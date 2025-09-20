const Food = require("../models/Food");

const createMeal = async (req, res) => {
  try {
    const { name, price, image, imageUrl, description } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "missing_fields" });
    }

    // pick either uploaded file or provided URL
    const imagePath = req.file
      ? `/images/meals/${req.file.filename}`
      : (imageUrl || image || "").trim();

    if (!imagePath) {
      return res.status(400).json({ error: "missing_image" });
    }

    const meal = await Food.create({
      name,
      price: Number(price),
      image: imagePath,
      description, // default applied if missing
    });

    return res.status(201).json(meal);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("createMeal error:", err);
    }
    if (err.code === 11000) {
      return res.status(409).json({ error: "duplicate" });
    }
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "validation_error", details: err.errors });
    }
    return res.status(500).json({ error: "internal_server_error" });
  }
};

const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const changes = {};

    if (req.body.name) changes.name = req.body.name;
    if (req.body.price) changes.price = Number(req.body.price);
    if ("description" in req.body) changes.description = req.body.description;

    if (req.file) {
      changes.image = `/images/meals/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      changes.image = req.body.imageUrl;
    }

    const doc = await Food.findByIdAndUpdate(id, changes, {
      new: true,
      runValidators: true,
    }).lean();

    if (!doc) return res.status(404).json({ error: "not_found" });
    res.json(doc);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("updateMeal error:", err);
    }
    res.status(500).json({ error: "internal_server_error" });
  }
};

const deleteMeal = async (req, res) => {
  const doc = await Food.findByIdAndDelete(req.params.id).lean();
  if (!doc) return res.status(404).json({ error: "not_found" });
  res.status(204).end();
};

module.exports = { createMeal, updateMeal, deleteMeal };
