const VehicleAssign = require('../../models/Transport/vehicleAssignModel');

// CREATE
exports.createVehicleAssign = async (req, res) => {
  try {
    const newAssignment = new VehicleAssign(req.body);
    const savedAssignment = await newAssignment.save();

    const populatedAssignment = await VehicleAssign.findById(savedAssignment._id)
      .populate({
        path: 'transportRoute',
        select: 'routeName startPlace stopPlace remark'
      })
      .populate({
        path: 'stoppage',
        select: 'stoppage stopTiming routeFare'
      })
      .populate({
        path: 'vehicles',
        select: 'vehicleNumber driverName driverPhoneNumber'
      });

    res.status(201).json({
      message: "Vehicle assigned successfully",
      data: populatedAssignment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating vehicle assignment",
      error: error.message
    });
  }
};

// GET ALL
exports.getAllVehicleAssignments = async (req, res) => {
  try {
    const assignments = await VehicleAssign.find()
      .populate({
        path: 'transportRoute',
        select: 'routeName startPlace stopPlace remark'
      })
      .populate({
        path: 'stoppage',
        select: 'stoppage stopTiming routeFare'
      })
      .populate({
        path: 'vehicles',
        select: 'vehicleNumber driverName driverPhoneNumber'
      });

    res.status(200).json({
      message: "Fetched all vehicle assignments",
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching assignments",
      error: error.message
    });
  }
};

// GET BY ID
exports.getVehicleAssignmentById = async (req, res) => {
  try {
    const assignment = await VehicleAssign.findById(req.params.id)
      .populate({
        path: 'transportRoute',
        select: 'routeName startPlace stopPlace remark'
      })
      .populate({
        path: 'stoppage',
        select: 'stoppage stopTiming routeFare'
      })
      .populate({
        path: 'vehicles',
        select: 'vehicleNumber driverName driverPhoneNumber'
      });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      message: "Fetched assignment successfully",
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching assignment",
      error: error.message
    });
  }
};

// UPDATE
exports.updateVehicleAssignment = async (req, res) => {
  try {
    const updatedAssignment = await VehicleAssign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate({
        path: 'transportRoute',
        select: 'routeName startPlace stopPlace remark'
      })
      .populate({
        path: 'stoppage',
        select: 'stoppage stopTiming routeFare'
      })
      .populate({
        path: 'vehicles',
        select: 'vehicleNumber driverName driverPhoneNumber'
      });

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      message: "Assignment updated successfully",
      data: updatedAssignment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating assignment",
      error: error.message
    });
  }
};

// DELETE
exports.deleteVehicleAssignment = async (req, res) => {
  try {
    const deleted = await VehicleAssign.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting assignment",
      error: error.message
    });
  }
};
