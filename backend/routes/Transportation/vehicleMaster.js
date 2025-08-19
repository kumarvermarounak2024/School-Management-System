const mongoose = require("mongoose");
const express = require("express");
const vehicleMaster = require("../../controllers/Transport/vehicleMasterController");
const router = express.Router();

const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
} = require("../../controllers/Transport/vehicleMasterController");

router.post("/create", createVehicle);
router.get("/getAll", getAllVehicles);
router.get("/get/:id", getVehicleById);
router.put("/updateVehicleById/:id", updateVehicleById);
router.delete("/delete/:id", deleteVehicleById);
module.exports = router;
