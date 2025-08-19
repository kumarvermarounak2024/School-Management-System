const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createContraTransaction,
  getAllContraTransactions,
  getContraTransactionById,
  updateContraTransaction,
  deleteContraTransaction,
  getNextContraNumber
} = require("../../controllers/Accounting/contraController");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new Contra Transaction with file upload
router.post("/create", upload.single("Attachment"), createContraTransaction);

// Get all Contra Transactions
router.get("/getAll", getAllContraTransactions);

// Get Contra Transaction by ID
router.get("/get/:id", getContraTransactionById);

// Update Contra Transaction with file upload
router.put("/update/:id", upload.single("Attachment"), updateContraTransaction);

// Delete Contra Transaction
router.delete("/delete/:id", deleteContraTransaction);

// Generate next unique Contra Number
router.get("/generate/next", getNextContraNumber);

module.exports = router;
