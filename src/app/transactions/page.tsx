'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/lib/types';
import { CategoryIcon } from '@/components/category-icon';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { TransactionSheet } from "@/components/transactions/transaction-sheet";
import React from "react";
import { DeleteTransactionDialog } from "@/components/transactions/delete-transaction-dialog";
import { useUser } from "@/context/user-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TransactionsPage() {
    const { transactions, categories, addTransaction, updateTransaction, deleteTransaction } = useUser();
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
    const [isEditMode, setIsEditMode] = React.useState(false);


    const handleAdd = () => {
        setSelectedTransaction(null);
        setIsEditMode(false);
        setIsSheetOpen(true);
    };

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
        <main className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
                    <p className="text-muted-foreground">View and manage your expenses.</p>
                </div>
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                    <CardDescription>A complete list of all your recorded transactions.</CardDescription>
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
                            {sortedTransactions.map((transaction) => {
                            const category = categoryMap.get(transaction.categoryId);
                            const categoryName = category ? category.name : 'Uncategorized';
                            return (
                                <TableRow key={transaction.id}>
                                <TableCell className="font-medium">{transaction.description}</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge variant="outline" className="flex items-center gap-2 max-w-min">
                                    <CategoryIcon name={categoryName} className="h-4 w-4" />
                                    <span>{categoryName}</span>
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
            </Card>

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
        </main>
    );
}
