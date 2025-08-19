const express = require('express');
const router = express.Router();

const {createStoppage,
    getAllStoppage,
    getStoppageById,
    updateStoppage,
    deleteStoppage


 }=require ('../../controllers/Transport/stoppageController');

router.post('/create', createStoppage);
router.get('/getAll', getAllStoppage);
router.get('/get/:id',getStoppageById);
router.put('/update/:id',updateStoppage);
router.delete('/delete/:id',deleteStoppage)

module.exports = router;
