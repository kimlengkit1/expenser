import { StyleSheet, Platform } from 'react-native';
export const styles = StyleSheet.create({
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
      backgroundColor: '#333',
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