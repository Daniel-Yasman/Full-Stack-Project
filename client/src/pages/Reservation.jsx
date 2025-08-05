import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";
function Reservation() {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || null;
  const name = JSON.parse(localStorage.getItem("user"))?.name || null;
  // make a cart
  const [cart, setCart] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const datetime = `${date}T${time}`;
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetch(`/api/user/${userId}/cart`);
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: "Unknown error" };
        }
        setMessage(`${errorData}.`);
        return;
      }
      const data = await response.json();
      setCart(data.cart);
    };
    fetchCart();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/reservations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        cart,
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
  };
  return (
    <div>
      {message === "Success" ? (
        <SuccessModal name={name} food={cart} time={datetime} />
      ) : (
        <div>
          {userId ? (
            <div>
              <Link to="/">Home</Link>
              {message && <p>{message}</p>}
              {name && <p>{name}</p>}
              {cart.length === 0 ? (
                <p>Cart is empty.</p>
              ) : (
                <div>
                  <header>Cart:</header>
                  <div>
                    {cart.map((item) => (
                      <div className="border-1" key={item._id}>
                        <div className="flex flex-col items-center">
                          <p>{item.foodId.name}</p>
                          <p>{item.foodId.price}$</p>
                          <p>x{item.quantity}</p>
                          <img
                            className="w-25 h-25 rounded-md"
                            src={item.foodId.image}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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
