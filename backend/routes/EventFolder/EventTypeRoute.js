const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} = require("../../controllers/EventFolder/EventTypeController");
router.post("/create", (req, res, next) => {
  console.log("POST /api/eventtype/create hit with body:", req.body);
  next();
}, createEvent);

router.post("/create", createEvent);     // ✅ This must be defined
router.get("/list", getEvents);
router.put("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);

module.exports = router;
