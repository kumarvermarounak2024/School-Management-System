const express = require("express");
const {
  createJournalTransaction,
  getAllJournalTransactions,
  getJournalTransactionById,
  updateJournalTransaction,
  deleteJournalTransaction,
  getNextJournalNo
} = require("../../controllers/Accounting/journalController");

const router = express.Router();

router.post("/create", createJournalTransaction);
router.get("/getAll", getAllJournalTransactions);
router.get("/get/:id", getJournalTransactionById);
router.put("/update/:id", updateJournalTransaction);
router.delete("/delete/:id", deleteJournalTransaction);
router.get("/generate/next-journal-no", getNextJournalNo);

module.exports = router;
