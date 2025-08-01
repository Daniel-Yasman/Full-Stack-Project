import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function MyReservations() {
  // call fetch add users id via localstorage
  const userId = JSON.parse(localStorage.getItem("user"))?._id || null;
  const name = JSON.parse(localStorage.getItem("user"))?.name || null;
  const [reservations, setReservations] = useState([]);
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
      }
      const data = await response.json();
      setReservations(data.reservations);
    };

    fetchReservations();
  }, []);

  return (
    <div>
      {userId ? (
        <div>
          <Link to="/">Home</Link>
          <h1>{name && <span>{name}'s</span>} History</h1>
          <div>
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
      ) : (
        <div>
          <Link to="/">Home</Link>
          <p>Log in first</p>
        </div>
      )}
    </div>
  );
}
export default MyReservations;
