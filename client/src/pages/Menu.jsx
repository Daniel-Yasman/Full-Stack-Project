import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Cart from "../components/Cart";
import FoodList from "../components/FoodList";

function Menu() {
  const { cartCount, fetchCart } = useCart();
  const { user } = useAuth();

  return (
    <div>
      <div>
        <Link to="/">Home</Link>
        {user && (
          <Link to="/cart">
            <Cart cartCount={cartCount} />
          </Link>
        )}
      </div>
      <FoodList fetchCart={fetchCart} />
    </div>
  );
}

export default Menu;
