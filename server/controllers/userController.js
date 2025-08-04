const User = require("../models/User");
async function addToCart() {
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
module.exports = {
  addToCart,
};
