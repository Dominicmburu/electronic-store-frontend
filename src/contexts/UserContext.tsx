// src/contexts/UserContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Address, PaymentMethod, AccountSettings } from '../types/account';
import {
  loadUsers,
  saveUsers,
  getLoggedInUser,
  setLoggedInUser,
  clearLoggedInUser,
  addUser,
  updateUser,
  validateEmail,
  validatePhone
} from '../utils/userUtils';

interface UserContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, email: string, phone: string, password?: string) => Promise<void>;
  addAddress: (type: 'Shipping' | 'Billing' | 'Both', details: string) => void;
  editAddress: (id: number, type: 'Shipping' | 'Billing' | 'Both', details: string) => void;
  deleteAddress: (id: number) => void;
  addPaymentMethod: (type: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer', details: string) => void;
  editPaymentMethod: (id: number, type: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer', details: string) => void;
  deletePaymentMethod: (id: number) => void;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  updateAccountSettings: (
    newsletter: 'Subscribed' | 'Unsubscribed',
    notifications: 'All Notifications' | 'Email Only' | 'SMS Only' | 'No Notifications'
  ) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user on mount
  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    const users = loadUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setLoggedInUser(foundUser);
      setUser(foundUser);
    } else {
      throw new Error('Invalid email or password.');
    }
  };

  // Register function
  const register = async (name: string, email: string, phone: string, password: string) => {
    if (password.length < 6) {
      throw new Error('Password should be at least 6 characters long.');
    }
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!validatePhone(phone)) {
      throw new Error('Please enter a valid phone number.');
    }

    const users = loadUsers();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: Date.now(),
      name,
      email,
      phone,
      password, // Note: In production, passwords should be hashed
      orders: [],
      addresses: [],
      paymentMethods: [],
      wishlist: [],
      settings: {
        newsletter: 'Subscribed',
        notifications: 'All Notifications',
      },
    };

    addUser(newUser);
    setLoggedInUser(newUser);
    setUser(newUser);
  };

  // Logout function
  const logout = () => {
    clearLoggedInUser();
    setUser(null);
  };

  // Update Profile
  const updateProfile = async (name: string, email: string, phone: string, password?: string) => {
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!validatePhone(phone)) {
      throw new Error('Please enter a valid phone number.');
    }
    if (password && password.length < 6) {
      throw new Error('Password should be at least 6 characters long.');
    }

    if (user) {
      const users = loadUsers();
      const emailTaken = users.some(u => u.email === email && u.id !== user.id);
      if (emailTaken) {
        throw new Error('This email is already in use by another account.');
      }

      const updatedUser: User = {
        ...user,
        name,
        email,
        phone,
        password: password || user.password,
      };

      updateUser(updatedUser);
      setLoggedInUser(updatedUser);
      setUser(updatedUser);
    }
  };

  // Address Management
  const addAddressMethod = (type: 'Shipping' | 'Billing' | 'Both', details: string) => {
    if (user) {
      const newAddress: Address = {
        id: Date.now(),
        type,
        details,
      };
      const updatedUser = { ...user, addresses: [...user.addresses, newAddress] };
      updateUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const editAddressMethod = (id: number, type: 'Shipping' | 'Billing' | 'Both', details: string) => {
    if (user) {
      const updatedAddresses = user.addresses.map(addr => addr.id === id ? { ...addr, type, details } : addr);
      const updatedUser = { ...user, addresses: updatedAddresses };
      updateUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const deleteAddressMethod = (id: number) => {
    if (user) {
      const updatedAddresses = user.addresses.filter(addr => addr.id !== id);
      const updatedUser = { ...user, addresses: updatedAddresses };
      updateUser(updatedUser);
      setUser(updatedUser);
    }
  };

  // Payment Method Management
  const addPaymentMethodMethod = (type: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer', details: string) => {
    if (user) {
      const newPaymentMethod: PaymentMethod = {
        id: Date.now(),
        type,
        details,
      };
      const updatedUser = { ...user, paymentMethods: [...user.paymentMethods, newPaymentMethod] };
      updateUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const editPaymentMethodMethod = (id: number, type: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer', details: string) => {
    if (user) {
      const updatedPaymentMethods = user.paymentMethods.map(pm => pm.id === id ? { ...pm, type, details } : pm);
      const updatedUser = { ...user, paymentMethods: updatedPaymentMethods };
      updateUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const deletePaymentMethodMethod = (id: number) => {
    if (user) {
      const updatedPaymentMethods = user.paymentMethods.filter(pm => pm.id !== id);
      const updatedUser = { ...user, paymentMethods: updatedPaymentMethods };
      updateUser(updatedUser);
      setUser(updatedUser);
    }
  };

  // Wishlist Management
  const addToWishlistMethod = (productId: number) => {
    if (user) {
      if (!user.wishlist.includes(productId)) {
        const updatedUser = { ...user, wishlist: [...user.wishlist, productId] };
        updateUser(updatedUser);
        setUser(updatedUser);
      }
    }
  };

  const removeFromWishlistMethod = (productId: number) => {
    if (user) {
      const updatedUser = { ...user, wishlist: user.wishlist.filter(id => id !== productId) };
      updateUser(updatedUser);
      setUser(updatedUser);
    }
  };

  // Account Settings
  const updateAccountSettingsMethod = (
    newsletter: 'Subscribed' | 'Unsubscribed',
    notifications: 'All Notifications' | 'Email Only' | 'SMS Only' | 'No Notifications'
  ) => {
    if (user) {
      const updatedUser = {
        ...user,
        settings: {
          newsletter,
          notifications,
        },
      };
      updateUser(updatedUser);
      setUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        addAddress: addAddressMethod,
        editAddress: editAddressMethod,
        deleteAddress: deleteAddressMethod,
        addPaymentMethod: addPaymentMethodMethod,
        editPaymentMethod: editPaymentMethodMethod,
        deletePaymentMethod: deletePaymentMethodMethod,
        addToWishlist: addToWishlistMethod,
        removeFromWishlist: removeFromWishlistMethod,
        updateAccountSettings: updateAccountSettingsMethod,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
