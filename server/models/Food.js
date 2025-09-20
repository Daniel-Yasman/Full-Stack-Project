const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  stock: { type: Number },
  description: { type: String, default: "None available" },
});

module.exports = mongoose.model("Food", foodSchema);
