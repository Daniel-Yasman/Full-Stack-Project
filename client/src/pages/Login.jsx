import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "Unknown error" };
      }
      setMessage(`${errorData.message}.`);
      return;
    }
    const data = await response.json();
    localStorage.setItem("user", JSON.stringify(data));
    setMessage("Success");
    setEmail("");
    setPassword("");
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
      {message && <p>{message}</p>}
    </div>
  );
}
export default Login;
