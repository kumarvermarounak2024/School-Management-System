const Section = require("../models/sectionModel");

// Create a new section
exports.createSection = async (req, res) => {
  try {
    const { Name, Capacity } = req.body;

    if (!Name || !Capacity) {
      return res.status(400).json({ message: "Name and Capacity are required" });
    }

    const existingSection = await Section.findOne({ Name });
    if (existingSection) {
      return res.status(400).json({ message: "Section with this name already exists" });
    }

    const section = new Section({ Name, Capacity });
    await section.save();

    res.status(201).json({ message: "Section created successfully", section });
  } catch (err) {
    res.status(500).json({ message: "Error creating section", error: err.message });
  }
};

// Get all sections
exports.getAllSections = async (req, res) => {
  try {
    const sections = await Section.find().sort({ Name: 1 });
    res.status(200).json({ message: "All sections fetched", sections });
  } catch (err) {
    res.status(500).json({ message: "Error fetching sections", error: err.message });
  }
};

// Get a section by ID
exports.getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ message: "Section not found" });

    res.status(200).json({ message: "Section fetched", section });
  } catch (err) {
    res.status(500).json({ message: "Error fetching section", error: err.message });
  }
};

// Update a section
exports.updateSection = async (req, res) => {
  try {
    const { Name, Capacity } = req.body;

    const section = await Section.findByIdAndUpdate(
      req.params.id,
      { Name, Capacity },
      { new: true }
    );

    if (!section) return res.status(404).json({ message: "Section not found" });

    res.status(200).json({ message: "Section updated successfully", section });
  } catch (err) {
    res.status(500).json({ message: "Error updating section", error: err.message });
  }
};

// Delete a section
exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) return res.status(404).json({ message: "Section not found" });

    res.status(200).json({ message: "Section deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting section", error: err.message });
  }
};
