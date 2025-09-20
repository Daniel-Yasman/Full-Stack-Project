const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const { listFoodItems } = require("../controllers/foodController");
const {
  createMeal,
  updateMeal,
  deleteMeal,
} = require("../controllers/adminController");
const { findByEmail } = require("../controllers/userController");
const {
  listByUser,
  adminDeleteReservation,
} = require("../controllers/reservationController");
const {
  listSubscribers,
  deleteSubscriber,
} = require("../controllers/newsController");
const { listContacts } = require("../controllers/contactController");

// uploads go to ./server/public/images/meals
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = path.join(__dirname, "..", "public", "images", "meals");
    await fs.promises.mkdir(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[\/\\?%*:|"<>]/g, "_").trim();
    cb(null, safe || `meal_${Date.now()}.png`);
  },
});
const upload = multer({ storage });

router.use(auth, roleCheck("admin"));

router.get("/stats", (req, res) => res.json({ ok: true }));
router.get("/meals", listFoodItems);
router.post("/meals", upload.single("image"), createMeal);
router.patch("/meals/:id", upload.single("image"), updateMeal);
router.delete("/meals/:id", deleteMeal);

router.get("/users/by-email", findByEmail);
router.get("/reservations", listByUser);
router.delete("/reservations/:id", adminDeleteReservation);

router.get("/subscribers", listSubscribers);
router.delete("/subscribers/:id", deleteSubscriber);
router.get("/contacts", listContacts);

// optional: list saved images in meals dir
router.get("/meals/images", async (req, res) => {
  try {
    const dir = path.join(__dirname, "..", "public", "images", "meals");
    const files = await fs.promises.readdir(dir);
    const urls = files.map((f) => `/images/meals/${f}`);
    res.json({ images: urls });
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.error(e);
    res.status(500).json({ error: "internal_server_error" });
  }
});

module.exports = router;
