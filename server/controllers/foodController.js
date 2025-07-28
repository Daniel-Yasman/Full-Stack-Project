const Food = require("../models/Food");

const listFoodItems = async (req, res) => {
  try {
    const foods = await Food.find({});
    if (foods.length === 0)
      return res.status(404).json({ message: "No Foods found" });
    return res.status(200).json({ message: "Success", foods });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "An error occurred while trying to list food items" });
  }
};
module.exports = {
  listFoodItems,
};
