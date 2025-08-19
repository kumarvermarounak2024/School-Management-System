// const TransactionPayment = require("../../models/Accounting/paymentModel");
// const { uploadDocument } = require("../../config/cloudinary");// const storage = multer.memoryStorage();
// // const upload = multer({ storage }).single("Attachment");
// // Utility: Generate unique payment number
// TransactionPayment.generateUniquePaymentNumber = async function () {
//   let unique = false;
//   let paymentNo = "";
//   while (!unique) {
//     paymentNo = `PAY-${Math.floor(1000000 + Math.random() * 9000000)}`;
//     const exists = await this.findOne({ paymentNo });
//     if (!exists) unique = true;
//   }
//   return paymentNo;
// };

// // Create Transaction Payment
// // Create Transaction Payment
// exports.createTransactionPayment = async (req, res) => {
//   try {
//     const {
//       date, // small d
//       paymentNumber,
//       accountAmount, // actually ledgerId
//       amount, // actually numeric amount
//       expenseName,
//       expenseAmount,
//       narration,
//     } = req.body;

//     console.log(req.body, " req.body", req.files?.attachment?.[0]);

//     // validate required fields
//     if (!date || !accountAmount || !amount || !expenseName || !expenseAmount) {
//       return res.status(400).json({ message: "Missing required fields." });
//     }

//     let finalPaymentNo;

//     if (paymentNumber?.trim()) {
//       const exists = await TransactionPayment.findOne({
//         paymentNo: paymentNumber.trim(),
//       });
//       if (!exists) {
//         finalPaymentNo = paymentNumber.trim();
//       } else {
//         finalPaymentNo = await TransactionPayment.generateUniquePaymentNumber();
//       }
//     } else {
//       finalPaymentNo = await TransactionPayment.generateUniquePaymentNumber();
//     }

//     let attachment = null;
//     if (req.files?.attachment?.[0]) {
//       const uploadResult = await uploadDocument(
//         req.files.attachment[0].buffer,
//         "transaction_payment_attachments",
//         req.files.attachment[0].originalname,
//         req.files.attachment[0].mimetype
//       );

//       console.log("uploadResult:", uploadResult);

//       if (uploadResult?.url) {
//         attachment = {
//           public_id: uploadResult.public_id,
//           url: uploadResult.url,
//           format: uploadResult.format,
//           resource_type: uploadResult.resource_type,
//         };
//       } else {
//         return res.status(500).json({ message: "Failed to upload attachment" });
//       }
//     }

//     console.log("Final Payment No:", finalPaymentNo);

//     const newTransaction = new TransactionPayment({
//       Date: date,
//       paymentNo: finalPaymentNo,
//       account: amount, // ledgerId
//       accountAmount, // numeric amount
//       expenseName: amount,
//       expenseAmount,
//       narration: narration || "",
//       attachment,
//     });

//     const saved = await newTransaction.save();
//     const populated = await TransactionPayment.findById(saved._id)
//       .populate("account", "ledgerName")
//       .populate("expenseName", "ledgerName");

//     res.status(201).json({
//       message: "Transaction payment created successfully!",
//       data: populated,
//       generatedPaymentNo: finalPaymentNo !== paymentNumber ? finalPaymentNo : null,
//     });
//   } catch (error) {
//     console.error("Create error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Get all
// exports.getAllTransactionPayments = async (req, res) => {
//   try {
//     const data = await TransactionPayment.find()
//       .sort({ createdAt: -1 })
//       .populate("account", "ledgerName")
//       .populate("expenseName", "ledgerName");

//     res.json({ message: "All transaction payments retrieved", data });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Get by ID
// exports.getTransactionPaymentById = async (req, res) => {
//   try {
//     const transaction = await TransactionPayment.findById(req.params.id)
//       .populate("account", "ledgerName")
//       .populate("expenseName", "ledgerName");

//     if (!transaction) return res.status(404).json({ message: "Transaction not found" });

//     res.json({ message: "Transaction payment retrieved", data: transaction });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Update
// exports.updateTransactionPayment = async (req, res) => {
//   upload(req, res, async function (err) {
//     if (err) return res.status(500).json({ message: "File upload error", error: err.message });

//     try {
//       const {
//         Date,
//         paymentNo,
//         account,
//         accountAmount,
//         expenseName,
//         expenseAmount,
//         narration
//       } = req.body;

//       const updateData = {
//         Date,
//         paymentNo,
//         account,
//         accountAmount,
//         expenseName,
//         expenseAmount,
//         narration
//       };

//       if (req.file) {
//         const uploadResult = await uploadDocument(
//           req.file.buffer,
//           "transaction_payment_attachments",
//           req.file.originalname,
//           req.file.mimetype
//         );
//         if (uploadResult?.url) {
//           updateData.attachment = uploadResult.url;
//         }
//       }

//       const updated = await TransactionPayment.findByIdAndUpdate(req.params.id, updateData, {
//         new: true,
//         runValidators: true
//       }).populate("account", "ledgerName")
//         .populate("expenseName", "ledgerName");

//       if (!updated) return res.status(404).json({ message: "Transaction not found" });

//       res.json({ message: "Transaction payment updated", data: updated });
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   });
// };

// // Delete
// exports.deleteTransactionPayment = async (req, res) => {
//   try {
//     const deleted = await TransactionPayment.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Transaction not found" });
//     res.json({ message: "Transaction payment deleted", data: deleted });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Get next payment number
// exports.getNextPaymentNumber = async (req, res) => {
//   try {
//     const paymentNo = await TransactionPayment.generateUniquePaymentNumber();
//     res.status(200).json({ message: "Next payment number generated", paymentNo });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to generate payment number", error: error.message });
//   }
// };

const TransactionPayment = require("../../models/Accounting/paymentModel");
const { uploadDocument } = require("../../config/cloudinary");

// const storage = multer.memoryStorage();
// const upload = multer({ storage }).single("Attachment");
// Utility: Generate unique payment number
TransactionPayment.generateUniquePaymentNumber = async function () {
  let unique = false;
  let paymentNo = "";
  while (!unique) {
    paymentNo = `PAY-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const exists = await this.findOne({ paymentNo });
    if (!exists) unique = true;
  }
  return paymentNo;
};

// Create Transaction Payment
exports.createTransactionPayment = async (req, res) => {
  try {
    const {
      date, // Schema uses lowercase 'date'
      paymentNo,
      account,
      accountAmount,
      expenseName,
      expenseAmount,
      narration,
    } = req.body;

    console.log(req.body, " req.body", req.files?.attachment?.[0]);

    // Validate required fields
    if (!date || !account || !accountAmount || !expenseName || !expenseAmount) {
      return res.status(400).json({ 
        message: "Missing required fields.",
        required: ["date", "account", "accountAmount", "expenseName", "expenseAmount"],
        received: { date, account, accountAmount, expenseName, expenseAmount }
      });
    }

    let finalPaymentNo;

    if (paymentNo?.trim()) {
      const exists = await TransactionPayment.findOne({
        paymentNo: paymentNo.trim(),
      });
      if (!exists) {
        finalPaymentNo = paymentNo.trim();
      } else {
        finalPaymentNo = await TransactionPayment.generateUniquePaymentNumber();
      }
    } else {
      finalPaymentNo = await TransactionPayment.generateUniquePaymentNumber();
    }

    let attachment = null;
    if (req.files?.attachment?.[0]) {
      const uploadResult = await uploadDocument(
        req.files.attachment[0].buffer,
        "transaction_payment_attachments",
        req.files.attachment[0].originalname,
        req.files.attachment[0].mimetype
      );

      console.log("uploadResult:", uploadResult);

      if (uploadResult?.url) {
        attachment = {
          public_id: uploadResult.public_id,
          url: uploadResult.url,
          format: uploadResult.format,
          resource_type: uploadResult.resource_type,
        };
      } else {
        return res.status(500).json({ message: "Failed to upload attachment" });
      }
    }

    console.log("Final Payment No:", finalPaymentNo);

    const newTransaction = new TransactionPayment({
      date: date, // Schema field name is lowercase
      paymentNo: finalPaymentNo,
      account: account,
      accountAmount: accountAmount,
      expenseName: expenseName, // Now a String, not ObjectId
      expenseAmount: expenseAmount,
      narration: narration || "",
      attachment,
    });

    const saved = await newTransaction.save();
    // Only populate account since expenseName is now a String
    const populated = await TransactionPayment.findById(saved._id)
      .populate("account", "ledgerName");

    res.status(201).json({
      message: "Transaction payment created successfully!",
      data: populated,
      generatedPaymentNo: finalPaymentNo !== paymentNo ? finalPaymentNo : null,
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all
exports.getAllTransactionPayments = async (req, res) => {
  try {
    const data = await TransactionPayment.find()
      .sort({ createdAt: -1 })
      .populate("account", "ledgerName");
      // Removed expenseName populate since it's now a String

    res.json({ message: "All transaction payments retrieved", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get by ID
exports.getTransactionPaymentById = async (req, res) => {
  try {
    const transaction = await TransactionPayment.findById(req.params.id)
      .populate("account", "ledgerName");
      // Removed expenseName populate since it's now a String

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Transaction payment retrieved", data: transaction });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update
exports.updateTransactionPayment = async (req, res) => {
  try {
    const {
      date, // Schema uses lowercase 'date'
      paymentNo,
      account,
      accountAmount,
      expenseName,
      expenseAmount,
      narration
    } = req.body;

    const updateData = {
      date, // Schema field name is lowercase
      paymentNo,
      account,
      accountAmount,
      expenseName,
      expenseAmount,
      narration
    };

    // Handle file upload if present
    let attachment = null;
    if (req.files?.attachment?.[0]) {
      const uploadResult = await uploadDocument(
        req.files.attachment[0].buffer,
        "transaction_payment_attachments",
        req.files.attachment[0].originalname,
        req.files.attachment[0].mimetype
      );

      if (uploadResult?.url) {
        updateData.attachment = {
          public_id: uploadResult.public_id,
          url: uploadResult.url,
          format: uploadResult.format,
          resource_type: uploadResult.resource_type,
        };
      }
    }

    const updated = await TransactionPayment.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate("account", "ledgerName");
    // Removed expenseName populate since it's now a String

    if (!updated) return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Transaction payment updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete
exports.deleteTransactionPayment = async (req, res) => {
  try {
    const deleted = await TransactionPayment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction payment deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get next payment number
exports.getNextPaymentNumber = async (req, res) => {
  try {
    const paymentNo = await TransactionPayment.generateUniquePaymentNumber();
    res.status(200).json({ message: "Next payment number generated", paymentNo });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate payment number", error: error.message });
  }
};