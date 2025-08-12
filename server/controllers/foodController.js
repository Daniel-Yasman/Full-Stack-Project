const Food = require("../models/Food");

const listFoodItems = async (req, res) => {
  try {
    const foods = await Food.find({}).lean();
    return res.status(200).json({ foods });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "internal_server_error" });
  }
};
module.exports = {
  listFoodItems,
};
