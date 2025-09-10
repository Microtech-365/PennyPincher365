'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, Transaction, Budget, Category } from '@/lib/types';
import { categories as defaultCategories } from '@/lib/data';

type AuthResult = {
  success: boolean;
  error?: string;
};

type UserContextType = {
  user: User | null;
  login: (email: string, password: string) => AuthResult;
  signup: (userData: Omit<User, 'id'>) => Promise<AuthResult>;
  updateUser: (userData: User) => void;
  logout: () => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  budgets: Budget[];
  updateBudgets: (budgets: Budget[]) => void;
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAllUsers = localStorage.getItem('all_users');
      if (storedAllUsers) {
        setAllUsers(JSON.parse(storedAllUsers));
      }

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        loadUserData(parsedUser.email);
      }
    }
  }, []);

  const loadUserData = (email: string) => {
    const storedTransactions = localStorage.getItem(`transactions_${email}`);
    const storedBudgets = localStorage.getItem(`budgets_${email}`);
    const storedCategories = localStorage.getItem(`categories_${email}`);
    
    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);
    setBudgets(storedBudgets ? JSON.parse(storedBudgets) : defaultCategories.map(c => ({ categoryId: c.id, amount: 0 })));
    setCategories(storedCategories ? JSON.parse(storedCategories) : defaultCategories);
  };

  const saveUserData = (email: string) => {
      localStorage.setItem(`transactions_${email}`, JSON.stringify(transactions));
      localStorage.setItem(`budgets_${email}`, JSON.stringify(budgets));
      localStorage.setItem(`categories_${email}`, JSON.stringify(categories));
  };
  
  const signup = async (userData: Omit<User, 'id'>): Promise<AuthResult> => {
    if (allUsers.find(u => u.email === userData.email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser = { ...userData };
    const newAllUsers = [...allUsers, newUser];
    setAllUsers(newAllUsers);
    setUser(newUser);
    
    localStorage.setItem('all_users', JSON.stringify(newAllUsers));
    localStorage.setItem('user', JSON.stringify(newUser));
    loadUserData(newUser.email);

    return { success: true };
  };
  
  const login = (email: string, password: string): AuthResult => {
    const foundUser = allUsers.find(u => u.email === email);
    if (!foundUser) {
      return { success: false, error: 'No account found with this email.' };
    }
    if (foundUser.password !== password) {
      return { success: false, error: 'Incorrect password.' };
    }
    
    setUser(foundUser);
    localStorage.setItem('user', JSON.stringify(foundUser));
    loadUserData(foundUser.email);
    return { success: true };
  };

  const updateUser = (userData: User) => {
    if(!user) return;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    const newAllUsers = allUsers.map(u => u.email === userData.email ? userData : u);
    setAllUsers(newAllUsers);
    localStorage.setItem('all_users', JSON.stringify(newAllUsers));
  }

  const logout = () => {
    if(!user) return;
    saveUserData(user.email); 
    setUser(null);
    setTransactions([]);
    setBudgets([]);
    setCategories(defaultCategories);
    localStorage.removeItem('user');
  };

  const persistData = (email: string, { newTransactions, newBudgets, newCategories }: { newTransactions?: Transaction[], newBudgets?: Budget[], newCategories?: Category[] }) => {
    if (!user || user.email !== email) return;
    const currentTransactions = newTransactions ?? transactions;
    const currentBudgets = newBudgets ?? budgets;
    const currentCategories = newCategories ?? categories;
    localStorage.setItem(`transactions_${email}`, JSON.stringify(currentTransactions));
    localStorage.setItem(`budgets_${email}`, JSON.stringify(currentBudgets));
    localStorage.setItem(`categories_${email}`, JSON.stringify(currentCategories));
  }

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const newTransaction: Transaction = {
      id: new Date().toISOString() + Math.random().toString(),
      ...transactionData,
    };
    const newTransactions = [...transactions, newTransaction];
    setTransactions(newTransactions);
    persistData(user.email, { newTransactions });
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    if (!user) return;
    const newTransactions = transactions.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t));
    setTransactions(newTransactions);
    persistData(user.email, { newTransactions });
  };

  const deleteTransaction = (id: string) => {
    if (!user) return;
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    persistData(user.email, { newTransactions });
  };

  const updateBudgets = (newBudgets: Budget[]) => {
    if(!user) return;
    setBudgets(newBudgets);
    persistData(user.email, { newBudgets });
  }

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    if (!user) return;
    const newCategory: Category = {
      id: categoryData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      ...categoryData,
    };
    const newCategories = [...categories, newCategory];
    setCategories(newCategories);
    const newBudgets = [...budgets, { categoryId: newCategory.id, amount: 0 }];
    setBudgets(newBudgets);
    persistData(user.email, { newBudgets, newCategories });
  };

  const updateCategory = (updatedCategory: Category) => {
    if (!user) return;
    const newCategories = categories.map(c => (c.id === updatedCategory.id ? updatedCategory : c));
    setCategories(newCategories);
    persistData(user.email, { newCategories });
  };

  const deleteCategory = (id: string) => {
    if (!user) return;
    if (transactions.some(t => t.categoryId === id)) {
      alert("Cannot delete category with existing transactions. Please re-assign them first.");
      return;
    }
    const newCategories = categories.filter(c => c.id !== id);
    setCategories(newCategories);
    const newBudgets = budgets.filter(b => b.categoryId !== id);
    setBudgets(newBudgets);
    persistData(user.email, { newBudgets, newCategories });
  };


  return (
    <UserContext.Provider value={{ 
        user, signup, login, updateUser, logout, 
        transactions, addTransaction, updateTransaction, deleteTransaction, 
        budgets, updateBudgets,
        categories, addCategory, updateCategory, deleteCategory
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
