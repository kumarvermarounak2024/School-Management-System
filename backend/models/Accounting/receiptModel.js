// const mongoose = require("mongoose");

// const receiptNo = new mongoose.Schema(
//   {
//     Date: {
//       type: Date,
//       required: true,
//     },
//     receiptNo: {
//       type: String,
//       required: true,
//       trim: true,
//       unique: true,
//     },
//     account: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "AccountingLedger",
//       required: true,
//     },
//     accountAmount: {
//       type: Number,
//       required: true,
//     },
//     receiptName: {
//       type: String,

//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     narration: {
//       type: String,
//       trim: true,
//     },
//     attachment: {
//       type: String,
//     },
//   },
  
// );
// // module.exports = mongoose.model("receiptNo", receiptNo);
// module.exports = mongoose.model("Receipt", receiptNo);



const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  Date: {
    type: Date,
    required: true,
  },
  receiptNo: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AccountingLedger",
    required: true,
  },
  accountAmount: {
    type: Number,
    required: true,
  },
  receiptName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  narration: {
    type: String,
    trim: true,
  },
  attachment: {
    type: String,
  },
});

module.exports = mongoose.model("Receipt", receiptSchema); // ✅ Model name must be "Receipt"

