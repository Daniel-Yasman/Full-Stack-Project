import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SuccessModal from "../components/SuccessModal";

function Reservation() {
  const { getUserId, user } = useAuth();
  const { fetchCart, cartItems, cartTotal, cartCount, getCheckoutPayload } =
    useCart();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const datetime = `${date}T${time}`;
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/reservations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userId: getUserId(),
        // neither cartItems or fetchCart work. both return 400.
        cart: getCheckoutPayload(),
        time: datetime,
        creditCard: {
          cardNumber,
          cardHolder,
          expirationDate,
          cvv,
        },
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => {});
      setMessage(payload.error || "unknown_error");
      return;
    }
    setMessage("Success");
  };
  return (
    <div>
      {message === "Success" ? (
        <SuccessModal name={user?.name} food={cartItems} time={datetime} />
      ) : (
        <div>
          {user ? (
            <div>
              <Link to="/">Home</Link>
              {message && <p>{message}</p>}
              {user?.name && <p>{user?.name}</p>}
              {cartCount === 0 ? (
                <p>Cart is empty.</p>
              ) : (
                <div className="border-1">
                  <header>Cart:</header>
                  <div>
                    {cartItems.map((item) => (
                      <div key={item.id}>
                        <div className="flex flex-col items-center">
                          <p>{item.name}</p>
                          <p>{item.price}$</p>
                          <p>x{item.quantity}</p>
                          <img
                            className="w-25 h-25 rounded-md"
                            src={item.image}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p>Total: {cartTotal.toFixed(2)}$</p>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <fieldset>
                  <legend>Date & Time</legend>
                  <label>Date:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <label>Time:</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </fieldset>
                <fieldset>
                  <legend>Payment Info</legend>
                  <label>Card Number:</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <label>Card Holder:</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                  <label>Expiry:</label>
                  <input
                    type="text"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                  <label>CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </fieldset>
                <button type="submit">Submit</button>
              </form>
            </div>
          ) : (
            <div>
              <Link to="/">Home</Link>
              <p>Log in first</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default Reservation;
