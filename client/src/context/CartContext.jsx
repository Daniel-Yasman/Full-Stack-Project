import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, getUserId } = useAuth();

  const fetchCart = async () => {
    const uid = getUserId();
    if (!uid) {
      setCartCount(0);
      setCartItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/user/${uid}/cart`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error fetching cart");
      const data = await res.json();

      setCartCount(data.cart.length);
      setCartItems(data.cart);
    } catch {
      setCartCount(0);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (foodId, quantity) => {
    const uid = getUserId();
    if (!uid) return;
    await fetch(`/api/user/${uid}/cart`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ foodId, quantity }),
    });
    await fetchCart();
  };

  const removeCartItem = async (foodId) => {
    const uid = getUserId();
    if (!uid) return;
    await fetch(`/api/user/${uid}/cart/${foodId}`, {
      method: "DELETE",
      credentials: "include",
    });
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        user,
        loading,
        cartCount,
        cartItems,
        fetchCart,
        setCartCount,
        updateCartItem,
        removeCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
