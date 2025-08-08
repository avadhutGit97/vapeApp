// src/screens/BrandProductsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import localData from '../../data.json';
import { useCart } from '../context/CartContext';

const BrandProductsScreen = ({ route, navigation }) => {
  const { brandId } = route.params;
  const [flavours, setFlavours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');
  const { addItem } = useCart();

  const normalize = (str = '') => str.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  const loadFromLocalJson = () => {
    try {
      const disposables = localData?.disposables || {};
      const keys = Object.keys(disposables);
      if (keys.length === 0) return false;

      const idNorm = normalize(brandId);

      // Try exact normalized match first
      let matchedKey = keys.find(k => normalize(k) === idNorm);

      // Then try prefix/contains match
      if (!matchedKey) {
        matchedKey = keys.find(k => {
          const kn = normalize(k);
          return kn.startsWith(idNorm) || idNorm.startsWith(kn) || kn.includes(idNorm) || idNorm.includes(kn);
        });
      }

      if (!matchedKey) return false;

      const brandEntry = disposables[matchedKey];
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

  const handleAddToCart = (flavour) => {
    const product = {
      id: `${brandId}:${flavour.id}`,
      name: `${brandId} - ${flavour.name || flavour.id}`,
      price: 0,
      imageUrl: flavour.image || null,
      category: 'disposables',
    };
    addItem(product, 1);
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
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
            <View style={{ marginTop: 8, alignSelf: 'stretch' }}>
              <Button title="Add to Cart" onPress={() => handleAddToCart(item)} />
            </View>
          </View>
        )}
        ListEmptyComponent={(
          <View style={styles.center}>
            <Text>No flavours found for {brandId} ({source || 'unknown'}).</Text>
          </View>
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
    padding: 10,
    paddingBottom: 80,
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

export default BrandProductsScreen;
