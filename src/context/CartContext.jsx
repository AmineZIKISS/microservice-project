import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shopping-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopping-cart', JSON.stringify(cart));
  }, [cart]);

  // ---------------------------------------------------------------------------
  // Get a stable product ID — works with both MongoDB `_id` and plain `id`
  // ---------------------------------------------------------------------------
  const getProductId = (product) => product._id || product.id;

  const addToCart = (product) => {
    const productId = getProductId(product);

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => getProductId(item) === productId);
      
      if (existingItem) {
        return prevCart.map((item) =>
          getProductId(item) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => getProductId(item) !== id));
  };

  const updateQuantity = (id, amount) => {
    setCart((prevCart) => 
      prevCart.map((item) => {
        if (getProductId(item) === id) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, total }}>
      {children}
    </CartContext.Provider>
  );
};