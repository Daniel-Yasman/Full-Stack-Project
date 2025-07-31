import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";
function Reservation() {
  const location = useLocation();
  /*
  in order to create reservation I need
  • userId
  • foodId
  • date
  • time
  • creditCard:{cardNumber,cardHolder,expirationDate,cvv}
  I get sent the foodId on button click, userId is in localStorage
  now all I need is to make it work.
    */
  const userId = JSON.parse(localStorage.getItem("user"))?._id || null;
  const name = JSON.parse(localStorage.getItem("user"))?.name || null;
  const food = location.state.food;
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/reservations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        foodId: food._id,
        date,
        time,
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
        <SuccessModal name={name} food={food.name} date={date} time={time} />
      ) : (
        <div>
          {userId ? (
            <div>
              <Link to="/">Home</Link>
              {message && <p>{message}</p>}
              {name && <p>{name}</p>}
              {food?.name && <p>{food.name}</p>}
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
