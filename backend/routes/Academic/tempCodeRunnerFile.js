const express = require("express");
const router = express.Router();

const {
  createSimpleReceiptPaymentFinal,
  getAllSimpleReceiptPayments,
  getSimpleReceiptPaymentById,
  updateSimpleReceiptPayment,
  deleteSimpleReceiptPayment
} = require("../../controllers/Accounts/simpleReceiptPaymentFinalController");

router.post("/create", createSimpleReceiptPaymentFinal);
router.get("/getAll", getAllSimpleReceiptPayments);
router.get("/:id", getSimpleReceiptPaymentById);
router.put("/update/:id", updateSimpleReceiptPayment);
router.delete("/delete/:id", deleteSimpleReceiptPayment);

module.exports = router;
