import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
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
    setMessage("Success");
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
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
      {message && <p>{message}</p>}
    </div>
  );
}
export default Register;
