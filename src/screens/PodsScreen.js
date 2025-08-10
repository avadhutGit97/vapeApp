import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, FlatList } from 'react-native';

const ENTRIES = [
  { key: 'z_pods', label: 'Z Pods', image: 'https://example.com/z-pods.jpg' },
  { key: 'hybrid_pods', label: 'Hybrid Pods', image: 'https://example.com/hybrid-pods.jpg' },
  { key: 'stlth', label: 'STLTH', image: 'https://example.com/stlth.jpg' },
];

const PodsScreen = ({ navigation }) => {
  const handlePress = (category) => {
    navigation.navigate('PodsCategory', { category });
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={ENTRIES}
      keyExtractor={(item) => item.key}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handlePress(item.key)}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : (
            <View style={[styles.image, { backgroundColor: '#eee' }]} />
          )}
          <Text style={styles.title}>{item.label}</Text>
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
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default PodsScreen;