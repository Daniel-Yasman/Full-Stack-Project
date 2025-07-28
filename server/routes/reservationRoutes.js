const express = require("express");
const router = express.Router();
const {
  createReservation,
  listReservations,
} = require("../controllers/reservationController");

router.post("/reservations", createReservation);
router.get("/user/history", listReservations);

module.exports = router;
