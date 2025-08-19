// const ClassSchedule = require('../../models/Academic/classscheduleModel'); 

// //==================  Create a new class schedule ==================//
// exports.createClassSchedule = async (req, res) => {
//   try {
//     const { level_class, section, day } = req.body;

//     const existing = await ClassSchedule.findOne({ level_class, section, day });
//     if (existing) {
//       return res.status(400).json({ message: "Schedule already exists for this class, section, and day." });
//     }

//     const schedule = new ClassSchedule({ level_class, section, day });
//     await schedule.save();

//     res.status(201).json({ success: true, data: schedule });
//   } catch (error) {
//     console.error("Create Schedule Error:", error);
//     res.status(500).json({ error: "Server Error", message: error.message });
//   }
// };

// // ================= Get all class schedules =======================
// exports.getAllClassSchedules = async (req, res) => {
//   try {
//     const schedules = await ClassSchedule.find()
//       .populate('level_class')
//       .populate('section');

//     res.status(200).json({ success: true, data: schedules });
//   } catch (error) {
//     console.error("Get All Schedules Error:", error);
//     res.status(500).json({ error: "Server Error", message: error.message });
//   }
// };

// // Get a schedule by ID
// exports.getClassScheduleById = async (req, res) => {
//   try {
//     const schedule = await ClassSchedule.findById(req.params.id)
//       .populate('level_class')
//       .populate('section');

//     if (!schedule) {
//       return res.status(404).json({ message: "Schedule not found" });
//     }

//     res.status(200).json({ success: true, data: schedule });
//   } catch (error) {
//     console.error("Get Schedule By ID Error:", error);
//     res.status(500).json({ error: "Server Error", message: error.message });
//   }
// };

// // Update a schedule by ID
// exports.updateClassSchedule = async (req, res) => {
//   try {
//     const { level_class, section, day } = req.body;

//     const updated = await ClassSchedule.findByIdAndUpdate(
//       req.params.id,
//       { level_class, section, day },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "Schedule not found" });
//     }

//     res.status(200).json({ success: true, data: updated });
//   } catch (error) {
//     console.error("Update Schedule Error:", error);
//     res.status(500).json({ error: "Server Error", message: error.message });
//   }
// };

// Delete a schedule
// exports.deleteClassSchedule = async (req, res) => {
//   try {
//     const deleted = await ClassSchedule.findByIdAndDelete(req.params.id);

//     if (!deleted) {
//       return res.status(404).json({ message: "Schedule not found" });
//     }

//     res.status(200).json({ success: true, message: "Schedule deleted" });
//   } catch (error) {
//     console.error("Delete Schedule Error:", error);
//     res.status(500).json({ error: "Server Error", message: error.message });
//   }
// };

const ClassSchedule = require('../../models/Academic/classscheduleModel');

// ========== Create a new schedule ==========
exports.createClassSchedule = async (req, res) => {
  try {
    const {
      employeeId,
      subjectId,
      level_class,
      section,
      startTime,
      endTime,
      day,
      class_room
    } = req.body;

    const schedule = new ClassSchedule({
      employeeId,
      subjectId,
      level_class,
      section,
      startTime,
      endTime,
      day,
      class_room
    });

    await schedule.save();

    const populatedSchedule = await ClassSchedule.findById(schedule._id)
      .populate('employeeId', 'name staffId')
      .populate('subjectId', 'subjectName')
      .populate('level_class', 'className')
      .populate('section', 'name');

    res.status(201).json({ success: true, data: populatedSchedule });
  } catch (error) {
    console.error("Create Schedule Error:", error);
    res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// ========== Get all schedules ==========
// ========== Get all schedules ==========
exports.getAllClassSchedules = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;

    // Dynamically build the filter
    const filter = {};
    if (classId) filter.level_class = classId;
    if (sectionId) filter.section = sectionId;

    const schedules = await ClassSchedule.find(filter)
      .populate('employeeId', 'name staffId')
      .populate('subjectId', 'subjectName')
      .populate('level_class', 'className')
      .populate('section', 'name');

    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    console.error("Get All Schedules Error:", error);
    res.status(500).json({ error: "Server Error", message: error.message });
  }
};


// ========== Get schedule by ID ==========
exports.getClassScheduleById = async (req, res) => {
  try {
    const schedule = await ClassSchedule.findById(req.params.id)
      .populate('employeeId', 'name staffId')
      .populate('subjectId', 'subjectName code')
      .populate('level_class', 'className')
      .populate('section', 'name');

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    console.error("Get Schedule By ID Error:", error);
    res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// ========== Update schedule by ID ==========
exports.updateClassScheduleById = async (req, res) => {
  try {
    const {
      employeeId,
      subjectId,
      level_class,
      section,
      startTime,
      endTime,
      day,
      class_room
    } = req.body;

    const updated = await ClassSchedule.findByIdAndUpdate(
      req.params.id,
      { employeeId, subjectId, level_class, section, startTime, endTime, day, class_room },
      { new: true }
    )
      .populate('employeeId', 'name staffId')
      .populate('subjectId', 'subjectName code')
      .populate('level_class', 'className')
      .populate('section', 'name');

    if (!updated) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Update Schedule Error:", error);
    res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// ========== Delete schedule ==========
exports.deleteClassSchedule = async (req, res) => {
  try {
    const deleted = await ClassSchedule.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json({ success: true, message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Delete Schedule Error:", error);
    res.status(500).json({ error: "Server Error", message: error.message });
  }
};
