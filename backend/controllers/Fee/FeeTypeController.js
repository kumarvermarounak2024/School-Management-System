// controllers/feeTypeController.js

const FeeType = require('../../models/Fee/FeeTypeModel')

// Create a new fee type
exports.createFeeType = async (req, res) => {
  try {
    const { feeType, description } = req.body;
    if (!feeType) return res.status(400).json({ message: 'Fee Type Name is required' });

    const newFeeType = new FeeType({ feeType, description });
    await newFeeType.save();
    res.status(201).json(newFeeType);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all fee types
exports.getFeeTypes = async (req, res) => {
  try {
    const feeTypes = await FeeType.find().sort({ createdAt: -1 });
    res.json(feeTypes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a single fee type by ID
exports.getFeeTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const feeType = await FeeType.findById(id);

    if (!feeType) return res.status(404).json({ message: 'Fee Type not found' });

    res.json(feeType);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a fee type
exports.updateFeeType = async (req, res) => {
  try {
    const { id } = req.params;
    const { feeType, description } = req.body;

    const updated = await FeeType.findByIdAndUpdate(id, { feeType, description }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Fee Type not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a fee type
exports.deleteFeeType = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FeeType.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Fee Type not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
