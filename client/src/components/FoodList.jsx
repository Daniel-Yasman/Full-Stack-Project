import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

function FoodList() {
  const [foods, setFoods] = useState([]);
  const [message, setMessage] = useState("");
  const { fetchCart } = useCart();
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
        setMessage(`${errorData.message}.`);
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
    } else {
      setMessage("Added to cart");
      await fetchCart(); // comes from context now
    }
  };

  return (
    <div>
      {foods.map((food) => (
        <div className="border-1 my-1" key={food._id}>
          <div className="flex flex-col items-center">
            <p>{food.name}</p>
            <p>{food.price}$</p>
            <img className="w-25 h-25 rounded-md" src={food.image} />
          </div>
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
