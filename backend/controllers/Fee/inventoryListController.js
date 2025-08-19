const mongoose = require("mongoose");
const feeInventory = require("../../models/Fee/inventoryModel");

// CREATE
exports.createInvoiceEntry = async (req, res) => {
  try {
    const { student, feeGroup, status } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(feeGroup)) {
      return res.status(400).json({ message: "Invalid or missing 'feeGroup' ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(student)) {
      return res.status(400).json({ message: "Invalid or missing 'student' ID" });
    }

    // Validate status
    const allowedStatuses = ["Unpaid", "Paid"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const newInvoice = new feeInventory({
      student,
      feeGroup,
      status: status || "Unpaid",
    });

    await newInvoice.save();

    const populatedInvoice = await feeInventory
      .findById(newInvoice._id)
      .populate("student", "firstName lastName registration_no roll_no mobile_no level_class section")
      .populate("feeGroup", "feeGroup");

    res.status(201).json({
      message: "Invoice created successfully",
      data: populatedInvoice,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating invoice",
      error: error.message,
    });
  }
};

// GET ALL
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await feeInventory.find()
      .populate("student", "firstName lastName registration_no roll_no mobile_no level_class section")
      .populate("feeGroup", "feeGroup");

    res.status(200).json({
      message: "All invoices fetched successfully",
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching invoices",
      error: error.message,
    });
  }
};

// GET BY ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await feeInventory.findById(req.params.id)
      .populate("student", "firstName lastName registration_no roll_no mobile_no level_class section")
      .populate("feeGroup", "feeGroup");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({
      message: "Invoice fetched successfully",
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching invoice",
      error: error.message,
    });
  }
};

// UPDATE
exports.updateInvoice = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const allowedStatuses = ["Unpaid", "Paid"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedInvoice = await feeInventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("student", "firstName lastName registration_no roll_no mobile_no level_class section")
      .populate("feeGroup", "feeGroup");

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({
      message: "Invoice updated successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating invoice",
      error: error.message,
    });
  }
};

// DELETE
exports.deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice = await feeInventory.findByIdAndDelete(req.params.id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting invoice",
      error: error.message,
    });
  }
};
