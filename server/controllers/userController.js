const User = require("../models/User");
const Food = require("../models/Food");
const { isValidObjectId } = require("mongoose");
const MAX_QTY = 10;
const MIN_QTY = 1;
async function addToCart(req, res) {
  const userId = req.user.id;
  const { foodId, quantity } = req.body;

  if (!foodId || quantity == null)
    return res.status(400).json({
      error: "missing_fields",
      details: ["foodId", "quantity"],
    });

  if (!isValidObjectId(foodId))
    return res.status(404).json({ error: "not_found" });

  const qty = Number(quantity);
  if (!Number.isInteger(qty))
    return res.status(400).json({ error: "invalid_input" });
  if (qty < MIN_QTY) return res.status(400).json({ error: "invalid_input" });
  if (qty > MAX_QTY) return res.status(400).json({ error: "limit_reached" });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "not_found" });

    const foodExists = await Food.exists({ _id: foodId });
    if (!foodExists) return res.status(400).json({ error: "invalid_foodId" });

    const found = user.cart.find((i) => i.foodId.toString() === foodId);
    if (found) {
      if (found.quantity + qty > MAX_QTY) {
        return res.status(400).json({ error: "limit_reached" });
      }
      found.quantity += qty;
    } else {
      user.cart.push({ foodId, quantity: qty });
    }

    await user.save();
    return res.status(200).end();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "internal_server_error" });
  }
}

async function getCart(req, res) {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId)
      .select("cart")
      .populate("cart.foodId", "name price image")
      .lean();
    if (!user) return res.status(404).json({ error: "not_found" });
    return res.status(200).json({ cart: user.cart });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "internal_server_error" });
  }
}

async function updateCartItem(req, res) {
  const userId = req.user.id;
  const { foodId, quantity } = req.body;
  if (!foodId || quantity == null)
    return res.status(400).json({
      error: "missing_fields",
      details: ["foodId", "quantity"],
    });

  if (!isValidObjectId(foodId))
    return res.status(404).json({ error: "not_found" });

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < MIN_QTY)
    return res.status(400).json({ error: "invalid_input" });

  try {
    if (qty > MAX_QTY) return res.status(400).json({ error: "limit_reached" });
    const result = await User.updateOne(
      { _id: userId, "cart.foodId": foodId },
      { $set: { "cart.$.quantity": qty } }
    );
    if (result.matchedCount === 0)
      return res.status(404).json({ error: "not_found" });
    return res.status(200).end();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "internal_server_error" });
  }
}
async function removeCartItem(req, res) {
  const { foodId } = req.params;
  const userId = req.user.id;
  if (!foodId)
    return res.status(400).json({
      error: "missing_fields",
      details: ["foodId"],
    });

  if (!isValidObjectId(foodId))
    return res.status(404).json({ error: "not_found" });

  try {
    const result = await User.updateOne(
      {
        _id: userId,
        "cart.foodId": foodId,
      },
      { $pull: { cart: { foodId } } }
    );
    if (result.modifiedCount === 0)
      return res.status(404).json({ error: "not_found" });
    return res.status(200).end();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "internal_server_error" });
  }
}
module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};
