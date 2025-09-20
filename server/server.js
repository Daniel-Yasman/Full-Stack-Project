require("dotenv").config();
const fs = require("fs");
const https = require("https");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN, // e.g. "https://localhost:5173"
    credentials: true,
  })
);

// serve all static images directly from ./server/public/images
app.use(
  "/images",
  express.static(path.join(__dirname, "public", "images"), {
    maxAge: "1h",
    etag: true,
  })
);

// connect DB
const connectDB = require("./config/db");
connectDB();

// routes
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const userRoutes = require("./routes/userRoutes");
const meRoutes = require("./routes/me");
const adminRoutes = require("./routes/adminRoutes");
const newsRoutes = require("./routes/newsRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use("/api", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/user", userRoutes);
app.use("/api", meRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/contact", contactRoutes);

// health check
app.get("/health", (_, res) => res.json({ ok: true }));

// start HTTPS server
const PORT = Number(process.env.PORT || 5000);
const key = fs.readFileSync("./localhost-key.pem");
const cert = fs.readFileSync("./localhost.pem");
https.createServer({ key, cert }, app).listen(PORT, () => {
  console.log(`HTTPS API on https://localhost:${PORT}`);
});
