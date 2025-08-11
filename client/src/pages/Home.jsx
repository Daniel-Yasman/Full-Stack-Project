import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { cartCount } = useCart();
  const { user, logout, authLoading } = useAuth();

  if (authLoading) return null;

  return (
    <ul>
      {user ? (
        <>
          <li>
            {user.name} <Link to="/cart">Cart ({cartCount})</Link>
          </li>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
          <li>
            <Link to="/reserve">Make a reservation</Link>
          </li>
          <li>
            <Link to="/my-reservations">User Page</Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <p>Hello, please log in to begin!</p>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </>
      )}
      <li>
        <Link to="/menu">Menu</Link>
      </li>
    </ul>
  );
}
export default Home;
