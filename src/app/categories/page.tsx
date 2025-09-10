'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Category } from '@/lib/types';
import { CategoryIcon } from '@/components/category-icon';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import React from "react";
import { useUser } from "@/context/user-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryDialog } from '@/components/categories/category-dialog';
import { DeleteCategoryDialog } from '@/components/categories/delete-category-dialog';

export default function CategoriesPage() {
    const { categories, addCategory, updateCategory, deleteCategory } = useUser();
    
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
    const [isEditMode, setIsEditMode] = React.useState(false);

    const handleAdd = () => {
        setSelectedCategory(null);
        setIsEditMode(false);
        setIsDialogOpen(true);
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditMode(true);
        setIsDialogOpen(true);
    };

    const handleDelete = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedCategory) return;
        deleteCategory(selectedCategory.id);
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
    };

    const handleFormSubmit = (data: Omit<Category, 'id'>) => {
      if (isEditMode && selectedCategory) {
        updateCategory({ ...selectedCategory, ...data });
      } else {
        addCategory(data);
      }
      setIsDialogOpen(false);
      setSelectedCategory(null);
    };

    return (
        <main className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">Manage your spending categories.</p>
                </div>
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>A complete list of your spending categories.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <CategoryIcon name={category.name} className="h-5 w-5" />
                                        <span>{category.name}</span>
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
                                            <DropdownMenuItem onClick={() => handleEdit(category)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(category)} className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <CategoryDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                isEditMode={isEditMode}
                category={selectedCategory}
                onSubmit={handleFormSubmit}
            />
            <DeleteCategoryDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
            />
        </main>
    );
}
