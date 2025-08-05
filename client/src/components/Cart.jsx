import { useCart } from "../context/CartContext";
function Cart() {
  const { cartCount } = useCart();
  return (
    <div>
      <p>Cart ({cartCount})</p>
    </div>
  );
}

export default Cart;
