import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const ENTRY_BRANDS = [
  {
    id: 'Elf Bar 6000',
    image: 'https://example.com/mango-ice.jpg',
  },
  {
    id: 'Geek Bar 5000',
    image: 'https://example.com/strawberry-kiwi.jpg',
  },
];

const DisposablesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  // Keep code handy if later we want to validate existence in Firestore
  useEffect(() => {
    const check = async () => {
      try {
        setLoading(true);
        await getDocs(collection(db, 'disposables'));
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  const handleBrandPress = (brandId) => {
    navigation.navigate('BrandProducts', { brandId });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={ENTRY_BRANDS}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleBrandPress(item.id)}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholder]} />
          )}
          <Text style={styles.brandText}>{item.id}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  placeholder: {
    backgroundColor: '#eee',
  },
});

export default DisposablesScreen;
