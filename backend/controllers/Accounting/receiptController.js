const Receipt = require("../../models/Accounting/receiptModel");
const { uploadDocument } = require("../../config/cloudinary");

exports.createReceipt = async (req, res) => {
  try {
    const {
      Date,
      receiptNo,
      account,
      accountAmount,
      receiptName,
      amount,
      narration,
    } = req.body;

    let attachmentUrl = "";
    if (req.file) {
      const { buffer, originalname, mimetype } = req.file;
      const result = await uploadDocument(buffer, "receipts", originalname, mimetype);
      attachmentUrl = result.url;
    }

    const newReceipt = new Receipt({
      Date,
      receiptNo,
      account,
      accountAmount,
      receiptName,
      amount,
      narration,
      attachment: attachmentUrl,
    });

    const saved = await newReceipt.save();
    const populated = await Receipt.findById(saved._id)
      .populate("account", "ledgerName")
      // .populate("receiptName", "name");

    res.status(201).json({ message: "Receipt created", data: populated });
  } catch (error) {
    console.error("Create receipt error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Get All Receipts
exports.getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .sort({ createdAt: -1 })
      .populate('account', 'ledgerName')
      // .populate('receiptName', 'ledgerName');
    res.json({ message: "All receipts retrieved", data: receipts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Receipt by ID
exports.getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('account', 'ledgerName')
      // .populate('receiptName', 'ledgerName');
    if (!receipt) return res.status(404).json({ message: "Receipt not found" });
    res.json({ message: "Receipt retrieved", data: receipt });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Receipt
// exports.updateReceipt = async (req, res) => {
//   try {
//     const updated = await Receipt.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     }).populate('account', 'ledgerName')
//       .populate('receiptName', 'ledgerName');

//     if (!updated) return res.status(404).json({ message: "Receipt not found" });
//     res.json({ message: "Receipt updated", data: updated });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// Delete Receipt
exports.deleteReceipt = async (req, res) => {
  try {
    const deleted = await Receipt.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Receipt not found" });
    res.json({ message: "Receipt deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateReceipt = async (req, res) => {
  try {
    const receiptId = req.params.id;

    // Fetch existing receipt
    const existingReceipt = await Receipt.findById(receiptId);
    if (!existingReceipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    let attachmentUrl = existingReceipt.attachment;

    // Handle new file upload
    if (req.file) {
      const { buffer, originalname, mimetype } = req.file;


      const result = await uploadDocument(buffer, "receipts", originalname, mimetype);
      attachmentUrl = result.url;
    }

    const updatedFields = {
      Date: req.body.Date || existingReceipt.Date,
      receiptNo: req.body.receiptNo || existingReceipt.receiptNo,
      account: req.body.account || existingReceipt.account,
      accountAmount: req.body.accountAmount || existingReceipt.accountAmount,
      receiptName: req.body.receiptName || existingReceipt.receiptName,
      amount: req.body.amount || existingReceipt.amount,
      narration: req.body.narration || existingReceipt.narration,
      attachment: attachmentUrl,
    };

    const updated = await Receipt.findByIdAndUpdate(receiptId, updatedFields, {
      new: true,
    })
      .populate("account", "ledgerName")
      // .populate("receiptName", "name");

    res.status(200).json({ message: "Receipt updated", data: updated });
  } catch (error) {
    console.error("Update receipt error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};