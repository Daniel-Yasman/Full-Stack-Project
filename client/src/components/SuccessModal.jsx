import { Link } from "react-router-dom";

function SuccessModal({ name, food, date, time }) {
  return (
    <div className="border-1 w-[350px] h-[225px] flex flex-col items-center justify-center absolute z-10 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Link to="/">X</Link>
      <h1>Huzzah!</h1>
      <p>Your order was successfull {name}!</p>
      <p>
        At {time} on {date} your {food} will be waiting for you!
      </p>
    </div>
  );
}
export default SuccessModal;
