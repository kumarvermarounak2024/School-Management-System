const express = require('express');
const router = express.Router();
const promotionController = require('../../controllers/Academic/promotionController');

// router.get('/get', promotionController.getAllPromotions);
// router.get('/get/:id', promotionController.getPromotionById);
// router.post('/create', promotionController.createPromotion);
// router.put('/update/:id', promotionController.updatePromotion);
// router.delete('/delete/:id', promotionController.deletePromotion);

router.post('/bulk-promote', promotionController.bulkPromoteStudents);
router.get('/students/:classId/:sectionId', promotionController.getStudentsByClassAndSection);

module.exports = router;
