const BookIssue = require("../../models/Library/bookIssueAndReturnModel");

// ========== Create Book Issue ==========
exports.createBookIssue = async (req, res) => {
  try {
    const {
      bookCategory,
      bookTitle,
      issuedTo,
      class: classId,
      user,
      issueDate,
      expiryDate,
      fine,
      status,
    } = req.body;

    const newIssue = new BookIssue({
      bookCategory,
      bookTitle,
      issuedTo,
      class: classId,
      user,
      issueDate,
      expiryDate,
      fine,
      status,
    });

    await newIssue.save();

    res.status(201).json({
      success: true,
      message: "Book issued successfully",
      data: newIssue,
    });
  } catch (error) {
    console.error("Error issuing book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to issue book",
      error: error.message,
    });
  }
};

// ========== Get All Book Issues ==========
exports.getAllBookIssues = async (req, res) => {
  try {
    const issues = await BookIssue.find()
     .populate("bookCategory", "name")
      .populate("bookTitle", "title author edition coverImage")
      .populate("class","Name")
      .populate("issuedTo", "name")
      .populate("user", "firstName lastName");

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    console.error("Error fetching book issues:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch book issues",
      error: error.message,
    });
  }
};

// ========== Get Single Book Issue ==========
exports.getBookIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await BookIssue.findById(id)
      .populate("bookCategory", "name")
      .populate("bookTitle", "title author edition coverImage")
      .populate("class","Name")
      .populate("issuedTo", "name")
      .populate("user", "firstName lastName");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Book issue record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    console.error("Error fetching book issue:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch book issue",
      error: error.message,
    });
  }
};

// ========== Delete Book Issue ==========
exports.deleteBookIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BookIssue.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Book issue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book issue deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book issue:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete book issue",
      error: error.message,
    });
  }
};

// ========== Update Book Issue ==========
exports.updateBookIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedIssue = await BookIssue.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("bookCategory", "name")
      .populate("bookTitle", "title author edition coverImage")
      .populate("class", "className");

    if (!updatedIssue) {
      return res.status(404).json({
        success: false,
        message: "Book issue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book issue updated successfully",
      data: updatedIssue,
    });
  } catch (error) {
    console.error("Error updating book issue:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update book issue",
      error: error.message,
    });
  }
};
