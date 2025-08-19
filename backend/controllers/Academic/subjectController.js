const Subject = require("../../models/Academic/subjectModel");

// ======== Create a new subject  ==========
exports.createSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, subjectAuthor, subjectType } = req.body;

    const existing = await Subject.findOne({ subjectCode });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Subject code already exists" });
    }

    const subject = new Subject({
      subjectName,
      subjectCode,
      subjectAuthor,
      subjectType,
    });
    await subject.save();

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// =============== Get all subjects (http://localhost:5000/api/subjects?search=your_search_text) ===========
exports.getAllSubjects = async (req, res) => {
  try {
    const search = req.query.search || "";
    const regex = new RegExp(search, "i");

    const subjects = await Subject.find({
      $or: [
        { subjectName: regex },
        { subjectCode: regex },
        { subjectAuthor: regex },
        { subjectType: regex },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

//===========  Get subject by ID =============
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

//=================  Update subject =================
exports.updateSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, subjectAuthor, subjectType } = req.body;

    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      { subjectName, subjectCode, subjectAuthor, subjectType },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: updated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ==================Delete subject ================
exports.deleteSubject = async (req, res) => {
  try {
    const deleted = await Subject.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Subject deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
