const FeeCollection = require("../../models/Fee/FeeInvoiceModel");

// CREATE Fee Collection
exports.createFeeCollection = async (req, res) => {
  try {
    const feeCollection = new FeeCollection(req.body);
    await feeCollection.save();
    res.status(201).json({
      message: "Fee Collection created successfully",
      data: feeCollection,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating Fee Collection",
      error: error.message,
    });
  }
};

// GET ALL Fee Collections
exports.getAllFeeCollections = async (req, res) => {
  try {
    const collections = await FeeCollection.find().sort({ createdAt: -1 });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Fee Collections",
      error: error.message,
    });
  }
};

// GET Fee Collection BY ID
exports.getFeeCollectionById = async (req, res) => {
  try {
    const feeCollection = await FeeCollection.findById(req.params.id);
    if (!feeCollection) {
      return res.status(404).json({ message: "Fee Collection not found" });
    }
    res.status(200).json(feeCollection);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Fee Collection",
      error: error.message,
    });
  }
};

// UPDATE Fee Collection
exports.updateFeeCollection = async (req, res) => {
  try {
    const updated = await FeeCollection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Fee Collection not found" });
    }
    res.status(200).json({
      message: "Fee Collection updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating Fee Collection",
      error: error.message,
    });
  }
};

// UPDATE INVOICE STATUS BY ID - NEW FUNCTION
exports.updateStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !["Paid", "Unpaid"].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Status must be either "Paid" or "Unpaid"',
      });
    }

    // Find and update the invoice status
    const updated = await FeeCollection.findByIdAndUpdate(
      id,
      {
        "invoice.status": status,
        // If marking as paid, also update the paid amount to match the total amount
        ...(status === "Paid" && {
          "invoice.paid": "$amount", // This will be handled in the pre-save hook or we can calculate it
        }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Fee Collection not found",
      });
    }

    // If marking as paid, update the paid amount and balance
    if (status === "Paid") {
      updated.invoice.paid = updated.amount - (updated.discount || 0);
      updated.invoice.balance = 0;
      updated.invoice.total = updated.amount;
      await updated.save();
    } else if (status === "Unpaid") {
      updated.invoice.paid = 0;
      updated.invoice.balance = updated.amount - (updated.discount || 0);
      updated.invoice.total = updated.amount;
      await updated.save();
    }

    res.status(200).json({
      message: `Invoice status updated to ${status} successfully`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating invoice status",
      error: error.message,
    });
  }
};

// DELETE Fee Collection
exports.deleteFeeCollection = async (req, res) => {
  try {
    const deleted = await FeeCollection.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Fee Collection not found" });
    }
    res.status(200).json({ message: "Fee Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Fee Collection",
      error: error.message,
    });
  }
};
