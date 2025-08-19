const mongoose = require("mongoose");
// const hostelmaster = require("./Hostel_masterModel");

const hostelRoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
  },
  hostelmasterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HostelMaster",
    required: true,
  },
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HostelCategory",
  },
  NoOfBeds: {
    type: Number,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Remarks: {
    type: String,
    required: false,
  },
});

const HostelRoom = mongoose.model("HostelRoom", hostelRoomSchema);

module.exports = HostelRoom;
