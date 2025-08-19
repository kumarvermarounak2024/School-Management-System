const FeeReminder = require("../../models/Fee/feeReminderModel");

// Create
exports.createFeeReminder = async (req, res) => {
  try {
    const newReminder = new FeeReminder(req.body);
    await newReminder.save();
    res.status(201).json({ message: "Fee Reminder created", data: newReminder });
  } catch (error) {
    res.status(400).json({ message: "Error creating reminder", error });
  }
};

// Get All
exports.getAllFeeReminders = async (req, res) => {
  try {
    const reminders = await FeeReminder.find();
    res.status(200).json({ message: "All Fee Reminders", data: reminders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reminders", error });
  }
};

// Get by ID
exports.getFeeReminderById = async (req, res) => {
  try {
    const reminder = await FeeReminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    res.status(200).json({ message: "Reminder fetched", data: reminder });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID or error", error });
  }
};

// Update by ID
exports.updateFeeReminder = async (req, res) => {
  try {
    const updated = await FeeReminder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Reminder not found" });
    res.status(200).json({ message: "Reminder updated", data: updated });
  } catch (error) {
    res.status(400).json({ message: "Update failed", error });
  }
};

// Delete by ID
exports.deleteFeeReminder = async (req, res) => {
  try {
    const deleted = await FeeReminder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Reminder not found" });
    res.status(200).json({ message: "Reminder deleted", data: deleted });
  } catch (error) {
    res.status(400).json({ message: "Delete failed", error });
  }
};
