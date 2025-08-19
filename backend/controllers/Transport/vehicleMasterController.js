const mongoose=require("mongoose");
const vehicleModel=require("../../models/Transport/vehicleModel")
exports.createVehicle=async(req,res)=>{

   try{
const newVehicle=new vehicleModel(req.body);
const savedVehicle=await newVehicle.save();
res.status(201).json({
    message:"Vehicle created successfully",
    data:savedVehicle
})


   }catch(error){
console.log(error)
res.status(500).json({
    message:"Error creating vehicle",
    error:error.message
})

   } 
}

exports.getAllVehicles=async (req,res)=>{
    try{

const vehicles=await vehicleModel.find();
res.status(200).json(vehicles);


    }catch(error){
        res.status(500).json({
            message:"Error fetching vehicles",
            error:error.message
        })

    }
}


exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await vehicleModel.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching vehicle",
      error: error.message
    });
  }
};

// Update vehicle by ID
exports.updateVehicleById = async (req, res) => {
  try {
    const updatedVehicle = await vehicleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating vehicle",
      error: error.message
    });
  }
};

// Delete vehicle by ID
exports.deleteVehicleById = async (req, res) => {
  try {
    const deletedVehicle = await vehicleModel.findByIdAndDelete(req.params.id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting vehicle",
      error: error.message
    });
  }
};