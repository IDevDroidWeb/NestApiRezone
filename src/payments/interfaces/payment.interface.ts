import { Document } from 'mongoose';

export interface IPayment extends Document {
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  description: string;
  status: string;
  transactionId?: string;
  paymentUrl?: string;
  referenceId?: string;
}