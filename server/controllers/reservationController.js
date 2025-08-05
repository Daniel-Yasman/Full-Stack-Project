const Reservation = require("../models/Reservation");
const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const createReservation = async (req, res) => {
  const { userId, cart, time, creditCard } = req.body;
  if (
    !userId ||
    !Array.isArray(cart) ||
    cart.length === 0 ||
    !time ||
    !creditCard
  )
    return res.status(400).json({ message: "Missing fields" });
  const israelTime = DateTime.fromISO(time, {
    zone: "Asia/Jerusalem",
  }).toJSDate();

  try {
    const newReservation = new Reservation({
      userId,
      cart,
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
      "name",
      "price",
      "image"
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

const deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.findById(id);
    if (!reservation)
      return res.status(404).json({ message: "No reservation found" });

    const now = DateTime.now().setZone("Asia/Jerusalem");
    const compare = DateTime.fromJSDate(reservation.time, {
      zone: "utc",
    }).setZone("Asia/Jerusalem");
    const diff = compare.diff(now, "hours").hours;

    if (diff < 24)
      return res.status(401).json({
        message: "Cancellation window passed, please contact support",
      });

    await reservation.deleteOne();

    return res.status(200).json({ message: "Success" });
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
  deleteReservation,
};
