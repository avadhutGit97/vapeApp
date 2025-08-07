import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Screens
import AgeVerificationScreen from './src/screens/AgeVerificationScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import DisposablesScreen from './src/screens/DisposablesScreen';
import VapeJuiceScreen from './src/screens/VapeJuiceScreen';
import PodsScreen from './src/screens/PodsScreen';
import BrandProductsScreen from './src/screens/BrandProductsScreen'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Disposables') iconName = focused ? 'flash' : 'flash-outline';
          else if (route.name === 'Vape Juice') iconName = focused ? 'water' : 'water-outline';
          else if (route.name === 'Pods') iconName = focused ? 'layers' : 'layers-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {/* <Tab.Screen name="Disposables">
        {props => <ProductListScreen {...props} category="disposables" />}
      </Tab.Screen>
      <Tab.Screen name="Vape Juice">
        {props => <ProductListScreen {...props} category="vape_juice" />}
      </Tab.Screen>
      <Tab.Screen name="Pods">
        {props => <ProductListScreen {...props} category="pods" />}
      </Tab.Screen> */}

      <Tab.Screen name="Disposables" component={DisposablesScreen} />
      {/* <Tab.Screen name="Vape Juice" component={VapeJuiceScreen} />
      <Tab.Screen name="Pods" component={PodsScreen} /> */}

      
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="AgeVerification">
        <Stack.Screen
          name="AgeVerification"
          component={AgeVerificationScreen}
          options={{ title: 'Age Verification', headerBackVisible: false }}
        />
        <Stack.Screen
          name="MainApp"
          component={MainAppTabs}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="BrandProductsScreen"
          component={BrandProductsScreen}
          options={{ title: 'BrandProducts', headerBackVisible: false }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: 'Checkout' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
