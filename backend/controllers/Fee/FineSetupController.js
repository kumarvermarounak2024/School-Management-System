const FineSetup = require('../../models/Fee/FineSetupModel');

// Create (with populate)
exports.createFine = async (req, res) => {
  try {
    const fine = new FineSetup(req.body);
    const saved = await fine.save();

    const populated = await FineSetup.findById(saved._id)
      .populate('feeGroup')
      .populate('feeType');

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All (with populate)
exports.getAllFines = async (req, res) => {
  try {
    const allFines = await FineSetup.find()
      .populate('feeGroup')
      .populate('feeType')
      .sort({ createdAt: -1 });

    res.json(allFines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateFine = async (req, res) => {
  try {
    const updated = await FineSetup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Fine not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.deleteFine = async (req, res) => {
  try {
    const deleted = await FineSetup.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Fine not found' });
    res.json({ message: 'Fine deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
