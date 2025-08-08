import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Button,
    Platform,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    View,
} from 'react-native';
import { auth, firebaseConfig } from '../../firebase'; // Make sure firebase.js is in the root folder
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useCart } from '../context/CartContext';

// This is a placeholder for the web recaptcha verifier
// It needs to be available in the component's scope.
let appVerifier = null;

const CheckoutScreen = ({ navigation }) => {
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaWrapperRef = useRef(null);
  const nativeRecaptchaRef = useRef(null);
  const { items, removeItem } = useCart();

  // Initialize RecaptchaVerifier for web
  useEffect(() => {
    if (Platform.OS === 'web') {
        appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
        });
    }
  }, []);

  const handleSendCode = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const formattedPhoneNumber = `+1${phoneNumber}`; // Assuming US/Canada numbers.
      if (Platform.OS === 'web') {
        const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
        setConfirmationResult(result);
      } else {
        // Ensure the modal is ready
        if (!nativeRecaptchaRef.current) {
          Alert.alert('Error', 'Recaptcha not ready. Please try again.');
          return;
        }
        const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, nativeRecaptchaRef.current);
        setConfirmationResult(result);
      }
      Alert.alert('Code Sent!', 'A verification code has been sent to your phone.');
    } catch (error) {
      console.error('SMS Error:', error);
      Alert.alert('Error', 'Could not send verification code. Make sure you have set up test numbers in Firebase or that your domain is authorized.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!zipCode.toUpperCase().startsWith('N7T')) {
      Alert.alert('Invalid Zip Code', 'Sorry, we only deliver to zip codes starting with N7T.');
      return;
    }

    if (!confirmationResult || code.length < 6) {
        Alert.alert('Invalid Code', 'Please enter the 6-digit verification code.');
        return;
    }

    try {
        await confirmationResult.confirm(code);
        Alert.alert(
            'Order Placed!',
            'Your order has been successfully placed. We will contact you shortly.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        // TODO: In a real app, write the order to your Firestore 'orders' collection here.
    } catch (error) {
        console.error('Code Confirmation Error:', error);
        Alert.alert('Error', 'The verification code is incorrect. Please try again.');
    }
  };

  const cartTotal = items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Native reCAPTCHA modal for Android/iOS */}
      {Platform.OS !== 'web' && (
        <FirebaseRecaptchaVerifierModal
          ref={nativeRecaptchaRef}
          firebaseConfig={firebaseConfig}
        />
      )}

      {/* This invisible div is required for web recaptcha */}
      <View ref={recaptchaWrapperRef} nativeID="recaptcha-container"></View>

      {/* Cart Summary */}
      <Text style={styles.sectionTitle}>Your Cart</Text>
      {items.length === 0 ? (
        <Text style={{ marginBottom: 8 }}>Cart is empty.</Text>
      ) : (
        <View style={styles.cartList}>
          {items.map(item => (
            <View key={item.id} style={styles.cartRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cartName}>{item.name}</Text>
                <Text style={styles.cartMeta}>Qty: {item.quantity || 1} • ${item.price?.toFixed ? item.price.toFixed(2) : item.price}</Text>
              </View>
              <Button title="Remove" color="#d9534f" onPress={() => removeItem(item.id)} />
            </View>
          ))}
          <View style={styles.cartTotalRow}>
            <Text style={styles.cartTotalLabel}>Total</Text>
            <Text style={styles.cartTotalValue}>${cartTotal.toFixed(2)}</Text>
          </View>
        </View>
      )}

      <Text style={styles.label}>Delivery Zip Code</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., N7T 1A1"
        value={zipCode}
        onChangeText={setZipCode}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Phone Number (10 digits)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 5191234567"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        maxLength={10}
      />
      <Button
        title="Send Verification Code"
        onPress={handleSendCode}
        disabled={!!confirmationResult}
      />

      {confirmationResult && (
        <>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={styles.input}
            placeholder="6-Digit Code"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
          <View style={styles.buttonSpacing} />
           <Button
            title="Verify & Place Order"
            onPress={handlePlaceOrder}
            color="#4CAF50"
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cartList: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    marginBottom: 12,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cartName: {
    fontSize: 16,
    fontWeight: '600',
  },
  cartMeta: {
    color: '#666',
    marginTop: 2,
  },
  cartTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  cartTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonSpacing: {
      height: 20,
  }
});

export default CheckoutScreen;