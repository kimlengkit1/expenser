import { Image, StyleSheet, Platform, Text, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useState } from 'react';
import { Divider } from "react-native-elements";

// Define the type for each purchaser's share of an item
type Purchaser = {
  name: string; // e.g., "Alice"
  share: number; // Percentage share of the item, e.g., 50 for 50%
};

// Define the type for a receipt item
type ReceiptItem = {
  description: string; // e.g., "2x Apples $6.00"
  purchasedBy: Purchaser[]; // Array of people splitting this item
};

// Define the type for a transaction
type Transaction = {
  id: string;
  title: string;
  amount: number;
  date: string;
  merchant: string;
  description: string;
  receiptItems?: ReceiptItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
};

// Sample transaction data
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: 85.00,
    date: '2024-11-09',
    merchant: 'Whole Foods',
    description: 'Weekly grocery shopping',
    receiptItems: [
      { description: "2x Apples $6.00", purchasedBy: [{ name: "Alice", share: 50 }, { name: "Bob", share: 50 }] },
      { description: "1x Bread $2.50", purchasedBy: [{ name: "Alice", share: 100 }] },
      { description: "1x Milk $4.00", purchasedBy: [{ name: "Alice", share: 50 }, { name: "Charlie", share: 50 }] },
    ],
    subtotal: 75.00,
    tax: 10.50,
    total: 85.50,
  },
  {
    id: '2',
    title: 'Big Back Activity',
    amount: 128.40,
    date: '2024-11-09',
    merchant: 'McDonalds',
    description: 'big back big back',
    receiptItems: [
      { description: "100x Chicken Nuggets $50.00", purchasedBy: [{ name: "Alice", share: 50 }, { name: "Benson", share: 50 }] },
      { description: "20x McChk Sndwch $60.00", purchasedBy: [{ name: "Alice", share: 50 },{ name: "Benson", share: 50 }] },
      { description: "5x Lg Coke $10.00", purchasedBy: [{ name: "Alice", share: 50 }, { name: "Charlie", share: 50 }] },
    ],
    subtotal: 120.00,
    tax: 8.40,
    total: 128.40,
  },
];

type TransactionPopupProps = {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
};

const TransactionPopup: React.FC<TransactionPopupProps> = ({ visible, transaction, onClose }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!transaction) return null;

  // Calculate total paid by each person
  const calculateTotalsByPerson = () => {
    const totals: { [key: string]: number } = {};

    transaction.receiptItems?.forEach(item => {
      const [_, price] = item.description.split(/(?=\$\d+)/);
      const amount = parseFloat(price.replace('$', '').trim());

      item.purchasedBy.forEach(purchaser => {
        const individualShare = (amount *1.07 * purchaser.share) / 100;
        if (!totals[purchaser.name]) {
          totals[purchaser.name] = 0;
        }
        totals[purchaser.name] += individualShare;
      });
      
    });

    return totals;
  };

  const totalsByPerson = calculateTotalsByPerson();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.popupContainer}>
          <FlatList
            data={[{}]} // Dummy data to wrap entire content as a single item
            keyExtractor={(_, index) => index.toString()}
            renderItem={() => (
              <View>
                {/* Header */}
                <View style={styles.popupHeader}>
                  <Text style={styles.popupTitle}>Transaction Details</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                <Divider style={styles.popupDivider} color="#E0E0E0" />

                {/* Content */}
                <View style={styles.popupContent}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Title</Text>
                    <Text style={styles.detailValue}>{transaction.title}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total</Text>
                    <Text style={[
                      styles.detailValue,
                      { color: transaction.amount >= 0 ? '#4CAF50' : '#FF5252' }
                    ]}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{transaction.date}</Text>
                  </View>


                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Merchant</Text>
                    <Text style={styles.detailValue}>{transaction.merchant}</Text>
                  </View>

                  <View style={styles.descriptionRow}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.descriptionText}>{transaction.description}</Text>
                  </View>

                  {/* Toggle for Receipt Details */}
                  <TouchableOpacity onPress={() => setShowReceipt(!showReceipt)} style={styles.toggleButton}>
                    <Text style={styles.toggleButtonText}>
                      {showReceipt ? 'Hide Receipt Details' : 'Show Receipt Details'}
                    </Text>
                  </TouchableOpacity>

                  {/* Receipt Details */}
                  {showReceipt && transaction.receiptItems && (
                    <View style={styles.receiptContainer}>
                      <Text style={styles.receiptTitle}>Receipt Items</Text>
                      <FlatList
                        data={transaction.receiptItems}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                          const [itemText, price] = item.description.split(/(?=\$\d+)/);
                          return (
                            <View style={styles.receiptItem}>
                              <Text style={styles.itemText}>{itemText.trim()}</Text>
                              <Text style={styles.splitInfo}>
                                {item.purchasedBy.map((purchaser, index) => (
                                  <Text key={index}>
                                    {purchaser.name}
                                    {index < item.purchasedBy.length - 1 ? ', ' : ''}
                                  </Text>
                                ))}
                              </Text>
                              <Text style={styles.itemPrice}>{price.trim()}</Text>
                              
                            </View>
                          );
                        }}
                      />
                      <Divider style={styles.popupDivider} color="#E0E0E0" />
                      <View style={styles.receiptSummary}>
                        <Text style={styles.summaryLabel}>Subtotal:</Text>
                        <Text style={styles.summaryValue}>${transaction.subtotal?.toFixed(2)}</Text>
                      </View>
                      <View style={styles.receiptSummary}>
                        <Text style={styles.summaryLabel}>Tax:</Text>
                        <Text style={styles.summaryValue}>${transaction.tax?.toFixed(2)}</Text>
                      </View>
                      <View style={styles.receiptSummary}>
                        <Text style={styles.summaryLabel}>Total:</Text>
                        <Text style={styles.summaryValue}>${transaction.total?.toFixed(2)}</Text>
                      </View>
                    </View>
                  )}

                  {/* Toggle for Breakdown by Person */}
                  <TouchableOpacity onPress={() => setShowBreakdown(!showBreakdown)} style={styles.toggleButton}>
                    <Text style={styles.toggleButtonText}>
                      {showBreakdown ? 'Hide Payment Breakdown' : 'Show Payment Breakdown'}
                    </Text>
                  </TouchableOpacity>

                  {/* Breakdown by Person */}
                  {showBreakdown && (
                    <View style={styles.breakdownContainer}>
                      {Object.entries(totalsByPerson).map(([person, total]) => (
                        <View key={person} style={styles.breakdownRow}>
                          <Text style={styles.personName}>{person}:</Text>
                          <Text style={styles.personTotal}>${total.toFixed(2)}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}
            ListFooterComponent={() => (
              <View style={styles.popupFooter}>
                <TouchableOpacity style={styles.closeFullButton} onPress={onClose}>
                  <Text style={styles.closeFullButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
    
  );
};
export default function HomeScreen() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => handleTransactionPress(item)}
    >
      <View style={styles.transactionRow}>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
        <Text style={[
          styles.transactionAmount,
          { color: item.amount >= 0 ? '#4CAF50' : '#FF5252' }
        ]}>
          ${Math.abs(item.amount).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/expenserlogo.png')}
          style={styles.Logo}
        />
        <Text style={styles.headerText}>Transactions</Text>
        <Divider
          style={styles.headerDivider}
          color="white"
          width={1}
          orientation="horizontal"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.transactionList}>
          <FlatList
            data={sampleTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <TransactionPopup
          visible={modalVisible}
          transaction={selectedTransaction}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  breakdownContainer: {
    marginTop: 20,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  splitInfo: {
    color: '#BDBDBD',
    fontSize: 13,
    marginTop: 4,
  },
  personName: {
    color: '#BDBDBD',
    fontSize: 15,
  },
  personTotal: {
    color: 'white',
    fontSize: 15,
  },
  itemDescription: {
    color: '#BDBDBD',
    fontSize: 15,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  itemText: {
    color: '#BDBDBD',
    fontSize: 15,
  },
  itemPrice: {
    color: 'white',
    fontSize: 15,
    textAlign: 'right',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
  },
  Logo: {
    width: 75,
    height: 50,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 30 : 30,
    left: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginTop: 20,
  },
  headerDivider: {
    width: '100%',
    marginTop: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryLabel: {
    color: '#BDBDBD',
    fontSize: 15,
  },
  summaryValue: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  welcomeText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  transactionList: {
    flex: 1,
    marginTop: 20,
  },
  transactionItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  transactionDate: {
    color: '#BDBDBD',
    fontSize: 14,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  receiptSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  popupTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#BDBDBD',
    fontSize: 24,
    fontWeight: 'bold',
  },
  popupDivider: {
    marginBottom: 10,
  },
  popupContent: {
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleButton: {
    marginTop: 20,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailLabel: {
    color: '#BDBDBD',
    fontSize: 15,
  },
  detailValue: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  descriptionRow: {
    paddingVertical: 8,
  },
  descriptionText: {
    color: 'white',
    fontSize: 15,
    marginTop: 5,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popupFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeFullButton: {
    backgroundColor: '#b84b4b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeFullButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  itemName: {
    color: '#BDBDBD',
    fontSize: 15,
  },
  receiptContainer: {
    marginTop: 20,
  },
  receiptTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});