import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAgeVerification = async () => {
      try {
        const isVerified = await AsyncStorage.getItem('isAgeVerified');
        // If age is verified, go straight to the main app (the tabs)
        if (isVerified === 'true') {
          navigation.replace('MainApp');
        } else {
          // Otherwise, show the age verification screen
          navigation.replace('AgeVerification');
        }
      } catch (e) {
        // if there's an error, default to showing the verification screen
        navigation.replace('AgeVerification');
      }
    };

    checkAgeVerification();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;