const Admission = require("../models/admissionModel");

exports.getStudents = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;

    const filter = {};
    if (classId && classId !== "All") {
      filter.level_class = classId;
    }
    if (sectionId && sectionId !== "All") {
      filter.section = sectionId;
    }

    const students = await Admission.find(filter)
      .populate("level_class") 
      .populate("section");

    // const formatted = students.map((student) => {
    //   return {
    //     photo: student.photo,
    //     name: `${student.firstName} ${student.lastName}`,
    //     class: student.level_class?.name || "",
    //     section: student.section?.name || "",
    //     registration_no: student.registration_no,
    //     roll: student.roll,
    //     age: calculateAge(student.date_of_birth),
    //     guardian: student.guardian_name,
    //   };
    // });

    res.status(200).json({
      success: true,
      full: students,
      // formatted,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// function calculateAge(date_of_birth) {
//   if (!date_of_birth) return null;
//   const ageDifMs = Date.now() - new Date(date_of_birth).getTime();
//   const ageDate = new Date(ageDifMs);
//   return Math.abs(ageDate.getUTCFullYear() - 1970);
// }
