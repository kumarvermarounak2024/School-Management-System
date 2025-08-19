const FeesAllocation = require("../../models/Fee/feeAllocationModel");

// Create Fees Allocation
exports.createFeesAllocation = async (req, res) => {
  console.log("fee allocation ==",req.body)

  try {
    const { sNo, students } = req.body;
     console.log("===")

    // Create the allocation
    const allocation = await FeesAllocation.create({ sNo, students });
    console.log("====",allocation)

    // Populate student data after creation
    const populatedAllocation = await FeesAllocation.findById(allocation._id).populate(
      "students",
      "firstName lastName registration_no roll_no mobile_no level_class section email gender"
    );

    res.status(201).json({
      message: "Fees allocation created successfully",
      data: allocation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating fees allocation",
      error: error.message,
    });
  }
};




exports.getAllFeesAllocations = async (req, res) => {
  try {
    const allocations = await FeesAllocation.find().populate(
      "students",
      "firstName lastName registration_no roll_no mobile_no level_class section email gender"
    );
    res.status(200).json({ data: allocations });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching allocations",
      error: error.message,
    });
  }
};



// Get Fees Allocation by ID
exports.getFeesAllocationById = async (req, res) => {
  try {
    const allocation = await FeesAllocation.findById(req.params.id).populate(
      "students",
      "firstName lastName registration_no roll_no mobile_no level_class section email gender"
    );

    if (!allocation) {
      return res.status(404).json({ message: "Allocation not found" });
    }

    res.status(200).json({ data: allocation });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching allocation",
      error: error.message,
    });
  }
};

exports.updateFeesAllocation = async (req, res) => {
  try {
    const { sNo, students } = req.body;

    const allocation = await FeesAllocation.findByIdAndUpdate(
      req.params.id,
      { sNo, students },
      { new: true }
    ).populate(
      "students",
      "firstName lastName registration_no roll_no mobile_no level_class section email gender"
    );

    if (!allocation)
      return res.status(404).json({ message: "Allocation not found" });

    res.status(200).json({ message: "Updated successfully", data: allocation });
  } catch (error) {
    res.status(500).json({ message: "Error updating allocation", error: error.message });
  }
};


// Delete Fees Allocation
exports.deleteFeesAllocation = async (req, res) => {
  try {
    const deleted = await FeesAllocation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Allocation not found" });
    }

    res.status(200).json({ message: "Fees allocation deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting allocation",
      error: error.message,
    });
  }
};
