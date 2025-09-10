'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, Transaction, Budget, Category } from '@/lib/types';
import { categories as defaultCategories } from '@/lib/data';

type UserContextType = {
  user: User | null;
  login: (userData: User) => void;
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  
  useEffect(() => {
    // Load user from localStorage on initial load
    if (typeof window !== 'undefined') {
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

  const saveUserData = (email: string, newTransactions: Transaction[], newBudgets: Budget[], newCategories: Category[]) => {
      localStorage.setItem(`transactions_${email}`, JSON.stringify(newTransactions));
      localStorage.setItem(`budgets_${email}`, JSON.stringify(newBudgets));
      localStorage.setItem(`categories_${email}`, JSON.stringify(newCategories));
  };


  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    loadUserData(userData.email);
  };

  const logout = () => {
    if(!user) return;
    saveUserData(user.email, transactions, budgets, categories); // Save before logging out
    setUser(null);
    setTransactions([]);
    setBudgets([]);
    setCategories(defaultCategories);
    localStorage.removeItem('user');
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const newTransaction: Transaction = {
      id: new Date().toISOString() + Math.random().toString(),
      ...transactionData,
    };
    const newTransactions = [...transactions, newTransaction];
    setTransactions(newTransactions);
    saveUserData(user.email, newTransactions, budgets, categories);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    if (!user) return;
    const newTransactions = transactions.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t));
    setTransactions(newTransactions);
    saveUserData(user.email, newTransactions, budgets, categories);
  };

  const deleteTransaction = (id: string) => {
    if (!user) return;
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    // Also delete any associated budgets
    const newBudgets = budgets.filter(b => {
      const txn = transactions.find(t => t.id === id);
      return !txn || b.categoryId !== txn.categoryId;
    });

    saveUserData(user.email, newTransactions, newBudgets, categories);
  };

  const updateBudgets = (newBudgets: Budget[]) => {
    if(!user) return;
    setBudgets(newBudgets);
    saveUserData(user.email, transactions, newBudgets, categories);
  }

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    if (!user) return;
    const newCategory: Category = {
      id: categoryData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      ...categoryData,
    };
    const newCategories = [...categories, newCategory];
    setCategories(newCategories);
    // Add a default budget of 0 for the new category
    const newBudgets = [...budgets, { categoryId: newCategory.id, amount: 0 }];
    setBudgets(newBudgets);
    saveUserData(user.email, transactions, newBudgets, newCategories);
  };

  const updateCategory = (updatedCategory: Category) => {
    if (!user) return;
    const newCategories = categories.map(c => (c.id === updatedCategory.id ? updatedCategory : c));
    setCategories(newCategories);
    saveUserData(user.email, transactions, budgets, newCategories);
  };

  const deleteCategory = (id: string) => {
    if (!user) return;
    // Prevent deletion if transactions exist for this category
    if (transactions.some(t => t.categoryId === id)) {
      alert("Cannot delete category with existing transactions. Please re-assign them first.");
      return;
    }
    const newCategories = categories.filter(c => c.id !== id);
    setCategories(newCategories);
    const newBudgets = budgets.filter(b => b.categoryId !== id);
    setBudgets(newBudgets);
    saveUserData(user.email, transactions, newBudgets, newCategories);
  };


  return (
    <UserContext.Provider value={{ 
        user, login, logout, 
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
