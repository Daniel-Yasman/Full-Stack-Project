import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { SyncLoader } from "react-spinners";
function Cart() {
  const { loading, cartItems, cartCount, updateCartItem, removeCartItem } =
    useCart();
  const { user } = useAuth();
  if (loading) return <SyncLoader color="#000000" />;

  return (
    <div>
      <div className="flex justify-around">
        <Link to="/">Home</Link>
        {user && <Link to="/menu">Menu</Link>}
      </div>
      {user ? (
        <div>
          {cartCount === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <div>
              {cartCount === 1 ? (
                <p>{cartCount} Item</p>
              ) : (
                <p>{cartCount} Items</p>
              )}
              {cartItems.map((item) => (
                <div key={item.id}>
                  <p>{item.name}</p>
                  <p>{item.price}$</p>
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
                      onClick={(e) => {
                        e.preventDefault();
                        updateCartItem(item.id, item.quantity + 1);
                      }}
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
                      onClick={() => updateCartItem(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                  )}
                  <button onClick={() => removeCartItem(item.id)}>
                    Remove item
                  </button>
                  <img className="w-25 h-25 rounded-md" src={item.image} />
                </div>
              ))}
            </div>
          )}
          {cartCount !== 0 ? <Link to="/reserve">Checkout</Link> : ""}
        </div>
      ) : (
        <div>Please log in.</div>
      )}
    </div>
  );
}
export default Cart;
