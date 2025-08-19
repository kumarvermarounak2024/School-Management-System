const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  StudentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission',
    required: true
  },
  Class:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
   Section:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  promotionDate:{
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Promotion', promotionSchema);



