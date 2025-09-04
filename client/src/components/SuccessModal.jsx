import { Link } from "react-router-dom";
import { DateTime } from "luxon";

function SuccessModal({ info }) {
  const { name, food, time } = info;
  return (
    <div className="border-1 p-4 flex flex-col items-center justify-center absolute z-10 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Link to="/">X</Link>
      <h1>Huzzah!</h1>
      <p>Your order was successfull {name}!</p>
      <p>
        On{" "}
        {DateTime.fromISO(time)
          .setZone("Asia/Jerusalem")
          .toFormat("MMMM d, yyyy - HH:mm")}
        , your food will be ready:
      </p>
      <div>
        {Array.isArray(food) &&
          food.map((item) => (
            <div className="py-1 flex gap-1 items-center" key={item.id}>
              <img className="w-10 h-10 rounded-md" src={item.image} />
              <div>{item.name}</div>
              <div>x{item.quantity}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
export default SuccessModal;
