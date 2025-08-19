const express = require("express");
const router = express.Router();
const feeGroupController = require("../../controllers/Fee/FeeGroupController")

// POST: Create Fee Group
router.post("/create", feeGroupController.createFeeGroup);

// GET: Get all Fee Groups
router.get("/getall", feeGroupController.getAllFeeGroups);

// PATCH: Update Fee Group
router.patch("/update/:id", feeGroupController.updateFeeGroup);

// DELETE: Delete Fee Group
router.delete("/delete/:id", feeGroupController.deleteFeeGroup);

module.exports = router;
