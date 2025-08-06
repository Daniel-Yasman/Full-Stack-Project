import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
function Cart() {
  const { cartItems, cartCount, updateCartItem, removeCartItem } = useCart();

  return (
    <div>
      <Link to="/">Home</Link>
      {cartCount === 1 ? <p>{cartCount} Item</p> : <p>{cartCount} Items</p>}
      {cartItems.map((item) => (
        <div key={item.foodId._id}>
          <p>{item.foodId.name}</p>
          <p>{item.foodId.price}$</p>
          <div>x{item.quantity}</div>
          <button
            onClick={() => updateCartItem(item.foodId._id, item.quantity + 1)}
          >
            +
          </button>
          <button
            onClick={() => updateCartItem(item.foodId._id, item.quantity - 1)}
          >
            -
          </button>
          <button onClick={() => removeCartItem(item.foodId._id)}>
            Remove item
          </button>
          <img className="w-25 h-25 rounded-md" src={item.foodId.image} />
        </div>
      ))}
    </div>
  );
}
export default Cart;
