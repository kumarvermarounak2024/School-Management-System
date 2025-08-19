const express = require('express');
const router = express.Router();
const marksController = require('../../controllers/Examination/marksController');

router.post('/create', marksController.createMarks);
router.get('/getAll', marksController.getAllmarks);
router.get('/getById/:id', marksController.getmarksById);
router.put('/update/:id', marksController.updatmarks);
router.delete('/delete/:id', marksController.deletemark);


module.exports = router;