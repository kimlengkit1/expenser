import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ScanReceipt() {
  return (
    <View>
      <CustomAddButton onPress={() => console.log('Button Pressed')} />
    </View>
  );
}

export function CustomAddButton({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.backgroundContainer}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Ionicons name="add-circle-outline" size={40} color="#34c759" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
     // Adjust position above the tab bar    
    top: Platform.OS == 'web' ? 15:0,        // Center the button horizontally
    backgroundColor: '#1a1a1a',              // Matches tab bar color
    height: 40,                              // Circular background size
    width: 40,
    borderRadius: 40,                        // Half of height/width for a circular shape
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomAddButton;
