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
import { CartProvider, useCart } from './src/context/CartContext';
import { View, Text } from 'react-native';
import PodsCategoryScreen from './src/screens/PodsCategoryScreen';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DisposablesStack = createNativeStackNavigator();
const PodsStack = createNativeStackNavigator();
const VapeJuiceStack = createNativeStackNavigator();

function CartTabIcon({ color, size }) {
  const { items } = useCart();
  const count = items.reduce((sum, it) => sum + (it.quantity || 1), 0);
  return (
    <View style={{ position: 'relative' }}>
      <Ionicons name="cart" size={size} color={color} />
      {count > 0 && (
        <View style={{
          position: 'absolute',
          right: -6,
          top: -4,
          backgroundColor: 'tomato',
          borderRadius: 8,
          paddingHorizontal: 4,
          minWidth: 16,
          alignItems: 'center'
        }}>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{count}</Text>
        </View>
      )}
    </View>
  );
}

function DisposablesStackScreen() {
  return (
    <DisposablesStack.Navigator>
      <DisposablesStack.Screen
        name="DisposablesHome"
        component={DisposablesScreen}
        options={{ headerShown: false }}
      />
      <DisposablesStack.Screen
        name="BrandProducts"
        component={BrandProductsScreen}
        options={{ title: 'Brand Products' }}
      />
    </DisposablesStack.Navigator>
  );
}

function PodsStackScreen() {
  return (
    <PodsStack.Navigator>
      <PodsStack.Screen
        name="PodsHome"
        component={PodsScreen}
        options={{ headerShown: false }}
      />
      <PodsStack.Screen
        name="PodsCategory"
        component={PodsCategoryScreen}
        options={{ title: 'Pods' }}
      />
    </PodsStack.Navigator>
  );
}

function VapeJuiceStackScreen() {
  return (
    <VapeJuiceStack.Navigator>
      <VapeJuiceStack.Screen
        name="VapeJuiceHome"
        options={{ headerShown: false }}
      >
        {props => <ProductListScreen {...props} category="vape_juice" />}
      </VapeJuiceStack.Screen>
    </VapeJuiceStack.Navigator>
  );
}

function MainAppTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Disposables') iconName = focused ? 'flash' : 'flash-outline';
          else if (route.name === 'Vape Juice') iconName = focused ? 'water' : 'water-outline';
          else if (route.name === 'Pods') iconName = focused ? 'layers' : 'layers-outline';
          else if (route.name === 'Cart') return <CartTabIcon color={color} size={size} />;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {/* Category tabs */}
      <Tab.Screen
        name="Disposables"
        component={DisposablesStackScreen}
        options={{ unmountOnBlur: true }}
        listeners={({ navigation: tabNav }) => ({
          focus: () => tabNav.navigate('Disposables', { screen: 'DisposablesHome' }),
        })}
      />
      <Tab.Screen
        name="Vape Juice"
        component={VapeJuiceStackScreen}
        options={{ unmountOnBlur: true }}
        listeners={({ navigation: tabNav }) => ({
          focus: () => tabNav.navigate('Vape Juice', { screen: 'VapeJuiceHome' }),
        })}
      />
      <Tab.Screen
        name="Pods"
        component={PodsStackScreen}
        options={{ unmountOnBlur: true }}
        listeners={({ navigation: tabNav }) => ({
          focus: () => tabNav.navigate('Pods', { screen: 'PodsHome' }),
        })}
      />
      <Tab.Screen name="Cart" component={() => null} listeners={{
        tabPress: e => {
          e.preventDefault();
          navigation.navigate('Checkout');
        }
      }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootStack.Navigator initialRouteName="AgeVerification">
          <RootStack.Screen
            name="AgeVerification"
            component={AgeVerificationScreen}
            options={{ title: 'Age Verification', headerBackVisible: false }}
          />
          <RootStack.Screen
            name="MainApp"
            component={MainAppTabs}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ title: 'Checkout' }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
