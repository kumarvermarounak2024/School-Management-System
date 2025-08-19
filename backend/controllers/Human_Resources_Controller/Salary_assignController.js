const Employee = require("../../models/employeeModel");
const SalaryAssign = require("../../models/Human_Resources_Model/Salary_assignModel");
const Designation = require("../../models/designationModel");
const SalaryTemplate = require("../../models/Human_Resources_Model/PayrollModel");

// ========= Get Employees Filtered by Role and Designation ========
exports.getEmployeesByRoleDesignation = async (req, res) => {
  try {
    const { role, designation } = req.query;

    if (!role || !designation) {
      return res.status(400).json({
        success: false,
        message: "Both 'role' and 'designation' are required.",
      });
    }

    const designationDoc = await Designation.findOne({ name: designation });

    if (!designationDoc) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    const employees = await Employee.find({
      role,
      designation: designationDoc._id,
    })
      // .populate("designation", "name")
      // .populate("department", "name");
    // .select("_id name designation department");

    return res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//  ============ Assign Salary Grade to Employees ================
exports.assignSalaryGrade = async (req, res) => {
  try {
    const { assignments } = req.body;
    console.log(assignments, "assignments");

    const savedAssignments = [];

    for (const assignment of assignments) {
      const { employeeId, gradeId } = assignment;

      // Fetch employee to get designation
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: `Employee with ID ${employeeId} not found.`,
        });
      }

      // Create and save SalaryAssign
      const newAssign = new SalaryAssign({
        employeeId,
        gradeId,
        designation: employee.designation,
      });

      const saved = await newAssign.save();
      savedAssignments.push(saved);
    }

    return res.status(201).json({
      success: true,
      message: "Salary grades assigned successfully",
      data: savedAssignments,
    });
  } catch (error) {
    console.error("Error assigning salary grade:", error);
    return res.status(500).json({
      success: false,
      message: "Assignment failed due to server error",
    });
  }
};

exports.getAllAssign = async (req, res) => {
  try {
    const assignments = await SalaryAssign.find()
      .populate({
        path: "employeeId",
        populate: [
          { path: "designation" },
          { path: "department" },
        ],
      })
      .populate({
        path: "gradeId",
      })

    return res.status(200).json({
      success: true,
      message: "Fetched all salary grade assignments with full details",
      data: assignments,
    });
  } catch (error) {
    console.error("Error fetching assigned salary grades:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch assignments due to server error",
    });
  }
};

// Get All Salary Grades (for dropdown)
exports.getSalaryGrades = async (req, res) => {
  try {
    const grades = await SalaryTemplate.find({});

    const enrichedGrades = grades.map((grade) => {
      const totalAllowances =
        grade.allowances?.reduce((acc, a) => acc + a.amount, 0) || 0;
      const totalDeductions =
        grade.deductions?.reduce((acc, d) => acc + d.amount, 0) || 0;
      const totalSalary = grade.basicSalary + totalAllowances - totalDeductions;

      return {
        ...grade._doc,
        totalAllowances,
        totalDeductions,
        totalSalary,
      };
    });

    res.status(200).json({ success: true, data: enrichedGrades });
  } catch (error) {
    console.error("Error fetching salary grades:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch salary grades" });
  }
};

//================ Get Salary Assignment by Employee ID ================

exports.getAssignByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const assignment = await SalaryAssign.findOne({ employeeId })
      .populate({
        path: "employeeId",
        populate: [
          { path: "designation" },
          { path: "department" },
        ],
      })
      .populate("gradeId");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "No assignment found for this employee",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched salary assignment by employee ID",
      data: assignment,
    });
  } catch (error) {
    console.error("Error fetching assignment by employee ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching assignment",
    });
  }
};

