// routes/receipt.routes.js
const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Destructure controller methods
const {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt
} = require("../../controllers/Accounting/receiptController");

// Define routes
router.post("/create", upload.single("attachment"), createReceipt);
router.get("/getAll", getAllReceipts);
router.get("/get/:id", getReceiptById);
// router.put("/update/:id", updateReceipt);
router.delete("/delete/:id", deleteReceipt);

router.put("/update/:id", upload.single("attachment"), updateReceipt);


module.exports = router;
