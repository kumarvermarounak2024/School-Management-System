const TeacherSchedule = require("../../models/Academic/TeacherScheduleModel");

// Create Teacher Schedule
const createTeacherSchedule = async (req, res) => {
  try {
    const { class_teacher } = req.body;

    const newSchedule = new TeacherSchedule({
      class_teacher,
    });

    const savedSchedule = await newSchedule.save();

    res.status(201).json({
      success: true,
      message: "Teacher schedule created successfully",
      data: savedSchedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating teacher schedule",
      error: error.message,
    });
  }
};

// Get all Teacher Schedules
const getAllTeacherSchedules = async (req, res) => {
  try {
    const schedules = await TeacherSchedule.find().populate("class_teacher");

    res.status(200).json({
      success: true,
      message: "All teacher schedules fetched successfully",
      data: schedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teacher schedules",
      error: error.message,
    });
  }
};

// Get a single Teacher Schedule by ID
const getTeacherScheduleById = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await TeacherSchedule.findById(id).populate("class_teacher");

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Teacher schedule not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher schedule fetched successfully",
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teacher schedule",
      error: error.message,
    });
  }
};

module.exports = {
  createTeacherSchedule,
  getAllTeacherSchedules,
  getTeacherScheduleById,
};
