const Reservation = require("../models/Reservation");
const Food = require("../models/Food");
const { DateTime } = require("luxon");
const { isValidObjectId } = require("mongoose");

const createReservation = async (req, res) => {
  const { cart, time } = req.body;
  if (!Array.isArray(cart) || cart.length === 0 || !time)
    return res.status(400).json({
      error: "missing_fields",
      details: ["cart", "time"],
    });

  const ids = cart.map((item) => item.foodId);
  const foods = await Food.find({ _id: { $in: ids } })
    .select("price")
    .lean();
  if (foods.length !== ids.length)
    return res.status(400).json({ error: "invalid_foodId" });

  const priceMap = new Map(foods.map((f) => [String(f._id), f.price]));
  let total = 0;
  for (const i of cart) {
    const p = priceMap.get(String(i.foodId));
    if (typeof p !== "number")
      return res.status(400).json({ error: "invalid_foodId" });
    total += i.quantity * p;
  }

  const israelTime = DateTime.fromISO(time, {
    zone: "Asia/Jerusalem",
  }).toJSDate();
  if (isNaN(israelTime.getTime()))
    return res.status(400).json({ error: "invalid_time" });

  try {
    const newReservation = await Reservation.create({
      userId: req.user.id,
      cart,
      time: israelTime,
      total,
    });
    const { _id } = newReservation;
    return res.status(201).json({
      reservation: {
        id: _id,
        userId: req.user.id,
        cart,
        time: israelTime,
        total,
      },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "internal_server_error" });
  }
};

const listReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .select("-__v")
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
