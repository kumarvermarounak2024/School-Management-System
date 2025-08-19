const express = require("express");
const router = express.Router();

const {
  createDueFee,
  getAllFeeAssignments,
  getDueFeeById,
  updateDueFee,
  deleteDueFee
} = require("../../controllers/Fee/dueFeeController");

router.post("/create", createDueFee);
router.get("/getAll", getAllFeeAssignments);
router.get("/get/:id", getDueFeeById);
router.put("/update/:id", updateDueFee);
router.delete("/delete/:id", deleteDueFee);

module.exports = router;
