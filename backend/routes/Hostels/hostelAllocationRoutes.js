const express = require('express');
const router = express.Router();
const hostelAllocationController = require('../../controllers/Hostels/hostelAllocationController');

router.post('/create', hostelAllocationController.createHostelAllocation);
router.get('/getAll', hostelAllocationController.getAllHostelAllocation);
router.get('/getById/:id', hostelAllocationController.getHostelAllocationById);
router.put('/update/:id', hostelAllocationController.updateHostelAllocation);
router.delete('/delete/:id', hostelAllocationController.deleteHostelAllocation);

module.exports = router;
