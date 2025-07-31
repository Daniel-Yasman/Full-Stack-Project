import { Link } from "react-router-dom";
function logout() {
  localStorage.removeItem("user");
  window.location.reload();
}
function Home() {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  return (
    <div>
      {user?.name ? (
        <p>Welcome {user.name}!</p>
      ) : (
        <p>Hello, please log in to begin!</p>
      )}
      <ul>
        <li>
          <Link to="/register">Register</Link>
        </li>
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
        <li>
          <Link to="/my-reservations">User Page</Link>
        </li>
      </ul>
    </div>
  );
}
export default Home;
