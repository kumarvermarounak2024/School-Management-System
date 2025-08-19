const Ledger = require('../../models/Accounting/ledgerModel');

// Create
exports.createLedger = async (req, res) => {
      console.log(req.body); 
  try {
    const newLedger = await Ledger.create(req.body);
    res.status(201).json({ message: 'Ledger created', data: newLedger });
  } catch (error) {
    res.status(400).json({ message: 'Error creating ledger', error: error.message });
  }
};

// Read All
exports.getAllLedgers = async (req, res) => {
  try {
    const ledgers = await Ledger.find();
    res.status(200).json({ data: ledgers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ledgers', error: error.message });
  }
};

// Read by ID
exports.getLedgerById = async (req, res) => {
  try {
    const ledger = await Ledger.findById(req.params.id);
    if (!ledger) {
      return res.status(404).json({ message: 'Ledger not found' });
    }
    res.status(200).json({ data: ledger });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ledger', error: error.message });
  }
};

// Update
exports.updateLedger = async (req, res) => {
  try {
    const updatedLedger = await Ledger.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedLedger) {
      return res.status(404).json({ message: 'Ledger not found' });
    }
    res.status(200).json({ message: 'Ledger updated', data: updatedLedger });
  } catch (error) {
    res.status(400).json({ message: 'Error updating ledger', error: error.message });
  }
};

// Delete
exports.deleteLedger = async (req, res) => {
  try {
    const deleted = await Ledger.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Ledger not found' });
    }
    res.status(200).json({ message: 'Ledger deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ledger', error: error.message });
  }
};
