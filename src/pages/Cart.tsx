import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/cartContext";
import LoadingSpinner from "../components/common/AnimatedLoadingSpinner";
import { Order, useOrder } from "../contexts/orderContext";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Button, Badge } from "react-bootstrap";
import { API_BASE_URL } from "../api/main";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, loading, error, updateCartItem, removeFromCart } = useCart();
  const { orders, getUserOrders, cancelOrder } = useOrder();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [showPendingOrdersModal, setShowPendingOrdersModal] = useState(false);
  const [selectedOrderId] = useState<number | null>(null);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);

  const cartRef = useRef(null);

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await getUserOrders();
      } catch (error) {
        console.log("No orders or error fetching orders");
      }
    };

    fetchOrders();
  }, [getUserOrders]);

  // Filter pending orders
  useEffect(() => {
    if (orders && orders.length > 0) {
      const activePendingOrders = orders.filter(
        (order) => order.status === "PENDING"
      );
      setPendingOrders(activePendingOrders);
    }
  }, [orders]);

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(cartItemId, newQuantity);
  };

  const handleRemoveItem = async (cartItemId: number) => {
    if (window.confirm("Are you sure you want to remove this item from your cart?")) {
      await removeFromCart(cartItemId);
    }
  };

  // Standard checkout - proceed with current cart
  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Handle completing payment for a pending order
  const handleCompleteOrder = (orderId: number) => {
    setShowPendingOrdersModal(false);
    // Navigate to checkout with orderId and direct to payment step
    navigate(`/checkout?orderId=${orderId}&directPayment=true`);
  };

  // View all pending orders
  const viewPendingOrders = () => {
    setShowPendingOrdersModal(true);
  };

  // Initialize the order cancellation process
  const handleCancelOrderClick = (orderId: number) => {
    setOrderToCancel(orderId);
    setShowCancelOrderModal(true);
  };

  // Confirm and process order cancellation
  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
    
    try {
      setCancellingOrder(true);
      // Get the order number from the order object
      const orderToCancelObj = pendingOrders.find(order => order.id === orderToCancel);
      if (!orderToCancelObj) {
        throw new Error("Order not found");
      }
      
      // Call the cancel order API with the order number
      const orderNumber = orderToCancelObj.orderNumber;
      await cancelOrder(orderNumber);
      
      // Close the modal and refresh orders
      setShowCancelOrderModal(false);
      await getUserOrders();
      
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setCancellingOrder(false);
      setOrderToCancel(null);
    }
  };

  const subtotal = cart?.totalAmount || 0;
  const taxRate = 0.18; // 18% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  const alertVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  if (loading && !cart) {
    return (
      <Layout>
        <motion.div
          className="container my-5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSpinner size="lg" color="primary" />
        </motion.div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <motion.div
          className="container my-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="alert alert-danger">{error}</div>
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
        exit="exit"
        variants={containerVariants}
        ref={cartRef}
      >
        {/* Enhanced notification banner for pending orders */}
        <AnimatePresence>
          {pendingOrders.length > 0 && (
            <motion.div
              className="alert alert-info d-flex align-items-center justify-content-between mb-4 shadow-sm"
              variants={alertVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layoutId="pending-orders-alert"
            >
              <div>
                <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                <strong>
                  You have {pendingOrders.length} pending {pendingOrders.length === 1 ? "order" : "orders"}!
                </strong>
                <span className="ms-2">
                  Complete your payment to process {pendingOrders.length === 1 ? "it" : "them"}.
                </span>
              </div>
              <div className="d-flex">
                <motion.button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={viewPendingOrders}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bi bi-eye me-1"></i> View Orders
                </motion.button>
                <motion.button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleCompleteOrder(pendingOrders[0].id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bi bi-credit-card me-1"></i> Pay Latest Order
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <motion.h2
            variants={fadeIn}
          >
            <i className="bi bi-cart3 me-2"></i>
            Shopping Cart
          </motion.h2>
          
          {pendingOrders.length > 0 && (
            <motion.div
              variants={fadeIn}
              className="d-none d-md-block"
            >
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={viewPendingOrders}
                className="d-flex align-items-center"
              >
                <i className="bi bi-list-check me-2"></i>
                Manage Pending Orders
                <Badge bg="danger" className="ms-2">{pendingOrders.length}</Badge>
              </Button>
            </motion.div>
          )}
        </div>

        {
          !cart || cart.items.length === 0 ? (
            <motion.div
              className="text-center my-5 py-5 bg-light rounded shadow-sm"
              variants={itemVariants}
            >
              <motion.div
                className="mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 200,
                  delay: 0.2
                }}
              >
                <i className="bi bi-cart-x" style={{ fontSize: "4rem", color: "#6c757d" }}></i>
              </motion.div>
              <motion.h3
                variants={itemVariants}
                custom={1}
              >
                Your cart is empty
              </motion.h3>
              <motion.p
                className="text-muted"
                variants={itemVariants}
                custom={2}
              >
                Looks like you haven't added any items to your cart yet.
              </motion.p>
              <motion.div
                variants={itemVariants}
                custom={3}
                className="mt-3"
              >
                <motion.button
                  className="btn btn-primary me-3"
                  onClick={() => navigate("/shop")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bi bi-shop me-2"></i>Browse Products
                </motion.button>
                
                {pendingOrders.length > 0 && (
                  <motion.button 
                    className="btn btn-outline-primary"
                    onClick={viewPendingOrders}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Pay Pending Orders
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="table-responsive"
                variants={fadeIn}
              >
                <table className="table table-bordered cart-table">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Subtotal</th>
                      <th scope="col">Remove</th>
                    </tr>
                  </thead>
                  <motion.tbody>
                    <AnimatePresence>
                      {cart.items.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          variants={itemVariants}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layoutId={`cart-item-${item.id}`}
                        >
                          <td>
                            <motion.img
                              src={`${API_BASE_URL}/uploads/${item.product.images[0]}`}
                              alt={item.product.name}
                              className="img-thumbnail"
                              style={{ maxWidth: "80px" }}
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            />
                          </td>
                          <td className="align-middle">{item.product.name}</td>
                          <td className="align-middle">KSh {item.product.currentPrice.toLocaleString()}</td>
                          <td>
                            <div className="input-group input-group-sm" style={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
                              <motion.button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={loading || item.quantity <= 1}
                                style={{ flexShrink: 0 }}
                                whileHover={{ backgroundColor: "#e9ecef" }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <i className="bi bi-dash"></i>
                              </motion.button>

                              <button
                                className="form-control text-center centered-input"
                                type="button"
                                disabled
                                style={{ width: "100%", padding: "3px 20px", fontSize: "16px", textAlign: "center", flexGrow: 0, backgroundColor: "#fff" }}
                              >
                                {item.quantity}
                              </button>

                              <motion.button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={loading}
                                whileHover={{ backgroundColor: "#e9ecef" }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <i className="bi bi-plus"></i>
                              </motion.button>
                            </div>
                          </td>
                          <td className="align-middle">
                            <motion.strong
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              key={item.subtotal} // Re-render on subtotal change
                            >
                              KSh {item.subtotal.toLocaleString()}
                            </motion.strong>
                          </td>
                          <td className="align-middle text-center">
                            <motion.button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={loading}
                              whileHover={{ scale: 1.1, backgroundColor: "#dc3545", color: "white" }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <i className="bi bi-trash"></i>
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </motion.tbody>
                </table>
              </motion.div>

              <div className="row mt-4">
                <div className="col-md-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    variants={itemVariants}
                  >
                    <Link to="/shop" className="btn btn-outline-secondary">
                      <i className="bi bi-arrow-left me-1"></i> Continue Shopping
                    </Link>
                  </motion.div>
                </div>
                <div className="col-md-6">
                  <motion.div
                    className="cart-summary shadow-sm p-4 bg-light rounded"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.h5
                      className="mb-3"
                      variants={fadeIn}
                    >
                      Cart Summary
                    </motion.h5>
                    <motion.div
                      variants={fadeIn}
                    >
                      <p className="d-flex justify-content-between">
                        <span>Subtotal:</span>
                        <motion.span
                          className="text-dark"
                          key={subtotal} // Re-render on subtotal change
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          KSh <span id="cart-subtotal">{subtotal.toLocaleString()}</span>
                        </motion.span>
                      </p>
                      <p className="d-flex justify-content-between">
                        <span>Tax (18%):</span>
                        <motion.span
                          className="text-dark"
                          key={tax} // Re-render on tax change
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          KSh <span id="cart-tax">{tax.toLocaleString()}</span>
                        </motion.span>
                      </p>
                      <hr />
                      <p className="d-flex justify-content-between total-price">
                        <span><strong>Total:</strong></span>
                        <motion.span
                          className="text-primary fs-5"
                          key={total} // Re-render on total change
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <strong>KSh <span id="cart-total">{total.toLocaleString()}</span></strong>
                        </motion.span>
                      </p>
                    </motion.div>
                    
                    {/* Checkout buttons with pending orders option */}
                    <div className="d-grid gap-2">
                      <motion.button
                        className="btn btn-primary"
                        onClick={handleCheckout}
                        disabled={loading}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <i className="bi bi-bag-check me-2"></i> Proceed to Checkout
                      </motion.button>
                      
                      {pendingOrders.length > 0 && (
                        <motion.button
                          className="btn btn-outline-primary"
                          onClick={viewPendingOrders}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <i className="bi bi-credit-card me-2"></i> 
                          Pay Pending Order{pendingOrders.length > 1 ? 's' : ''}
                          <Badge bg="danger" className="ms-2">{pendingOrders.length}</Badge>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </>
          )
        }
      </motion.div>

      {/* Pending Orders Modal */}
      <Modal
        show={showPendingOrdersModal}
        onHide={() => setShowPendingOrdersModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Your Pending Orders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingOrders.length > 0 ? (
            <>
              <p>You have {pendingOrders.length} pending {pendingOrders.length === 1 ? 'order' : 'orders'} that {pendingOrders.length === 1 ? 'needs' : 'need'} payment. Select one to complete payment or cancel:</p>
              
              <div className="table-responsive mt-3">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Order #</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrders.map((order) => (
                      <tr key={order.id} className={selectedOrderId === order.id ? 'table-primary' : ''}>
                        <td>{order.id}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>{order.orderItems.length}</td>
                        <td><Badge bg="warning">Pending</Badge></td>
                        <td>
                          KSh {order.orderItems.reduce((sum, item) => 
                            sum + (item.price * item.quantity), 0).toLocaleString()}
                        </td>
                        <td className="text-nowrap">
                          <Button
                            variant="primary"
                            size="sm"
                            className="me-1 mb-1 mb-md-0"
                            onClick={() => handleCompleteOrder(order.id)}
                          >
                            <i className="bi bi-credit-card me-1"></i> Pay
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleCancelOrderClick(order.id)}
                          >
                            <i className="bi bi-x-circle me-1"></i> Cancel
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
              <h5 className="mb-2">No pending orders</h5>
              <p className="text-muted">You don't have any orders waiting for payment</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowPendingOrdersModal(false)}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCheckout}
            disabled={cart?.items.length === 0}
          >
            Proceed with Current Cart
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Cancel Order Confirmation Modal */}
      <Modal
        show={showCancelOrderModal}
        onHide={() => setShowCancelOrderModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-warning">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Are you sure you want to cancel this order?</strong>
          </div>
          <p>This action cannot be undone. Order #{orderToCancel} will be permanently cancelled.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowCancelOrderModal(false)}
            disabled={cancellingOrder}
          >
            Keep Order
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmCancelOrder}
            disabled={cancellingOrder}
          >
            {cancellingOrder ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cancelling...
              </>
            ) : (
              <>Cancel Order</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Cart;