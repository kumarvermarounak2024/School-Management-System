const mongoose = require('mongoose');

const callingpurposeModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

});

const Response = mongoose.model('Callingpurpose', callingpurposeModel);
module.exports = Response;