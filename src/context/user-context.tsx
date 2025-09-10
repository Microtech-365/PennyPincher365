'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, Transaction, Budget } from '@/lib/types';
import { categories, budgets as defaultBudgets } from '@/lib/data';

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
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

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
    
    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);
    setBudgets(storedBudgets ? JSON.parse(storedBudgets) : defaultBudgets);
  };

  const saveUserData = (email: string, newTransactions: Transaction[], newBudgets: Budget[]) => {
      localStorage.setItem(`transactions_${email}`, JSON.stringify(newTransactions));
      localStorage.setItem(`budgets_${email}`, JSON.stringify(newBudgets));
  };


  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    loadUserData(userData.email);
  };

  const logout = () => {
    setUser(null);
    setTransactions([]);
    setBudgets([]);
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
    saveUserData(user.email, newTransactions, budgets);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    if (!user) return;
    const newTransactions = transactions.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t));
    setTransactions(newTransactions);
    saveUserData(user.email, newTransactions, budgets);
  };

  const deleteTransaction = (id: string) => {
    if (!user) return;
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    saveUserData(user.email, newTransactions, budgets);
  };

  const updateBudgets = (newBudgets: Budget[]) => {
    if(!user) return;
    setBudgets(newBudgets);
    saveUserData(user.email, transactions, newBudgets);
  }

  return (
    <UserContext.Provider value={{ user, login, logout, transactions, addTransaction, updateTransaction, deleteTransaction, budgets, updateBudgets }}>
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
