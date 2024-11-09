import { Image, View, Text, StyleSheet, Button, Alert} from 'react-native';



export default function HomeScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.red} >
        Hi!
      </Text>
      <Button title="Press Me" onPress={()=>
        Alert.alert(
          "Chris",
          "topher Chen~",
          [
            { text: "Chest", onPress: () => console.log("Chest pressed") },
            { text: "Leg", onPress: () => console.log("Leg pressed") }
          ]
        )
        
      } color="red"/>
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