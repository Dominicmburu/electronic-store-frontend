// src/utils/userUtils.ts

import { User, Order, Address, PaymentMethod, AccountSettings } from '../types/account';

// Load users from Local Storage
export const loadUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

// Save users to Local Storage
export const saveUsers = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Get the currently logged-in user
export const getLoggedInUser = (): User | null => {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
};

// Set the logged-in user
export const setLoggedInUser = (user: User) => {
  localStorage.setItem('loggedInUser', JSON.stringify(user));
};

// Clear the logged-in user
export const clearLoggedInUser = () => {
  localStorage.removeItem('loggedInUser');
};

// Add a new user
export const addUser = (newUser: User) => {
  const users = loadUsers();
  users.push(newUser);
  saveUsers(users);
};

// Update an existing user
export const updateUser = (updatedUser: User) => {
  const users = loadUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
    setLoggedInUser(updatedUser);
  }
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone number format (simple validation)
export const validatePhone = (phone: string): boolean => {
  const re = /^\+?\d{7,15}$/;
  return re.test(phone);
};
