import { Link } from "react-router-dom";
function Home() {
  const name = JSON.parse(localStorage.getItem("user"))?.name || "";
  return (
    <div>
      {name ? <p>Welcome {name}!</p> : <p>Hello, please log in to begin!</p>}
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
    </div>
  );
}
export default Home;
