// src/screens/BrandProductsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';


const BrandProductsScreen = ({ route }) => {
  const { brandId } = route.params;
  const [flavours, setFlavours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlavours = async () => {
    try {
      const snapshot = await getDocs(collection(db, `disposables/${brandId}/flavours`));
      const flavourList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFlavours(flavourList);
    } catch (err) {
      console.error('Error fetching flavours: ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlavours();
  }, []);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>
  );

  return (
    <FlatList
      data={flavours}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.puff}>Puffs: {item.puff}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  puff: {
    fontSize: 14,
    color: '#555',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BrandProductsScreen;
