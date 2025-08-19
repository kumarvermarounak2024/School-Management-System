const express = require('express');
const router = express.Router();

const {createVehicleAssign,
getAllVehicleAssignments,
getVehicleAssignmentById,
updateVehicleAssignment,
deleteVehicleAssignment
}=require('../../controllers/Transport/vehicleAssignController')

router.post('/create', createVehicleAssign);
router.get('/getAll',getAllVehicleAssignments);
router.get('/get/:id',getVehicleAssignmentById);
router.put('/update/:id', updateVehicleAssignment);
router.delete('/delete/:id', deleteVehicleAssignment);

module.exports = router;
