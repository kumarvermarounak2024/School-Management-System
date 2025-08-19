const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  createCertificate,
  getCertificates,
  deleteCertificate,
  getCertificateById
} = require("../../controllers/Certificate/certificateController");

const fileUpload = upload.fields([
  { name: "signature", maxCount: 1 },
  { name: "logo", maxCount: 1 },
  { name: "background", maxCount: 1 },
]);

router.post("/create", fileUpload, createCertificate);
router.get("/getall", getCertificates);
router.get("/update/:id", getCertificateById);
router.delete("/delete/:id", deleteCertificate);

module.exports = router;

