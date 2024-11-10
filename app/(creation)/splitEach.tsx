import { Image, StyleSheet, Platform, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import mockData from "../../constants/sample-data.json";


export default function SplitEach() {
// export default function SplitEach({ data }: { data: string }) {
    console.log(mockData);
    return (<>
        <Text>{mockData.store}</Text>
        <Text>{mockData.date}</Text>
        <Text>{mockData.total}</Text>
        <Text>{JSON.stringify(mockData.items)}</Text>
        <Text>{JSON.stringify(mockData)}</Text>
    </>);
}