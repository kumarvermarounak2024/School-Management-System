const Designation = require("../models/designationModel");

// Create Designation
exports.CreateDesignation = async (req, res) => {
  try {
    const { name } = req.body;
    const newDesignation = new Designation({ name });
    await newDesignation.save();
    res.status(201).json({ message: "Designation created successfully", data: newDesignation });
  } catch (error) {
    res.status(500).json({ message: "Error creating designation", error: error.message });
  }
};

// Get All Designations
exports.GetDesignation = async (req, res) => {
  try {
    const designations = await Designation.find().sort({ createdAt: -1 });
    res.status(200).json(designations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching designations", error: error.message });
  }
};

// Update Designation
exports.UpdateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedDesignation = await Designation.findByIdAndUpdate(id, { name }, { new: true });
    res.status(200).json({ message: "Designation updated successfully", data: updatedDesignation });
  } catch (error) {
    res.status(400).json({ message: "Error updating designation", error: error.message });
  }
};

// Delete Designation
exports.DeleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    await Designation.findByIdAndDelete(id);
    res.status(200).json({ message: "Designation deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting designation", error: error.message });
  }
};
