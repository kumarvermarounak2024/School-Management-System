const mongoose = require("mongoose");

const transactionPaymentSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    paymentNo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return v && v.trim().length > 0;
        },
        message: "PaymentNo cannot be empty",
      },
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
    expenseName: {
      // changed from ExpenseName
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "AccountingLedger",
      // required: true,

      type: String,
      required: true,
    },
    expenseAmount: {
      type: Number,
      required: true,
    },
    narration: {
      type: String,
      trim: true,
    },
    attachment: {
      public_id: String,
      url: String,
      format: String,
      resource_type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TransactionPayment", transactionPaymentSchema);
