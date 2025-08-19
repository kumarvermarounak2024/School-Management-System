const express = require("express");
const router = express.Router();

const feesAllocationController = require("../../controllers/Fee/feeAllocationController");

const {
  createFeesAllocation,
  getAllFeesAllocations,
  getFeesAllocationById,
  updateFeesAllocation,
  deleteFeesAllocation,
} = feesAllocationController;

// Routes
router.post("/create", createFeesAllocation);
router.get("/getAll", getAllFeesAllocations);
router.get("/get/:id", getFeesAllocationById);
router.put("/update/:id", updateFeesAllocation);
router.delete("/delete/:id", deleteFeesAllocation);

module.exports = router;
