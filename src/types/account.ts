export interface User {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    password: string; 
    orders: Order[];
    addresses: Address[];
    paymentMethods: PaymentMethod[];
    wishlist: number[]; // Array of Product IDs
    settings: AccountSettings;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Order {
    id: number;
    orderNumber: string;
    orderDate: string; // ISO string
    shippingAddress: string;
    paymentMethod: string;
    items: OrderItem[];
    total: number;
    status: string;
    estimatedDelivery: string;
  }
  
  export interface OrderItem {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
    subtotal: number;
  }
  
  export interface Address {
    id: number;
    userId: number;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }

  export interface FetchUserAddressesResponse {
    addresses: Address[];
  }
  
  export interface PaymentMethod {
    id: number;
    type: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer';
    details: string; // e.g., Card Number, PayPal Email
  }
  
  export interface AccountSettings {
    newsletter: 'Subscribed' | 'Unsubscribed';
    notifications: 'All Notifications' | 'Email Only' | 'SMS Only' | 'No Notifications';
  }
  