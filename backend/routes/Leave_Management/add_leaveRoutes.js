const express = require("express");
const router = express.Router();
const {
  createLeaveApplication,
  getAllLeaveApplications,
  deleteLeaveApplication,
  updateLeaveApplication,
} = require("../../controllers/Leave_Managemet/add_leaveController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create", upload.single("attachment"), createLeaveApplication);
router.get("/getAll", getAllLeaveApplications);
router.delete("/delete/:id", deleteLeaveApplication);
router.put("/update/:id", upload.single("attachment"), updateLeaveApplication);

module.exports = router;
