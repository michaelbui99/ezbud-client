export type Transaction = {
  date: Date;
  payee: string;
  notes?: string;
  category: string;
  payment: number;
  deposit: number;
  cleared: boolean;
}
