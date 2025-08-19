// const express = require("express");
// const router = express.Router();

// const {
//   createReceiptPayment,
//   getAllReceiptPayments,
//   getReceiptPaymentById,
//   updateReceiptPayment,
//   deleteReceiptPayment
// } = require("../../controllers/Accounting/receiptandpaymentController");

// router.post("/create", createReceiptPayment);
// router.get("/getAll", getAllReceiptPayments);
// router.get("/get/:id", getReceiptPaymentById);
// router.put("/update/:id", updateReceiptPayment);
// router.delete("/delete/:id", deleteReceiptPayment);

// const express = require("express");
// const router = express.Router();

// const {
//   createSimpleReceiptPaymentFinal,
//   getAllSimpleReceiptPayments,
//   getSimpleReceiptPaymentById,
//   updateSimpleReceiptPayment,
//   deleteSimpleReceiptPayment
// } = require("../../controllers/Accounts/simpleReceiptPaymentFinalController");

// router.post("/create", createSimpleReceiptPaymentFinal);
// router.get("/all", getAllSimpleReceiptPayments);
// router.get("/:id", getSimpleReceiptPaymentById);
// router.put("/update/:id", updateSimpleReceiptPayment);
// router.delete("/delete/:id", deleteSimpleReceiptPayment);

// module.exports = router;

// routes/Accounting/simpleReceiptPaymentRoutes.js

const express = require('express');
const router = express.Router();

const {
  createSimpleReceiptPaymentFinal,
  getAllSimpleReceiptPayments,
  getSimpleReceiptPaymentById,
  updateSimpleReceiptPayment,
  deleteSimpleReceiptPayment
} = require('../../controllers/Accounting/receiptandpaymentController');

// 🌟 Simple Receipt & Payment Final Routes

// Create
router.post('/create', createSimpleReceiptPaymentFinal);

// Get All
router.get('/getAll', getAllSimpleReceiptPayments);

// Get by ID
router.get('/get/:id', getSimpleReceiptPaymentById);

// Update
router.put('/update/:id', updateSimpleReceiptPayment);

// Delete
router.delete('/delete/:id', deleteSimpleReceiptPayment);

module.exports = router;
