// const ReceiptModel = require("../../models/Accounting/receiptModel");
// const PaymentModel = require("../../models/Accounting/paymentModel");

// // Create Receipt & Payment Account (IDs only)
// exports.createSimpleReceiptPaymentFinal = async (req, res) => {
//   try {
//     const {
//       financialYear,
//       fromDate,
//       toDate,
//       receiptTransactions,
//       paymentTransactions,
//       schoolName,
//       status
//     } = req.body;

//     const newRecord = new SimpleReceiptPaymentFinal({
//       financialYear,
//       fromDate,
//       toDate,
//       receiptTransactions,
//       paymentTransactions,
//       schoolName,
//       status
//     });

//     await newRecord.save();

//     res.status(201).json({
//       message: "Receipt & Payment Account created successfully!",
//       data: newRecord
//     });
//   } catch (error) {
//     console.error("Create error:", error.message);
//     res.status(500).json({
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get all records
// exports.getAllSimpleReceiptPayments = async (req, res) => {
//   try {
//     const data = await SimpleReceiptPaymentFinal.find()
//       .populate("receiptTransactions")
//       .populate("paymentTransactions");

//     res.status(200).json({ message: "All records", data });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching data", error: error.message });
//   }
// };

// // Get by ID
// exports.getSimpleReceiptPaymentById = async (req, res) => {
//   try {
//     const record = await SimpleReceiptPaymentFinal.findById(req.params.id)
//       .populate("receiptTransactions")
//       .populate("paymentTransactions");

//     if (!record) {
//       return res.status(404).json({ message: "Not found" });
//     }

//     res.status(200).json({ message: "Found", data: record });
//   } catch (error) {
//     res.status(500).json({ message: "Error", error: error.message });
//   }
// };

// // Update by ID
// exports.updateSimpleReceiptPayment = async (req, res) => {
//   try {
//     const updated = await SimpleReceiptPaymentFinal.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "Not found" });
//     }

//     res.status(200).json({ message: "Updated successfully", data: updated });
//   } catch (error) {
//     res.status(500).json({ message: "Update failed", error: error.message });
//   }
// };

// // Delete by ID
// exports.deleteSimpleReceiptPayment = async (req, res) => {
//   try {
//     const deleted = await SimpleReceiptPaymentFinal.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ message: "Record not found" });
//     }
//     res.status(200).json({ message: "Deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Deletion error", error: error.message });
//   }
// };
const SimpleReceiptPaymentFinal = require("../../models/Accounting/paymentandreceiptModel");
const ReceiptModel = require("../../models/Accounting/receiptModel");
const PaymentModel = require("../../models/Accounting/paymentModel");


exports.createSimpleReceiptPaymentFinal = async (req, res) => {
  try {
    const {
      financialYear,
      fromDate,
      toDate,
      receiptTransactions,
      paymentTransactions,
      schoolName,
      status
    } = req.body;

    let totalReceipt = 0;
    for (const receiptId of receiptTransactions) {
      const receipt = await ReceiptModel.findById(receiptId);
      if (receipt) {
        totalReceipt += receipt.amount;
      }
    }

    let totalPayment = 0;
    for (const paymentId of paymentTransactions) {
      const payment = await PaymentModel.findById(paymentId);
      if (payment?.paymentItems?.length > 0) {
        totalPayment += payment.paymentItems.reduce((sum, item) => sum + item.amount, 0);
      }
    }

    const netAmount = totalReceipt - totalPayment;

    // Optional logic for closing balance
    const closingCash = netAmount / 2;
    const closingBank = netAmount / 2;

    const newRecord = new SimpleReceiptPaymentFinal({
      financialYear,
      fromDate,
      toDate,
      receiptTransactions,
      paymentTransactions,
      totalReceipt,
      totalPayment,
      netAmount,
      closingBalance: {
        cash: closingCash,
        bank: closingBank
      },
      schoolName,
      status
    });

    await newRecord.save();

    res.status(201).json({
      message: "Receipt & Payment Account created successfully!",
      data: newRecord
    });
  } catch (error) {
    console.error("Create error:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

// ✅ GET ALL records
exports.getAllSimpleReceiptPayments = async (req, res) => {
  try {
    const data = await SimpleReceiptPaymentFinal.find()
      .populate("receiptTransactions")
      .populate("paymentTransactions");

    res.status(200).json({ message: "All records", data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};

// ✅ GET by ID
exports.getSimpleReceiptPaymentById = async (req, res) => {
  try {
    const record = await SimpleReceiptPaymentFinal.findById(req.params.id)
      .populate("receiptTransactions")
      .populate("paymentTransactions");

    if (!record) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "Found", data: record });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};


exports.updateSimpleReceiptPayment = async (req, res) => {
  try {
    const updated = await SimpleReceiptPaymentFinal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "Updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};


exports.deleteSimpleReceiptPayment = async (req, res) => {
  try {
    const deleted = await SimpleReceiptPaymentFinal.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion error", error: error.message });
  }
};
