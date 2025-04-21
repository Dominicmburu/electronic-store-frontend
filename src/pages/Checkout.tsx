import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import { Modal, Button, Form, Col, Row, Card, Badge, Alert } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { useCart } from "../contexts/cartContext";
import { useOrder } from "../contexts/orderContext";
import { useWallet } from "../contexts/walletContext";
import { Order } from "../contexts/orderContext";
import LoadingSpinner from "../components/common/AnimatedLoadingSpinner";
import { UserContext } from '../contexts/UserContext';
import { Address, FetchUserAddressesResponse } from "../types/account";
import axios from "axios";
import { API_BASE_URL } from "../api/main";

enum CheckoutStep {
  REVIEW_CART = 1,
  SHIPPING = 2,
  PAYMENT = 3,
  CONFIRMATION = 4,
}

interface ShippingAddress {
  id?: number;
  address: string;
  city: string;
  county?: string;
  state?: string;
  postalCode?: string;
  zip?: string;
  country?: string;
  phoneNumber: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, loading: cartLoading, refreshCart } = useCart();
  const { orders, placeOrder, loading: orderLoading, payOrderWithMpesa, getUserOrders } = useOrder();
  const { wallet, loading: walletLoading, payWithWallet, refreshWallet } = useWallet();
  const userContext = useContext(UserContext);
  const token = userContext?.token;
  const profile = userContext?.profile;
  const paymentMethods = userContext?.paymentMethods;
  const fetchPaymentMethods = userContext?.fetchPaymentMethods;

  // Component state
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.REVIEW_CART);
  const [previousStep, setPreviousStep] = useState<CheckoutStep>(CheckoutStep.REVIEW_CART);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<number | null>(null);
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [availableAddresses, setAvailableAddresses] = useState<ShippingAddress[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<"processing" | "success" | "failed" | null>(null);
  const [paymentInProgress, setPaymentInProgress] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [insufficientFunds, setInsufficientFunds] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [walletPaymentMethodId, setWalletPaymentMethodId] = useState<number | null>(null);
  const [mpesaPaymentMethodId, setMpesaPaymentMethodId] = useState<number | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [checkingTransactionStatus, setCheckingTransactionStatus] = useState<boolean>(false);
  const [isDirectPayment, setIsDirectPayment] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  // Animation refs
  const pageRef = useRef(null);
  
  // Calculate order summary
  const subtotal = cart?.totalAmount || 0;
  const taxRate = 0.18; // 18% tax
  const tax = subtotal * taxRate;
  
  // Effect to set total from cart or selected order
  useEffect(() => {
    if (selectedOrderId && orders) {
      const selectedOrder = orders.find(order => order.id === selectedOrderId);
      if (selectedOrder) {
        const orderTotal = selectedOrder.orderItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
        setTotal(orderTotal * (1 + taxRate)); // Calculate with tax
      }
    } else {
      setTotal(subtotal + tax);
    }
  }, [selectedOrderId, orders, subtotal, tax]);

  // Load user addresses, payment methods, and fetch wallet info
  // useEffect(() => {
  //   if (token && fetchPaymentMethods) {
  //     fetchPaymentMethods(token);
  //   }
  // }, [token, fetchPaymentMethods]);

  // Check URL parameters
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const orderIdParam = params.get('orderId');
  //   const directPayment = params.get('directPayment');
    
  //   if (orderIdParam) {
  //     const parsedOrderId = parseInt(orderIdParam);
  //     setSelectedOrderId(parsedOrderId);

  //     // If directed to payment, set the flag and go to payment step
  //     if (directPayment === 'true') {
  //       setIsDirectPayment(true);
  //       setCurrentStep(CheckoutStep.PAYMENT);
        
  //       // Save these in session storage too
  //       sessionStorage.setItem('checkoutStep', CheckoutStep.PAYMENT.toString());
  //       sessionStorage.setItem('selectedOrderId', orderIdParam);
  //       sessionStorage.setItem('isDirectPayment', 'true');
  //     }
  //   }
  // }, [location]);

  // Restore checkout step from sessionStorage
  // useEffect(() => {
  //   if (!isDirectPayment) {
  //     // Only restore from session storage if not direct payment
  //     const savedStep = sessionStorage.getItem('checkoutStep');
  //     const savedOrderId = sessionStorage.getItem('selectedOrderId');
  //     const savedIsDirectPayment = sessionStorage.getItem('isDirectPayment');
      
  //     if (savedStep) {
  //       setCurrentStep(parseInt(savedStep));
  //     }
      
  //     if (savedOrderId) {
  //       setSelectedOrderId(parseInt(savedOrderId));
  //     }
      
  //     if (savedIsDirectPayment === 'true') {
  //       setIsDirectPayment(true);
  //     }
  //   }
  // }, [isDirectPayment]);

  // Save current step to sessionStorage whenever it changes
  // useEffect(() => {
  //   sessionStorage.setItem('checkoutStep', currentStep.toString());
  // }, [currentStep]);

  // Save selected order ID to sessionStorage
  // useEffect(() => {
  //   if (selectedOrderId) {
  //     sessionStorage.setItem('selectedOrderId', selectedOrderId.toString());
  //   }
  // }, [selectedOrderId]);

  // Load user addresses and payment methods from profile
  // useEffect(() => {
  //   if (profile) {
  //     // Format addresses from profile
  //     const userAddresses = profile.addresses.map(addr => ({
  //       id: addr.id,
  //       address: addr.address,
  //       city: addr.city,
  //       state: addr.state,
  //       zip: addr.zip,
  //       country: addr.country,
  //       phoneNumber: profile.phoneNumber || ""
  //     }));

  //     setAvailableAddresses(userAddresses);

  //     // Set default selected address if available
  //     if (userAddresses.length > 0) {
  //       setSelectedAddress(userAddresses[0]);
  //     }

  //     // Set M-Pesa phone number from profile
  //     const mpesaMethod = paymentMethods?.find(method => method.type === "MPESA");
  //     if (mpesaMethod) {
  //       setMpesaPhoneNumber(mpesaMethod.details);
  //     } else if (profile.phoneNumber) {
  //       setMpesaPhoneNumber(profile.phoneNumber);
  //     }
  //   }
  // }, [profile, paymentMethods]);

  // Replace your current profile effect with this one
useEffect(() => {
  // Skip if no profile is available yet
  if (!profile) return;
  
  // Create a stable reference to avoid unnecessary rerenders
  const profileAddresses = profile.addresses || [];
  
  // Format addresses from profile
  const userAddresses = profileAddresses.map(addr => ({
    id: addr.id,
    address: addr.address,
    city: addr.city,
    state: addr.state,
    zip: addr.zip,
    country: addr.country,
    phoneNumber: profile.phoneNumber || ""
  }));

  setAvailableAddresses(userAddresses);

  // Set default selected address if available and not already set
  if (userAddresses.length > 0 && !selectedAddress) {
    setSelectedAddress(userAddresses[0]);
  }
  
  // Only set M-Pesa phone number if not already set
  if (!mpesaPhoneNumber && profile.phoneNumber) {
    setMpesaPhoneNumber(profile.phoneNumber);
  }
  
  // This runs when profile changes, which should be rare
}, [profile, selectedAddress, mpesaPhoneNumber]);

// Separate effect for payment methods (should run less frequently)
useEffect(() => {
  if (!paymentMethods || paymentMethods.length === 0) return;
  
  // Set payment method IDs only if not already set
  if (walletPaymentMethodId === null || mpesaPaymentMethodId === null) {
    const walletId = paymentMethods.find(method => method.type === 'WALLET')?.id;
    const mpesaId = paymentMethods.find(method => method.type === 'MPESA')?.id;

    if (walletId) setWalletPaymentMethodId(walletId);
    if (mpesaId) setMpesaPaymentMethodId(mpesaId);
  }
  
  // Set M-Pesa phone number if available in payment methods
  const mpesaMethod = paymentMethods.find(method => method.type === "MPESA");
  if (mpesaMethod?.details && !mpesaPhoneNumber) {
    setMpesaPhoneNumber(mpesaMethod.details);
  }
  
}, [paymentMethods, walletPaymentMethodId, mpesaPaymentMethodId, mpesaPhoneNumber]);

  // Shipping address state
  // const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
  //   address: "",
  //   city: "",
  //   county: "",
  //   postalCode: "",
  //   phoneNumber: "",
  // });

  // Form validation state
  const [validated, setValidated] = useState(false);

  // Fetch orders when component mounts
  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       await getUserOrders();
  //     } catch (error) {
  //       // Silently handle error
  //       console.log("No orders or error fetching orders");
  //     }
  //   };

  //   if (token) {
  //     fetchOrders();
  //   }
  // }, [getUserOrders, token]);

  // Set payment method IDs
  // useEffect(() => {
  //   if (paymentMethods) {
  //     const walletId = paymentMethods.find(method => method.type === 'WALLET')?.id;
  //     const mpesaId = paymentMethods.find(method => method.type === 'MPESA')?.id;

  //     setWalletPaymentMethodId(walletId || null);
  //     setMpesaPaymentMethodId(mpesaId || null);
  //   }
  // }, [paymentMethods]);

  // Transaction status polling
  // useEffect(() => {
  //   let pollingInterval: NodeJS.Timeout | undefined = undefined;
    
  //   if (transactionId && paymentStatus === "processing") {
  //     setCheckingTransactionStatus(true);
      
  //     pollingInterval = setInterval(async () => {
  //       try {
  //         if (token) {
  //           const response = await axios.get(`${API_BASE_URL}/mpesa/transaction/${transactionId}`, {
  //             headers: { Authorization: `Bearer ${token}` }
  //           });
            
  //           const { status } = response.data.data.transaction;
            
  //           console.log("Transaction status:", status);
            
  //           if (status === 'COMPLETED') {
  //             setPaymentStatus("success");
  //             setCheckingTransactionStatus(false);
              
  //             setTimeout(() => {
  //               setOrderSuccess(true);
  //               setCurrentStep(CheckoutStep.CONFIRMATION);
  //               setShowPaymentModal(false);
  //             }, 2000);
              
  //             if (pollingInterval) {
  //               clearInterval(pollingInterval);
  //             }
              
  //             // Refresh wallet and cart
  //             await refreshWallet();
  //             await refreshCart();
              
  //           } else if (status === 'FAILED') {
  //             setPaymentStatus("failed");
  //             setCheckingTransactionStatus(false);
  //             if (pollingInterval) {
  //               clearInterval(pollingInterval);
  //             }
  //           }
  //           // If status is still "PENDING", continue polling
  //         }
  //       } catch (error) {
  //         console.error("Error checking transaction status:", error);
  //       }
  //     }, 5000); // Check every 5 seconds
  //   }
    
  //   return () => {
  //     if (pollingInterval) {
  //       clearInterval(pollingInterval);
  //     }
  //   };
  // }, [transactionId, paymentStatus, token, refreshWallet, refreshCart]);

  // Replace your current transaction polling effect with this improved version


  // Replace multiple initialization effects with this single consolidated effect
useEffect(() => {
  const initializeCheckout = async () => {
    if (token) {
      // Load all necessary data at once
      if (fetchPaymentMethods) {
        await fetchPaymentMethods(token);
      }
      
      try {
        await getUserOrders();
      } catch (error) {
        console.log("No orders or error fetching orders");
      }
    }
    
    // Process URL parameters (moved here to run only once)
    const params = new URLSearchParams(location.search);
    const orderIdParam = params.get('orderId');
    const directPayment = params.get('directPayment');
    
    if (orderIdParam) {
      const parsedOrderId = parseInt(orderIdParam);
      setSelectedOrderId(parsedOrderId);

      if (directPayment === 'true') {
        setIsDirectPayment(true);
        setCurrentStep(CheckoutStep.PAYMENT);
        
        sessionStorage.setItem('checkoutStep', CheckoutStep.PAYMENT.toString());
        sessionStorage.setItem('selectedOrderId', orderIdParam);
        sessionStorage.setItem('isDirectPayment', 'true');
      } else if (!isDirectPayment) {
        // Restore from session storage
        const savedStep = sessionStorage.getItem('checkoutStep');
        if (savedStep) {
          setCurrentStep(parseInt(savedStep));
        }
      }
    }
  };
  
  initializeCheckout();
  
  // Note: This effect only runs on initial component mount or when token changes
}, [token, location.search]); // Minimal dependencies



  useEffect(() => {
  let timeoutId: NodeJS.Timeout | undefined = undefined;
  let attempt = 0;
  const MAX_ATTEMPTS = 10;
  
  const checkTransactionStatus = async () => {
    if (attempt >= MAX_ATTEMPTS || !transactionId || paymentStatus !== "processing" || !token) {
      setCheckingTransactionStatus(false);
      return;
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/mpesa/transaction/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { status } = response.data.data.transaction;
      console.log("Transaction status:", status);
      
      if (status === 'COMPLETED') {
        setPaymentStatus("success");
        setCheckingTransactionStatus(false);
        
        setTimeout(() => {
          setOrderSuccess(true);
          setCurrentStep(CheckoutStep.CONFIRMATION);
          setShowPaymentModal(false);
        }, 2000);
        
        // Call these after status is confirmed
        debouncedRefreshWallet();
        debouncedRefreshCart();
      } else if (status === 'FAILED') {
        setPaymentStatus("failed");
        setCheckingTransactionStatus(false);
      } else {
        // Still processing, schedule next check with exponential backoff
        attempt++;
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000); // Cap at 30 seconds
        timeoutId = setTimeout(checkTransactionStatus, delay);
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
      attempt++;
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      timeoutId = setTimeout(checkTransactionStatus, delay);
    }
  };
  
  if (transactionId && paymentStatus === "processing" && token) {
    setCheckingTransactionStatus(true);
    checkTransactionStatus();
  }
  
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}, [transactionId, paymentStatus, token]);

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Create debounced versions of refresh functions
const debouncedRefreshCart = useCallback(
  debounce(() => refreshCart(), 500),
  [refreshCart]
);

const debouncedRefreshWallet = useCallback(
  debounce(() => refreshWallet(), 500),
  [refreshWallet]
);


  // Track step changes for animations
  useEffect(() => {
    setPreviousStep(currentStep);
  }, [currentStep]);

  // Get selected order from orders
  const selectedOrder = selectedOrderId
    ? orders?.find(order => order.id === selectedOrderId)
    : null;

  // Handle address selection
  const handleAddressSelect = (address: ShippingAddress) => {
    setSelectedAddress(address);
  };

  // Handle shipping form submission
  const handleShippingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false || !selectedAddress) {
      event.stopPropagation();
      setValidated(true);

      if (!selectedAddress) {
        toast.error("Please select a shipping address");
      }

      return;
    }

    // Validate payment method is selected
    if (!selectedPaymentType) {
      toast.error("Please select a payment method");
      return;
    }

    // Find the selected payment method by its ID
    const selectedMethod = paymentMethods?.find(method => method.id === selectedPaymentType);

    // If no payment method is found
    if (!selectedMethod) {
      toast.error("Invalid payment method selected");
      return;
    }

    // Check if it's a wallet payment and if funds are sufficient
    if (selectedMethod.type === "WALLET") {
      if (wallet && wallet.balance < total) {
        toast.error("Insufficient wallet balance. Please top up or choose another payment method.");
        setInsufficientFunds(true);
        return;
      }
    }

    // Show confirmation modal to place the order
    setShowConfirmationModal(true);
  };

  // Handle payment method selection
  const handlePaymentSelection = (id: number) => {
    setSelectedPaymentType(id);  // Store the ID of the selected payment method

    // Find the selected payment method using the ID
    const selectedMethod = paymentMethods?.find((method) => method.id === id);

    // Check if wallet has sufficient funds when the method is WALLET
    if (selectedMethod?.type === "WALLET" && wallet && wallet.balance < total) {
      setInsufficientFunds(true);
    } else {
      setInsufficientFunds(false);
    }
  };

  // Confirm order placement
  const confirmPlaceOrder = async () => {
    setShowConfirmationModal(false);
    setLoading(true);

    try {
      // Get the payment method based on the selected ID
      const selectedPaymentMethod = paymentMethods?.find(
        (method) => method.id === selectedPaymentType
      );

      // Check if selectedPaymentMethod exists and handle accordingly
      if (!selectedPaymentMethod) {
        throw new Error("No valid payment method selected.");
      }

      // Place the order with the selected address and payment method ID
      const orderResponse = await placeOrder(selectedAddress?.id || 0, selectedPaymentMethod.id);

      if (orderResponse && orderResponse.id) {
        setSelectedOrderId(orderResponse.id);
        setOrderPlaced(true);

        // After placing the order, go to the payment step
        setCurrentStep(CheckoutStep.PAYMENT);

        // Show success toast
        toast.success("Order placed successfully!");

        // Refresh cart after successful order
        await debouncedRefreshCart();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Process wallet payment
  // const processWalletPayment = async () => {
  //   if (!selectedOrderId) {
  //     toast.error("No order selected");
  //     return;
  //   }

  //   try {
  //     setPaymentInProgress(true);
  //     setPaymentStatus("processing");
  //     setShowPaymentModal(true);

  //     // Process wallet payment with the order ID
  //     const paymentResult = await payWithWallet(selectedOrderId);

  //     setPaymentStatus("success");
  //     setTimeout(() => {
  //       setOrderSuccess(true);
  //       setCurrentStep(CheckoutStep.CONFIRMATION);
  //       setShowPaymentModal(false);
  //     }, 2000);

  //     // Refresh wallet after payment
  //     await debouncedRefreshWallet();
  //     await debouncedRefreshCart();

  //   } catch (error) {
  //     console.error("Error processing wallet payment:", error);
  //     setPaymentStatus("failed");
  //     toast.error("Wallet payment processing failed");
  //   } finally {
  //     setPaymentInProgress(false);
  //   }
  // };

  // Replace your processWalletPayment function
const processWalletPayment = async () => {
  if (!selectedOrderId) {
    toast.error("No order selected");
    return;
  }

  // Prevent double processing
  if (paymentInProgress) {
    return;
  }

  try {
    setPaymentInProgress(true);
    setPaymentStatus("processing");
    setShowPaymentModal(true);

    // Process wallet payment with the order ID
    const paymentResult = await payWithWallet(selectedOrderId);

    setPaymentStatus("success");
    
    // Use a single setTimeout to avoid multiple state updates
    setTimeout(() => {
      setOrderSuccess(true);
      setCurrentStep(CheckoutStep.CONFIRMATION);
      setShowPaymentModal(false);
      
      // Only refresh data when UI updates are complete
      debouncedRefreshWallet();
      debouncedRefreshCart();
    }, 2000);

  } catch (error) {
    console.error("Error processing wallet payment:", error);
    setPaymentStatus("failed");
    toast.error("Wallet payment processing failed");
  } finally {
    setPaymentInProgress(false);
  }
};

  // Process M-Pesa payment
  // const processMpesaPayment = async () => {
  //   if (!selectedOrderId) {
  //     toast.error("No order selected");
  //     return;
  //   }

  //   if (!mpesaPhoneNumber) {
  //     toast.error("Please enter your M-Pesa phone number");
  //     return;
  //   }

  //   try {
  //     setPaymentInProgress(true);
  //     setPaymentStatus("processing");
  //     setShowPaymentModal(true);

  //     // Start M-Pesa payment with order ID and phone number
  //     const transactionResult = await payOrderWithMpesa(selectedOrderId, mpesaPhoneNumber);
      
  //     if (transactionResult) {
  //       // Save the transaction ID for status checking
  //       setTransactionId(transactionResult);
        
  //       // No need to set success here - we'll wait for the polling to confirm
  //       toast.info("M-Pesa payment initiated. Please check your phone to complete the payment.");
  //     } else {
  //       throw new Error("Failed to initiate payment");
  //     }

  //   } catch (error) {
  //     console.error("Error processing M-Pesa payment:", error);
  //     setPaymentStatus("failed");
  //     toast.error("M-Pesa payment processing failed");
  //     setPaymentInProgress(false);
  //   }
  // };


  // Replace your processMpesaPayment function
const processMpesaPayment = async () => {
  if (!selectedOrderId) {
    toast.error("No order selected");
    return;
  }

  if (!mpesaPhoneNumber) {
    toast.error("Please enter your M-Pesa phone number");
    return;
  }

  // Prevent double processing
  if (paymentInProgress) {
    return;
  }

  try {
    setPaymentInProgress(true);
    setPaymentStatus("processing");
    setShowPaymentModal(true);

    // Start M-Pesa payment with order ID and phone number
    const transactionResult = await payOrderWithMpesa(selectedOrderId, mpesaPhoneNumber);
    
    if (transactionResult) {
      // Save the transaction ID for status checking
      setTransactionId(transactionResult);
      
      // The transaction status will be checked by the optimized polling effect
      toast.info("M-Pesa payment initiated. Please check your phone to complete the payment.");
    } else {
      throw new Error("Failed to initiate payment");
    }

  } catch (error) {
    console.error("Error processing M-Pesa payment:", error);
    setPaymentStatus("failed");
    toast.error("M-Pesa payment processing failed");
    setPaymentInProgress(false);
  }
};

  // Handle payment modal close
  const handleClosePaymentModal = () => {
    if (paymentStatus === "processing") {
      // Ask for confirmation before closing if payment is in progress
      if (window.confirm("Are you sure you want to cancel this payment process?")) {
        setShowPaymentModal(false);
        setPaymentStatus(null);
        setPaymentInProgress(false);
        setTransactionId(null);
      }
    } else {
      setShowPaymentModal(false);
      setPaymentStatus(null);
    }
  };

  // Clear checkout session
  const clearCheckoutSession = () => {
    sessionStorage.removeItem('checkoutStep');
    sessionStorage.removeItem('selectedOrderId');
    sessionStorage.removeItem('isDirectPayment');
    setCurrentStep(CheckoutStep.REVIEW_CART);
    setSelectedOrderId(null);
    setIsDirectPayment(false);
  };

  // Navigation helpers - modified to prevent going back in direct payment mode
  const goToCart = () => {
    clearCheckoutSession();
    navigate("/cart");
  };
  
  const goToShipping = () => {
    if (!isDirectPayment) {
      setCurrentStep(CheckoutStep.SHIPPING);
    }
  };
  
  const goToPayment = () => setCurrentStep(CheckoutStep.PAYMENT);
  
  const goToReviewCart = () => {
    if (!isDirectPayment) {
      setCurrentStep(CheckoutStep.REVIEW_CART);
    }
  };
  
  const goToAccount = () => navigate("/my-account");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 15, stiffness: 300 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 15, stiffness: 300, delay: 0.2 }
    }
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 25 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 25 },
        opacity: { duration: 0.3 }
      }
    })
  };

  // Determine direction for animations
  const getDirection = () => {
    return currentStep > previousStep ? 1 : -1;
  };

  // Render progress steps
  const renderProgressSteps = (): React.ReactNode => {
    return (
      <motion.div
        className="checkout-progress mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="progress" style={{ height: "4px" }}>
          <motion.div
            className="progress-bar bg-primary"
            initial={{ width: `${(previousStep / 4) * 100}%` }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          ></motion.div>
        </div>
        <div className="d-flex justify-content-between mt-2">
          {/* In direct payment mode, make previous steps inactive */}
          <motion.div
            className={`progress-step text-center ${isDirectPayment ? 'text-muted' : currentStep >= CheckoutStep.REVIEW_CART ? 'active' : ''}`}
            whileHover={{ scale: isDirectPayment ? 1 : 1.05 }}
          >
            <motion.div
              className={`step-circle ${isDirectPayment ? 'bg-light text-muted' : currentStep >= CheckoutStep.REVIEW_CART ? 'bg-primary text-white' : 'bg-light'}`}
              initial={false}
              animate={{
                backgroundColor: isDirectPayment ? "#f8f9fa" : currentStep >= CheckoutStep.REVIEW_CART ? "#0d6efd" : "#f8f9fa",
                color: isDirectPayment ? "#6c757d" : currentStep >= CheckoutStep.REVIEW_CART ? "#ffffff" : "#212529",
                scale: currentStep === CheckoutStep.REVIEW_CART && !isDirectPayment ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {currentStep > CheckoutStep.REVIEW_CART && !isDirectPayment ? (
                <motion.i
                className="bi bi-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            ) : 2}
          </motion.div>
          <div className="step-label small mt-1">Shipping</div>
        </motion.div>
        
        <motion.div
          className={`progress-step text-center ${currentStep >= CheckoutStep.PAYMENT ? 'active' : ''}`}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className={`step-circle ${currentStep >= CheckoutStep.PAYMENT ? 'bg-primary text-white' : 'bg-light'}`}
            initial={false}
            animate={{
              backgroundColor: currentStep >= CheckoutStep.PAYMENT ? "#0d6efd" : "#f8f9fa",
              color: currentStep >= CheckoutStep.PAYMENT ? "#ffffff" : "#212529",
              scale: currentStep === CheckoutStep.PAYMENT ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            {currentStep > CheckoutStep.PAYMENT ? (
              <motion.i
                className="bi bi-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            ) : 3}
          </motion.div>
          <div className="step-label small mt-1">Payment</div>
        </motion.div>
        
        <motion.div
          className={`progress-step text-center ${currentStep >= CheckoutStep.CONFIRMATION ? 'active' : ''}`}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className={`step-circle ${currentStep >= CheckoutStep.CONFIRMATION ? 'bg-primary text-white' : 'bg-light'}`}
            initial={false}
            animate={{
              backgroundColor: currentStep >= CheckoutStep.CONFIRMATION ? "#0d6efd" : "#f8f9fa",
              color: currentStep >= CheckoutStep.CONFIRMATION ? "#ffffff" : "#212529",
              scale: currentStep === CheckoutStep.CONFIRMATION ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            4
          </motion.div>
          <div className="step-label small mt-1">Confirmation</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Render order summary
const renderOrderSummary = () => {
  return (
    <motion.div
      className="card shadow-sm mb-4 border-0 bg-light"
      variants={cardVariants}
      whileHover={{ boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
    >
      <div className="card-header bg-light">
        <h4 className="mb-0">Order Summary</h4>
      </div>
      <div className="card-body">
        {selectedOrderId && isDirectPayment ? (
          // Show order summary for existing order
          <>
            <motion.div
              className="d-flex justify-content-between mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span>Order ID:</span>
              <span className="fw-bold">{selectedOrderId}</span>
            </motion.div>
            {selectedOrder && (
              <>
                <motion.div
                  className="d-flex justify-content-between mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span>Items:</span>
                  <span>{selectedOrder.orderItems.length}</span>
                </motion.div>
                <hr />
                <motion.div
                  className="d-flex justify-content-between fw-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span>Total:</span>
                  <motion.span
                    className="text-primary"
                    key={total}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    KSh {total.toLocaleString()}
                  </motion.span>
                </motion.div>
              </>
            )}
          </>
        ) : (
          // Show cart summary for new order
          <>
            <motion.div
              className="d-flex justify-content-between mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span>Items ({cart?.items.length || 0}):</span>
              <motion.span
                key={subtotal}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                KSh {subtotal.toLocaleString()}
              </motion.span>
            </motion.div>
            <motion.div
              className="d-flex justify-content-between mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span>Tax (18%):</span>
              <motion.span
                key={tax}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                KSh {tax.toLocaleString()}
              </motion.span>
            </motion.div>
            <hr />
            <motion.div
              className="d-flex justify-content-between fw-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>Total:</span>
              <motion.span
                className="text-primary"
                key={total}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                KSh {total.toLocaleString()}
              </motion.span>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Loading state
if (loading || cartLoading || orderLoading || walletLoading) {
  return (
    <Layout>
      <motion.div
        className="container my-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center py-5">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
              }
            }}
          >
            <LoadingSpinner size="lg" />
          </motion.div>
          <motion.p
            className="mt-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Loading checkout information...
          </motion.p>
        </div>
      </motion.div>
    </Layout>
  );
}

// Direct payment notice - show at the top if in direct payment mode
const DirectPaymentNotice = () => (
  <motion.div
    className="alert alert-info mb-4"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="d-flex align-items-center">
      <i className="bi bi-info-circle-fill me-2 fs-4"></i>
      <div>
        <h5 className="mb-1">Complete Your Order Payment</h5>
        <p className="mb-0">You are completing payment for order #{selectedOrderId}. Choose a payment method to proceed.</p>
      </div>
    </div>
  </motion.div>
);

// Empty cart state - only show this if we're on review cart step and not in direct payment mode
if ((!cart || cart.items.length === 0) && currentStep === CheckoutStep.REVIEW_CART && !isDirectPayment) {
  return (
    <Layout>
      <motion.div
        className="container my-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="text-center my-5 py-5 bg-light rounded shadow-sm"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.div
            className="mb-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.2
            }}
          >
            <i className="bi bi-cart-x" style={{ fontSize: "4rem", color: "#6c757d" }}></i>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Your cart is empty
          </motion.h3>
          <motion.p
            className="text-muted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Looks like you haven't added any items to your cart yet.
          </motion.p>
          <motion.button
            onClick={() => navigate("/shop")}
            className="btn btn-primary mt-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-shop me-2"></i>Continue Shopping
          </motion.button>
        </motion.div>
      </motion.div>
    </Layout>
  );
}

return (
  <Layout>
    <motion.div
      className="container my-5"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      ref={pageRef}
    >
      <motion.div className="mb-4" variants={itemVariants}>
        <motion.div
          className="d-flex align-items-center mb-4"
          variants={itemVariants}
        >
          <h2 className="mb-0">Checkout</h2>
          {wallet && (
            <motion.div
              className="ms-auto bg-light rounded-pill px-4 py-2 shadow-sm"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: 0.3
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
              }}
            >
              <span className="text-muted me-2">Wallet Balance:</span>
              <motion.span
                className="fw-bold text-success"
                key={wallet.balance} // Re-render when balance changes
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                KSh {wallet.balance?.toLocaleString() || '0'}
              </motion.span>
            </motion.div>
          )}
        </motion.div>

        {renderProgressSteps()}
      </motion.div>

      {/* Direct Payment Notice */}
      {isDirectPayment && <DirectPaymentNotice />}

      <AnimatePresence mode="wait" custom={getDirection()}>
        {/* Step 1: Review Cart - Only show if not in direct payment mode */}
        {currentStep === CheckoutStep.REVIEW_CART && !isDirectPayment && (
          <motion.div
            key="review-cart"
            custom={getDirection()}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="row"
          >
            <motion.div className="col-lg-8" variants={itemVariants}>
              <motion.div
                className="card shadow-sm mb-4"
                variants={cardVariants}
                whileHover={{ boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
              >
                <div className="card-header bg-light">
                  <h4 className="mb-0">Review Your Cart</h4>
                </div>
                <div className="card-body">
                  <AnimatePresence>
                    {cart && cart.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="row mb-3 py-3 border-bottom"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                          }
                        }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{
                          backgroundColor: "rgba(0,0,0,0.02)",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <div className="col-md-2">
                          <motion.img
                            src={`${API_BASE_URL}/uploads/${item.product.images[0]}`}
                            alt={item.product.name}
                            className="img-fluid rounded"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                        </div>
                        <div className="col-md-5">
                          <h5 className="fs-6">{item.product.name}</h5>
                          <motion.span
                            className="badge bg-light text-dark"
                            whileHover={{ scale: 1.1 }}
                          >
                            Quantity: {item.quantity}
                          </motion.span>
                        </div>
                        <div className="col-md-5 text-end">
                          <div className="text-muted">
                            <small>KSh {item.product.currentPrice.toLocaleString()} x {item.quantity}</small>
                          </div>
                          <motion.div
                            className="fw-bold"
                            key={item.subtotal}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            KSh {item.subtotal.toLocaleString()}
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="card-footer bg-light d-flex justify-content-between">
                  <motion.button
                    className="btn btn-outline-secondary"
                    onClick={goToCart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bi bi-arrow-left me-2"></i>Back to Cart
                  </motion.button>
                  <motion.button
                    className="btn btn-primary"
                    onClick={goToShipping}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!cart || cart.items.length === 0}
                  >
                    Continue to Shipping<i className="bi bi-arrow-right ms-2"></i>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
            <motion.div className="col-lg-4" variants={itemVariants}>
              {renderOrderSummary()}
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: Shipping Information - Only show if not in direct payment mode */}
        {currentStep === CheckoutStep.SHIPPING && !isDirectPayment && (
          <motion.div
            key="shipping"
            custom={getDirection()}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="row"
          >
            <motion.div className="col-lg-8" variants={itemVariants}>
              <motion.div
                className="card shadow-sm mb-4"
                variants={cardVariants}
                whileHover={{ boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
              >
                <div className="card-header bg-light">
                  <h4 className="mb-0">Shipping Address</h4>
                </div>
                <div className="card-body">
                  {availableAddresses.length > 0 ? (
                    <Form noValidate validated={validated} onSubmit={handleShippingSubmit}>
                      <div className="address-selection mb-4">
                        <motion.p
                          className="mb-3"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { delay: 0.1 } },
                          }}
                        >
                          Please select an address for delivery:
                        </motion.p>

                        <motion.div
                          className="address-cards"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                          }}
                        >
                          {availableAddresses.map((address) => (
                            <motion.div
                              key={address.id}
                              className={`card mb-3 ${selectedAddress?.id === address.id ? 'border-primary' : ''}`}
                              variants={itemVariants}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="card-body p-3">
                                <div className="d-flex align-items-center">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="addressRadio"
                                      id={`address-${address.id}`}
                                      checked={selectedAddress?.id === address.id}
                                      onChange={() => handleAddressSelect(address)}
                                      required
                                    />
                                  </div>
                                  <div className="ms-3 flex-grow-1">
                                    <p className="mb-1">
                                      {address.address}, {address.city}
                                      {address.state && `, ${address.state}`}
                                      {address.zip && ` ${address.zip}`}
                                      {address.country && `, ${address.country}`}
                                    </p>
                                    {address.phoneNumber && (
                                      <p className="text-muted mb-0 small">
                                        <i className="bi bi-telephone me-1"></i>
                                        {address.phoneNumber}
                                      </p>
                                    )}
                                  </div>
                                  {selectedAddress?.id === address.id && (
                                    <Badge bg="primary" className="ms-2">Selected</Badge>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>

                        <motion.div
                          className="text-end"
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { delay: 0.3 } },
                          }}
                        >
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => navigate("/my-account")}
                            className="mt-2"
                          >
                            <i className="bi bi-plus-circle me-1"></i>
                            Add New Address
                          </Button>
                        </motion.div>

                        {validated && !selectedAddress && (
                          <motion.div
                            className="text-danger mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Please select a delivery address.
                          </motion.div>
                        )}
                      </div>

                      <motion.hr
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { delay: 0.4 } },
                        }}
                      />

                      {/* Payment Method Selection */}
                      <motion.div
                        className="payment-selection mt-4"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { delay: 0.5 } },
                        }}
                      >
                        <h5 className="mb-3">Payment Method</h5>

                        <div className="payment-options">
                          {paymentMethods?.map((method) => (
                            <motion.div
                              className={`card mb-3 ${selectedPaymentType === method.id ? 'border-primary' : ''}`}
                              variants={itemVariants}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => handlePaymentSelection(method.id)}
                              key={method.id}
                            >
                              <div className="card-body p-3">
                                <div className="d-flex align-items-center">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="paymentRadio"
                                      id={`payment-${method.type}`}
                                      checked={selectedPaymentType === method.id}
                                      onChange={() => handlePaymentSelection(method.id)}
                                      required
                                    />
                                  </div>
                                  <div className="ms-3 flex-grow-1">
                                    <div className="d-flex align-items-center">
                                      <i
                                        className={`bi bi-${method.type === 'WALLET' ? 'wallet2' : 'phone'} me-2 text-${method.type === 'WALLET' ? 'primary' : 'success'}`}
                                        style={{ fontSize: "1.25rem" }}
                                      ></i>
                                      <div>
                                        <p className="mb-0 fw-medium">{method.type === 'WALLET' ? 'Wallet Balance' : 'M-Pesa'}</p>
                                        {method.type === "MPESA" && method.details && (
                                          <p className="text-muted mb-0 small">Phone: {method.details}</p>
                                        )}

                                        {method.type === "WALLET" && wallet && (
                                          <Form.Label className="small">
                                            <span className="text-muted me-2">Wallet Balance:</span>
                                            <motion.span
                                              className={wallet.balance < total ? "fw-bold text-danger" : "fw-bold text-success"}
                                              key={wallet.balance || 0}
                                              initial={{ scale: 0.9 }}
                                              animate={{ scale: 1 }}
                                              transition={{ type: "spring", stiffness: 300 }}
                                            >
                                              KSh {wallet.balance?.toLocaleString() || '0'}
                                            </motion.span>
                                          </Form.Label>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {selectedPaymentType === method.id && (
                                    <Badge bg="primary" className="ms-2">Selected</Badge>
                                  )}
                                </div>

                                {method.type === "WALLET" && insufficientFunds && selectedPaymentType === method.id && (
                                  <div className="alert alert-warning mt-2 mb-0 py-2 small">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Insufficient balance. Please top up your wallet or choose another payment method.
                                    <div className="mt-1">
                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        className="me-2"
                                        // onClick={() => navigate("/my-account?tab=wallet")}
                                        onClick={() => navigate('/my-account', { state: { tab: 'wallet' } })}
                                      >
                                        Top Up Wallet
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {method.type === "MPESA" && !method.details && (
                                  <div className="alert alert-warning mt-2 mb-0 py-2 small">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Please add a phone number in your account settings.
                                    <div className="mt-1">
                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => navigate("/my-account?tab=profile")}
                                      >
                                        Update Profile
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {method.type === "MPESA" && (
                                  <Form.Label className="small">
                                    *To use a different M-Pesa number, update it in your account
                                  </Form.Label>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {validated && !selectedPaymentType && (
                          <motion.div
                            className="text-danger mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Please select a payment method.
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div
                        className="d-flex justify-content-between mt-4"
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0, transition: { delay: 0.6 } },
                        }}
                      >
                        <motion.button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={goToReviewCart}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <i className="bi bi-arrow-left me-2"></i>Back to Cart
                        </motion.button>
                        <motion.button
                          type="submit"
                          className="btn btn-primary"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={
                            !selectedAddress ||
                            !selectedPaymentType ||
                            (paymentMethods?.find(method => method.id === selectedPaymentType)?.type === "WALLET" && insufficientFunds) ||
                            (paymentMethods?.find(method => method.id === selectedPaymentType)?.type === "MPESA" && !paymentMethods?.find(method => method.id === selectedPaymentType)?.details)
                          }
                        >
                          Place Order<i className="bi bi-arrow-right ms-2"></i>
                        </motion.button>
                      </motion.div>
                    </Form>
                  ) : (
                    <motion.div
                      className="text-center py-4"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { delay: 0.2 } },
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <i className="bi bi-house-x" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                      </motion.div>
                      <h5 className="mt-3">No shipping addresses found</h5>
                      <p className="text-muted">You need to add a shipping address to continue.</p>
                      <motion.button
                        className="btn btn-primary mt-2"
                        onClick={() => navigate("/my-account?tab=addresses")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New Address
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
            <motion.div className="col-lg-4" variants={itemVariants}>
              {renderOrderSummary()}
            </motion.div>

            {/* Confirmation Modal for Order Placement */}
            <Modal
              show={showConfirmationModal}
              onHide={() => setShowConfirmationModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Confirm Order</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to place this order?</p>

                <div className="order-summary-modal">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping Address:</span>
                      <span className="text-end">
                        {selectedAddress?.address}, {selectedAddress?.city}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Payment Method:</span>
                      <span className="text-primary">
                        {
                          paymentMethods?.find(method => method.id === selectedPaymentType)?.type === "WALLET"
                            ? "Wallet"
                            : "M-Pesa"
                        }
                      </span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>KSh {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax (18%):</span>
                      <span>KSh {tax.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span className="text-primary">KSh {total.toLocaleString()}</span>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowConfirmationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={confirmPlaceOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      "Confirm Order"
                    )}
                  </Button>
                </Modal.Footer>
              </Modal>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {currentStep === CheckoutStep.PAYMENT && (
            <motion.div
              key="payment"
              custom={getDirection()}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="row"
            >
              <motion.div className="col-lg-8" variants={itemVariants}>
                <motion.div
                  className="card shadow-sm mb-4"
                  variants={cardVariants}
                  whileHover={{ boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
                >
                  <div className="card-header bg-light">
                    <h4 className="mb-0">Payment Method</h4>
                  </div>
                  <div className="card-body">
                    {/* Order Success Message - Only show if not in direct payment mode */}
                    {!isDirectPayment && (
                      <motion.div
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3">
                            <i className="bi bi-check-circle-fill text-success fs-3"></i>
                          </div>
                          <div>
                            <h5 className="mb-0">Order Placed Successfully</h5>
                            <p className="text-muted mb-0 small">Order #{selectedOrderId}</p>
                          </div>
                        </div>
                        <p>Your order has been placed. Please complete your payment to finalize your order.</p>
                      </motion.div>
                    )}

                    {/* If existing order/direct payment, show order details */}
                    {isDirectPayment && selectedOrder && (
                      <motion.div
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Card className="border-0 bg-light mb-3">
                          <Card.Body>
                            <h5 className="mb-3">Order #{selectedOrderId} Details</h5>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Date:</span>
                              <span>{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Items:</span>
                              <span>{selectedOrder.orderItems.length}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Status:</span>
                              <Badge bg="warning">Pending Payment</Badge>
                            </div>
                            <div className="d-flex justify-content-between fw-bold">
                              <span>Total:</span>
                              <span className="text-primary">KSh {total.toLocaleString()}</span>
                            </div>
                          </Card.Body>
                        </Card>
                        <p>Please select a payment method to complete your order.</p>
                      </motion.div>
                    )}

                    {/* Payment Method Selection */}
                    <motion.div
                      className="payment-selection mt-4"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { delay: 0.3 } },
                      }}
                    >
                      <h5 className="mb-3">Select Payment Method</h5>

                      <div className="payment-options">
                        {paymentMethods?.map((method) => (
                          <motion.div
                            className={`card mb-3 ${selectedPaymentType === method.id ? 'border-primary' : ''}`}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handlePaymentSelection(method.id)}
                            key={method.id}
                          >
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentRadio"
                                    id={`payment-${method.type}`}
                                    checked={selectedPaymentType === method.id}
                                    onChange={() => handlePaymentSelection(method.id)}
                                    required
                                  />
                                </div>
                                <div className="ms-3 flex-grow-1">
                                  <div className="d-flex align-items-center">
                                    <i
                                      className={`bi bi-${method.type === 'WALLET' ? 'wallet2' : 'phone'} me-2 text-${method.type === 'WALLET' ? 'primary' : 'success'}`}
                                      style={{ fontSize: "1.25rem" }}
                                    ></i>
                                    <div>
                                      <p className="mb-0 fw-medium">{method.type === 'WALLET' ? 'Wallet Balance' : 'M-Pesa'}</p>
                                      {method.type === "MPESA" && method.details && (
                                        <p className="text-muted mb-0 small">Phone: {method.details}</p>
                                      )}

                                      {method.type === "WALLET" && wallet && (
                                        <div className="small">
                                          <span className="text-muted me-2">Wallet Balance:</span>
                                          <motion.span
                                            className={wallet.balance < total ? "fw-bold text-danger" : "fw-bold text-success"}
                                            key={wallet.balance || 0}
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                          >
                                            KSh {wallet.balance?.toLocaleString() || '0'}
                                          </motion.span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {selectedPaymentType === method.id && (
                                  <Badge bg="primary" className="ms-2">Selected</Badge>
                                )}
                              </div>

                              {method.type === "WALLET" && insufficientFunds && selectedPaymentType === method.id && (
                                <div className="alert alert-warning mt-2 mb-0 py-2 small">
                                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                  Insufficient balance. Please top up your wallet or choose another payment method.
                                  <div className="mt-1">
                                    <Button
                                      size="sm"
                                      variant="outline-primary"
                                      className="me-2"
                                      onClick={() => navigate("/my-account?tab=wallet")}
                                    >
                                      Top Up Wallet
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {method.type === "MPESA" && !method.details && (
                                <div className="alert alert-warning mt-2 mb-0 py-2 small">
                                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                  Please add a phone number in your account settings.
                                  <div className="mt-1">
                                    <Button
                                      size="sm"
                                      variant="outline-primary"
                                      onClick={() => navigate("/my-account?tab=profile")}
                                    >
                                      Update Profile
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Payment Details */}
                    {selectedPaymentType && (
                      <motion.div
                        className="payment-details p-3 bg-light rounded mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {paymentMethods?.find(method => method.id === selectedPaymentType)?.type === "MPESA" && (
                          <div className="mpesa-payment-info">
                            <div className="mb-3">
                              <label className="form-label">M-Pesa Phone Number</label>
                              <div className="input-group">
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={mpesaPhoneNumber}
                                  onChange={(e) => setMpesaPhoneNumber(e.target.value)}
                                  readOnly
                                />
                                <button 
                                  className="btn btn-outline-secondary" 
                                  type="button"
                                  onClick={() => {
                                    if (profile && profile.phoneNumber) {
                                      setMpesaPhoneNumber(profile.phoneNumber);
                                    }
                                  }}
                                >
                                  Use My Number
                                </button>
                              </div>
                              <small className="text-muted">We'll send the M-Pesa payment request to this number</small>
                            </div>
                            <div className="alert alert-info mb-0 py-2 small">
                              <i className="bi bi-info-circle me-2"></i>
                              You will receive a prompt on your phone to complete the payment
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Payment Button */}
                    <div className="mt-4">
                      <motion.button
                        className="btn btn-primary btn-lg w-100"
                        onClick={
                          paymentMethods?.find(method => method.id === selectedPaymentType)?.type === "WALLET"
                            ? processWalletPayment
                            : processMpesaPayment
                        }
                        disabled={
                          paymentInProgress || 
                          !selectedPaymentType ||
                          (paymentMethods?.find(method => method.id === selectedPaymentType)?.type === "WALLET" && insufficientFunds)
                        }
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {paymentInProgress ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing Payment...
                          </>
                        ) : (
                          <>Complete Payment</>
                        )}
                      </motion.button>
                    </div>
                  </div>
                  <div className="card-footer bg-light d-flex justify-content-between">
                    {!isDirectPayment && (
                      <motion.button
                        className="btn btn-outline-secondary"
                        onClick={goToShipping}
                        disabled={paymentInProgress}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bi bi-arrow-left me-2"></i>Back to Shipping
                      </motion.button>
                    )}
                    {isDirectPayment && (
                      <motion.button
                        className="btn btn-outline-secondary"
                        onClick={goToCart}
                        disabled={paymentInProgress}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="bi bi-arrow-left me-2"></i>Back to Cart
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
              <motion.div className="col-lg-4" variants={itemVariants}>
                {renderOrderSummary()}

                {selectedOrderId && (
                  <motion.div className="mt-4" variants={itemVariants}>
                    <Card className="shadow-sm">
                      <Card.Header className="bg-light">
                        <h5 className="mb-0">Order Summary</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Order ID:</span>
                          <span className="fw-bold">{selectedOrderId}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Status:</span>
                          <Badge bg="warning">Awaiting Payment</Badge>
                        </div>
                        <div className="d-flex justify-content-between fw-bold mt-3">
                          <span>Total:</span>
                          <span className="text-primary">KSh {total.toLocaleString()}</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
          
          {/* Step 4: Confirmation */}
          {currentStep === CheckoutStep.CONFIRMATION && (
            <motion.div
              key="confirmation"
              custom={getDirection()}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <motion.div
                className="text-center py-5"
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }
                }}
              >
                <motion.div
                  className="mb-4 text-success"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                >
                  <i className="bi bi-check-circle" style={{ fontSize: "5rem" }}></i>
                </motion.div>

                <motion.h2
                  className="mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Thank You!
                </motion.h2>

                <motion.p
                  className="text-muted mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Your order has been placed and payment has been completed successfully.
                </motion.p>

                <motion.div
                  className="card shadow-sm mb-4 mx-auto"
                  style={{ maxWidth: "500px" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Order Details</h5>
                  </div>
                  <div className="card-body">
                    {selectedOrder && (
                      <>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span>Order Number:</span>
                            <span className="fw-bold">{selectedOrder.id}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Date:</span>
                            <span>{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Status:</span>
                            <Badge bg="success">Paid</Badge>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Payment Method:</span>
                            <span>
                              {
                                paymentMethods?.find(method => method.id === selectedPaymentType)?.type === "WALLET"
                                  ? "Wallet"
                                  : "M-Pesa"
                              }
                            </span>
                          </div>
                          <div className="d-flex justify-content-between fw-bold">
                            <span>Total Amount:</span>
                            <span className="text-primary">KSh {total.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="alert alert-success mb-0 small">
                          <i className="bi bi-check-circle-fill me-2"></i>
                          {paymentMethods?.find(method => method.id === selectedPaymentType)?.type === "WALLET" 
                            ? "Payment completed successfully using your wallet balance." 
                            : "M-Pesa payment completed successfully."}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    variant="outline-secondary"
                    className="me-3"
                    onClick={() => {
                      clearCheckoutSession();
                      navigate("/shop");
                    }}
                  >
                    <i className="bi bi-shop me-2"></i>
                    Continue Shopping
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      clearCheckoutSession();
                      navigate("/my-account?tab=orders");
                    }}
                  >
                    <i className="bi bi-box me-2"></i>
                    View Orders
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Processing Modal */}
        <Modal
          show={showPaymentModal}
          onHide={handleClosePaymentModal}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {paymentStatus === "processing" 
                ? "Processing Payment" 
                : paymentStatus === "success" 
                  ? "Payment Successful" 
                  : "Payment Failed"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {paymentStatus === "processing" && (
              <div className="text-center py-3">
                <LoadingSpinner size="md" />
                <h5 className="mt-3">Processing Payment</h5>
                {paymentMethods?.find(method => method.id === selectedPaymentType)?.type === "MPESA" ? (
                  <>
                    <p className="text-muted">
                      Please check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
                    </p>
                    <p className="mb-2">
                      Phone: <span className="fw-bold">{mpesaPhoneNumber}</span>
                    </p>
                    {checkingTransactionStatus && (
                      <div className="alert alert-info py-2 small">
                        <i className="bi bi-info-circle-fill me-2"></i>
                        Checking transaction status... Please wait.
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted">
                    Processing your wallet payment. This will just take a moment.
                  </p>
                )}
                <p className="mb-0 small">
                  Amount: <span className="fw-bold">KSh {total.toLocaleString()}</span>
                </p>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="text-center py-3">
                <div className="text-success mb-3">
                  <i className="bi bi-check-circle" style={{ fontSize: "3rem" }}></i>
                </div>
                <h5>Payment Successful!</h5>
                <p className="text-muted">Your payment has been processed successfully.</p>
                
                <div className="alert alert-success py-2 mt-3">
                  <i className="bi bi-shield-check me-2"></i>
                  Transaction completed
                </div>
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="text-center py-3">
                <div className="text-danger mb-3">
                  <i className="bi bi-x-circle" style={{ fontSize: "3rem" }}></i>
                </div>
                <h5>Payment Failed</h5>
                <p className="text-muted">There was an issue processing your payment. Please try again.</p>
                
                <div className="alert alert-danger py-2 mt-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Transaction was not completed
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {paymentStatus === "processing" && (
              <Button 
                variant="secondary" 
                onClick={handleClosePaymentModal}
                disabled={checkingTransactionStatus}
              >
                {checkingTransactionStatus ? "Please wait..." : "Cancel"}
              </Button>
            )}

            {paymentStatus === "success" && (
              <Button variant="primary" onClick={() => {
                setCurrentStep(CheckoutStep.CONFIRMATION);
                setShowPaymentModal(false);
              }}>
                Continue
              </Button>
            )}

            {paymentStatus === "failed" && (
              <>
                <Button variant="secondary" onClick={handleClosePaymentModal}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={
                    paymentMethods?.find(method => method.id === selectedPaymentType)?.type === "WALLET"
                      ? processWalletPayment
                      : processMpesaPayment
                  }
                >
                  Try Again
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Layout>
  );
};

export default Checkout;