import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const menuItems = [
  { id: 1, name: 'Spicy Margherita', category: 'Pizza', price: 299, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', rating: 4.8, time: '20 min', badge: 'Best Seller', veg: false },
  { id: 2, name: 'Butter Chicken Bowl', category: 'Indian', price: 349, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', rating: 4.9, time: '25 min', badge: 'Popular', veg: false },
  { id: 3, name: 'Classic Cheeseburger', category: 'Burgers', price: 249, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', rating: 4.7, time: '15 min', badge: null, veg: false },
  { id: 4, name: 'Paneer Tikka Wrap', category: 'Wraps', price: 199, image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&q=80', rating: 4.6, time: '18 min', badge: 'Veg', veg: true },
  { id: 5, name: 'Masala Dosa', category: 'Indian', price: 149, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80', rating: 4.8, time: '20 min', badge: 'Veg', veg: true },
  { id: 6, name: 'BBQ Chicken Wings', category: 'Starters', price: 319, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80', rating: 4.7, time: '25 min', badge: null, veg: false },
  { id: 7, name: 'Veggie Supreme Pizza', category: 'Pizza', price: 279, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', rating: 4.5, time: '22 min', badge: 'Veg', veg: true },
  { id: 8, name: 'Chocolate Lava Cake', category: 'Desserts', price: 179, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80', rating: 4.9, time: '10 min', badge: 'Must Try', veg: true },
  { id: 9, name: 'Chicken Biryani', category: 'Indian', price: 369, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', rating: 4.9, time: '30 min', badge: 'Best Seller', veg: false },
  { id: 10, name: 'Caesar Salad', category: 'Salads', price: 199, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80', rating: 4.4, time: '10 min', badge: null, veg: true },
  { id: 11, name: 'Prawn Fried Rice', category: 'Rice', price: 329, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', rating: 4.6, time: '20 min', badge: null, veg: false },
  { id: 12, name: 'Mango Shake', category: 'Drinks', price: 99, image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80', rating: 4.8, time: '5 min', badge: 'Veg', veg: true },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('foa_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('foa_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('foa_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('foa_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('foa_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (user) localStorage.setItem('foa_user', JSON.stringify(user));
    else localStorage.removeItem('foa_user');
  }, [user]);

  const login = (userData) => setUser(userData);
  const logout = () => { setUser(null); setCart([]); };

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = (details) => {
    const order = {
      id: `ORD${Date.now()}`,
      items: [...cart],
      total: cartTotal,
      date: new Date().toISOString(),
      ...details,
    };
    setOrders(prev => [order, ...prev]);
    clearCart();
    return order;
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      cart, cartCount, cartTotal,
      addToCart, removeFromCart, updateQty, clearCart, placeOrder,
      orders,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
