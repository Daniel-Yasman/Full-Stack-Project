const register = async (req, res) => {
  try {
    console.log("register endpoint hit");
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "An error occurred while trying to register user" });
  }
};

const login = async (req, res) => {
  try {
    console.log("login endpoint hit");
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "An error occurred while trying to log-in user" });
  }
};
