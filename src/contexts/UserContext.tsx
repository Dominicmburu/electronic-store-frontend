import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { FetchUserAddressesResponse, User } from '../types/account';
import { fetchUserProfile, loginUser, updateUserProfile } from './helper';
import { addAddressAPI, deleteAddressAPI, updateAddressAPI, fetchUserAddressesAPI } from './addressHelper';
import { addPaymentMethodAPI, deletePaymentMethodAPI, fetchPaymentMethodsAPI } from './paymentHelper';
import { addToWishlistAPI, fetchWishlistAPI, removeFromWishlistAPI } from './wishlistHelper';
import { fetchSettingsAPI, updateSettingsAPI } from './settingsHelper';
import Cookies from 'js-cookie';

interface UserContextProps {
  token: string | null;
  profile: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, email: string, phoneNumber: string, password?: string, currentPassword?: string) => Promise<void>;
  fetchUserAddresses: (token: string) => Promise<FetchUserAddressesResponse>;
  addAddress: (addressData: any) => Promise<void>;
  updateAddress: (id: number, addressData: any) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
  paymentMethods: any[];
  fetchPaymentMethods: (token: string) => Promise<void>;
  addPaymentMethod: (type: string, details: string) => Promise<void>;
  deletePaymentMethod: (id: number) => Promise<void>;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  fetchWishlist: (token: string) => Promise<any>;
  updateAccountSettings: (settings: any) => Promise<void>;
  fetchAccountSettings: (token: string) => Promise<any>;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(Cookies.get('token') || null);
  const [profile, setProfile] = useState<User | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    const currentToken = Cookies.get('token');
    setToken(currentToken || null);

    if (currentToken) {
      const fetchUserProfileData = async () => {
        try {
          const profileData = await fetchUserProfile(currentToken);
          setProfile(profileData);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setProfile(null);
        }
      };
      fetchUserProfileData();


      const fetchPayments = async () => {
        try {
          const methods = await fetchPaymentMethodsAPI(currentToken);
          setPaymentMethods(methods);
        } catch (error) {
          console.error("Error fetching payment methods:", error);
        }
      };
      fetchPayments();


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

  const logout = () => {
    Cookies.remove('token');
    setToken(null);
    setProfile(null);
  };

  const updateProfile = async (name: string, email: string, phoneNumber: string, password?: string, currentPassword?: string) => {
    if (!profile) throw new Error('User is not logged in.');
    try {
      const updatedUser = await updateUserProfile(name, email, phoneNumber, password, currentPassword);
      setProfile(updatedUser);
    } catch (error) {
      throw new Error('Failed to update profile.');
    }
  };

  const fetchUserAddresses = async (token: string) => {
    if (!token) throw new Error('No token found.');
    return await fetchUserAddressesAPI(token);
  };

  const addAddress = async (addressData: any) => {
    if (!token) throw new Error('User is not logged in.');
    try {
      await addAddressAPI(addressData, token);
    } catch (error) {
      throw new Error('Failed to add address.');
    }
  };

  const updateAddress = async (id: number, addressData: any) => {
    if (!token) throw new Error('User is not logged in.');
    try {
      await updateAddressAPI(id, addressData, token);
    } catch (error) {
      throw new Error('Failed to update address.');
    }
  };

  const deleteAddress = async (id: number) => {
    if (!token) throw new Error('User is not logged in.');
    try {
      await deleteAddressAPI(id, token);
    } catch (error) {
      throw new Error('Failed to delete address.');
    }
  };

  const fetchPaymentMethods = async (token: string) => {
    try {
      const methods = await fetchPaymentMethodsAPI(token);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  const addPaymentMethod = async (type: string, details: string) => {
    if (!token) throw new Error('User is not logged in.');
    try {
      await addPaymentMethodAPI(type, details, token);
    } catch (error) {
      throw new Error('Failed to add payment method.');
    }
  };

  const deletePaymentMethod = async (id: number) => {
    if (!token) throw new Error('User is not logged in.');
    try {
      await deletePaymentMethodAPI(id, token);
    } catch (error) {
      throw new Error('Failed to delete payment method.');
    }
  };

  const addToWishlist = async (productId: number) => {
    if (!token) throw new Error('User is not logged in.');
    try {
      await addToWishlistAPI(productId, token);
    } catch (error) {
      throw new Error('Failed to add to wishlist.');
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!token) throw new Error('User is not logged in.');
    try {
      await removeFromWishlistAPI(productId, token);
    } catch (error) {
      throw new Error('Failed to remove from wishlist.');
    }
  };

  const fetchWishlist = async (token: string) => {
    try {
      const response = await fetchWishlistAPI(token);
      return response;  
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const updateAccountSettings = async (settings: any) => {
    if (!token) throw new Error('User is not logged in.');
    try {
      const { newsSubscription, notificationEmail, notificationSMS } = settings;
      await updateSettingsAPI(newsSubscription, notificationEmail, notificationSMS, token);
    } catch (error) {
      throw new Error('Failed to update account settings.');
    }
  };
  

  const fetchAccountSettings = async (token: string) => {
    try {
      const settings = await fetchSettingsAPI(token);
      return settings; 
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        token,
        profile,
        login,
        logout,
        updateProfile,
        fetchUserAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        paymentMethods,
        fetchPaymentMethods,
        addPaymentMethod,
        deletePaymentMethod,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
        updateAccountSettings,
        fetchAccountSettings,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
