const router = require("express").Router();
const { newInquiry } = require("../controllers/contactController");

router.post("/newInquiry", newInquiry);

module.exports = router;
