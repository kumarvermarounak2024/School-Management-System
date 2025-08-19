
const mongoose = require('mongoose');

const accountingLedgerSchema = new mongoose.Schema({
  // Changed from LedgerName to ledgerName
  ledgerName: {
    type: String,
    required: true,
    trim: true,
  },
  // Changed from GroupName to groupName
  groupName: {
    type: String,
    required: true,
    trim: true,
  },
  // Changed from Type to type
  type: {
    type: String,
    required: true,
    enum: ['Expense', 'Income', 'Assets', 'Liabilities'],
  },
  // Changed from OpeningBalance to openingBalance
  openingBalance: {
    type: Number,
    required: true,
  },
  // Changed from Accounting to accounting
  accounting: {
    type: String,
    required: true,
    enum: ['Dr.', 'Cr.'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AccountingLedger', accountingLedgerSchema);
