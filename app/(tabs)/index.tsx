import { Image, View, Text, StyleSheet, Button, Alert} from 'react-native';
import {useState} from 'react';
import { useRouter } from 'expo-router';




export default function HomeScreen() {
  const [isLogIn, setLogIn] = useState(true);
  const router = useRouter();
  return (
    <View style={styles.center}>
      {isLogIn ? 
      (<>
      <Text style={styles.red} >
        Hi!
      </Text>
      <Button title="Press Me" color="red" onPress={() => {
        router.push('/lol2')}} />
      </>) : 
      (<>
      <Text>Not logged in..</Text>
      </>)
      }
    </View>
  );
}

const styles = StyleSheet.create({
  red: {
    color: "red",
    fontSize: 32
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  }
});