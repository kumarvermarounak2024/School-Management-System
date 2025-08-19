const ContraTransaction = require("../../models/Accounting/contraModel");
const { uploadDocument } = require("../../config/cloudinary");
// const multer = require("multer");

// const storage = multer.memoryStorage();
// const upload = multer({ storage }).single("Attachment");

// Generate unique Contra number
exports.createContraTransaction = async (req, res) => {
  try {
    const { Date, contraNo, fromAccount, fromAmount, toAccount, toAmount, narration } = req.body;

    if (!Date || !fromAccount || !fromAmount || !toAccount || !toAmount) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let finalContraNo;
    if (contraNo?.trim()) {
      const exists = await ContraTransaction.findOne({ contraNo: contraNo.trim() });
      finalContraNo = exists ? await ContraTransaction.generateUniqueContraNumber() : contraNo.trim();
    } else {
      finalContraNo = await ContraTransaction.generateUniqueContraNumber();
    }

    let attachment = "";
    if (req.file) {
      const uploadResult = await uploadDocument(
        req.file.buffer,
        "contra_transaction_attachments",
        req.file.originalname,
        req.file.mimetype
      );
      if (uploadResult?.url) {
        attachment = uploadResult.url;
      } else {
        return res.status(500).json({ message: "Failed to upload attachment" });
      }
    }

    const newContra = new ContraTransaction({
      Date,
      contraNo: finalContraNo,
      fromAccount,
      fromAmount,
      toAccount,
      toAmount,
      narration: narration || "",
      attachment
    });

    const saved = await newContra.save();
    const populated = await ContraTransaction.findById(saved._id)
      .populate("fromAccount", "ledgerName")
      .populate("toAccount", "ledgerName");

    res.status(201).json({
      message: "Contra transaction created successfully!",
      data: populated,
      generatedContraNo: finalContraNo !== contraNo ? finalContraNo : null
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get all
exports.getAllContraTransactions = async (req, res) => {
  try {
    const data = await ContraTransaction.find()
      .sort({ createdAt: -1 })
      .populate("fromAccount", "ledgerName")
      .populate("toAccount", "LedgerName");

    res.json({ message: "All contra transactions retrieved", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get by ID
exports.getContraTransactionById = async (req, res) => {
  try {
    const contra = await ContraTransaction.findById(req.params.id)
      .populate("fromAccount", "LedgerName")
      .populate("toAccount", "LedgerName");

    if (!contra) return res.status(404).json({ message: "Contra transaction not found" });

    res.json({ message: "Contra transaction retrieved", data: contra });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update
exports.updateContraTransaction = async (req, res) => {
  try {
    const { Date, contraNo, fromAccount, fromAmount, toAccount, toAmount, narration } = req.body;

    const updateData = {
      Date,
      contraNo,
      fromAccount,
      fromAmount,
      toAccount,
      toAmount,
      narration
    };

    if (req.file) {
      const uploadResult = await uploadDocument(
        req.file.buffer,
        "contra_transaction_attachments",
        req.file.originalname,
        req.file.mimetype
      );
      if (uploadResult?.url) {
        updateData.attachment = uploadResult.url;
      }
    }

    const updated = await ContraTransaction.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    })
      .populate("fromAccount", "ledgerName")
      .populate("toAccount", "ledgerName");

    if (!updated) return res.status(404).json({ message: "Contra transaction not found" });

    res.json({ message: "Contra transaction updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete
exports.deleteContraTransaction = async (req, res) => {
  try {
    const deleted = await ContraTransaction.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Contra transaction not found" });
    res.json({ message: "Contra transaction deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get next contra number
exports.getNextContraNumber = async (req, res) => {
  try {
    const contraNo = await ContraTransaction.generateUniqueContraNumber();
    res.status(200).json({ message: "Next contra number generated", contraNo });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate contra number", error: error.message });
  }
};
