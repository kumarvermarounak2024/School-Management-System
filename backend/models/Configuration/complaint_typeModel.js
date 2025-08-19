const mongoose = require('mongoose');

const complainTypeModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
   
    });
    module.exports = mongoose.model('complainType', complainTypeModel);
    