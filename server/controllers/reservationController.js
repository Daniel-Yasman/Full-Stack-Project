const Reservation = require("../models/Reservation");
const mongoose = require("mongoose");

function numberToWord(month) {
  switch (month) {
    case "01":
      return "January";
    case "02":
      return "February";
    case "03":
      return "March";
    case "04":
      return "April";
    case "05":
      return "May";
    case "06":
      return "June";
    case "07":
      return "July";
    case "08":
      return "August";
    case "09":
      return "September";
    case "10":
      return "October";
    case "11":
      return "November";
    case "12":
      return "December";
    default:
      return "Invalid";
  }
}

const createReservation = async (req, res) => {
  const { userId, foodId, date, time, creditCard } = req.body;
  if (!userId || !foodId || !date || !time || !creditCard)
    return res.status(400).json({ message: "Missing fields" });
  if (time.slice(3) % 30 !== 0) {
    return res.status(500).json({ message: "Invalid time" });
  }

  // date = 2025-08-01
  const year = date.slice(0, 4);
  const month = numberToWord(date.slice(5, 7));
  const day = parseInt(date.slice(8));

  if (month === "Invalid") {
    return res.status(500).json({ message: "Invalid month value" });
  }

  const formattedDate = `${month} ${day}, ${year}`;

  try {
    const newReservation = new Reservation({
      userId,
      foodId,
      date: formattedDate,
      time,
      creditCard,
    });
    await newReservation.save();
    return res.status(200).json({
      message: "Reservation created successfully",
      reservation: newReservation,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "An error occurred while trying to create a reservation",
    });
  }
};

const listReservations = async (req, res) => {
  const { userId } = req.query;
  // need to turn this into mongodb readable format
  const objectId = new mongoose.Types.ObjectId(userId);
  try {
    const reservations = await Reservation.find({ userId: objectId }).populate(
      "foodId",
      "name"
    );

    if (reservations.length === 0)
      return res.status(404).json({ message: "No reservations found" });

    return res.status(200).json({ message: "Success", reservations });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "An error occurred while trying to get reservations",
    });
  }
};

module.exports = {
  createReservation,
  listReservations,
};
