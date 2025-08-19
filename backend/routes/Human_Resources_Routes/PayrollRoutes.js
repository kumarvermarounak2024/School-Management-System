const express = require("express");
const router = express.Router();
const {
  createSalaryTemplate,
  getAllSalaryTemplates,
  getSalaryTemplateById,
  deleteSalaryTemplate,
  updateSalaryTemplate,
} = require("../../controllers/Human_Resources_Controller/PayrollController");

router.post("/create", createSalaryTemplate);
router.get("/getAll", getAllSalaryTemplates);
router.get("/get/:id", getSalaryTemplateById);
router.delete("/delete/:id", deleteSalaryTemplate);
router.put("/update/:id", updateSalaryTemplate);

module.exports = router;
