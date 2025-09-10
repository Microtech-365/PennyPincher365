'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Category } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

type CategoryFormProps = {
  onSubmit: (data: Omit<Category, 'id'>) => void;
  isEditMode: boolean;
  category: Category | null;
};

export function CategoryForm({ onSubmit, isEditMode, category }: CategoryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode && category ? { name: category.name } : { name: '' },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Groceries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Category'}</Button>
      </form>
    </Form>
  );
}
