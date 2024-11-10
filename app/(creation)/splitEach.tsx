import { Image, StyleSheet, Platform, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// import mockData from "../../constants/sample-data.json";
import { data as mockData } from "../(tabs)/createExpense";

export default function SplitEach() {
// export default function SplitEach({ data }: { data: string }) {
    console.log(mockData);
    return (<>
        <Text>{mockData.store}</Text>
        <Text>{mockData.date}</Text>
        <Text>{JSON.stringify(mockData.items)}</Text>
        <Text>{mockData.subtotal}</Text>
        <Text>{mockData.tax}</Text>
        <Text>{mockData.total}</Text>
    </>);
}