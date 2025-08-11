import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const r = await register(name, email, password, phone);
    if (!r.ok) {
      // TODO: show toast based on res.error (e.g., 'email_exists', 'invalid_input')
      return;
    }
    navigate("/login");
  };

  return (
    <div>
      <div>
        <Link to="/">Home</Link>
      </div>
      <form onSubmit={handleSubmit}>
        <legend>Register</legend>
        <label>Full name</label>
        <input
          type="text"
          placeholder="full name.."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="password.."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Phone number</label>
        <input
          type="text"
          placeholder="050-123-1234.."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <div>
        <p>
          Have an account? <Link to="/login">Login</Link> here
        </p>
      </div>
    </div>
  );
}
export default Register;
