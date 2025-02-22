import { User } from '../types/account';

export const loadUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const getLoggedInUser = (): User | null => {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
};

export const setLoggedInUser = (user: User) => {
  localStorage.setItem('loggedInUser', JSON.stringify(user));
};

export const clearLoggedInUser = () => {
  localStorage.removeItem('loggedInUser');
};

export const addUser = (newUser: User) => {
  const users = loadUsers();
  users.push(newUser);
  saveUsers(users);
};

export const updateUser = (updatedUser: User) => {
  const users = loadUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
    setLoggedInUser(updatedUser);
  }
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\+?\d{7,15}$/;
  return re.test(phone);
};
