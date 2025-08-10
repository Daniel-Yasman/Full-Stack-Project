import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const [userId, setUserId] = useState(null);
async function getUserId() {
  if (userId) return userId;
  const meRes = await fetch("/api/me", { credentials: "include" });
  if (!meRes.ok) return null;
  const me = await meRes.json();
  setUserId(me._id);
  return me._id;
}

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const uid = await getUserId();
    if (!uid) return;
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
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (foodId, quantity) => {
    const uid = await getUserId();
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
    const uid = await getUserId();
    if (!uid) return;
    await fetch(`/api/user/${uid}/cart/${foodId}`, {
      method: "DELETE",
      credentials: "include",
    });
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  return (
    <CartContext.Provider
      value={{
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
