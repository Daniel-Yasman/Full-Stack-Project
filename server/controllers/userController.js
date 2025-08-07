const User = require("../models/User");
async function addToCart(req, res) {
  const { userId } = req.params;
  const { foodId, quantity } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const item = user.cart.find((item) => item.foodId.toString() === foodId);
    if (item) item.quantity += 1;
    else user.cart.push({ foodId, quantity });
    await user.save();
    return res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while trying to add to cart" });
  }
}

async function getCart(req, res) {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.populate("cart.foodId");
    return res.status(200).json({ message: "Success", cart: user.cart });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while trying to fetch the cart" });
  }
}

async function updateCartItem(req, res) {
  const { userId } = req.params;
  const { foodId, quantity } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!foodId || quantity === undefined)
      return res.status(400).json({ message: "Missing fields" });
    if (quantity > 10 || quantity < 1)
      return res.status(400).json({ message: "Quantity limit reached" });
    await User.findOneAndUpdate(
      { _id: userId, "cart.foodId": foodId },
      { $set: { "cart.$.quantity": quantity } }
    );
    return res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while trying to update the cart" });
  }
}
async function removeCartItem(req, res) {
  const { userId, foodId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    await User.updateOne({ _id: userId }, { $pull: { cart: { foodId } } });
    return res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while trying to remove the item" });
  }
}
module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};
