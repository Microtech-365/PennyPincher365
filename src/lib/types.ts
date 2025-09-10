export type Transaction = {
  id: string;
  date: string;
  amount: number;
  description: string;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Budget = {
  categoryId: string;
  amount: number;
};

export type User = {
  name: string;
  email: string;
  password?: string;
};
