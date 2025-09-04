import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, refreshMe } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    await refreshMe();
    navigate("/");
  };

  return (
    <div>
      <div>
        <Link to="/">Home</Link>
      </div>
      <form onSubmit={handleSubmit}>
        <legend>Login</legend>
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <div>
        <p>
          New user? <Link to="/register">Register</Link> here
        </p>
      </div>
    </div>
  );
}
export default Login;
