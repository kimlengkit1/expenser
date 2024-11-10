// Define the type for each purchaser's share of an item
export type Purchaser = {
  name: string; // e.g., "Alice"
  share: number; // Percentage share of the item, e.g., 50 for 50%
};

// Define the type for a receipt item
export type ReceiptItem = {
  description: string; // e.g., "2x Apples $6.00"
  purchasedBy: Purchaser[]; // Array of people splitting this item
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
export const sampleTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: 85.00,
    date: '2024-11-09',
    category: 'Food',
    merchant: 'Whole Foods',
    paymentMethod: 'Credit Card',
    description: 'Weekly grocery shopping',
    receiptItems: [
      { description: "2x Apples $6.00", purchasedBy: [{ name: "Alice", share: 50 }, { name: "Bob", share: 50 }] },
      { description: "1x Bread $2.50", purchasedBy: [{ name: "Alice", share: 100 }] },
      { description: "1x Milk $4.00", purchasedBy: [{ name: "Alice", share: 50 }, { name: "Charlie", share: 50 }] },
      { description: "1x Milkkkkkkkkkkkkkkkkkkkk $4.00", purchasedBy: [{ name: "Alice", share: 50 }, { name: "Charlie", share: 50 }] },
    ],
    subtotal: 75.00,
    tax: 10.50,
    total: 85.50,
  },
];

export type TransactionPopupProps = {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
};
