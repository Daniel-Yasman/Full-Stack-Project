import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cart from "../components/Cart";
import FoodList from "../components/FoodList";
function Menu() {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || null;
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    const response = await fetch(`/api/user/${userId}/cart`);
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "Unknown error" };
      }
      setMessage(errorData.message || "Unknown error");
      return;
    }
    const data = await response.json();
    setCartCount(data.cart.length);
  };
  useEffect(() => {
    fetchCart();
  }, []);
  return (
    <div>
      <div>
        <Link to="/">Home</Link>
        <Cart cartCount={cartCount} />
      </div>
      <FoodList fetchCart={fetchCart} />
    </div>
  );
}
export default Menu;
