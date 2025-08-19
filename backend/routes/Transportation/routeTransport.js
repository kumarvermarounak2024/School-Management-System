// routes/route.routes.js
const express = require('express');
const router = express.Router();
const { createTransportRoute,
    getAllTransportRoutes,
    getAllTransportRoutesById,
    updateTransportRoute,
deleteTransportRoute

} = require('../../controllers/Transport/routeTransportController');

router.post('/create', createTransportRoute);      
router.get('/getAll',getAllTransportRoutes);
 router.get('/get/:id',getAllTransportRoutesById );
router.put('/updateTransportRoute/:id',updateTransportRoute);
router.delete('/delete/:id',  deleteTransportRoute)
module.exports = router;
