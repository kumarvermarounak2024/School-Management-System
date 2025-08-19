// const ExamAttendance = require("../../models/ExamAttendance/examAttendanceModel");
// const Addmission = require("../../models/admissionModel");

// // =============  Create or Update Exam Attendance =============
// exports.saveExamAttendance = async (req, res) => {
//   try {
//     const { exam, classId, section, subject, date, attendance } = req.body;

//     let record = await ExamAttendance.findOne({
//       exam,
//       class: classId,
//       section,
//       subject,
//       date,
//     });

//     if (record) {
//       record.attendance = attendance;
//       await record.save();
//     } else {
//       record = await ExamAttendance.create({
//         exam,
//         class: classId,
//         section,
//         subject,
//         date,
//         attendance,
//       });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Attendance saved", data: record });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// };

// //=============  Fetch Attendance List by Class/Section + Optional Date Range =============
// exports.getExamAttendanceList = async (req, res) => {
//   try {
//     const { classId, sectionId, fromDate, toDate } = req.query;

//     const query = {
//       class: classId,
//       section: sectionId,
//     };

//     if (fromDate && toDate) {
//       query.date = {
//         $gte: new Date(fromDate),
//         $lte: new Date(toDate),
//       };
//     }

//     const records = await ExamAttendance.find(query)
//       .populate(
//         "class section subject exam attendance.student",
//         "firstName lastName registration_no roll_no"
//       )
//       .sort({ date: 1 });

//     res.status(200).json({ success: true, data: records });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// };




const ExamAttendance = require("../../models/ExamAttendance/examAttendanceModel");

exports.saveExamAttendance = async (req, res) => {
  const { exam, class: classId, section, subject, attendance } = req.body;

  try {
    if (!exam || !classId || !section || !subject || !attendance || !attendance.length) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const saved = await ExamAttendance.create({
      exam,
      class: classId,
      section,
      subject,
      attendance
    });

    res.status(201).json({
      success: true,
      message: "Exam attendance saved successfully",
      data: saved
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const Admission = require("../../models/admissionModel");

exports.getExamStudents = async (req, res) => {
  const { examId, classId, sectionId, subjectId } = req.query;

  try {
    if (!examId || !classId || !sectionId || !subjectId) {
      return res.status(400).json({ success: false, message: "Missing required query parameters" });
    }

    const students = await Admission.find({
      level_class: classId,
      section: sectionId,
      status: "Active"
    }).select("firstName lastName roll_no registration_no");

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ============= report ============= 

const mongoose = require("mongoose");

exports.getStudentExamAttendanceReport = async (req, res) => {
  const { classId, sectionId, studentId, startDate, endDate } = req.query;

  try {
    if (!classId || !sectionId || !studentId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "All fields (classId, sectionId, studentId, date range) are required",
      });
    }

    const records = await ExamAttendance.find({
      class: classId,
      section: sectionId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      "attendance.student": studentId,
    })
      .populate("subject", "subjectName")
      .populate("attendance.student", "firstName lastName")
      .sort({ date: 1 });

    const report = [];

    let totalPresent = 0;
    let totalAbsent = 0;

    for (const record of records) {
      const studentAttendance = record.attendance.find(att => att.student._id.toString() === studentId);

      if (studentAttendance) {
        if (studentAttendance.status === "Present") totalPresent++;
        if (studentAttendance.status === "Absent") totalAbsent++;

        report.push({
          subject: record.subject.subjectName,
          date: record.date,
          status: studentAttendance.status,
          remarks: studentAttendance.remarks,
        });
      }
    }

    res.status(200).json({
      success: true,
      studentId,
      totalPresent,
      totalAbsent,
      attendanceDetails: report,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: " + err.message,
    });
  }
};