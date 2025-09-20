const router = require("express").Router();
const { addSubscriber } = require("../controllers/newsController");
router.post("/addSubscriber", addSubscriber);
module.exports = router;
