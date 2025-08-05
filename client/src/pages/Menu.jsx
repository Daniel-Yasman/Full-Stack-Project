import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Cart from "../components/Cart";
import FoodList from "../components/FoodList";

function Menu() {
  const { cartCount, fetchCart } = useCart();

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
