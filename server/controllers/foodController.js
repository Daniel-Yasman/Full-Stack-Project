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
const getAllFoodsRandom = async (req, res) => {
  try {
    const meals = await Food.find();
    for (let i = meals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [meals[i], meals[j]] = [meals[j], meals[i]];
    }
    return res.json(meals);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "internal_server_error" });
  }
};
module.exports = {
  listFoodItems,
  getAllFoodsRandom,
};
