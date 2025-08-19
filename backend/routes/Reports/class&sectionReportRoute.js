// routes/admissionRoutes.js
const express = require("express");
const router = express.Router();
const { getAdmissionCounts } = require("../../controllers/Reports/class&sectionReportController");

// GET /api/admissions/summary?startDate=2025-06-11&endDate=2025-06-11
router.get("/admissions/summary", getAdmissionCounts);

module.exports = router;
