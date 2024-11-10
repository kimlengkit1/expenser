import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Button, View, Text } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import mockData from "../../constants/sample-data.json";

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
    console.log('parsing receipt');
    console.log(`uri: ${image}`);

    // const mockData = await fetch('../../constants/sample-data.json')
    // .then((response) => response.json())
    // .catch((error) => console.error(error));
    // .then((json) => console.log(json));

    console.log("mock data: " + mockData.store);

  };
    // fetch('http://localhost:5000/parseReceipt', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     image: image,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((json) => {
    //     console.log(json);
    //   })



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
