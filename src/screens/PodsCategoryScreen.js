import React from 'react';
import ProductListScreen from './ProductListScreen';

const PodsCategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;
  return <ProductListScreen category={category} navigation={navigation} />;
};

export default PodsCategoryScreen;