export interface MyFatoorahPaymentResponse {
  Data: {
    PaymentURL: string;
    InvoiceId: string;
  };
}

export interface MyFatoorahPaymentStatusResponse {
  Data: {
    InvoiceStatus: string;
    InvoiceTransactions?: {
      TransactionId: string;
    }[];
  };
}