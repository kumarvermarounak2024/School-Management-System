const mongoose = require('mongoose');

const referanceModel = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
});

const Response = mongoose.model('Referance', referanceModel);
module.exports = Response;
