const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCart,
} = require("../controllers/userController");
router.post("/:userId/cart", addToCart);
router.get("/:userId/cart", getCart);
router.patch("/:userId/cart", updateCart);
module.exports = router;
