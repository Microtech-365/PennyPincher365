import type { Transaction, Category, Budget } from './types';

export const categories: Category[] = [
  { id: 'food', name: 'Food' },
  { id: 'travel', name: 'Travel' },
  { id: 'bills', name: 'Bills' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'health', name: 'Health' },
];

export const transactions: Transaction[] = [
  { id: '1', date: '2024-07-01', amount: 12.50, description: 'Lunch at Cafe', categoryId: 'food' },
  { id: '2', date: '2024-07-01', amount: 150.00, description: 'Groceries', categoryId: 'food' },
  { id: '3', date: '2024-07-02', amount: 350.75, description: 'Flight to SFO', categoryId: 'travel' },
  { id: '4', date: '2024-07-03', amount: 75.00, description: 'Electricity Bill', categoryId: 'bills' },
  { id: '5', date: '2024-07-04', amount: 250.00, description: 'New shoes', categoryId: 'shopping' },
  { id: '6', date: '2024-07-05', amount: 45.00, description: 'Movie tickets', categoryId: 'entertainment' },
  { id: '7', date: '2024-07-06', amount: 25.00, description: 'Dinner', categoryId: 'food' },
  { id: '8', date: '2024-07-08', amount: 60.00, description: 'Pharmacy', categoryId: 'health' },
  { id: '9', date: '2024-07-10', amount: 85.00, description: 'Internet Bill', categoryId: 'bills' },
  { id: '10', date: '2024-07-12', amount: 220.00, description: 'Weekend trip fuel', categoryId: 'travel' },
  { id: '11', date: '2024-07-15', amount: 95.00, description: 'Concert', categoryId: 'entertainment' },
  { id: '12', date: '2024-07-18', amount: 180.00, description: 'Jacket', categoryId: 'shopping' },
  { id: '13', date: '2024-07-20', amount: 80.00, description: 'Fancy dinner with friends', categoryId: 'food' },
  { id: '14', date: '2024-07-22', amount: 400.00, description: 'Over-budget grocery haul', categoryId: 'food' },
];

export const budgets: Budget[] = [
  { categoryId: 'food', amount: 400 },
  { categoryId: 'travel', amount: 500 },
  { categoryId: 'bills', amount: 200 },
  { categoryId: 'shopping', amount: 300 },
  { categoryId: 'entertainment', amount: 100 },
  { categoryId: 'health', amount: 100 },
];
