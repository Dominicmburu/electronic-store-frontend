import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/account';
import { fetchUserProfile, loginUser, updateUserProfile } from './helper';
import Cookies from 'js-cookie';
// import axios from 'axios';

interface UserContextProps {
  token: string | null;
  profile: User | null;
  login: (email: string, password: string) => Promise<void>;
  // register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, email: string, phoneNumber: string, password?: string) => Promise<void>;
  // addAddress: (type: 'Shipping' | 'Billing' | 'Both', details: string) => void;
  // editAddress: (id: number, type: 'Shipping' | 'Billing' | 'Both', details: string) => void;
  // deleteAddress: (id: number) => void;
  // addPaymentMethod: (type: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer', details: string) => void;
  // editPaymentMethod: (id: number, type: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer', details: string) => void;
  // deletePaymentMethod: (id: number) => void;
  // addToWishlist: (productId: number) => void;
  // removeFromWishlist: (productId: number) => void;
  // updateAccountSettings: (
  //   newsletter: 'Subscribed' | 'Unsubscribed',
  //   notifications: 'All Notifications' | 'Email Only' | 'SMS Only' | 'No Notifications'
  // ) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(Cookies.get('token') || null);
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const currentToken = Cookies.get('token'); 
    setToken(currentToken || null); 

    if (currentToken) {
      const fetchUserProfileData = async () => {
        try {
          const profileData = await fetchUserProfile(currentToken);
          if (profileData) {
            setProfile(profileData); 
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setProfile(null); 
        }
      };

      fetchUserProfileData();
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await loginUser(email, password);
      Cookies.set('token', token, { expires: 7, sameSite: 'Strict' });
      setToken(token);
      setProfile(user);
    } catch (error) {
      throw new Error('Invalid email or password.');
    }
  };

  // const register = async (name: string, email: string, phone: string, password: string) => {
  //   try {
  //     const response = await axios.post('https://electronic-store-backend.onrender.com/api/auth/register', {
  //       name,
  //       email,
  //       phoneNumber: phone,
  //       password,
  //     });

  //     if (response.status === 201) {
  //       const { token } = response.data;

  //       Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' });

  //       const userProfile = response.data.user;
  //       setUser(userProfile);
  //     }
  //   } catch (error) {
  //     throw new Error(error.response?.data?.message || 'Registration failed.');
  //   }
  // };

  const logout = () => {
    Cookies.remove('token');
    setToken(null);
    setProfile(null);
  };

  const updateProfile = async (name: string, email: string, phoneNumber: string, password?: string) => {
    if (!profile) throw new Error('User is not logged in.');
    try {
      const updatedUser = await updateUserProfile(name, email, phoneNumber, password);
      setProfile(updatedUser);
    } catch (error) {
      throw new Error('Failed to update profile.');
    }

  // const addAddressMethod = (type: 'Shipping' | 'Billing' | 'Both', details: string) => {
  //   if (user) {
  //     const newAddress: Address = {
  //       id: Date.now(),
  //       type,
  //       details,
  //     };
  //     const updatedUser = { ...user, addresses: [...user.addresses, newAddress] };
  //     updateUser(updatedUser);
  //     setUser(updatedUser);
  //   }
  // };

  // const editAddressMethod = (id: number, type: 'Shipping' | 'Billing' | 'Both', details: string) => {
  //   if (user) {
  //     const updatedAddresses = user.addresses.map(addr => addr.id === id ? { ...addr, type, details } : addr);
  //     const updatedUser = { ...user, addresses: updatedAddresses };
  //     updateUser(updatedUser);
  //     setUser(updatedUser);
  //   }
  // };

  // const deleteAddressMethod = (id: number) => {
  //   if (user) {
  //     const updatedAddresses = user.addresses.filter(addr => addr.id !== id);
  //     const updatedUser = { ...user, addresses: updatedAddresses };
  //     updateUser(updatedUser);
  //     setUser(updatedUser);
  //   }
  // };

  // const addPaymentMethodMethod = (type: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer', details: string) => {
  //   if (user) {
  //     const newPaymentMethod: PaymentMethod = {
  //       id: Date.now(),
  //       type,
  //       details,
  //     };
  //     const updatedUser = { ...user, paymentMethods: [...user.paymentMethods, newPaymentMethod] };
  //     updateUser(updatedUser);
  //     setUser(updatedUser);
  //   }
  // };

  // const editPaymentMethodMethod = (id: number, type: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer', details: string) => {
  //   if (user) {
  //     const updatedPaymentMethods = user.paymentMethods.map(pm => pm.id === id ? { ...pm, type, details } : pm);
  //     const updatedUser = { ...user, paymentMethods: updatedPaymentMethods };
  //     updateUser(updatedUser);
  //     setUser(updatedUser);
  //   }
  // };

  // const deletePaymentMethodMethod = (id: number) => {
  //   if (user) {
  //     const updatedPaymentMethods = user.paymentMethods.filter(pm => pm.id !== id);
  //     const updatedUser = { ...user, paymentMethods: updatedPaymentMethods };
  //     updateUser(updatedUser);
  //     setUser(updatedUser);
  //   }
  // };

  // const addToWishlistMethod = (productId: number) => {
  //   if (user) {
  //     if (!user.wishlist.includes(productId)) {
  //       const updatedUser = { ...user, wishlist: [...user.wishlist, productId] };
  //       updateUser(updatedUser);
  //       setUser(updatedUser);
  //     }
  //   }
  // };

  // const removeFromWishlistMethod = (productId: number) => {
  //   if (user) {
  //     const updatedUser = { ...user, wishlist: user.wishlist.filter(id => id !== productId) };
  //     updateUser(updatedUser);
  //     setUser(updatedUser);
  //   }
  // };

  // const updateAccountSettingsMethod = (
  //   newsletter: 'Subscribed' | 'Unsubscribed',
  //   notifications: 'All Notifications' | 'Email Only' | 'SMS Only' | 'No Notifications'
  // ) => {
  //   if (user) {
  //     const updatedUser = {
  //       ...user,
  //       settings: {
  //         newsletter,
  //         notifications,
  //       },
  //     };
  //     updateUser(updatedUser);
  //     setUser(updatedUser);
  //   }
  };

  return (
    <UserContext.Provider
      value={{        
        token,
        profile,
        login,
        // register,
        logout,
        updateProfile,
        // addAddress: addAddressMethod,
        // editAddress: editAddressMethod,
        // deleteAddress: deleteAddressMethod,
        // addPaymentMethod: addPaymentMethodMethod,
        // editPaymentMethod: editPaymentMethodMethod,
        // deletePaymentMethod: deletePaymentMethodMethod,
        // addToWishlist: addToWishlistMethod,
        // removeFromWishlist: removeFromWishlistMethod,
        // updateAccountSettings: updateAccountSettingsMethod,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
