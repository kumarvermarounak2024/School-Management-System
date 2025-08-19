const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    Date: {
      type: Date,
      required: true,
    },
    journalNo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return v && v.trim().length > 0;
        },
        message: "journalNo cannot be empty",
      },
    },
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountingLedger",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountingLedger",
      required: true,
    },
    toAmount: {
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
  },
  { timestamps: true }
);


journalSchema.statics.generateUniqueJournalNo = async function () {
  let unique = false;
  let journalNo = "";
  while (!unique) {
    journalNo = `JOURNAL-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const exists = await this.findOne({ journalNo });
    if (!exists) unique = true;
  }
  return journalNo;
};

module.exports = mongoose.model("journalSchema", journalSchema);
