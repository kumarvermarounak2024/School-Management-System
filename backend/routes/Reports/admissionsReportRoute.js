const express = require("express");
const router = express.Router();
const { filterAdmissions } = require("../../controllers/Reports/admissionsReportController");

router.get("/filter", filterAdmissions);

module.exports = router;
