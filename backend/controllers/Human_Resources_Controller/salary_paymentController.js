const SalaryAssign = require("../../models/Human_Resources_Model/Salary_assignModel");
const SalaryPayment = require("../../models/Human_Resources_Model/salary_paymentModel");
const Employee = require("../../models/employeeModel");



exports.createSalaryPaymentsFromAssign = async (req, res) => {
  try {
    const {
      employeeId,
      salaryassignId,
      salaryGrade,
      month,
      amount,
      status,
    } = req.body;

    // Simple validation
    if (!employeeId || !salaryassignId || !salaryGrade || !month || !amount) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if salary already paid for this employee in this month
    const existingPayment = await SalaryPayment.findOne({
      employeeId,
      month,
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Salary already paid for this employee for this month",
      });
    }

    const payment = new SalaryPayment({
      employeeId,
      salaryassignId,
      salaryGrade,
      month,
      amount,
      status,
    });

    const savedPayment = await payment.save();

    res.status(201).json({
      success: true,
      message: "Salary paid successfully",
      data: savedPayment,
    });
  } catch (error) {
    console.error("Error paying salary manually:", error);
    res.status(500).json({
      success: false,
      message: "Failed to pay salary",
      error: error.message,
    });
  }
};


//  =============== GET ALL SALARY PAYMENTS =============== //

exports.getSalaryPayments = async (req, res) => {
  try {
    const { role, month } = req.query;
    let filter = {};

    // Filter by role if provided
    if (role) {
      const employees = await Employee.find({ role }).select("_id");
      const employeeIds = employees.map((e) => e._id);
      filter.employeeId = { $in: employeeIds };
    }

    // Filter by month if provided
    if (month) {
      filter.month = month;
    }

    const payments = await SalaryPayment.find(filter)
      .populate({
        path: "employeeId",
        select: "employeeCode name role designation department mobileNumber",
        populate: [
          {
            path: "designation",
            select: "name",
          },
          {
            path: "department",
            select: "name",
          },
        ],
      })
      .populate({
        path: "salaryGrade",
        select: "grade basicSalary",
      })
      .populate({
        path: "salaryassignId",
        select: "assignedAt",
      });

    res.status(200).json({
      success: true,
      message: "Salary payments fetched successfully",
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching salary payments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
