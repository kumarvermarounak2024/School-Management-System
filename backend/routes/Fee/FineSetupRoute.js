const express = require('express');
const router = express.Router();
const fineController = require('../../controllers/Fee/FineSetupController');



// POST
router.post('/create', fineController.createFine);

// GET all
router.get('/getall', fineController.getAllFines);

// PATCH update
router.patch('/update/:id', fineController.updateFine);

// DELETE
router.delete('/delete/:id', fineController.deleteFine);

module.exports = router;