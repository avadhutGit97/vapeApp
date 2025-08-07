// src/screens/BrandProductsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import localData from '../../data.json';

const BrandProductsScreen = ({ route }) => {
  const { brandId } = route.params;
  const [flavours, setFlavours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');

  const loadFromLocalJson = () => {
    try {
      const brandEntry = localData?.disposables?.[brandId];
      if (!brandEntry || !brandEntry.flavours) return false;
      const flavourList = Object.entries(brandEntry.flavours).map(([id, data]) => ({ id, ...data }));
      setFlavours(flavourList);
      setSource('json');
      return true;
    } catch (e) {
      return false;
    }
  };

  const loadFromFirestore = async () => {
    try {
      const snapshot = await getDocs(collection(db, `disposables/${brandId}/flavours`));
      const flavourList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFlavours(flavourList);
      setSource('firestore');
    } catch (err) {
      console.error('Error fetching flavours from Firestore: ', err);
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const ok = loadFromLocalJson();
      if (!ok) {
        await loadFromFirestore();
      }
      setLoading(false);
    };
    run();
  }, [brandId]);

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
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]} />
          )}
          <Text style={styles.name}>{item.name || item.id}</Text>
          {item.puff ? <Text style={styles.puff}>Puffs: {item.puff}</Text> : null}
        </View>
      )}
      ListEmptyComponent={(
        <View style={styles.center}>
          <Text>No flavours found for {brandId} ({source || 'unknown'}).</Text>
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
  imagePlaceholder: {
    backgroundColor: '#eee',
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
