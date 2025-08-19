const express = require('express');
const router = express.Router();

const {
createallocationReportModel,
  getAllallocationReportModel,
  getallocationReportById,
  updateallocationReportModel,
  deleteallocationReportModel
} = require('../../controllers/Transport/allocationReportController');

// Create
router.post('/create', createallocationReportModel);

// Get All
router.get('/getAll', getAllallocationReportModel);

// Get By ID
router.get('/get/:id', getallocationReportById);

// Update
router.put('/update/:id', updateallocationReportModel);

// Delete
router.delete('/delete/:id', deleteallocationReportModel );

module.exports = router;
