const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const paymentFileFields = upload.fields([{ name: "attachment", maxCount: 1 }]);

const {
  createTransactionPayment,
  getAllTransactionPayments,
  getTransactionPaymentById,
  updateTransactionPayment,
  deleteTransactionPayment,
  getNextPaymentNumber,
} = require("../../controllers/Accounting/paymentController");

// 🌟 Transaction Payment Routes

// Create with file upload middleware
router.post("/create", paymentFileFields, createTransactionPayment);

// Read All
router.get("/getAll", getAllTransactionPayments);

// Read by ID
router.get("/get/:id", getTransactionPaymentById);

// Update
router.put("/update/:id", updateTransactionPayment);

// Delete
router.delete("/delete/:id", deleteTransactionPayment);

// Get next auto-generated Payment No
router.get("/next-payment-no", getNextPaymentNumber);

module.exports = router;
