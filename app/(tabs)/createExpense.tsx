import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Button, View, Text } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import SplitEach from '../(creation)/splitEach';

import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { router } from 'expo-router';

export let data = {store: "", date: "", items: [], subtotal: 0, tax: 0, total: 0}; 

export default function CreateExpense() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
      console.log(image);
    }
  };

  const parseReceipt = async () => {
    console.log('Parsing receipt');
  
    if (!image) {
      console.log('No image selected');
      return;
    }
  
    try {
      // Fetch the image URI as a Blob
      const response = await fetch(image);
      const blob = await response.blob();
  
      // Create a new FormData object and append the Blob with a filename and MIME type
      const formData = new FormData();
      formData.append('image', blob, 'receipt.jpg'); // 'receipt.jpg' is the filename
  
      const uploadResponse = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData, // Send the FormData directly as the body
      });
  
      // Handle the response from the backend
      if (uploadResponse.ok) {
        data = await uploadResponse.json();
        console.log('Response from server:', data);
      } else {
        console.error('Failed to upload image:', uploadResponse.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  
    // Navigate to the next screen
    router.push('/(creation)/splitEach');
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image 
      ? (<>
          <Image source={{ uri: image }} style={styles.image} />
          <Button title="Parse this receipt" onPress={parseReceipt} />
        </>)
      : (
          <Text>No Image Selected</Text>
        )}
      {/* <Text>sd</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
