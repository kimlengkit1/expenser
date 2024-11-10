import { Image, Text, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useState } from 'react';
import { Divider } from 'react-native-elements';
import { styles } from '../../constants/Styles';
import { TransactionPopupProps, Transaction, sampleTransactions } from '../../constants/Types';

const TransactionPopup: React.FC<TransactionPopupProps> = ({ visible, transaction, onClose }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Ensure both toggles are reset on close
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose} // Reset toggles on modal close
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
