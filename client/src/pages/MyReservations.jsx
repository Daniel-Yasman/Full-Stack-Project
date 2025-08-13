import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { useAuth } from "../context/AuthContext";
function MyReservations() {
  const { getUserId, user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchReservations = async () => {
      const uid = getUserId();
      if (!uid) return;
      const response = await fetch(`/api/reservations?userId=${uid}`, {
        credentials: "include",
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => {});
        setMessage(payload.error || "unknown_error");
        return;
      }
      const data = await response.json();
      setReservations(data.reservations);
    };
    fetchReservations();
  }, [user]);

  const handleDelete = async (id) => {
    const response = await fetch(`/api/reservations/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => {});
      setMessage(payload.error || "unknown_error");
      return;
    } else setMessage("Success");
  };
  // Turn {message && <p>{message}</p>} into a toast eventually
  return (
    <div>
      {message && <p>{message}</p>}
      {user ? (
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/menu">Make a new reservation</Link>
            </li>
          </ul>
          <h1>{user?.name && <span>{user?.name}'s</span>} History</h1>
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
