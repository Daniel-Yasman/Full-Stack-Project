import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  const fetchCart = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/user/${userId}/cart`);
      if (!res.ok) throw new Error("Error fetching cart");
      const data = await res.json();
      setCartCount(data.cart.length);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  return (
    <CartContext.Provider value={{ cartCount, fetchCart, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
