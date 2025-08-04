const express = require("express");
const router = express.Router();
const { addToCart, getCart } = require("../controllers/userController");
router.post("/:userId/cart", addToCart);
router.get("/:id/cart", getCart);
module.exports = router;
