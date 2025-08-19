const Question = require("../../models/Online_Exams/questionModel");

exports.createQuestion = async (req, res) => {
  try {
    const {
      classId,
      subjectId,
      type,
      marks,
      questionText,
      options,
      correctOptionIndex,
      answer,
    } = req.body;

    if (!classId || !subjectId || !type || !marks || !questionText) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const questionData = {
      classId,
      subjectId,
      type,
      marks,
      questionText,
    };

    if (type === "Objective") {
      if (!Array.isArray(options) || options.length < 2) {
        return res
          .status(400)
          .json({
            error: "At least two options are required for Objective type.",
          });
      }
      if (
        correctOptionIndex === undefined ||
        correctOptionIndex < 0 ||
        correctOptionIndex >= options.length
      ) {
        return res
          .status(400)
          .json({ error: "Valid correctOptionIndex is required." });
      }
      questionData.options = options.map((opt) => ({ text: opt }));
      questionData.correctOptionIndex = correctOptionIndex;
    } else {
      if (answer === undefined || answer === null) {
        return res
          .status(400)
          .json({ error: "Answer is required for this question type." });
      }
      questionData.answer = answer;
    }

    const question = new Question(questionData);
    await question.save();

    res.status(201).json({ message: "Question saved successfully", question });
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getAllQuestions = async (req, res) => {
  try {
    const { classId, subjectId } = req.query;
    const filter = {};
    if (classId) filter.classId = classId;
    if (subjectId) filter.subjectId = subjectId;

    const questions = await Question.find(filter)
      .populate('classId', 'name')
      .populate('subjectId', 'name');

    res.status(200).json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('classId', 'name')
      .populate('subjectId', 'name');

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (err) {
    console.error('Error fetching question:', err);
    res.status(500).json({ error: 'Server error' });
  }
};