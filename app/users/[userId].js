import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function UserPage() {
  const { userId } = useLocalSearchParams(); // Extract dynamic route parameter

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No userId provided!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, User {userId}!</Text>
      <Text>Your personalized content goes here.</Text>
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
  error: {
    fontSize: 16,
    color: 'red',
  },
});
