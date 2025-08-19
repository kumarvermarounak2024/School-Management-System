const StudentAttendance = require("../../models/StudentAttendance/StudentAttendanceModel");

//============  Create multiple attendance ==============
exports.createAttendance = async (req, res) => {
  try {
    const { date, classId, sectionId, attendances } = req.body;

    if (!attendances || !Array.isArray(attendances) || attendances.length === 0) {
      return res.status(400).json({ message: "Attendance data is required." });
    }
    await StudentAttendance.deleteMany({ date, classId, sectionId });

    const newAttendances = attendances.map((entry) => ({
      date,
      classId,
      sectionId,
      student: entry.studentId,
      status: entry.status,
      remarks: entry.remarks || "",
    }));

    const savedRecords = await StudentAttendance.insertMany(newAttendances);

    res.status(201).json({
      message: "Attendance submitted successfully.",
      data: savedRecords,
    });
  } catch (error) {
    console.error("Error creating attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// =============== Get attendance list by class, section, date ================
const Admission = require("../../models/admissionModel");

exports.getStudentsByClassSection = async (req, res) => {
  try {
    const { level_class, section } = req.query;

    // If neither class nor section is provided
    if (!level_class && !section) {
      return res.status(400).json({
        success: false,
        message: "At least level_class or section is required.",
      });
    }

    // Build dynamic filter
    const filter = {};
    if (level_class) filter.level_class = level_class;
    if (section) filter.section = section;

    // Find students using filter
    const students = await Admission.find(filter)
      .populate("level_class", "className")
      .populate("section", "sectionName");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};


// ================= Attendance report by student in a date range ================
exports.getStudentAttendanceReport = async (req, res) => {
  try {
    const { classId, sectionId, studentId, fromDate, toDate } = req.query;

    const filter = {};

    if (classId) filter.classId = classId;
    if (sectionId) filter.sectionId = sectionId;
    if (studentId) filter.student = studentId;

    if (fromDate && toDate) {
      filter.date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    const records = await StudentAttendance.find(filter)
      .populate("classId")
      .populate("sectionId")
      .populate("student", "firstName lastName registration_no roll_no")
      .sort({ date: 1 });

    const totalPresent = records.filter((r) => r.status === "Present").length;
    const totalAbsent = records.filter((r) => r.status === "Absent").length;

    res.status(200).json({
      success: true,
      data: records,
      summary: {
        totalPresent,
        totalAbsent,
      },
    });
  } catch (err) {
    console.error("Error fetching attendance report:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
