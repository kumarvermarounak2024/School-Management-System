// controllers/admissionController.js
const Admission = require("../../models/admissionModel");

exports.getAdmissionCounts = async (req, res) => {
  try {
    const { classId, sectionId, startDate, endDate } = req.query;

    const filter = {};
    if (classId) filter.level_class = classId;
    if (sectionId) filter.section = sectionId;
    if (startDate && endDate) {
      filter.admission_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const admissions = await Admission.find(filter)
      .populate("level_class") // class name
      .populate("section")     // section name
      .sort({ admission_date: -1 });

    const formatted = admissions.map((item, index) => ({
      SL: index + 1,
      name: `${item.firstName} ${item.lastName}`,
      gender: item.gender,
      registration_no: item.registration_no,
      roll_no: item.roll_no,
      class: item.level_class?.Name || "",    // populated
      section: item.section?.Name || "",      // populated
      guardian_name: item.guardian_name,
      admission_date: item.admission_date.toISOString().split("T")[0],
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
      dateRange: `${startDate} to ${endDate}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


