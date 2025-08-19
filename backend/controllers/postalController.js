const PostalRecord = require("../models/postalRecordModel");
const { uploadDocument, deleteDocument } = require("../config/cloudinary");

exports.createPostalRecord = async (req, res) => {
  try {
    const {
      type,
      reference_no,
      sender_title,
      receiver_title,
      address,
      note,
      date,
      confidential,
    } = req.body;

    // Check if reference_no already exists
    const existingRecord = await PostalRecord.findOne({ reference_no });
    if (existingRecord) {
      return res.status(400).json({ error: "Reference number already exists" });
    }

    // Upload document to Cloudinary if provided

    let documentObj = null;
    if (req.file) {
      documentObj = await uploadDocument(
        req.file.buffer,
        "postal_records",
        req.file.originalname,
        req.file.mimetype
      );
    }

    // Create new postal record
    const newPostalRecord = new PostalRecord({
      type,
      reference_no,
      sender_title,
      receiver_title,
      address,
      note,
      date: date || Date.now(),
      document_file: documentObj,
      confidential: confidential || false,
    });

    const savedRecord = await newPostalRecord.save();

    res.status(201).json({
      success: true,
      message: "Postal record created successfully",
      data: savedRecord,
    });
  } catch (error) {
    console.error("Error in createPostalRecord:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

exports.getAllPostalRecords = async (req, res) => {
  try {
    const records = await PostalRecord.find();
    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Error in getAllPostalRecords:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

exports.getPostalRecordById = async (req, res) => {
  try {
    const record = await PostalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ error: "Postal record not found" });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error in getPostalRecordById:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

exports.updatePostalRecord = async (req, res) => {
  try {
    const record = await PostalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ error: "Postal record not found" });
    }

    const { confidential, ...otherFields } = req.body;
    const updateData = {
      ...otherFields,
      confidential: confidential === "true" || confidential === true, // Ensure boolean
    };

    // Handle file upload if new file is provided
    if (req.file) {
      // Delete old file from Cloudinary
      try {
        if (record?.document_file && record?.document_file?.public_id) {
          await deleteDocument(
            record.document_file.public_id,
            record.document_file.resource_type || "raw"
          );
        }
      } catch (err) {
        console.error("Cloudinary deletion failed:", err.message || err);
        // Proceed without throwing to allow update to continue
      }

      // Upload new file to Cloudinary
      const uploadedDoc = await uploadDocument(
        req.file.buffer,
        "postal_records",
        req.file.originalname,
        req.file.mimetype
      );

      updateData.document_file = uploadedDoc;
    }

    // Update the record
    const updatedRecord = await PostalRecord.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Postal record updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error in updatePostalRecord:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

exports.deletePostalRecord = async (req, res) => {
  try {
    const record = await PostalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ error: "Postal record not found" });
    }

    // Delete document from Cloudinary if exists
    if (record.document_file && record.document_file.public_id) {
      await deleteDocument(
        record.document_file.public_id,
        record.document_file.resource_type || "image"
      );
    }

    // Delete record from database
    await PostalRecord.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Postal record deleted successfully",
    });
  } catch (error) {
    console.error("Error in deletePostalRecord:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};
