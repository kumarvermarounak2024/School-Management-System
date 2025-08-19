const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage(); 
const upload = multer({ storage });
const {
  createIdCardTemplate,
  getAllIdCardTemplates,
  getIdCardTemplateById,
  deleteIdCardTemplate,
  updateIdCardTemplate,
} = require("../controllers/ID_CardController/idcardTemplateController");

// Upload multiple fields with different names
const uploadFields = upload.fields([
  { name: "signatureImage", maxCount: 1 },
  { name: "logoImage", maxCount: 1 },
  { name: "backgroundImage", maxCount: 1 },
]);

router.post("/create", uploadFields, createIdCardTemplate);
router.get("/getAll", getAllIdCardTemplates);
router.get("/get/:id", getIdCardTemplateById);
router.put("/update/:id", uploadFields, updateIdCardTemplate);
router.delete("/delete/:id", deleteIdCardTemplate);

module.exports = router;
