'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { TransactionForm } from './transaction-form';
import type { Transaction } from '@/lib/types';

type TransactionSheetProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isEditMode: boolean;
  transaction: Transaction | null;
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
};

export function TransactionSheet({ isOpen, setIsOpen, isEditMode, transaction, onSubmit }: TransactionSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Edit Transaction' : 'Add Transaction'}</SheetTitle>
          <SheetDescription>
            {isEditMode ? 'Update the details of your transaction.' : 'Enter the details of your new transaction.'}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <TransactionForm onSubmit={onSubmit} isEditMode={isEditMode} transaction={transaction} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
