const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
  uploadStudentDocument,
  login,
} = require("../controllers/admissionController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const admissionFileFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "guardian_photo", maxCount: 1 },
  { name: "documents", maxCount: 10 },
]);

const admissionUpdateFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "guardian_photo", maxCount: 1 },
]);

const multipleDocumentUpload = upload.array("files", 10);

// Routes
router.post("/createAdmission", admissionFileFields, createAdmission);

router.get("/getAllAdmissions", getAllAdmissions);

router.get("/getAdmissionById/:id", getAdmissionById);

router.put("/updateAdmissionById/:id", admissionUpdateFields, updateAdmission);

router.delete("/deleteAdmissionById/:id", deleteAdmission);

router.post(
  "/upload/:admissionId",
  multipleDocumentUpload,
  uploadStudentDocument
);

// Login
router.post("/login", login);

module.exports = router;
