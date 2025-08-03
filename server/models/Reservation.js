const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
    time: Date,
    creditCard: {
      cardNumber: String,
      cardHolder: String,
      expirationDate: String,
      cvv: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
