export type ReceiptItem = {
    description: string; // e.g., "2x Apples $6.00"
  };
  
  // Define the type for a transaction
export type Transaction = {
    id: string;
    title: string;
    amount: number;
    date: string;
    category: string;
    merchant: string;
    paymentMethod: string;
    description: string;
    receiptItems?: ReceiptItem[];
    subtotal?: number;
    tax?: number;
    total?: number;
  };
  
  // Sample transaction data

export type TransactionPopupProps = {
    visible: boolean;
    transaction: Transaction | null;
    onClose: () => void;
  };