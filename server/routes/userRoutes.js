const express = require("express");
const auth = require("../middleware/auth");
const owner = require("../middleware/owner");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/userController");

router.use("/cart", auth, owner);

router.post("/cart", addToCart);
router.get("/cart", getCart);
router.patch("/cart", updateCartItem);
router.delete("/cart/:foodId", removeCartItem);
module.exports = router;
