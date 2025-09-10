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

type RecentTransactionsProps = {
  transactions: Transaction[];
  categories: Category[];
  showViewAll?: boolean;
};

export function RecentTransactions({ transactions, categories, showViewAll = false }: RecentTransactionsProps) {
  const categoryMap = new Map(categories.map(c => [c.id, c]));

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
            {transactions.map((transaction) => {
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
                  <TableCell className="hidden md:table-cell">{new Date(transaction.date).toLocaleDateString()}</TableCell>
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
  );
}
