require("dotenv").config();
const fs = require("fs");
const https = require("https");
const key = fs.readFileSync("./localhost-key.pem");
const cert = fs.readFileSync("./localhost.pem");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);
const PORT = process.env.PORT || 3000;

const connectDB = require("./config/db");
connectDB();

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const userRoutes = require("./routes/userRoutes");
const meRoutes = require("./routes/me");

app.use("/api", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/user/", userRoutes);
app.use("/api", meRoutes);

https.createServer({ key, cert }, app).listen(PORT, () => {
  console.log(`HTTPS API on https://localhost:${PORT}`);
});
