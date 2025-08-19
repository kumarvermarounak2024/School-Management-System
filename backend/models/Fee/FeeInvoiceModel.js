const mongoose = require('mongoose');

const feeCollectionSchema = new mongoose.Schema({
  feeType: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Online', 'UPI', 'Bank Transfer'],
    required: true,
  },
 account: {
  type: String,
  required: true,
  trim: true,
},

  discount: {
    type: Number,
    default: 0,
  },
  remark: {
    type: String,
    default: '',
    trim: true,
  },
  invoice: {
    invoiceNo: {
      type: String,
    //   required: true,
    //   unique: true,
    //   trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Unpaid', 'Paid'],
      default: 'Unpaid',
    },
    total: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    fine: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
    },
   guardianConfirmationSMS: {
    type: Boolean,
    default: false,
  },
  },
}, { timestamps: true });

/**
 * Pre-save hook to copy discount to invoice.discount
 */
feeCollectionSchema.pre('save', function (next) {
  if (this.discount != null && this.invoice) {
    this.invoice.discount = this.discount;
  }
  next();
});

module.exports = mongoose.model('FeeCollection', feeCollectionSchema);
