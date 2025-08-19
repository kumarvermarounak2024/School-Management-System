const Exam = require('../../models/Examination/exam.js');

const handleServerError = (res, error, status = 500, customMessage = 'Internal Server Error') => {
  console.error(`Error: ${customMessage}`, error);
  res.status(status).json({
    error: customMessage,
    details: error.message
  });
};

exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return handleServerError(res, error, 400, 'Validation Error');
    }
    handleServerError(res, error, 400, 'Failed to create exam');
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    if (error.name === 'CastError') {
      return handleServerError(res, error, 400, 'Invalid Exam ID format');
    }
    handleServerError(res, error);
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return handleServerError(res, error, 400, 'Validation Error');
    }
    if (error.name === 'CastError') {
      return handleServerError(res, error, 400, 'Invalid Exam ID format');
    }
    handleServerError(res, error, 400, 'Failed to update exam');
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return handleServerError(res, error, 400, 'Invalid Exam ID format');
    }
    handleServerError(res, error);
  }
};
