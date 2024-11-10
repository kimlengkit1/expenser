import { Image, StyleSheet, Platform, Text, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Divider } from "react-native-elements";
import React from 'react';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { router } from 'expo-router';

import SecureDBGateway, { IUserInfo } from '../../lib/localDB';
import { collection, query, where, getDocs, getFirestore, doc, setDoc } from "firebase/firestore";
import { getDatabase, set } from "firebase/database";
import { initializeApp } from '@firebase/app';

const firebaseConfigKK = {
  apiKey: "AIzaSyBHZFFgouc4GDxhqoantd-jI5OvkMTYPTs",
  authDomain: "expenser-3f0b3.firebaseapp.com",
  projectId: "expenser-3f0b3",
  storageBucket: "expenser-3f0b3.firebasestorage.app",
  messagingSenderId: "1072306644873",
  appId: "1:1072306644873:web:1d0a827f71c5064b3e2358",
  measurementId: "G-YH3EFM8SQ0"
};

const firebaseConfig = {
    apiKey: "AIzaSyBZ0VXbZTBDxFHkphCz4MtB9GFZxi6BVxE",
    authDomain: "expenser-c3ab3.firebaseapp.com",
    projectId: "expenser-c3ab3",
    storageBucket: "expenser-c3ab3.firebasestorage.app",
    messagingSenderId: "565072002035",
    appId: "1:565072002035:web:6e97f69df58273740df086",
    measurementId: "G-MTLJ4GRYLE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Define the type for each purchaser's share of an item
type Purchaser = {
  name: string;
  share: number;
};

// Define the type for a receipt item
type ReceiptItem = {
  description: string;
  purchasedBy: Purchaser[];
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

const newMockData = [
  {
    "title": "Grocery Shopping",
    "amount": 85.00,
    "date": "2024-11-09",
    "merchant": "Whole Foods",
    "description": "Weekly grocery shopping",
    "receiptItems": [
      { "description": "2x Apples $6.00", "purchasedBy": [{ "name": "Alice", "share": 50 }, { "name": "Bob", "share": 50 }] },
      { "description": "1x Bread $2.50", "purchasedBy": [{ "name": "Alice", "share": 100 }] },
      { "description": "1x Milk $4.00", "purchasedBy": [{ "name": "Alice", "share": 50 }, { "name": "Charlie", "share": 50 }] }
    ],
    "subtotal": 75.00,
    "tax": 10.50,
    "total": 85.50
  },
  {
    "title": "Big Back Activity",
    "amount": 128.40,
    "date": "2024-11-09",
    "merchant": "McDonalds",
    "description": "big back big back",
    "receiptItems": [
      { "description": "100x Chicken Nuggets $50.00", "purchasedBy": [{ "name": "Alice", "share": 50 }, { "name": "Benson", "share": 50 }] },
      { "description": "20x McChk Sndwch $60.00", "purchasedBy": [{ "name": "Alice", "share": 50 }, { "name": "Benson", "share": 50 }] },
      { "description": "5x Lg Coke $10.00", "purchasedBy": [{ "name": "Alice", "share": 50 }, { "name": "Charlie", "share": 50 }] }
    ],
    "subtotal": 120.00,
    "tax": 8.40,
    "total": 128.40
  },
  {
    "title": "Weekend Brunch",
    "amount": 46.75,
    "date": "2024-11-10",
    "merchant": "Starbucks",
    "description": "Morning brunch with friends",
    "receiptItems": [
      { "description": "4x Caramel Macchiato $20.00", "purchasedBy": [{ "name": "Alice", "share": 25 }, { "name": "Bob", "share": 25 }] },
      { "description": "2x Bacon & Gouda Sndwch $12.50", "purchasedBy": [{ "name": "Charlie", "share": 50 }, { "name": "David", "share": 50 }] },
      { "description": "2x Croissant $4.50", "purchasedBy": [{ "name": "Alice", "share": 50 }, { "name": "Bob", "share": 50 }] },
      { "description": "1x Iced Tea $3.75", "purchasedBy": [{ "name": "David", "share": 100 }] }
    ],
    "subtotal": 40.75,
    "tax": 6.00,
    "total": 46.75
  },
  {
    "title": "Dinner Party Supplies",
    "amount": 65.00,
    "date": "2024-11-08",
    "merchant": "Costco",
    "description": "Food and drinks for dinner party",
    "receiptItems": [
      { "description": "3x Wine Bottles $30.00", "purchasedBy": [{ "name": "Alice", "share": 100 }] },
      { "description": "1x Salmon Fillets $18.00", "purchasedBy": [{ "name": "Bob", "share": 50 }, { "name": "Charlie", "share": 50 }] },
      { "description": "2x Cheese Platters $12.00", "purchasedBy": [{ "name": "David", "share": 100 }] },
      { "description": "1x Salad Mix $5.00", "purchasedBy": [{ "name": "Charlie", "share": 50 }, { "name": "Alice", "share": 50 }] }
    ],
    "subtotal": 60.00,
    "tax": 5.00,
    "total": 65.00
  },
  {
    "title": "Late Night Snack",
    "amount": 19.50,
    "date": "2024-11-07",
    "merchant": "7-Eleven",
    "description": "Quick late night snack run",
    "receiptItems": [
      { "description": "2x Pizza Rolls $6.00", "purchasedBy": [{ "name": "Charlie", "share": 50 }, { "name": "Benson", "share": 50 }] },
      { "description": "1x Slurpee $2.50", "purchasedBy": [{ "name": "Alice", "share": 100 }] },
      { "description": "1x Bag of Chips $3.00", "purchasedBy": [{ "name": "Bob", "share": 50 }, { "name": "Benson", "share": 50 }] },
      { "description": "1x Chocolate Bar $2.00", "purchasedBy": [{ "name": "David", "share": 100 }] },
      { "description": "2x Bottled Water $6.00", "purchasedBy": [{ "name": "Alice", "share": 50 }, { "name": "Bob", "share": 50 }] }
    ],
    "subtotal": 19.50,
    "tax": 0.00,
    "total": 19.50
  },
  {
    "title": "Holiday Baking",
    "amount": 54.30,
    "date": "2024-11-06",
    "merchant": "Target",
    "description": "Ingredients for holiday baking",
    "receiptItems": [
      { "description": "2x Sugar $5.00", "purchasedBy": [{ "name": "Alice", "share": 50 }, { "name": "Charlie", "share": 50 }] },
      { "description": "3x Flour $9.00", "purchasedBy": [{ "name": "Bob", "share": 50 }, { "name": "David", "share": 50 }] },
      { "description": "1x Butter $4.50", "purchasedBy": [{ "name": "Alice", "share": 100 }] },
      { "description": "1x Baking Powder $2.00", "purchasedBy": [{ "name": "David", "share": 100 }] },
      { "description": "2x Vanilla Extract $7.00", "purchasedBy": [{ "name": "Bob", "share": 50 }, { "name": "Charlie", "share": 50 }] },
      { "description": "1x Eggs $7.80", "purchasedBy": [{ "name": "Charlie", "share": 50 }, { "name": "David", "share": 50 }] },
      { "description": "1x Chocolate Chips $7.00", "purchasedBy": [{ "name": "Alice", "share": 50 }, { "name": "Bob", "share": 50 }] }
    ],
    "subtotal": 43.30,
    "tax": 11.00,
    "total": 54.30
  }
];


// Sample transaction data.
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

  const handleClose = () => {
    setShowReceipt(false);
    setShowBreakdown(false);
    onClose();
  };

  if (!transaction) return null;

  // Calculate total paid by each person
  const calculateTotalsByPerson = () => {
    const totals: { [key: string]: number } = {};
    transaction.receiptItems?.forEach(item => {
      const [_, price] = item.description.split(/(?=\$\d+)/);
      const amount = parseFloat(price.replace('$', '').trim());
      item.purchasedBy.forEach(purchaser => {
        const individualShare = (amount * 1.07 * purchaser.share) / 100;
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
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={handleClose}>
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
                  <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
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
                              {/* Item description and price on the same row */}
                              <View style={styles.itemRow}>
                                <Text style={styles.itemText}>{itemText.trim()}</Text>
                                <Text style={styles.itemPrice}>{price.trim()}</Text>
                              </View>

                              {/* Purchasers listed below the item */}
                              <Text style={styles.purchasersText}>
                                {item.purchasedBy.map((purchaser, index) => (
                                  <Text key={index}>
                                    {purchaser.name}
                                    {index < item.purchasedBy.length - 1 ? ', ' : ''}
                                  </Text>
                                ))}
                              </Text>
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
                <TouchableOpacity style={styles.closeFullButton} onPress={handleClose}>
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);

  
  
  // const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      // This function will be called when the screen comes into focus
      const loadUserInfo = async () => {
        console.log("Loading User Info");
        const userInf = await SecureDBGateway.load();
        if (userInf && userInf !== null) {
          // setUserInfo(userInf);
          console.log("User Info in index: ", userInf);
          // const db = getFirestore();
          const q = query(collection(db, "transactions"), where("uid", "==", userInf.id));
          console.log(q);
          const querySnapshot = await getDocs(q);
          console.log(querySnapshot);
          querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
          });
          setTransactions(querySnapshot.docs.map(doc => doc.data()) as Transaction[]);
        }
        console.log("User Info: ", userInf);
        // console.log("Saved User Info: ", userInfo);
      }
      loadUserInfo();

      const uploadMockData = async () => {
        const userInf = await SecureDBGateway.load();
        if (userInf && userInf !== null) {
          console.log("trying to upload mock data");
          // const db = getFirestore();

          const newDocs = newMockData.map((_) => doc(collection(db, "transactions")));

          for (let i = 0; i < newDocs.length; i++) {
            await setDoc(newDocs[i], { ...newMockData[i], uid: userInf.id });
          }

          console.log("NOTE: Mock data has been uploaded to the database.");
          // set(ref(db, 'transactions/' + userInf.id), newMockData);
        }
      }
      // uploadMockData();

      // Cleanup function (optional)
      return () => {
        // This will be called when the screen goes out of focus
        console.log('Screen is unfocused');
        setTransactions(sampleTransactions);
      };
    }, [])
  );



  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.transactionItem} onPress={() => handleTransactionPress(item)}>
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
      {isAuthenticated ? (
        <>
          <View style={styles.header}>
            <Image source={require('@/assets/images/expenserlogo.png')} style={styles.Logo} />
            <Text style={styles.headerText}>Transactions</Text>
            <Divider style={styles.headerDivider} color="white" width={1} orientation="horizontal" />
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
        </>
      ) : (
        <View style={styles.loginPrompt}>
          <View style={styles.logoContainer}>
            <Image source={require('@/assets/images/expenserlogo.png')} style={styles.loginLogo} />
          </View>
          {/* Optional: Add a button to navigate to login screen */}
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('../login')}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 30, // Add some space between the logo and the prompt
    width: '100%',
    position: 'absolute',
    top: 60, // Adjust this value to control how far from the top the logo appears
  },
  loginLogo: {
    width: 250,
    height: 200,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#6dba65',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  receiptItem: {
    marginBottom: 10,
  },
  itemRow: {
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
  purchasersText: {
    color: '#BDBDBD',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 5,
  },
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