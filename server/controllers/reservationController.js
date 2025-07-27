const createReservation = async (req, res) => {
  try {
    console.log("reservations endpoint hit");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "An error occurred while trying to create a reservation",
    });
  }
};

const listReservasions = async (req, res) => {
  try {
    console.log("history endpoint hit");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "An error occurred while trying to create get reservasions",
    });
  }
};
