const Reservation = require("../models/Reservation");

const createReservation = async (req, res) => {
  const { userId, foodItem, date, time, creditCard } = req.body;
  if (!userId || !foodItem || !date || !time || !creditCard)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const newReservation = new Reservation({
      userId,
      foodItem,
      date,
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
  try {
    const reservations = await Reservation.find({});

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
