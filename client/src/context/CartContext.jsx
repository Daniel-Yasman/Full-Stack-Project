import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  fetchCart as fetchCartApi,
  updateCartItem as updateCartItemApi,
  removeCartItem as removeCartItemApi,
} from "../../lib/cart";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, getUserId } = useAuth();

  const mapCart = (data) =>
    data.cart.map(({ foodId: f, quantity }) => ({
      id: f._id || f,
      name: f.name,
      price: f.price,
      image: f.image,
      quantity,
    }));

  const noUid = (uid) => {
    if (!uid) {
      resetCartState();
      setLoading(false);
      return true;
    }
    return false;
  };

  const fetchCart = async () => {
    const resetCartState = () => {
      setCartCount(0);
      setCartItems([]);
    };

    const uid = getUserId();
    if (noUid(uid)) return;

    setLoading(true);
    try {
      const data = await fetchCartApi(uid, () => resetCartState());
      setCartCount(data.cart.length);
      setCartItems(mapCart(data));
    } catch {
      resetCartState();
    } finally {
      setLoading(false);
    }
  };

  const getCheckoutPayload = () => {
    return cartItems.map((item) => ({
      foodId: item.id,
      quantity: item.quantity,
    }));
  };

  const updateCartItem = async (foodId, quantity) => {
    const uid = getUserId();
    if (!uid) return;
    await updateCartItemApi(uid, foodId, quantity);
    await fetchCart();
  };

  const removeCartItem = async (foodId) => {
    const uid = getUserId();
    if (!uid) return;
    await removeCartItemApi(uid, foodId);
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
        getCheckoutPayload,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
