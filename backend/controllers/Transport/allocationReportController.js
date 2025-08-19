const allocationReportModel = require("../../models/Transport/allocationReportModel");
const mongoose = require("mongoose");

// Helper function to check if referenced document exists
const checkReferenceExists = async (modelName, id, fieldName) => {
  try {
    const Model = mongoose.model(modelName);
    const doc = await Model.findById(id);
    if (!doc) {
      throw new Error(
        `${fieldName} with ID ${id} does not exist in ${modelName} collection`
      );
    }
    return true;
  } catch (error) {
    throw new Error(`Error checking ${fieldName}: ${error.message}`);
  }
};

// Create Student Attendance Record
exports.createallocationReportModel = async (req, res) => {
  try {
    const {
      student,
      fatherName,
      section,
      class: classId,
      routeName,
      stoppage,
      vehicleNumber,
      routeFare,
    } = req.body;

    console.log("Received payload:", req.body);

    // Validate ObjectIds
    const validateObjectId = (id, fieldName) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ${fieldName} ObjectId: ${id}`);
      }
      return id;
    };

    // Validate all ObjectId fields
    try {
      validateObjectId(student, "student");
      validateObjectId(section, "section");
      validateObjectId(classId, "class");
      validateObjectId(routeName, "routeName");
      validateObjectId(stoppage, "stoppage");
      validateObjectId(vehicleNumber, "vehicleNumber");
    } catch (error) {
      return res.status(400).json({
        message: "Invalid ID format",
        details: error.message,
      });
    }

    if (
      !student ||
      !section ||
      !classId ||
      !routeName ||
      !stoppage ||
      !vehicleNumber ||
      !routeFare
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate routeFare is a number
    if (typeof routeFare !== "number" && isNaN(Number(routeFare))) {
      return res.status(400).json({
        message: "routeFare must be a valid number",
      });
    }

    // Check if all referenced documents exist
    try {
      await checkReferenceExists("Admission", student, "Student");
      await checkReferenceExists("Section", section, "Section");
      await checkReferenceExists("Class", classId, "Class");
      await checkReferenceExists("Route", routeName, "Route");
      await checkReferenceExists("Stoppage", stoppage, "Stoppage");
      await checkReferenceExists("Vehicle", vehicleNumber, "Vehicle");
    } catch (error) {
      return res.status(400).json({
        message: "Reference validation failed",
        details: error.message,
      });
    }

    const newRecord = new allocationReportModel({
      student,
      fatherName,
      section,
      class: classId,
      routeName,
      stoppage,
      vehicleNumber,
      routeFare: Number(routeFare),
    });

    console.log("Attempting to save record:", newRecord);

    const savedRecord = await newRecord.save();
    console.log("Record saved successfully:", savedRecord);

    res.status(201).json({
      message: "Route allocation created successfully.",
      data: savedRecord,
    });
  } catch (error) {
    console.error("Detailed error in createallocationReportModel:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    });

    // Check for specific MongoDB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation Error",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID format",
        details: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate entry error",
        details: error.message,
      });
    }

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
      details: error.stack,
    });
  }
};

// Get All Student Attendance Records
exports.getAllallocationReportModel = async (req, res) => {
  try {
    const records = await allocationReportModel
      .find()
      .populate({ path: "student", select: "firstName lastName" })
      .populate({ path: "section" })
      .populate({ path: "class" })
      .populate({ path: "routeName", select: "routeName" })
      .populate({ path: "stoppage", select: "stoppage stopTiming routeFare" })
      .populate({ path: "vehicleNumber", select: "vehicleNumber" });
    // .populate({ path: "routeFare", select: "routeFare" });

    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ message: "Failed to fetch attendance records." });
  }
};

// Get By ID
exports.getallocationReportById = async (req, res) => {
  try {
    const record = await allocationReportModel
      .findById(req.params.id)
      .populate({ path: "student", select: "firstName lastName" })
      .populate({ path: "section" })
      .populate({ path: "class" })
      .populate({ path: "routeName", select: "routeName" })
      .populate({ path: "stoppage", select: "stoppage stopTiming routeFare" })
      .populate({ path: "vehicleNumber", select: "vehicleNumber" });
    // .populate({ path: "routeFare", select: "routeFare" });

    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error("Error fetching record by ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update
exports.updateallocationReportModel = async (req, res) => {
  try {
    const updatedRecord = await allocationReportModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.status(200).json({
      message: "Record updated successfully.",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete
exports.deleteallocationReportModel = async (req, res) => {
  try {
    const deleted = await allocationReportModel.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.status(200).json({ message: "Record deleted successfully." });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
