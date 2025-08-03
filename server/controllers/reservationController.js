const Reservation = require("../models/Reservation");
const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const createReservation = async (req, res) => {
  const { userId, foodId, time, creditCard } = req.body;
  if (!userId || !foodId || !time || !creditCard)
    return res.status(400).json({ message: "Missing fields" });

  // fromISO, because the value is a {type:Date}.
  // toJSDate, because mongoDB only accepts Native Dates.
  // This function converts js's iso (Three hours backwards) to the correct time.
  // then turns it into a mongoDB readable version.
  const israelTime = DateTime.fromISO(time, {
    zone: "Asia/Jerusalem",
  }).toJSDate();

  try {
    const newReservation = new Reservation({
      userId,
      foodId,
      time: israelTime,
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
