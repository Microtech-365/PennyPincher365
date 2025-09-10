'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Transaction, Category } from '@/lib/types';
import { CategoryIcon } from '@/components/category-icon';
import { Button } from '../ui/button';
import { MoreHorizontal, ArrowRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import Link from 'next/link';
import { useState } from 'react';
import { TransactionSheet } from '../transactions/transaction-sheet';
import { DeleteTransactionDialog } from '../transactions/delete-transaction-dialog';
import { useUser } from '@/context/user-context';

type RecentTransactionsProps = {
  transactions: Transaction[];
  categories: Category[];
  showViewAll?: boolean;
};

export function RecentTransactions({ transactions: initialTransactions, categories, showViewAll = false }: RecentTransactionsProps) {
  const { addTransaction, updateTransaction, deleteTransaction } = useUser();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditMode(true);
    setIsSheetOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (!selectedTransaction) return;
    deleteTransaction(selectedTransaction.id);
    setIsDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleFormSubmit = (data: Omit<Transaction, 'id'>) => {
    if (isEditMode && selectedTransaction) {
      updateTransaction({ ...selectedTransaction, ...data });
    } else {
      addTransaction(data);
    }
    setIsSheetOpen(false);
    setSelectedTransaction(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return utcDate.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            A list of your most recent expenses.
          </CardDescription>
        </div>
        {showViewAll && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/transactions">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialTransactions.map((transaction) => {
              const category = categoryMap.get(transaction.categoryId);
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="flex items-center gap-2 max-w-min">
                      {category && <CategoryIcon name={category.name} className="h-4 w-4" />}
                      <span>{category?.name || 'Uncategorized'}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(transaction.date)}</TableCell>
                  <TableCell className="text-right">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4"/>
                            <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(transaction)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(transaction)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
       <TransactionSheet 
          isOpen={isSheetOpen} 
          setIsOpen={setIsSheetOpen}
          isEditMode={isEditMode}
          transaction={selectedTransaction}
          onSubmit={handleFormSubmit}
      />
      <DeleteTransactionDialog 
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
          onConfirm={confirmDelete}
      />
    </Card>
  );
}
