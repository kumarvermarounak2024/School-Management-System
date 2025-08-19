const mongoose = require("mongoose");

const contraSchema = new mongoose.Schema(
  {
    Date: {
      type: Date,
      required: true,
    },
    contraNo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return v && v.trim().length > 0;
        },
        message: "ContraNo cannot be empty",
      },
    },
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountingLedger",
      required: true,
    },
    fromAmount: {
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
  {
    timestamps: true,
  }
);

// ✅ Add static method to generate unique contra number
contraSchema.statics.generateUniqueContraNumber = async function () {
  let unique = false;
  let contraNo = "";
  while (!unique) {
    contraNo = `CONTRA-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const exists = await this.findOne({ contraNo });
    if (!exists) unique = true;
  }
  return contraNo;
};

// ✅ Export the model
module.exports = mongoose.model("ContraTransaction", contraSchema);
