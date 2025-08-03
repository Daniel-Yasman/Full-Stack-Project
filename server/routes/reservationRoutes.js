const express = require("express");
const router = express.Router();
const {
  createReservation,
  listReservations,
  deleteReservation,
} = require("../controllers/reservationController");

router.post("/", createReservation);
router.get("/", listReservations);
router.delete("/:id", deleteReservation);
module.exports = router;
