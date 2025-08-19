const express = require("express");
const router = express.Router();
const {
  createSalaryPaymentsFromAssign,
  getSalaryPayments
} = require("../../controllers/Human_Resources_Controller/salary_paymentController");

router.post("/salary-payments", createSalaryPaymentsFromAssign);
router.get("/salary-payments", getSalaryPayments);

module.exports = router;
