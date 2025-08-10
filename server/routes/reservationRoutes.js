const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {
  createReservation,
  listReservations,
  deleteReservation,
} = require("../controllers/reservationController");

router.post("/", auth, createReservation);
router.get("/", auth, listReservations);
router.delete("/:id", auth, deleteReservation);
module.exports = router;
