const FeeGroup = require("../../models/Fee/FeeGroupModel");

// Create Fee Group
exports.createFeeGroup = async (req, res) => {
  try {
    const { feeGroup, description, feeDetails } = req.body;

    if (!feeGroup || !Array.isArray(feeDetails) || feeDetails.length === 0) {
      return res.status(400).json({ message: "Fee Group name and at least one fee detail are required" });
    }

    const cleanedDetails = feeDetails.filter(item => item.feeType && item.dueDate && item.amount);

    if (cleanedDetails.length === 0) {
      return res.status(400).json({ message: "All fee details must have feeType, dueDate, and amount" });
    }

    const newFeeGroup = new FeeGroup({ feeGroup, description, feeDetails: cleanedDetails });
    await newFeeGroup.save();

    res.status(201).json({ message: "Fee Group created successfully", data: newFeeGroup });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get All Fee Groups
exports.getAllFeeGroups = async (req, res) => {
  try {
    const groups = await FeeGroup.find().sort({ createdAt: -1 });
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Fee Group
exports.updateFeeGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { feeGroup, description, feeDetails } = req.body;

    if (!feeGroup || !Array.isArray(feeDetails)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const cleanedDetails = feeDetails.filter(item => item.feeType && item.dueDate && item.amount);

    const updated = await FeeGroup.findByIdAndUpdate(
      id,
      { feeGroup, description, feeDetails: cleanedDetails },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Fee Group not found" });
    }

    res.status(200).json({ message: "Fee Group updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Fee Group
exports.deleteFeeGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FeeGroup.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Fee Group not found" });
    }

    res.status(200).json({ message: "Fee Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
