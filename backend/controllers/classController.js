const Class = require("../models/classModel");

// Create Class
exports.createClass = async (req, res) => {
  try {
    const { Name, Class_Numeric } = req.body;

    if (!Name || Class_Numeric == null) {
      return res.status(400).json({ message: "Name and Class_Numeric are required" });
    }

    const newClass = new Class({ Name, Class_Numeric });
    await newClass.save();

    return res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating class",
      error: error.message,
    });
  }
};

// Get All Classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    return res.status(200).json({
      message: "All classes fetched successfully",
      classes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching classes",
      error: error.message,
    });
  }
};

// Get Class by ID
exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    return res.status(200).json({
      message: "Class fetched successfully",
      class: classData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching class",
      error: error.message,
    });
  }
};

// Update Class
exports.updateClass = async (req, res) => {
  try {
    const { Name, Class_Numeric } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { Name, Class_Numeric },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    return res.status(200).json({
      message: "Class updated successfully",
      class: updatedClass,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating class",
      error: error.message,
    });
  }
};

// Delete Class
exports.deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    return res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting class",
      error: error.message,
    });
  }
};
