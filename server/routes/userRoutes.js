const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/userController");
router.post("/:userId/cart", addToCart);
router.get("/:userId/cart", getCart);
router.patch("/:userId/cart", updateCartItem);
router.delete("/:userId/cart/:foodId", removeCartItem);
module.exports = router;
