const Admission = require("../../models/admissionModel");
const FeePayment = require("../../models/Fee/feeAllocationModel");

// GET /api/fees/report
exports.getStudentFeeReport = async (req, res) => {
  try {
    const { level_class, section, studentId, feeType, startDate, endDate } = req.query;

    const filter = {};

    if (level_class) filter.level_class = level_class;
    if (section) filter.section = section;
    if (studentId) filter.student = studentId;
    if (feeType) filter.feeType = feeType;
    if (startDate && endDate) {
      filter.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const feeRecords = await FeePayment.find(filter)
      .populate("student", "registration_no roll_no firstName lastName admission_date level_class section")
      .populate("feeType")
      .populate("level_class", "name")
      .populate("section", "name")
      .sort({ paymentDate: -1 });

    const result = feeRecords.map((record, index) => ({
      SL: index + 1,
      registerNo: record.student?.registration_no || "",
      rollNo: record.student?.roll_no || "",
      studentName: `${record.student?.firstName || ""} ${record.student?.lastName || ""}`,
      feeType: record.feeType?.name || "",
      dueDate: record.dueDate?.split("T")[0] || "",
      paymentDate: record.paymentDate?.toISOString().split("T")[0] || "",
      paymentNo: record.paymentNo || "",
      paidAmount: record.paidAmount || 0,
      discount: record.discount || 0,
      admissionDate: record.student?.admission_date?.toISOString().split("T")[0] || "",
      total: record.total || 0,
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    console.error("Fee report error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
