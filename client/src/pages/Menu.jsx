import { Link } from "react-router-dom";
import Cart from "../components/Cart";
import FoodList from "../components/FoodList";
function Menu() {
  return (
    <div>
      <div>
        <Link to="/">Home</Link>
        <Cart />
      </div>
      <FoodList />
    </div>
  );
}
export default Menu;
