import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function MyReservations() {
  // call fetch add users id via localstorage
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const name = JSON.parse(localStorage.getItem("user")).name;
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchReservations = async () => {
      const response = await fetch(`/api/reservations?userId=${userId}`);
      if (!response.ok) {
        let errorData;
        try {
          errorData = response.json();
        } catch {
          errorData = { message: "Unknown error" };
        }
        setMessage(errorData);
      }
      setMessage("Success");
      const data = await response.json();
      setReservations(data.reservations);
    };

    fetchReservations();
  }, []);

  return (
    <div>
      <div>
        <Link to="/">Home</Link>
      </div>
      {userId && <p>{userId}</p>}
      {message && <p>{message}</p>}
      <h1>HUllu {name && <span>{name}</span>} welcom 2 home p4g3!</h1>
      <div>
        <p>Heree histori:</p>
        {reservations.length === 0 ? (
          <p>No reservations yet</p>
        ) : (
          reservations.map((reservation) => (
            <div key={reservation._id}>
              <div>{reservation.date}</div>
              <div>{reservation.time}</div>
              <div>{reservation.foodId.name}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default MyReservations;
