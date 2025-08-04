import { useState, useEffect } from "react";
function Cart() {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || null;
  const [cart, setCart] = useState(0);
  const [message, setMessage] = useState("");
  const fetchCart = async () => {
    const response = await fetch(`/api/user/${userId}/cart`);
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "Unknown error" };
      }
      setMessage(`${errorData}.`);
      return;
    }
    const data = await response.json();
    setCart(data.cart.length);
  };
  useEffect(() => {
    fetchCart();
  }, []);
  return (
    <div>
      {message && <p>{message}</p>}
      <p>Cart ({cart})</p>
    </div>
  );
}
export default Cart;
