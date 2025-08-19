const Department = require('../models/departmentModel');

// Create department
exports.createdepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.status(201).json({ message: 'Department added', data: newDepartment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all departments
exports.getdepartment = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update department
exports.updatedepartment = async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.status(200).json({ message: 'Department updated', data: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete department
exports.deletedepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Department deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

