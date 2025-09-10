import {
  UtensilsCrossed,
  Plane,
  Receipt,
  ShoppingCart,
  Ticket,
  HeartPulse,
  LucideProps,
  HelpCircle,
} from 'lucide-react';
import { FC } from 'react';

export const categoryIcons: { [key: string]: FC<LucideProps> } = {
  Food: UtensilsCrossed,
  Travel: Plane,
  Bills: Receipt,
  Shopping: ShoppingCart,
  Entertainment: Ticket,
  Health: HeartPulse,
  Default: HelpCircle,
};

type CategoryIconProps = {
  name: string;
} & LucideProps;

export const CategoryIcon: FC<CategoryIconProps> = ({ name, ...props }) => {
  const Icon = categoryIcons[name] || categoryIcons.Default;
  return <Icon {...props} />;
};
