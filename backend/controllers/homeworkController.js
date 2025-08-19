const Homework = require("../models/homeworkModel");
const Admission = require("../models/admissionModel");
const { uploadDocument, deleteDocument } = require("../config/cloudinary");

//=========== Create Homework ===========
exports.createHomework = async (req, res) => {
  try {
    const {
      class: classId,
      section,
      subject,
      dateOfHomework,
      dateOfSubmission,
      publishLater,
      scheduleDate,
      homework,
      sendNotification,
    } = req.body;
const students = JSON.parse(req.body.students || "[]");
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Students array is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Attachment file is required" });
    }

    const file = req.file;
    const uploaded = await uploadDocument(
      file.buffer,
      "homework_attachments",
      file.originalname,
      file.mimetype
    );

    if (!uploaded || !uploaded.url) {
      return res
        .status(500)
        .json({ message: "Failed to upload file to Cloudinary" });
    }

    // Prepare homework objects for each student
    const homeworkArray = students.map((studentId) => ({
      class: classId,
      section,
      subject,
      dateOfHomework,
      dateOfSubmission,
      publishLater,
      scheduleDate,
      homework,
      attachmentUrl: uploaded,
      sendNotification,
      student: studentId,
    }));

    const insertedHomeworks = await Homework.insertMany(homeworkArray);

    res.status(201).json({
      message: "Homework created for all students",
      count: insertedHomeworks.length,
      data: insertedHomeworks,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating homework", error: err.message });
  }
};

//=========== Get All Homework ===========
exports.getAllHomework = async (req, res) => {
  try {
    const data = await Homework.find()
      .populate("class")
      .populate("section")
      .populate("subject")
      .populate("student");
    res.status(200).json({ data });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch homework", error: err.message });
  }
};

//=========== Delete Homework ===========
exports.deleteHomework = async (req, res) => {
  try {
    const { id } = req.params;

    const homework = await Homework.findById(id);
    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    if (homework.attachmentUrl) {
      const publicId = extractPublicId(homework.attachmentUrl);
      if (publicId) await deleteDocument(publicId);
    }

    await homework.deleteOne();

    res.status(200).json({ message: "Homework deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to delete homework", error: err.message });
  }
};

const extractPublicId = (url) => {
  try {
    const parts = url.split("/");
    const filename = parts.pop().split(".")[0];
    const folder = parts.slice(-2, -1)[0];
    return `${folder}/${filename}`;
  } catch {
    return null;
  }
};

//=============== Update Homework ================
exports.updateHomework = async (req, res) => {
  try {
    const { id } = req.params;

    const homework = await Homework.findById(id);
    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    const {
      class: classId,
      section,
      subject,
      dateOfHomework,
      dateOfSubmission,
      publishLater,
      scheduleDate,
      homework: homeworkText,
      sendNotification,
    } = req.body;

    // Prepare update fields
    const updatedData = {
      class: classId,
      section,
      subject,
      dateOfHomework,
      dateOfSubmission,
      publishLater,
      scheduleDate,
      homework: homeworkText,
      sendNotification,
    };

    // If new file uploaded, replace the old one
    if (req.file) {
      const file = req.file;

      // Delete old file
      if (homework?.attachmentUrl?.public_id) {
        // extract public id
        const publicId = extractPublicId(homework?.attachmentUrl);
        if (publicId) await deleteDocument(publicId);
      }

      const uploaded = await uploadDocument(
        file.buffer,
        "homework_attachments",
        file.originalname,
        file.mimetype
      );

      if (!uploaded || !uploaded.url) {
        return res.status(500).json({ message: "Failed to upload new file" });
      }

      updatedData.attachmentUrl = uploaded;
    }

    const updatedHomework = await Homework.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json({
      message: "Homework updated successfully",
      data: updatedHomework,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update homework", error: err.message });
  }
};

//=============== Get Homework by ID ================
exports.getHomeworkById = async (req, res) => {
  try {
    const { id } = req.params;

    const homework = await Homework.findById(id)
      .populate("class")
      .populate("section")
      .populate("subject");

    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    res.status(200).json({ data: homework });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch homework", error: err.message });
  }
};

////=========== Create Homework ===========
// exports.createHomework = async (req, res) => {
//   try {
//     const {
//       class: classId,
//       section,
//       subject,
//       student,
//       dateOfHomework,
//       dateOfSubmission,
//       publishLater,
//       scheduleDate,
//       homework,
//       sendNotification,
//       status,
//       rankOutOfFive,
//       remark,
//     } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ message: "Attachment file is required" });
//     }

//     const file = req.file;

//     const uploaded = await uploadDocument(
//       file.buffer,
//       "homework_attachments",
//       file.originalname,
//       file.mimetype
//     );

//     if (!uploaded || !uploaded.url) {
//       return res
//         .status(500)
//         .json({ message: "Failed to upload file to Cloudinary" });
//     }

//     const newHomework = new Homework({
//       class: classId,
//       section,
//       subject,
//       student,
//       dateOfHomework,
//       dateOfSubmission,
//       publishLater,
//       scheduleDate,
//       homework,
//       sendNotification,
//       attachmentUrl: uploaded.url,
//       status,
//       rankOutOfFive,
//       remark,
//     });

//     await newHomework.save();

//     res
//       .status(201)
//       .json({ message: "Homework created successfully", data: newHomework });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Error creating homework", error: err.message });
//   }
// };

// //=========== Get All Homework ===========
// exports.getAllHomework = async (req, res) => {
//   try {
//     const data = await Homework.find()
//       .populate("class")
//       .populate("section")
//       .populate("subject")
//       .populate("student", "firstName lastName registration_no roll_no"); // Make sure these exist in Admission schema

//     res.status(200).json({ data });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch homework", error: err.message });
//   }
// };

// //=========== Update Homework ===========
// exports.updateHomework = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const homework = await Homework.findById(id);
//     if (!homework) {
//       return res.status(404).json({ message: "Homework not found" });
//     }

//     const {
//       class: classId,
//       section,
//       subject,
//       student,
//       dateOfHomework,
//       dateOfSubmission,
//       publishLater,
//       scheduleDate,
//       homework: homeworkText,
//       sendNotification,
//       status,
//       rankOutOfFive,
//       remark,
//     } = req.body;

//     const updatedData = {
//       class: classId,
//       section,
//       subject,
//       student,
//       dateOfHomework,
//       dateOfSubmission,
//       publishLater,
//       scheduleDate,
//       homework: homeworkText,
//       sendNotification,
//       status,
//       rankOutOfFive,
//       remark,
//     };

//     if (req.file) {
//       const file = req.file;

//       if (homework.attachmentUrl) {
//         const publicId = extractPublicId(homework.attachmentUrl);
//         if (publicId) await deleteDocument(publicId);
//       }

//       const uploaded = await uploadDocument(
//         file.buffer,
//         "homework_attachments",
//         file.originalname,
//         file.mimetype
//       );

//       if (!uploaded || !uploaded.url) {
//         return res.status(500).json({ message: "Failed to upload new file" });
//       }

//       updatedData.attachmentUrl = uploaded.url;
//     }

//     const updatedHomework = await Homework.findByIdAndUpdate(id, updatedData, {
//       new: true,
//     });

//     res
//       .status(200)
//       .json({
//         message: "Homework updated successfully",
//         data: updatedHomework,
//       });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Failed to update homework", error: err.message });
//   }
// };

// //=========== Get Homework by ID ===========
// exports.getHomeworkById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const homework = await Homework.findById(id)
//       .populate("class", "name")
//       .populate("section", "name")
//       .populate("subject", "name")
//       .populate("student", "fullName registerNo rollNo");

//     if (!homework) {
//       return res.status(404).json({ message: "Homework not found" });
//     }

//     res.status(200).json({ data: homework });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch homework", error: err.message });
//   }
// };

// //=========== Delete Homework ===========
// exports.deleteHomework = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const homework = await Homework.findById(id);
//     if (!homework) {
//       return res.status(404).json({ message: "Homework not found" });
//     }

//     if (homework.attachmentUrl) {
//       const publicId = extractPublicId(homework.attachmentUrl);
//       if (publicId) {
//         await deleteDocument(publicId);
//       }
//     }

//     await homework.deleteOne();

//     res.status(200).json({ message: "Homework deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting homework:", err);
//     res
//       .status(500)
//       .json({ message: "Failed to delete homework", error: err.message });
//   }
// };

exports.getHomeworkByClassSection = async (req, res) => {
  try {
    const { classId, sectionId } = req.params;

    const homeworkList = await Homework.find({
      class: classId,
      section: sectionId,
    })
      .populate("class")
      .populate("section")
      .populate("student")
      .populate("subject", "subjectName");

    const students = await Admission.find({
      level_class: classId,
      section: sectionId,
    }).select("firstName lastName registration_no roll_no photo");

    res.status(200).json({
      classId,
      sectionId,
      homework: homeworkList,
      studentsAssigned: students,
    });
  } catch (error) {
    console.error("Error fetching homework by class and section:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch homework", error: error.message });
  }
};



const AssignedSubject = require("../models/Academic/AssignedSubjectModel");

exports.getEligibleAdmissionsWithSubjects = async (req, res) => {
  try {
    const assignedSubjects = await AssignedSubject.find({
      subjects: { $exists: true, $not: { $size: 0 } },
    })
      .select("classId sectionId subjects")
      .populate("subjects", "subjectName"); // 👈 this is where subject gets populated

    const filterConditions = assignedSubjects.map((as) => ({
      level_class: as.classId,
      section: as.sectionId,
    }));

    if (filterConditions.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const admissions = await Admission.find({
      $or: filterConditions,
    })
      .populate("level_class")
      .populate("section")
      .select(
        "firstName lastName registration_no roll_no level_class section photo status"
      );

    const result = admissions.map((admission) => {
      const match = assignedSubjects.find(
        (as) =>
          as.classId.toString() === admission.level_class._id.toString() &&
          as.sectionId.toString() === admission.section._id.toString()
      );

      return {
        _id: admission._id,
        studentName: `${admission.firstName} ${admission.lastName}`,
        registerNo: admission.registration_no,
        rollNo: admission.roll_no,
        photo: admission.photo,
        class: admission.level_class,
        section: admission.section,
        status: admission.status,
        assignedSubjects: match?.subjects || [],
      };
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching filtered admissions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateHomeworkFields = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = {};
    const allowedFields = ["status", "rankOutOfFive", "remark", "assignment"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    if (
      updateFields.status &&
      !["completed", "incomplete"].includes(updateFields.status.toLowerCase())
    ) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedHomework = await Homework.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedHomework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    res
      .status(200)
      .json({ message: "Homework updated successfully", updatedHomework });
  } catch (error) {
    console.error("Error updating homework:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
