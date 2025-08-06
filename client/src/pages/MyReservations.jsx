import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
function MyReservations() {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || null;
  const name = JSON.parse(localStorage.getItem("user"))?.name || null;
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
        setMessage(errorData.message);
      }
      const data = await response.json();
      setReservations(data.reservations);
    };
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(`/api/reservations/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "Unknown error" };
      }
      setMessage(errorData.message);
      return;
    } else setMessage("Success");
  };
  // Turn {message && <p>{message}</p>} into a component popup eventually
  return (
    <div>
      {message && <p>{message}</p>}
      {userId ? (
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/menu">Make a new reservation</Link>
            </li>
          </ul>
          <h1>{name && <span>{name}'s</span>} History</h1>
          <div>
            {reservations.length === 0 ? (
              <p>No reservations yet</p>
            ) : (
              reservations.map((reservation) => (
                <div className="border-1 flex flex-col" key={reservation._id}>
                  <div>
                    At:{" "}
                    {DateTime.fromISO(reservation.time)
                      .setZone("Asia/Jerusalem")
                      .toFormat("MMMM d, yyyy - HH:mm")}
                  </div>
                  {reservation.cart.map((cart) => (
                    <div
                      className="flex flex-col gap-1 items-center"
                      key={cart._id}
                    >
                      <div className="flex gap-1">
                        <div>{cart.foodId.name}</div>
                        <div>x{cart.quantity}</div>
                      </div>
                      <img
                        className="w-25 h-25 rounded-md"
                        src={cart.foodId.image}
                      />
                    </div>
                  ))}
                  <button onClick={() => handleDelete(reservation._id)}>
                    Delete reservation
                  </button>
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
