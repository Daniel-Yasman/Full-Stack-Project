require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

const connectDB = require("./config/db");
connectDB();

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

app.use("/api", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/reservations", reservationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
