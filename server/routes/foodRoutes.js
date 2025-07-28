const express = require("express");
const router = express.Router();
const { listFoodItems } = require("../controllers/foodController");

router.get("/", listFoodItems);

module.exports = router;
