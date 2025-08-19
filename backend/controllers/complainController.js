const Complaint = require("../models/complainModel");
const { uploadDocument, deleteDocument } = require("../config/cloudinary");

// ========== Create a new complaint ============

exports.createComplaint = async (req, res) => {
  try {
    // if (!req.body) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Request body is missing",
    //   });
    // }

    const { complaintType, complainantName, mobileNo, date, assignTo, note } =
      req.body;

    if (!complaintType || !complainantName || !mobileNo || !date || !assignTo) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Handle document upload
    if (req.file) {
      documentData = await uploadDocument(
        req.file.buffer,
        "postal_records",
        req.file.originalname,
        req.file.mimetype
      );
    }

    const complaint = await Complaint.create({
      complaintType,
      complainantName,
      mobileNo,
      date,
      assignTo,
      note,
      document: documentData,
    });

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//=================  Get all complaints =================
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .populate("assignTo", "name")
      .populate("complaintType", "name");

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =========== Get single complaint by ID with employee name ==============
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("assignTo", "name")
      .populate("complaintType", "name");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//=============== Update complaint =================
exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Validate and convert body
    const body = Object(req.body);

    if (body.dateOfSolution && isNaN(Date.parse(body.dateOfSolution))) {
      delete body.dateOfSolution;
    }

    // Handle document upload
    if (req.file) {
      try {
        // Delete old document if exists
        if (complaint.document?.public_id) {
          await deleteDocument(
            complaint.document.public_id,
            complaint.document.resource_type || "raw"
          );
        }

        // Upload new document
        const documentData = await uploadDocument(
          req.file.buffer,
          "complaints",
          req.file.originalname,
          req.file.mimetype
        );

        if (!documentData || !documentData.public_id) {
          throw new Error("Document upload returned invalid data");
        }

        body.document = documentData;
      } catch (uploadErr) {
        console.error("Error uploading document:", uploadErr);
        return res.status(500).json({
          success: false,
          message: "Document upload failed",
          error: uploadErr.message,
        });
      }
    }

    // Filter allowed fields
    const allowedFields = [
      "complaintType",
      "complainantName",
      "mobileNo",
      "date",
      "dateOfSolution",
      "status",
      "assignTo",
      "note",
      "document",
    ];

    const filteredBody = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        filteredBody[key] = body[key];
      }
    }

    // Update the complaint
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedComplaint,
    });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Delete complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Delete document from cloudinary if exists
    if (complaint.document && complaint.document.public_id) {
      await deleteDocument(
        complaint.document.public_id,
        complaint.document.resource_type || "image"
      );
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide status",
      });
    }

    // If status is Resolved, set dateOfSolution to current date
    const updateData = { status };
    if (status === "Resolved") {
      updateData.dateOfSolution = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
