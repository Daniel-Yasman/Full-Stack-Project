const listFoodItems = async (req, res) => {
  try {
    console.log("food endpoint hit");
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
