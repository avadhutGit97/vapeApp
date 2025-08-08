import { Image, StyleSheet, Text, View, Button } from 'react-native';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  return (
    <View style={styles.card}>
      {/* The Image component requires a valid URI, or it can cause errors. */}
      {/* We check if imageUrl exists before trying to display it. */}
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price ? product.price.toFixed(2) : '0.00'}</Text>
        <Button title="Add to Cart" onPress={() => addItem(product, 1)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    // For Android shadow
    elevation: 3,
    // For Web/iOS shadow (replaces all the old shadow* props)
    boxShadow: '0px 1px 1.41px rgba(0, 0, 0, 0.2)',
  },
  image: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    backgroundColor: '#e0e0e0', // A light gray background for items without an image
  },
  infoContainer: {
    padding: 15,
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
});

export default ProductCard;