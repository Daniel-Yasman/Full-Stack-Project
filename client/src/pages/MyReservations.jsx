import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { useAuth } from "../context/AuthContext";
import { listReservationsApi, deleteReservationApi } from "../lib/reservations";

function MyReservations() {
  const { user, logout } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function logoutAndRedirect() {
    logout();
    navigate("/login");
  }

  useEffect(() => {
    if (!user) return;

    const fetchReservations = async () => {
      try {
        const data = await listReservationsApi(logoutAndRedirect);
        setReservations(data.reservations);
      } catch (e) {
        setMessage(e.body?.error || "unknown_error");
      }
    };
    fetchReservations();
  }, [user]);

  const handleDelete = async (id) => {
    let had401 = false;
    await deleteReservationApi(id, (r) => {
      setMessage(r.body?.error);
      had401 = true;
    });
    if (!had401) setMessage("Success");
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
