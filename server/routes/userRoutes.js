const express = require("express");
const router = express.Router();
const { addToCart, getCart } = require("../controllers/userController");
router.post("/:userId/cart", addToCart);
router.get("/:userId/cart", getCart);
module.exports = router;
