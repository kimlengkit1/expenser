import { Image, StyleSheet, Platform ,Text, View, Button, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.welcomeText}>Welcome to Expenser</Text>
      <Image
          source={require('@/assets/images/expenserlogo.png')}
          style={styles.reactLogo}
        />
      <Button title="Scan" onPress={() => console.log("Scan button pressed")} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    width: 290,
    height: 178,
    alignSelf: 'center',
    marginTop: 20, // Adjust the spacing from the top if needed
    position: 'absolute',
    top: 0, // Positions the logo at the top
  },
  welcomeText: {
    color: 'white', // Set text color to white
    fontSize: 18, // Adjust font size as needed
    marginTop: 20,
  },
});
