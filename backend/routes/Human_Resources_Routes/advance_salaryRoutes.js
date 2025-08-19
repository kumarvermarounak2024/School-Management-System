const express = require("express");
const router = express.Router();
const {
  createAdvanceSalary,
  getAllAdvanceSalaries,
  getAdvanceSalaryById,
  updateAdvanceSalary,
  deleteAdvanceSalary
} = require("../../controllers/Human_Resources_Controller/advance_salaryController");

router.post("/create", createAdvanceSalary);
router.get("/getAll", getAllAdvanceSalaries);
router.get("/get/:id", getAdvanceSalaryById);
router.put("/update/:id", updateAdvanceSalary);
router.delete("/delete/:id", deleteAdvanceSalary);

module.exports = router;
