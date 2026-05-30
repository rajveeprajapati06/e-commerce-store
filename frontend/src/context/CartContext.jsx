import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Load cart data from localStorage on mount
  useEffect(() => {
    const cachedCart = localStorage.getItem('cartItems');
    if (cachedCart) {
      setCartItems(JSON.parse(cachedCart));
    }

    const cachedAddress = localStorage.getItem('shippingAddress');
    if (cachedAddress) {
      setShippingAddress(JSON.parse(cachedAddress));
    }
  }, []);

  const addToCart = (product, qty) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);
      
      let newItems;
      if (existItem) {
        newItems = prevItems.map((x) =>
          x.product === product._id ? { ...x, qty: Math.min(product.stock, x.qty + qty) } : x
        );
      } else {
        newItems = [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            stock: product.stock,
            qty,
          },
        ];
      }
      
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((x) => x.product !== id);
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const updateQty = (id, qty) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.map((x) =>
        x.product === id ? { ...x, qty: Number(qty) } : x
      );
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const saveShippingAddress = (addressData) => {
    setShippingAddress(addressData);
    localStorage.setItem('shippingAddress', JSON.stringify(addressData));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Calculations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 200 || itemsPrice === 0 ? 0 : 15; // Free shipping over $200
  const taxPrice = Math.round(itemsPrice * 0.12 * 100) / 100; // 12% GST/tax
  const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        addToCart,
        removeFromCart,
        updateQty,
        saveShippingAddress,
        clearCart,
        itemsCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
