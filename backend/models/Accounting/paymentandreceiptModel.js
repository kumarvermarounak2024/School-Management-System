// // const mongoose = require("mongoose");

// // const receiptItemSchema = new mongoose.Schema({
// //   head: { type: String, required: true },       // e.g., "Cash", "Bank", "School Fees"
// //   amount: { type: Number, required: true }
// // });

// // const paymentItemSchema = new mongoose.Schema({
// //   head: { type: String, required: true },       
// //   amount: { type: Number, required: true }
// // });

// // const receiptPaymentSchema = new mongoose.Schema(
// //   {
// //     financialYear: { type: String, required: true }, 
// //     dateGenerated: { type: Date, default: Date.now },

// //     // Corrected references to other collections
// //     receipt: [{ type: mongoose.Schema.Types.ObjectId, ref: "receiptNo" }],
// //     payment: [{ type: mongoose.Schema.Types.ObjectId, ref: "TransactionPayment" }],

// //     totalReceipt: { type: Number, required: true },
// //     totalPayment: { type: Number, required: true },

// //     closingBalance: {
// //       cash: { type: Number, default: 0 },
// //       bank: { type: Number, default: 0 }
// //     },

// //     schoolName: { type: String, default: "School Name" }
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("ReceiptPayment", receiptPaymentSchema);


// const mongoose = require("mongoose");

// // Sub-schemas for detailed receipt and payment items
// const receiptItemSchema = new mongoose.Schema({
//   head: { type: String, required: true },       // e.g., "Cash", "Bank", "School Fees"
//   ledgerAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Ledger" }, // Reference to ledger
//   amount: { type: Number, required: true },
//   description: { type: String } // Optional description
// });

// const paymentItemSchema = new mongoose.Schema({
//   head: { type: String, required: true },       
//   ledgerAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Ledger" }, // Reference to ledger
//   amount: { type: Number, required: true },
//   description: { type: String } // Optional description
// });

// const receiptPaymentSchema = new mongoose.Schema(
//   {
//     financialYear: { type: String, required: true }, 
//     dateGenerated: { type: Date, default: Date.now },
//     fromDate: { type: Date, required: true }, // Period start
//     toDate: { type: Date, required: true },   // Period end

//     // Receipt details - can be references OR embedded items
//     receiptTransactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "receiptNo" }],
//     receiptItems: [receiptItemSchema], // Detailed breakdown
    
//     // Payment details - can be references OR embedded items  
//     paymentTransactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "TransactionPayment" }],
//     paymentItems: [paymentItemSchema],

//     // Totals
//     totalReceipt: { type: Number, required: true },
//     totalPayment: { type: Number, required: true },
//     netAmount: { type: Number }, 

//     // Opening balances (from previous period)
//     openingBalance: {
//       cash: { type: Number, default: 0 },
//       bank: { type: Number, default: 0 },
//       total: { type: Number, default: 0 }
//     },

//     // Closing balances (for this period)
//     closingBalance: {
//       cash: { type: Number, default: 0 },
//       bank: { type: Number, default: 0 },
//       total: { type: Number, default: 0 }
//     },

//     // School information
//     schoolName: { type: String, default: "School Name" },
//     schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    
//     // Additional metadata
//     preparedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     status: { 
//       type: String, 
//       enum: ['draft', 'finalized', 'approved'], 
//       default: 'draft' 
//     },
    
//     // Bank details (if needed for specific bank accounts)
//     bankAccounts: [{
//       bankName: { type: String },
//       accountNumber: { type: String },
//       ledgerRef: { type: mongoose.Schema.Types.ObjectId, ref: "ledgerName" },
//       openingBalance: { type: Number, default: 0 },
//       closingBalance: { type: Number, default: 0 }
//     }]
//   },
//   { 
//     timestamps: true,
//     // Add indexes for better query performance
//     indexes: [
//       { financialYear: 1, fromDate: 1, toDate: 1 },
//       { schoolId: 1, financialYear: 1 },
//       { status: 1 }
//     ]
//   }
// );

// // Virtual to calculate net amount
// receiptPaymentSchema.virtual('calculatedNetAmount').get(function() {
//   return this.totalReceipt - this.totalPayment;
// });

// // Pre-save middleware to calculate totals
// receiptPaymentSchema.pre('save', function(next) {
//   // Calculate totals from items if they exist
//   if (this.receiptItems && this.receiptItems.length > 0) {
//     this.totalReceipt = this.receiptItems.reduce((sum, item) => sum + item.amount, 0);
//   }
  
//   if (this.paymentItems && this.paymentItems.length > 0) {
//     this.totalPayment = this.paymentItems.reduce((sum, item) => sum + item.amount, 0);
//   }
  
//   // Calculate net amount
//   this.netAmount = this.totalReceipt - this.totalPayment;
  
//   // Calculate closing balances
//   this.closingBalance.total = this.openingBalance.total + this.netAmount;
  
//   next();
// });

// // Static method to generate receipt & payment account
// receiptPaymentSchema.statics.generateAccount = async function(schoolId, financialYear, fromDate, toDate) {
//   // This would contain logic to:
//   // 1. Fetch all receipts and payments for the period
//   // 2. Calculate totals
//   // 3. Determine opening/closing balances
//   // 4. Create the account document
  
//   // Example implementation skeleton:
//   /*
//   const receipts = await Receipt.find({
//     schoolId,
//     date: { $gte: fromDate, $lte: toDate }
//   });
  
//   const payments = await Payment.find({
//     schoolId,
//     date: { $gte: fromDate, $lte: toDate }
//   });
  
//   // Process and create account...
//   */
// };

// module.exports = mongoose.model("ReceiptPayment", receiptPaymentSchema);




const mongoose = require("mongoose");

const simpleRPschema = new mongoose.Schema({
  financialYear: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },

  receiptTransactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Receipt" }],
  paymentTransactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "TransactionPayment" }],

  totalReceipt: { type: Number, default: 0 },
  totalPayment: { type: Number, default: 0 },
  netAmount: { type: Number, default: 0 },

  closingBalance: {
    cash: { type: Number, default: 0 },
    bank: { type: Number, default: 0 }
  },

  schoolName: { type: String, default: "School Name" },
  status: {
    type: String,
    enum: ["draft", "finalized"],
    default: "draft"
  }
}, { timestamps: true });

// Auto-calculate totals before saving
simpleRPschema.pre("save", async function (next) {
  const Receipt = mongoose.model("Receipt");
  const TransactionPayment = mongoose.model("TransactionPayment");

  let totalReceipt = 0;
  for (const id of this.receiptTransactions) {
    const receipt = await Receipt.findById(id);
    if (receipt) totalReceipt += receipt.amount;
  }

  let totalPayment = 0;
  for (const id of this.paymentTransactions) {
    const payment = await TransactionPayment.findById(id);
    if (payment && payment.paymentItems) {
      totalPayment += payment.paymentItems.reduce((sum, item) => sum + item.amount, 0);
    }
  }

  this.totalReceipt = totalReceipt;
  this.totalPayment = totalPayment;
  this.netAmount = totalReceipt - totalPayment;

  // Example logic to split net into cash/bank for display
  const closingHalf = this.netAmount / 2;
  this.closingBalance.cash = closingHalf;
  this.closingBalance.bank = closingHalf;

  next();
});

module.exports = mongoose.model("SimpleReceiptPaymentFinal", simpleRPschema);