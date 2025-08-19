const express = require("express");
const router = express.Router();
const { getStudentFeeReport } = require("../../controllers/Reports/studentFeeReportController");

router.get("/fees/report", getStudentFeeReport);

module.exports = router;
