import { useSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function UserPage() {
  const { userId } = useSearchParams(); // Extract dynamic parameter

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, User {userId}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});
