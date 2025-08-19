const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
} = require("../../controllers/EventFolder/EventController");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const eventFileFields = upload.fields([
  { name: "image", maxCount: 1 },
]);
// POST - Create
router.post("/create", eventFileFields, createEvent);

// GET - List All
router.get("/getAll", getAllEvents);

// PUT - Update
router.put("/update/:id", updateEvent);

// DELETE - Remove
router.delete("/delete/:id", deleteEvent);

module.exports = router;
