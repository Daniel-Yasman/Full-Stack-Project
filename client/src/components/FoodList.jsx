import { useState, useEffect } from "react";

function FoodList() {
  const [foods, setFoods] = useState([]);
  const [message, setMessage] = useState("");
  const userId = JSON.parse(localStorage.getItem("user"))?._id || null;
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
  const handleAddToCart = async (foodId, quantity) => {
    const response = await fetch(`/api/user/${userId}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ foodId, quantity }),
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
    } else setMessage("Added to cart");
  };
  // add "Add to cart" button, add handleAddToCart(food)
  return (
    <div>
      {foods.map((food) => (
        <div key={food._id}>
          <p>{food.name}</p>
          <button onClick={() => handleAddToCart(food._id, 1)}>
            Add to cart
          </button>
        </div>
      ))}
      {message && <p>{message}</p>}
    </div>
  );
}
export default FoodList;
