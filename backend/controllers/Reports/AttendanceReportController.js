const mongoose = require("mongoose");
const Attendance = require("../../models/StudentAttendance/StudentAttendanceModel");
const Student = require("../../models/admissionModel");

//================== Monthly Attendance Report Controller ==================
exports.getMonthlyStudentAttendanceReport = async (req, res) => {
  try {
    const { classId, sectionId, month } = req.query;

    let classFilter = {};
    let sectionFilter = {};
    let dateFilter = {};
    let monthName = null;
    let year = null;
    let totalDays = null;

    if (classId) {
      classFilter.level_class = new mongoose.Types.ObjectId(classId);
    }

    if (sectionId) {
      sectionFilter.section = new mongoose.Types.ObjectId(sectionId);
    }

    if (month) {
      const [monthStr, yearStr] = month.split("-");
      year = parseInt(yearStr);
      const monthIndex = new Date(`${monthStr} 1, ${year}`).getMonth();

      const startDate = new Date(year, monthIndex, 1);
      const endDate = new Date(year, monthIndex + 1, 0);
      totalDays = endDate.getDate();
      monthName = monthStr;

      dateFilter.date = { $gte: startDate, $lte: endDate };
    }

    // ✅ Find students and populate class/section name
    const students = await Student.find({
      ...classFilter,
      ...sectionFilter,
    })
      .populate("level_class", "Name") // Only get name field of class
      .populate("section", "Name");    // Only get name field of section

    if (!students.length) {
      return res.status(200).json({
        success: true,
        month: monthName,
        year,
        totalDays,
        data: [],
        message: "No students found for selected filters.",
      });
    }

    // ✅ Build attendance query
    const attendanceFilter = {
      ...(classId && { classId: new mongoose.Types.ObjectId(classId) }),
      ...(sectionId && { sectionId: new mongoose.Types.ObjectId(sectionId) }),
      ...dateFilter,
    };

    const attendanceData = await Attendance.find(attendanceFilter);

    // ✅ Build final report
    const report = students.map((student) => {
      const studentAttendance = attendanceData.filter(
        (a) => a.student.toString() === student._id.toString()
      );

      const dailyStatus = {};

      if (month) {
        for (let d = 1; d <= totalDays; d++) {
          const dateStr = new Date(year, new Date(`${monthName} 1`).getMonth(), d)
            .toISOString()
            .split("T")[0];

          const record = studentAttendance.find(
            (r) => new Date(r.date).toISOString().split("T")[0] === dateStr
          );

          dailyStatus[d] = record ? record.status : "Absent";
        }
      } else {
        studentAttendance.forEach((r) => {
          const dateStr = new Date(r.date).toISOString().split("T")[0];
          dailyStatus[dateStr] = r.status;
        });
      }

      return {
        studentId: student._id,
        studentName: `${student.firstName} ${student.lastName}`,
        class: student.level_class?.Name || "N/A",
        section: student.section?.Name || "N/A",
        dailyStatus,
      };
    });

    res.status(200).json({
      success: true,
      month: monthName,
      year,
      totalDays,
      data: report,
    });
  } catch (error) {
    console.error("Error fetching attendance report:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};




//================== staff Monthly Attendance Report Controller ==================

const Employee = require("../../models/employeeModel");
const EmployeeAttendance = require("../../models/EmployeeAttendance/EmployeeAttendance");

exports.getStaffMonthlyAttendanceReport = async (req, res) => {
  try {
    const { role, month } = req.query;

    // Use current month if not passed
    const selectedMonth = month ? new Date(month) : new Date();
    const year = selectedMonth.getFullYear();
    const monthIndex = selectedMonth.getMonth();

    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);
    const totalDays = endDate.getDate();
    const allDates = Array.from({ length: totalDays }, (_, i) => new Date(year, monthIndex, i + 1));

    // Filter employees (all or by role)
    const employeeFilter = role ? { role } : {};
    const employees = await Employee.find(employeeFilter);

    // Filter attendance records
    const attendanceFilter = {
      date: { $gte: startDate, $lte: endDate },
    };
    if (role) attendanceFilter.role = role;

    const attendanceRecords = await EmployeeAttendance.find(attendanceFilter).populate("employee");

    // Generate report
    const report = employees.map((emp) => {
      const dailyStatus = allDates.map((date) => {
        const record = attendanceRecords.find(
          (r) =>
            r.employee &&
            r.employee._id.toString() === emp._id.toString() &&
            r.date.toDateString() === date.toDateString()
        );

        if (record) {
          switch (record.status) {
            case "Present": return "P";
            case "Absent": return "A";
            case "Late": return "L";
            case "Half Day": return "HD";
            default: return "-";
          }
        } else if ([0, 6].includes(date.getDay())) {
          return "W"; // Weekend
        } else {
          return "-"; // No record
        }
      });

      return {
        employeeId: emp._id,
        employeeName: emp.name,
        role: emp.role,
        dailyStatus,
      };
    });

    res.status(200).json({
      success: true,
      total: report.length,
      daysInMonth: totalDays,
      month: `${year}-${String(monthIndex + 1).padStart(2, "0")}`,
      data: report,
    });
  } catch (err) {
    console.error("Error generating staff attendance report:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};


//================== Daily Attendance Report Controller ==================
const Class = require("../../models/classModel");

// exports.getClassAttendanceSummary = async (req, res) => {
//   try {
//     const { date } = req.query;
//     if (!date) {
//       return res.status(400).json({ success: false, message: "Date is required" });
//     }

//     // Format date range for that day
//     const startDate = new Date(date);
//     startDate.setHours(0, 0, 0, 0);
//     const endDate = new Date(startDate);
//     endDate.setDate(startDate.getDate() + 1);

//     // Get all classes
//     const classes = await Class.find();

//     const summary = [];

//     for (const classItem of classes) {
//       // Get students of this class
//       const students = await Student.find({ level_class: classItem._id }).select("_id firstName lastName");

//       if (students.length === 0) {
//         summary.push({
//           className: classItem.Name,
//           totalStudents: 0,
//           totalPresent: 0,
//           totalAbsent: 0,
//           totalLate: 0,
//           totalHalfDay: 0,
//           presentPercentage: "0.00",
//           absentPercentage: "0.00",
//           students: [],
//         });
//         continue;
//       }

//       const studentIds = students.map((s) => s._id);

//       // Get attendance for students in this class on the given date
//       const attendance = await Attendance.find({
//         student: { $in: studentIds },
//         date: { $gte: startDate, $lt: endDate },
//       });

//       // Map attendance by student ID
//       const attendanceMap = {};
//       attendance.forEach((a) => {
//         attendanceMap[a.student.toString()] = a.status;
//       });

//       let totalPresent = 0;
//       let totalAbsent = 0;
//       let totalLate = 0;
//       let totalHalfDay = 0;

//       const studentList = [];

//       for (const student of students) {
//         const status = attendanceMap[student._id.toString()] || "Absent";

//         if (status === "Present") totalPresent++;
//         else if (status === "Absent") totalAbsent++;
//         else if (status === "Late") totalLate++;
//         else if (status === "Half Day") totalHalfDay++;

//         studentList.push({
//           id: student._id,
//           name: `${student.firstName} ${student.lastName}`,
//           status,
//         });
//       }

//       const totalStudents = students.length;
//       const presentPercentage = ((totalPresent / totalStudents) * 100).toFixed(2);
//       const absentPercentage = ((totalAbsent / totalStudents) * 100).toFixed(2);

//       summary.push({
//         className: classItem.Name,
//         totalStudents,
//         totalPresent,
//         totalAbsent,
//         totalLate,
//         totalHalfDay,
//         presentPercentage,
//         absentPercentage,
//         // students: studentList,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       date: startDate,
//       data: summary,
//     });
//   } catch (error) {
//     console.error("Error in class-wise attendance summary:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

exports.getClassAttendanceSummary = async (req, res) => {
  try {
    const inputDate = req.query.date
      ? new Date(req.query.date)
      : new Date();

    const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

    // Fetch all classes
    const classes = await Class.find();

    const result = [];

    for (let cls of classes) {
      const students = await Student.find({ level_class: cls._id });

      const studentIds = students.map((s) => s._id.toString());

      const attendanceRecords = await Attendance.find({
        classId: cls._id,
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      let totalPresent = 0;
      let totalAbsent = 0;
      let totalLate = 0;
      let totalHalfDay = 0;

      for (let student of students) {
        const record = attendanceRecords.find((att) =>
          att.student.toString() === student._id.toString()
        );

        if (!record || record.status === "Absent") {
          totalAbsent++;
        } else if (record.status === "Present") {
          totalPresent++;
        } else if (record.status === "Late") {
          totalLate++;
        } else if (record.status === "Half Day") {
          totalHalfDay++;
        }
      }

      const totalStudents = students.length;
      const presentPercentage =
        totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(2) : "0.00";
      const absentPercentage =
        totalStudents > 0 ? ((totalAbsent / totalStudents) * 100).toFixed(2) : "0.00";

      result.push({
        className: cls.name,
        totalStudents,
        totalPresent,
        totalAbsent,
        totalLate,
        totalHalfDay,
        presentPercentage,
        absentPercentage,
      });
    }

    res.status(200).json({
      success: true,
      date: startOfDay,
      data: result,
    });
  } catch (error) {
    console.error("Attendance report error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
