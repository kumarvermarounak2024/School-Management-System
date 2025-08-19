const express = require('express');
const router = express.Router();
const gradeController = require('../../controllers/Examination/examGradeController');

router.post('/create', gradeController.createGrade);
router.get('/getAll', gradeController.getGrades);
router.put('/update/:id', gradeController.updateGrade);  
router.delete('/delete/:id', gradeController.deleteGrade);  


module.exports = router;
