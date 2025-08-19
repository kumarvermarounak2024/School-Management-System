const mongoose = require('mongoose');

const responseModel = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

});

const Response = mongoose.model('Response', responseModel);
module.exports = Response;