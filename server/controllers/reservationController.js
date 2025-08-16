const Reservation = require("../models/Reservation");
const Food = require("../models/Food");
const { DateTime } = require("luxon");
const { isValidObjectId } = require("mongoose");

const createReservation = async (req, res) => {
  const { cart, time, creditCard } = req.body;
  if (!Array.isArray(cart) || cart.length === 0 || !time || !creditCard)
    return res.status(400).json({
      error: "missing_fields",
      details: ["cart", "time", "creditCard"],
    });

  const ids = cart.map((item) => item.foodId);
  const count = await Food.countDocuments({ _id: { $in: ids } });
  if (count !== ids.length)
    return res.status(400).json({ error: "invalid_foodId" });

  const israelTime = DateTime.fromISO(time, {
    zone: "Asia/Jerusalem",
  }).toJSDate();

  try {
    const newReservation = await Reservation.create({
      userId: req.user.id,
      cart,
      time: israelTime,
      creditCard,
    });
    const { _id } = newReservation;
    return res.status(201).json({
      reservation: { id: _id, userId: req.user.id, cart, time: israelTime },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "internal_server_error" });
  }
};

const listReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .select("-creditCard -__v")
      .populate("cart.foodId", "name price image")
      .lean();
    return res.json({ reservations });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "internal_server_error" });
  }
};

const deleteReservation = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ error: "missing_fields", details: ["id"] });

  if (!isValidObjectId(id)) return res.status(404).json({ error: "not_found" });

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ error: "not_found" });

    if (String(reservation.userId) !== req.user.id)
      return res.status(403).json({ error: "forbidden" });

    const now = DateTime.now().setZone("Asia/Jerusalem");
    const compare = DateTime.fromJSDate(reservation.time, {
      zone: "utc",
    }).setZone("Asia/Jerusalem");
    const diff = compare.diff(now, "hours").hours;

    if (diff < 24)
      return res.status(403).json({ error: "cancellation_window" });

    await reservation.deleteOne();

    return res.status(204).end();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "internal_server_error" });
  }
};

module.exports = {
  createReservation,
  listReservations,
  deleteReservation,
};
