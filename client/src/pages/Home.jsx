import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
function logout() {
  localStorage.removeItem("user");
  window.location.reload();
}
function Home() {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const { cartCount } = useCart();
  return (
    <div>
      <div>
        {user?.name ? (
          <p>Welcome {user.name}!</p>
        ) : (
          <p>Hello, please log in to begin!</p>
        )}
        {user && <Link to="/cart">Cart ({cartCount})</Link>}
      </div>
      <ul>
        <li>{!user && <Link to="/register">Register</Link>}</li>
        <li>
          {user ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
        {user && (
          <li>
            <Link to="/reserve">Make a reservation</Link>
          </li>
        )}
        <li>
          <Link to="/my-reservations">User Page</Link>
        </li>
      </ul>
    </div>
  );
}
export default Home;
