const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCart,
  removeItem,
} = require("../controllers/userController");
router.post("/:userId/cart", addToCart);
router.get("/:userId/cart", getCart);
router.patch("/:userId/cart", updateCart);
router.delete("/:userId/cart/:foodId", removeItem);
module.exports = router;
