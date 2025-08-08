import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { db } from '../../firebase'; // Make sure firebase.js is in the root folder
import ProductCard from '../componets/ProductCard';
import localData from '../../data.json';

const ProductListScreen = ({ category, navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');

  const loadFromLocalJson = () => {
    try {
      const all = localData?.products || {};
      const list = Object.entries(all)
        .map(([id, data]) => ({ id, ...data }))
        .filter(p => p.category === category);
      if (list.length > 0) {
        setProducts(list);
        setSource('json');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "products"), where("category", "==", category));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (productsData.length > 0) {
          setProducts(productsData);
          setSource('firestore');
        } else {
          const ok = loadFromLocalJson();
          if (!ok) setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products: ", error);
        const ok = loadFromLocalJson();
        if (!ok) {
          alert('Failed to load products. Check your Firebase connection.');
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{category.replace('_', ' ').toUpperCase()} {source ? `(${source})` : ''}</Text>
        <Button title="Go to Checkout" onPress={() => navigation.navigate('Checkout')} />
      </View>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={(<Text style={{ padding: 16 }}>No products found.</Text>)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
});

export default ProductListScreen;