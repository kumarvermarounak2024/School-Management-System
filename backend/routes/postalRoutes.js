const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});
const router = express.Router();
const {
  createPostalRecord,
  getAllPostalRecords,
  getPostalRecordById,
  updatePostalRecord,
  deletePostalRecord,
} = require("../controllers/postalController");

router.post(
  "/createPostal",
  upload.single("document_file"),
  createPostalRecord
);
router.get("/getAllPostal", getAllPostalRecords);
router.get("/getPOstalById/:id", getPostalRecordById);
router.put(
  "/updatePostalById/:id",
  upload.single("document_file"),
  updatePostalRecord
);
router.delete("/deletePostalById/:id", deletePostalRecord);

module.exports = router;
