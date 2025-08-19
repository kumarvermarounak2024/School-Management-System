const JournalTransaction = require("../../models/Accounting/journalModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/journals";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage }).single("Attachment");

// CREATE
exports.createJournalTransaction = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) return res.status(500).json({ message: "File upload error", error: err.message });

    try {
      const { Date, journalNo, fromAccount, amount, toAccount, toAmount, narration } = req.body;

      if (!Date || !fromAccount || !amount || !toAccount || !toAmount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      let finalJournalNo;
      if (journalNo?.trim()) {
        const exists = await JournalTransaction.findOne({ journalNo: journalNo.trim() });
        finalJournalNo = exists ? await JournalTransaction.generateUniqueJournalNo() : journalNo.trim();
      } else {
        finalJournalNo = await JournalTransaction.generateUniqueJournalNo();
      }

      const attachment = req.file ? req.file.path : "";

      const newJournal = new JournalTransaction({
        Date,
        journalNo: finalJournalNo,
        fromAccount,
        amount,
        toAccount,
        toAmount,
        narration: narration || "",
        attachment,
      });

      const saved = await newJournal.save();
      const populated = await JournalTransaction.findById(saved._id)
        .populate("fromAccount", "ledgerName")
        .populate("toAccount", "ledgerName");

      res.status(201).json({
        message: "Journal transaction created successfully!",
        data: populated,
        generatedJournalNo: finalJournalNo !== journalNo ? finalJournalNo : null,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// GET ALL
exports.getAllJournalTransactions = async (req, res) => {
  try {
    const data = await JournalTransaction.find()
      .sort({ createdAt: -1 })
      .populate("fromAccount", "ledgerName")
      .populate("toAccount", "ledgerName");

    res.json({ message: "All journal transactions retrieved", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET BY ID
exports.getJournalTransactionById = async (req, res) => {
  try {
    const journal = await JournalTransaction.findById(req.params.id)
      .populate("fromAccount", "ledgerName")
      .populate("toAccount", "ledgerName");

    if (!journal) return res.status(404).json({ message: "Journal not found" });

    res.json({ message: "Journal transaction retrieved", data: journal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE
exports.updateJournalTransaction = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) return res.status(500).json({ message: "File upload error", error: err.message });

    try {
      const { Date, journalNo, fromAccount, amount, toAccount, toAmount, narration } = req.body;

      const updateData = {
        Date,
        journalNo,
        fromAccount,
        amount,
        toAccount,
        toAmount,
        narration,
      };

      if (req.file) {
        updateData.attachment = req.file.path;
      }

      const updated = await JournalTransaction.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      })
        .populate("fromAccount", "ledgerName")
        .populate("toAccount", "ledgerName");

      if (!updated) return res.status(404).json({ message: "Journal transaction not found" });

      res.json({ message: "Journal transaction updated", data: updated });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// DELETE
exports.deleteJournalTransaction = async (req, res) => {
  try {
    const deleted = await JournalTransaction.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Journal not found" });

    res.json({ message: "Journal transaction deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET NEXT JOURNAL NO
exports.getNextJournalNo = async (req, res) => {
  try {
    const journalNo = await JournalTransaction.generateUniqueJournalNo();
    res.status(200).json({ message: "Next journal number generated", journalNo });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate journal number", error: error.message });
  }
};
