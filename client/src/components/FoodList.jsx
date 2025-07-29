import { useState, useEffect } from "react";

function FoodList() {
  const [foods, setFoods] = useState([]);
  const [message, setMessage] = useState("");

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
        </div>
      ))}
      {message && <p>{message}</p>}
    </div>
  );
}
export default FoodList;
