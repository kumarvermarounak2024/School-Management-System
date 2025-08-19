const SalaryTemplate = require("../../models/Human_Resources_Model/PayrollModel");

// ============== Create =============== 
exports.createSalaryTemplate = async (req, res) => {
  try {
    const { salaryGrade, basicSalary, overtimeRate, allowances, deductions, finalSalary} = req.body;

    // Validate required fields
    if (!salaryGrade || !basicSalary) {
      return res.status(400).json({ message: 'Salary grade and basic salary are required.' });
    }

    const newTemplate = new SalaryTemplate({
      salaryGrade,
      basicSalary,
      overtimeRate,
      allowances,
      deductions,
      finalSalary
    });

    const savedTemplate = await newTemplate.save();
    res.status(201).json({ message: 'Salary template created successfully.', data: savedTemplate });
  } catch (error) {
    console.error('Error creating salary template:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// ===================== Get all salary =================== 
exports.getAllSalaryTemplates = async (req, res) => {
  try {
    const templates = await SalaryTemplate.find().sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching salary templates:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// ================= Get salary template by ID ===============
exports.getSalaryTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await SalaryTemplate.findById(id);

    if (!template) {
      return res.status(404).json({ message: 'Salary template not found.' });
    }

    res.status(200).json(template);
  } catch (error) {
    console.error('Error fetching salary template by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// ============== Delete salary template ==================
exports.deleteSalaryTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SalaryTemplate.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    res.status(200).json({ message: 'Salary template deleted successfully.' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

//  ================== Update salary template by ID ================== 
exports.updateSalaryTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { salaryGrade, basicSalary, overtimeRate, allowances, deductions } = req.body;

    // Validate required fields
    if (!salaryGrade || !basicSalary) {
      return res.status(400).json({ message: 'Salary grade and basic salary are required.' });
    }

    const updatedTemplate = await SalaryTemplate.findByIdAndUpdate(
      id,
      {
        salaryGrade,
        basicSalary,
        overtimeRate,
        allowances,
        deductions
      },
      { new: true, runValidators: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Salary template not found.' });
    }

    res.status(200).json({ message: 'Salary template updated successfully.', data: updatedTemplate });
  } catch (error) {
    console.error('Error updating salary template:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
