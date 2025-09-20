import { Transaction } from "./transaction";
import { compareAsc } from 'date-fns'

export type Account = {
  id: string;
  name: string;
  onBudget: boolean;
  transactions: Transaction[];
}

export function calculateBalance(transactions: Transaction[]): number {
  const compare = (left: Transaction, right: Transaction) => compareAsc(left.date, right.date);
  return transactions
    .sort(compare)
    .map(resultingBalance)
    .reduce((total, curr) => total + curr, 0)
}

function resultingBalance(transaction: Transaction): number {
  return transaction.deposit - transaction.payment;
}
