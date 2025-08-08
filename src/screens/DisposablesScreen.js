import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const DisposablesScreen = ({ navigation }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'disposables'));
      console.log('Snapshot size:', snapshot.size);
      const brandList = snapshot.docs.map(doc => ({ id: doc.id }));
      console.log('Brands:', brandList);
      setBrands(brandList);
    } catch (err) {
      console.error('Error fetching brands: ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
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
    <View style={{ flex: 1 }}>
      <FlatList
        data={brands}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleBrandPress(item.id)}>
            <Text style={styles.brandText}>{item.id}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.footer}>
        <Button title="Go to Checkout" onPress={() => navigation.navigate('Checkout')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  }
});

export default DisposablesScreen;
