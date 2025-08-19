const Employee = require("../models/employeeModel");
const bcrypt = require("bcrypt");
const { uploadDocument, deleteDocument } = require("../config/cloudinary");
const nodemailer = require("nodemailer");
// ✅ transporter ready
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sheetal.raghav0818@gmail.com",
    pass: "ejlz opdx vbyw wwfm",
  },
});
// Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      name,
      gender,
      religion,
      bloodGroup,
      dob,
      mobile,
      email,
      presentAddress,
      permanentAddress,
      role,
      joiningDate,
      department,
      designation,
      qualification,
      experienceDetails,
      totalExperience,
      username,
      password,
      // Social links (flattened)
      facebook,
      twitter,
      linkedin,
      instagram,
      // Bank details (flattened)
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankBranch,
      bankAddress,
      status,
      // Document metadata
      documentMeta
    } = req.body;


     // ✅ Check if email already exists
    const existingEmail = await Employee.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Reconstruct nested objects
    const socialLinks = { 
      facebook: facebook || "", 
      twitter: twitter || "", 
      linkedin: linkedin || "", 
      instagram: instagram || "" 
    };
    
    const bankDetails = {
      bankName: bankName || "",
      accountHolderName: accountHolderName || "",
      accountNumber: accountNumber || "",
      ifscCode: ifscCode || "",
      bankBranch: bankBranch || "",
      bankAddress: bankAddress || "",
    };

    // Upload profile picture to Cloudinary
    let profilePictureUrl = null;
    if (req.files?.profilePicture && req.files.profilePicture[0]) {
      const profile = req.files.profilePicture[0];
      const uploaded = await uploadDocument(
        profile.buffer,
        "employee_profiles",
        profile.originalname,
        profile.mimetype
      );
      profilePictureUrl = uploaded?.url || null;
    }

    // Upload documents
    let document_details = [];
    if (req.files?.documents && req.files.documents.length > 0) {
      let documentMetaArray = [];
      
      // Parse document metadata if it exists
      if (documentMeta) {
        try {
          documentMetaArray = JSON.parse(documentMeta);
        } catch (error) {
          console.error("Error parsing document metadata:", error);
          documentMetaArray = [];
        }
      }

      document_details = await Promise.all(
        req.files.documents.map(async (docFile, index) => {
          const uploaded = await uploadDocument(
            docFile.buffer,
            "employee_documents",
            docFile.originalname,
            docFile.mimetype
          );
          
          const metadata = documentMetaArray[index] || {};
          
          return {
            title: metadata.title || "Untitled",
            documentType: metadata.documentType || "Other",
            document_file: uploaded?.url || null,
            remarks: metadata.remarks || "",
            createdAt: metadata.createdAt || new Date().toISOString()
          };
        })
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee
    const employee = new Employee({
      name,
      gender,
      religion,
      bloodGroup,
      dob,
      mobile,
      email,
      presentAddress,
      permanentAddress,
      role,
      joiningDate,
      department,
      designation,
      qualification,
      experienceDetails,
      totalExperience,
      username,
      password: hashedPassword,
      retypePassword: hashedPassword, // You might want to remove this field from the model
      socialLinks,
      bankDetails,
      profilePicture: profilePictureUrl,
      document_details,
      status: status || "Active",
    });

    await employee.save();





    // ✅ Send mail after saving
    const mailOptions = {
      from: "sheetal.raghav0818@gmail.com",
      to: email,
      subject: "🎓 Your Admission Registration Details",
      html: `
        <div style="padding: 20px; font-family: Arial;">
          <h2>Welcome ${name || ""}!!!,</h2>
          <h2>Role: ${role}</h2>
          <p>Your admission has been successfully registered.</p>
          <p>Here are your login credentials:</p>
          <ul>
            <li><strong>Username (Email):</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p>Please keep this information safe.</p>
          <p>Thank you!</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        // email error ko bhi dikha sakte hain par registration to success hoga
        return res.status(201).json({
          success: true,
          message: "Employee created successfully, but failed to send email.",
          data: saved,
        });
      } else {
        res.status(201).json({
          success: true,
          message: "Employee created and email sent successfully.",
          data: saved,
        });
      }
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server error" 
    });
  }
};

// =================== Update Employee =================== 
exports.updateEmployee = async (req, res) => {
  try {
    const { password, status, facebook, twitter, linkedin, instagram, bankName, accountHolderName, accountNumber, ifscCode, ...updateData } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Optional: Validate status
    if (status && !["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    if (status) {
      updateData.status = status;
    }

    // Update social links if provided
    updateData.socialLinks = {
      facebook: facebook || employee.socialLinks?.facebook,
      twitter: twitter || employee.socialLinks?.twitter,
      linkedin: linkedin || employee.socialLinks?.linkedin,
      instagram: instagram || employee.socialLinks?.instagram,
    };

    // Update bank details if provided
    updateData.bankDetails = {
      bankName: bankName || employee.bankDetails?.bankName,
      accountHolderName: accountHolderName || employee.bankDetails?.accountHolderName,
      accountNumber: accountNumber || employee.bankDetails?.accountNumber,
      ifscCode: ifscCode || employee.bankDetails?.ifscCode,
    };

    // File updates
    if (req.files && req.files["profilePicture"]) {
      updateData.profilePicture = req.files["profilePicture"][0].filename;
    }

    if (req.files && req.files["documents"]) {
      updateData.document_details = req.files["documents"].map((doc) => doc.filename);
    }

    // Hash password if provided
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
      updateData.retypePassword = hashed;
    }

    Object.assign(employee, updateData);
    await employee.save();

    const empObj = employee.toObject();
    delete empObj.password;

    res.json({
      success: true,
      message: "Employee updated successfully",
      employee: empObj,
    });

  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


// ============== Delete Employee =================== 
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Delete profile picture from Cloudinary if it's stored there
    if (employee.profilePicture?.includes("cloudinary.com")) {
      const parts = employee.profilePicture.split("/");
      const publicIdWithExt = parts[parts.length - 1];
      const publicId = publicIdWithExt.split(".")[0];
      await deleteDocument(`employee_profiles/${publicId}`, "image");
    }

    // Delete all documents from Cloudinary
    if (Array.isArray(employee.document_details) && employee.document_details.length > 0) {
      for (const doc of employee.document_details) {
        if (doc && doc.document_file?.includes("cloudinary.com")) {
          const parts = doc.document_file.split("/");
          const publicIdWithExt = parts[parts.length - 1];
          const publicId = publicIdWithExt.split(".")[0];
          await deleteDocument(`employee_documents/${publicId}`, "raw");
        }
      }
    }

    // Delete employee from database
    await employee.deleteOne();

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Error deleting employee", error: error.message });
  }
};

// ================= Get Employee By ID================ 
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("department designation")
      .select("-password -retypePassword");

    if (!employee) return res.status(404).json({ message: "Employee not found" });
console.log(employee.document_details); // after creation

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error: error.message });
  }
};

// ========== Get All Employees with Pagination & Search ============= 
// exports.getEmployees = async (req, res) => {
//   try {
//     // const { page = 1, limit = 10, search = "" } = req.query;

//     // const query = search
//     //   ? {
//     //       $or: [
//     //         { name: { $regex: search, $options: "i" } },
//     //         { email: { $regex: search, $options: "i" } },
//     //         { username: { $regex: search, $options: "i" } },
//     //       ],
//     //     }
//     //   : {};

//     const employees = await Employee.find(query)
//       .populate("department designation")
//       .select("staffId name email gender mobile role username bloodGroup religion department designation mobile dob presentAddress permanentAddress profilePicture bankDetails document_details") // include what you need
//       // .skip((page - 1) * limit)
//       // .limit(Number(limit));

//     const total = await Employee.countDocuments(query);

//     res.json({
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / limit),
//       employees,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching employees", error: error.message });
//   }
// };

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("department designation")
      .select(
        "staffId name email gender mobile role username bloodGroup religion department designation mobile dob presentAddress permanentAddress profilePicture bankDetails document_details"
      );

    res.status(200).json({
      success: true,
      total: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employees",
      error: error.message,
    });
  }
};
