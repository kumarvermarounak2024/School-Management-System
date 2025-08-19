const mongoose = require('mongoose');


const hostelmasterSchema = new mongoose.Schema({
    Hostel_Name: {
        type: String,
        required: true,
        trim: true
    },
    Hostel_Address: {
        type: String,
        required: true,
        trim: true
    },
    Remarks: {
        type: String,
        required: true,
        trim: true
    },

})
const hostelmaster = mongoose.model('HostelMaster', hostelmasterSchema);
module.exports = hostelmaster;

// const mongoose = require('mongoose');

// const hostelmasterSchema = new mongoose.Schema({
//     Hostel_Name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     Hostel_Address: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     Remarks: {
//         type: String,
//         required: true,
//         trim: true
//     },
// });

// const HostelMaster = mongoose.models.HostelMaster || mongoose.model('HostelMaster', hostelmasterSchema);

// module.exports = HostelMaster;
