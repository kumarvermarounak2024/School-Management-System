const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/bookattachmentController');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

router.post('/create', upload.single('attachment'), attachmentController.createAttachment);
router.get('/getAll', attachmentController.getAllAttachments);
router.put('/update/:id', upload.single('attachment'), attachmentController.updateAttachment);
router.delete('/delete/:id', attachmentController.deleteAttachment);

module.exports = router;
