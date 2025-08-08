import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ProductListScreen from './ProductListScreen';

const CATEGORIES = [
  { key: 'z_pods', label: 'Z Pods' },
  { key: 'hybrid_pods', label: 'Hybrid Pods' },
  { key: 'stlth', label: 'STLTH' },
];

const PodsScreen = (props) => {
  const [active, setActive] = useState(CATEGORIES[0].key);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat.key} style={[styles.tab, active === cat.key && styles.tabActive]} onPress={() => setActive(cat.key)}>
            <Text style={[styles.tabText, active === cat.key && styles.tabTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>
        <ProductListScreen {...props} category={active} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabText: {
    color: '#888',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#3498db',
  },
  content: { flex: 1 },
});

export default PodsScreen;