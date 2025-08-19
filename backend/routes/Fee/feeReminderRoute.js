const express = require("express");
const router = express.Router();
const {
  createFeeReminder,
  getAllFeeReminders,
  getFeeReminderById,
  updateFeeReminder,
  deleteFeeReminder
} = require("../../controllers/Fee/feeReminderController");

router.post("/create", createFeeReminder);
router.get("/getAll", getAllFeeReminders);
router.get("/getById/:id", getFeeReminderById);
router.put("/update/:id", updateFeeReminder);
router.delete("/delete/:id", deleteFeeReminder);

module.exports = router;
