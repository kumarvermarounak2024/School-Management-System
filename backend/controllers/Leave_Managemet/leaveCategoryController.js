const LeaveCategory = require("../../models/Leave_Management/LeaveCategoryModel");

// Create a new leave category
exports.createLeaveCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const existing = await LeaveCategory.findOne({ categoryName });
    if (existing) {
      return res.status(400).json({ error: "Leave category already exists" });
    }

    const newCategory = new LeaveCategory({ categoryName });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all leave categories
exports.getAllLeaveCategories = async (req, res) => {
  try {
    const categories = await LeaveCategory.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a leave category
exports.updateLeaveCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;

    const updated = await LeaveCategory.findByIdAndUpdate(
      id,
      { categoryName },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Leave category not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a leave category
exports.deleteLeaveCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await LeaveCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Leave category not found" });
    }

    res.json({ message: "Leave category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
