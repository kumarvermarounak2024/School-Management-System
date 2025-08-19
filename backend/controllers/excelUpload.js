
// const xlsx = require('xlsx');
// const fs = require('fs');
// // Optional: use jsonschema for schema validation
// // const { validate } = require('jsonschema');

// // Optional schema (uncomment if using jsonschema validation)
// /*
// const excelSchema = {
//   type: 'object',
//   required: ['name', 'email', 'age'],
//   properties: {
//     name: { type: 'string' },
//     email: { type: 'string', format: 'email' },
//     age: { type: 'integer' },
//   },
// };
// */

// exports.uploadExcel = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }
//   console.log('File uploaded :=====>', req.file.originalname);


//   try {
//     const workbook = xlsx.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const jsonData = xlsx.utils.sheet_to_json(sheet);

//     // ✅ Basic manual validation (name, email, age must exist, age must be number)
//     const validData = jsonData.filter(row =>
//       row.name && row.email && Number.isInteger(row.age)
//     );

//     // ✅ Optional: Use JSON schema validation instead (requires `jsonschema` package)
//     /*
//     const validData = jsonData.filter((row) => {
//       const result = validate(row, excelSchema);
//       if (!result.valid) {
//         console.error('Invalid row:', row, result.errors);
//       }
//       return result.valid;
//     });
//     */

//     // Delete the uploaded file after processing
//     fs.unlinkSync(req.file.path);

//     // Send the response
//     res.status(200).json({
//       message: 'Excel uploaded and processed successfully',
//       rowsProcessed: validData.length,
//       data: validData,
//     });
//   } catch (error) {
//     console.error('Error processing Excel file:', error);
//     res.status(500).json({ message: 'Failed to process file' });
//   }
// };


// controllers/admissionController.js
const xlsx = require('xlsx');
const fs = require('fs');
const Admission = require('../models/admissionModel');

exports.uploadExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const { level_class, section } = req.body;

    if (!level_class || !section) {
      return res.status(400).json({ message: 'level_class and section are required' });
    }

    const dataToInsert = jsonData.map((row) => ({
      ...row,
      level_class,
      section,
    }));

    const insertedRecords = await Admission.insertMany(dataToInsert, { ordered: false });

    fs.unlinkSync(req.file.path); // delete uploaded file

    res.status(200).json({
      message: 'Excel uploaded and data saved',
      recordsInserted: insertedRecords.length,
      data: insertedRecords,
    });
  } catch (error) {
    console.error('Excel upload error:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
};
