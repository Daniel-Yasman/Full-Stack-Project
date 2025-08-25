const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  slotKey: { type: String, unique: true, index: true },
  used: { type: Number, default: 0 },
  limit: { type: Number, default: 2 },
});

module.exports = mongoose.model("Slot", slotSchema);
