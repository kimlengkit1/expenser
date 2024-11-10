import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ScanReceipt } from './ScanReceipt';
import { Placeholder } from './placeholder';
import { CustomAddButton } from './ScanReceipt';

// Import screens
import HomeScreen from './index';

const Tab = createBottomTabNavigator();


export default function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Placeholder') {
            iconName = 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'rgb(76, 175, 80)',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          paddingTop: Platform.OS === 'ios' ? 10 : 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          paddingTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Add"
        component={ScanReceipt}
        options={{
          tabBarIcon: () => null, // Hide default icon
          tabBarButton: (props) => (
            <CustomAddButton {...props} onPress={() => console.log('Add Button Pressed')} />
          ),
        }}
      />
      <Tab.Screen
        name="Placeholder"
        component={Placeholder}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
