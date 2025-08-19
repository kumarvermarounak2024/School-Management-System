const express = require('express');
const router = express.Router();

const { createAward, getAllAwards, deleteAllAwards, updateAward, deleteAwardById } = require('../../controllers/Human_Resources_Controller/awardController');

router.post('/create', createAward);
router.get('/all', getAllAwards);
router.delete("/delete-all", deleteAllAwards);
router.put("/:id", updateAward);
router.delete("/:id", deleteAwardById);

module.exports = router;
