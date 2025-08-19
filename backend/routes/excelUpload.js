const express = require('express');
const router = express.Router();
const upload = require('../config/uploads');
const { uploadExcel } = require('../controllers/excelUpload');

// Upload Excel
router.post('/upload-excel', upload.single('file'), uploadExcel);

// Get stored Excel data
// router.get('/excel-data', getExcelData);

module.exports = router;
