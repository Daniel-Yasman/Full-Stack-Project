import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  fetchCartApi,
  updateCartItemApi,
  removeCartItemApi,
} from "../lib/cart";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const mapCart = (data) =>
    data.cart.map(({ foodId: f, quantity }) => ({
      id: f._id || f,
      name: f.name,
      price: f.price,
      image: f.image,
      quantity,
    }));

  const fetchCart = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const data = await fetchCartApi();
      setCartCount(data.cart.length);
      setCartItems(mapCart(data));
      setCartTotal(data.total);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const getCheckoutPayload = () => {
    return cartItems.map((item) => ({
      foodId: item.id,
      quantity: item.quantity,
    }));
  };

  const updateCartItem = async (foodId, quantity) => {
    await updateCartItemApi(foodId, quantity);
    await fetchCart({ silent: true });
  };

  const removeCartItem = async (foodId) => {
    await removeCartItemApi(foodId);
    await fetchCart({ silent: true });
  };
  const clearCart = async () => {
    setCartCount(0);
    setCartTotal(0);
    setCartItems([]);
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
        cartTotal,
        cartItems,
        fetchCart,
        setCartCount,
        updateCartItem,
        removeCartItem,
        getCheckoutPayload,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
