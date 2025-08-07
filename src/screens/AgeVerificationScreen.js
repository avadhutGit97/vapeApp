import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AgeVerificationScreen = ({ navigation }) => {
  const handleVerification = () => {
    // Navigate to main app after verification
    navigation.replace('MainApp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you 19 years or older?</Text>
      <View style={styles.buttonContainer}>
        <Button title="Yes, I am 19+" onPress={handleVerification} />
      </View>
    </View>
  );
};

export default AgeVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
