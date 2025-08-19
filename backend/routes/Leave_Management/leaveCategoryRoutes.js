const express = require("express");
const router = express.Router();
const {
  createLeaveCategory,
  getAllLeaveCategories,
  updateLeaveCategory,
  deleteLeaveCategory,
} = require("../../controllers/Leave_Managemet/leaveCategoryController");

router.post("/create", createLeaveCategory);

router.get("/getAll", getAllLeaveCategories);

router.put("/update/:id", updateLeaveCategory);

router.delete("/delete/:id", deleteLeaveCategory);

module.exports = router;
