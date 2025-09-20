const Subscriber = require("../models/Subscriber");

// add this line
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function addSubscriber(req, res) {
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  if (!email) return res.status(400).json({ error: "missing_fields" });
  if (!emailRe.test(email))
    return res.status(400).json({ error: "invalid_input" });

  try {
    const exists = await Subscriber.findOne({ email }).lean();
    if (exists) return res.status(409).json({ error: "email_exists" });
    await Subscriber.create({ email });
    return res.status(201).json({ ok: true });
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.error(e);
    return res.status(500).json({ error: "internal_server_error" });
  }
}

async function listSubscribers(req, res) {
  const q = String(req.query.q || "")
    .trim()
    .toLowerCase();
  const filter = q
    ? {
        email: {
          $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          $options: "i",
        },
      }
    : {};
  try {
    const rows = await Subscriber.find(filter)
      .select("_id email createdAt")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ subscribers: rows });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    res.status(500).json({ error: "internal_server_error" });
  }
}

async function deleteSubscriber(req, res) {
  try {
    const doc = await Subscriber.findByIdAndDelete(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "not_found" });
    res.status(204).end();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    res.status(500).json({ error: "internal_server_error" });
  }
}

module.exports = { addSubscriber, listSubscribers, deleteSubscriber };
