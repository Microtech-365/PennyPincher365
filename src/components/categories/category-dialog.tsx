'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CategoryForm } from './category-form';
import type { Category } from '@/lib/types';

type CategoryDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isEditMode: boolean;
  category: Category | null;
  onSubmit: (data: Omit<Category, 'id'>) => void;
};

export function CategoryDialog({ isOpen, setIsOpen, isEditMode, category, onSubmit }: CategoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of your category.' : 'Enter the name for your new category.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <CategoryForm onSubmit={onSubmit} isEditMode={isEditMode} category={category} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
