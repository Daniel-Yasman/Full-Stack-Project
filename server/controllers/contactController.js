const Contact = require("../models/Contact");
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function newInquiry(req, res) {
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  const body = String(req.body?.body || "").trim();

  if (!email || !body) return res.status(400).json({ error: "missing_fields" });
  if (!emailRe.test(email))
    return res.status(400).json({ error: "invalid_email" });

  try {
    await Contact.create({ email, body });
    return res.status(201).json({ ok: true });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "internal_server_error" });
  }
}

async function listContacts(req, res) {
  const q = String(req.query.q || "").trim();
  const filter = q
    ? {
        email: {
          $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          $options: "i",
        },
      }
    : {};
  try {
    const rows = await Contact.find(filter)
      .select("_id email body createdAt")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ contacts: rows });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    res.status(500).json({ error: "internal_server_error" });
  }
}

module.exports = { newInquiry, listContacts };
