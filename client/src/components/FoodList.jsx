import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { addItemToCartApi } from "../lib/cart";
import { fetchFoodsApi } from "../lib/foods";
function FoodList() {
  const [foods, setFoods] = useState([]);
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      const data = await fetchFoodsApi({
        on401: (r) => setMessage(r.body?.error || "Unauthorized"),
      });
      setFoods(data.foods);
    };
    fetchFoods();
  }, []);

  const handleAddToCart = async (foodId, quantity) => {
    if (!user) {
      navigate("/login");
      return;
    }
    await addItemToCartApi(foodId, quantity);
    await fetchCart();
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
          <button
            onClick={() => {
              handleAddToCart(food._id, 1);
            }}
          >
            Add to cart
          </button>
        </div>
      ))}
      {message && <p>{message}</p>}
    </div>
  );
}

export default FoodList;
