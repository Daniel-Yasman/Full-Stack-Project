import { Link } from "react-router-dom";
import FoodList from "../components/FoodList";
function Menu() {
  return (
    <div>
      <div>
        <Link to="/">Home</Link>
      </div>
      <FoodList />
    </div>
  );
}
export default Menu;
