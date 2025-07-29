import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FoodList() {
  const [foods, setFoods] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReserve = (foodId) => {
    navigate("/reserve", { state: { foodId } });
  };
  useEffect(() => {
    const fetchFoods = async () => {
      const response = await fetch("/api/food");
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
      setFoods(data.foods);
    };
    fetchFoods();
  }, []);
  return (
    <div>
      {foods.map((food) => (
        <div key={food._id}>
          <p>{food.name}</p>
          <button onClick={() => handleReserve(food._id)}>Reserve</button>
        </div>
      ))}
      {message && <p>{message}</p>}
    </div>
  );
}
export default FoodList;
