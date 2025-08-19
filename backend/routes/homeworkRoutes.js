const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});
const homeworkController = require('../controllers/homeworkController');

// Homework routes
router.post('/create', upload.single('attachment'), homeworkController.createHomework);
router.get('/getAll', homeworkController.getAllHomework);
router.put('/update/:id', upload.single('attachment'), homeworkController.updateHomework);
router.delete('/delete/:id', homeworkController.deleteHomework);
router.get('/getById/:id', homeworkController.getHomeworkById);
router.get('/class/:classId/section/:sectionId', homeworkController.getHomeworkByClassSection);

router.get('/admissions/with-assigned-subjects',homeworkController.getEligibleAdmissionsWithSubjects);
router.patch("/update/home-work-status/:id", homeworkController.updateHomeworkFields);


module.exports = router;
