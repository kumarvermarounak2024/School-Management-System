const express = require('express');
const router = express.Router();
const {
    createdepartment,
    getdepartment,
    updatedepartment,
    deletedepartment,
} = require('../controllers/departmentController');

//route
router.post('/create', createdepartment);
router.get('/get', getdepartment);
router.put('/update/:id', updatedepartment);
router.delete('/delete/:id', deletedepartment);

module.exports = router;
