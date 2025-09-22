import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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

  // prevent overlapping fetches
  const loadingRef = useRef(false);

  const mapCart = useCallback((data) => {
    const raw = Array.isArray(data?.cart) ? data.cart : [];
    const cleaned = raw.filter((it) => it && it.foodId); // drop null/removed foods
    return cleaned.map(({ foodId: f, quantity }) => ({
      id: f._id || f,
      name: f.name,
      price: f.price,
      image: f.image,
      quantity,
    }));
  }, []);

  const recalc = useCallback((items) => {
    const total = items.reduce(
      (s, i) => s + Number(i.price || 0) * Number(i.quantity || 0),
      0
    );
    const count = items.reduce((s, i) => s + Number(i.quantity || 0), 0);
    setCartTotal(total);
    setCartCount(count);
  }, []);

  const fetchCart = useCallback(
    async ({ silent = false, signal, on401 } = {}) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      if (!silent) setLoading(true);
      try {
        const data = await fetchCartApi({ on401, signal });
        const items = mapCart(data);
        setCartItems(items);
        recalc(items);
      } finally {
        loadingRef.current = false;
        if (!silent) setLoading(false);
      }
    },
    [mapCart, recalc]
  );

  const getCheckoutPayload = useCallback(() => {
    return cartItems.map((item) => ({
      foodId: item.id,
      quantity: item.quantity,
    }));
  }, [cartItems]);

  const updateCartItem = useCallback(
    async (foodId, quantity, { on401, signal } = {}) => {
      await updateCartItemApi(foodId, quantity, { on401, signal });
      await fetchCart({ silent: true, signal, on401 });
    },
    [fetchCart]
  );

  const removeCartItem = useCallback(
    async (foodId, { on401, signal } = {}) => {
      await removeCartItemApi(foodId, { on401, signal });
      await fetchCart({ silent: true, signal, on401 });
    },
    [fetchCart]
  );

  const clearCart = useCallback(() => {
    setCartCount(0);
    setCartTotal(0);
    setCartItems([]);
  }, []);

  // fetch once per user mount, abort on unmount
  useEffect(() => {
    if (!user) {
      clearCart();
      return;
    }
    const ctrl = new AbortController();
    fetchCart({ signal: ctrl.signal });
    return () => ctrl.abort();
  }, [user, fetchCart, clearCart]);

  const value = useMemo(
    () => ({
      user,
      loading,
      cartCount,
      cartTotal,
      cartItems,
      fetchCart,
      setCartCount, // if you need it elsewhere
      updateCartItem,
      removeCartItem,
      getCheckoutPayload,
      clearCart,
    }),
    [
      user,
      loading,
      cartCount,
      cartTotal,
      cartItems,
      fetchCart,
      updateCartItem,
      removeCartItem,
      getCheckoutPayload,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
