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
import { MoreHorizontal } from 'lucide-react';

type RecentTransactionsProps = {
  transactions: Transaction[];
  categories: Category[];
};

export function RecentTransactions({ transactions, categories }: RecentTransactionsProps) {
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          A list of your most recent expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, 5).map((transaction) => {
              const category = categoryMap.get(transaction.categoryId);
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium hidden sm:table-cell">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-2 max-w-min">
                      {category && <CategoryIcon name={category.name} className="h-4 w-4" />}
                      <span>{category?.name || 'Uncategorized'}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
