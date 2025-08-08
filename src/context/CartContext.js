import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = 'app.cart.v1';

const CartContext = createContext({
  items: [],
  addItem: (_product, _quantity = 1) => {},
  removeItem: (_productId) => {},
  clear: () => {},
});

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {}
    };
    save();
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const index = prev.findIndex(p => p.id === product.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], quantity: (next[index].quantity || 1) + quantity };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name || product.title || 'Item',
          price: typeof product.price === 'number' ? product.price : 0,
          imageUrl: product.imageUrl || product.image || null,
          category: product.category || 'unknown',
          quantity: quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(p => p.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({ items, addItem, removeItem, clear }), [items, addItem, removeItem, clear]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);