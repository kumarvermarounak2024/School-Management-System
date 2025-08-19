const AdvanceSalary = require("../../models/Human_Resources_Model/advance_salaryModel");

// Create Advance Salary
exports.createAdvanceSalary = async (req, res) => {
  try {
    const { date, applicantName, designation, department, amount, reason } =
      req.body;

    if (
      !date ||
      !applicantName ||
      !designation ||
      !department ||
      !amount ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const advanceSalary = await AdvanceSalary.create({
      date,
      applicantName,
      designation,
      department,
      amount,
      reason,
    });

    res.status(201).json({
      success: true,
      data: advanceSalary,
    });
  } catch (error) {
    console.error("Error creating advance salary:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Advance Salaries with Populated References
exports.getAllAdvanceSalaries = async (req, res) => {
  try {
    const salaries = await AdvanceSalary.find()
      .populate("applicantName", "name profilePicture")  // include name + profilePicture
      .populate("designation", "name")
      .populate("department", "name");

    res.status(200).json({
      success: true,
      data: salaries,
    });
  } catch (error) {
    console.error("Error fetching salaries:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Get Advance Salary By ID
exports.getAdvanceSalaryById = async (req, res) => {
  try {
    const { id } = req.params;

    const salary = await AdvanceSalary.findById(id)
      .populate("applicantName", "name profilePicture")
      .populate("designation", "name")
      .populate("department", "name");

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Advance salary not found",
      });
    }

    res.status(200).json({
      success: true,
      data: salary,
    });
  } catch (error) {
    console.error("Error fetching salary by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

//================= Update Advance Salary ==================
exports.updateAdvanceSalary = async (req, res) => {
  try {
    const updateData = req.body;
    const { id } = req.params;

    const updatedAdvanceSalary = await AdvanceSalary.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAdvanceSalary) {
      return res.status(404).json({ message: 'AdvanceSalary record not found' });
    }

    res.status(200).json(updatedAdvanceSalary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//=============  Delete AdvanceSalary by ID =================
exports.deleteAdvanceSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdvanceSalary = await AdvanceSalary.findByIdAndDelete(id);

    if (!deletedAdvanceSalary) {
      return res.status(404).json({ message: 'AdvanceSalary record not found' });
    }

    res.status(200).json({ message: 'AdvanceSalary record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};