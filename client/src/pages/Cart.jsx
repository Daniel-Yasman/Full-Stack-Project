import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { SyncLoader } from "react-spinners";
function Cart() {
  const { loading, cartItems, cartCount, updateCartItem, removeCartItem } =
    useCart();
  if (loading) return <SyncLoader color="#000000" />;

  return (
    <div>
      <div className="flex justify-around">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
      </div>
      {cartCount === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div>
          {cartCount === 1 ? <p>{cartCount} Item</p> : <p>{cartCount} Items</p>}
          {cartItems.map((item) => (
            <div key={item.foodId._id}>
              <p>{item.foodId.name}</p>
              <p>{item.foodId.price}$</p>
              <div>x{item.quantity}</div>
              {item.quantity >= 10 ? (
                <button
                  disabled={true}
                  onClick={() => console.log("Cant add no more.")}
                  className="opacity-50"
                >
                  +
                </button>
              ) : (
                <button
                  onClick={() =>
                    updateCartItem(item.foodId._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              )}
              {item.quantity <= 1 ? (
                <button
                  disabled={true}
                  className="opacity-50"
                  onClick={() => console.log("Cant remove no more.")}
                >
                  -
                </button>
              ) : (
                <button
                  onClick={() =>
                    updateCartItem(item.foodId._id, item.quantity - 1)
                  }
                >
                  -
                </button>
              )}
              <button onClick={() => removeCartItem(item.foodId._id)}>
                Remove item
              </button>
              <img className="w-25 h-25 rounded-md" src={item.foodId.image} />
            </div>
          ))}
        </div>
      )}
      <Link to="/reserve">Checkout</Link>
    </div>
  );
}
export default Cart;
