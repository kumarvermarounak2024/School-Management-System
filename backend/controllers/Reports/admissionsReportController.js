const Admission = require("../../models/admissionModel");


exports.filterAdmissions = async (req, res) => {
  try {
    const { level_class, section, startDate, endDate } = req.query;

    const filter = {};

    if (level_class) {
      filter.level_class = level_class;
    }

    if (section) {
      filter.section = section;
    }

    if (startDate && endDate) {
      filter.admission_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const admissions = await Admission.find(filter)
      .populate("level_class", "Name")
      .populate("section", "Name")
      .sort({ admission_date: -1 });

    const studentData = admissions.map((student, index) => ({
      SL: index + 1,
      name: `${student.firstName} ${student.lastName}`,
      gender: student.gender,
      registerNo: student.registration_no,
      rollNo: student.roll_no,
      class: student.level_class?.Name || "N/A",
      section: student.section?.Name || "N/A",
      guardianName: student.guardian_name,
      admissionDate: student.admission_date.toISOString().split("T")[0], // yyyy-mm-dd
    }));

    res.status(200).json({
      success: true,
      count: studentData.length,
      data: studentData,
    });
  } catch (err) {
    console.error("Filter error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};