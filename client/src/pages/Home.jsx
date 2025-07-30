import { Link } from "react-router-dom";

function Home() {
  return (
    <ul>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/menu">Menu</Link>
      </li>
      <li>
        <Link to="/my-reservations">User Page</Link>
      </li>
    </ul>
  );
}
export default Home;
