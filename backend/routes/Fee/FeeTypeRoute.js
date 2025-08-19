// routes/Fee/FeeTypeRoute.js

const express = require('express');
const router = express.Router();
const feeTypeController = require("../../controllers/Fee/FeeTypeController")

// POST - create new fee type
router.post('/create', feeTypeController.createFeeType);

// GET - list all fee types
router.get('/getall', feeTypeController.getFeeTypes);

// Get fee type by ID
router.get('/getbyid/:id', feeTypeController.getFeeTypeById);

// PUT - update fee type by ID
router.patch('/update/:id', feeTypeController.updateFeeType);

// DELETE - delete fee type by ID
router.delete('/delete/:id', feeTypeController.deleteFeeType);

module.exports = router;
