const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
  updateComplaintStatus
} = require("../controllers/complainController");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});
// Routes
router.post("/createComplain", upload.single("document"), createComplaint);
router.get("/getAllComplains",getAllComplaints);
router.get("/getComplainById/:id",getComplaintById);
router.put(
  "/updateComplainById/:id",
  upload.single("document"),
  updateComplaint
);
router.delete("/deleteComplainById/:id",deleteComplaint);
router.patch("/complainStatus/:id/status",updateComplaintStatus);

module.exports = router;
