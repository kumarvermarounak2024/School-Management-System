const EmployeeAttendance = require("../../models/EmployeeAttendance/EmployeeAttendance");


// // ======================= Create attendance ========================
// exports.createAttendance = async (req, res) => {
//   try {
//     const attendance = await EmployeeAttendance.create(req.body);
//     res.status(201).json({ success: true, data: attendance });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// //================== Get attendance by role and date ==================
// exports.getAttendanceByRoleAndDate = async (req, res) => {
//   try {
//     const { role, date } = req.query;

//     const records = await EmployeeAttendance.find({
//       role,
//       date: new Date(date),
//     }).populate("employee", "name staffId photo");

//     res.status(200).json({ success: true, data: records });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

//================= Get attendance report for one employee ===============
exports.getEmployeeReport = async (req, res) => {
  try {
    const { employeeId, fromDate, toDate } = req.query;

    const attendance = await EmployeeAttendance.find({
      employee: employeeId,
      date: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
    })
      .populate("employee", "name staffId profilePhoto") 
      .sort({ date: 1 });

    const totalPresent = attendance.filter((a) => a.status === "Present").length;
    const totalAbsent = attendance.filter((a) => a.status === "Absent").length;

    res.status(200).json({
      success: true,
      data: attendance,
      summary: {
        totalPresent,
        totalAbsent,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



const Employee = require('../../models/employeeModel');

exports.getEmployeesByRole = async (req, res) => {
  try {
    const { role } = req.query;

    if (!role) {
      return res.status(400).json({ message: 'Role is required.' });
    }

    const employees = await Employee.find({ role }).select('name staffId profilePicture');
    res.status(200).json({
      success: true,
      role,
      employees
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const { role, date, attendances } = req.body;

    if (!role || !date || !Array.isArray(attendances)) {
      return res.status(400).json({ message: 'role, date, and attendances are required' });
    }

    // Optional: remove previous records for same date & role
    await EmployeeAttendance.deleteMany({ role, date });

    const records = attendances.map((entry) => ({
      date,
      role,
      employee: entry.employeeId,
      status: entry.status,
      remarks: entry.remarks || ""
    }));

    const saved = await EmployeeAttendance.insertMany(records);

    res.status(201).json({ success: true, message: "Attendance saved", data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};