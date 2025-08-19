
const Admission = require("../models/admissionModel");
const bcrypt = require("bcryptjs");
const { uploadDocument, deleteImage } = require("../config/cloudinary");
const mongoose = require("mongoose")
const nodemailer = require("nodemailer");
// ✅ transporter ready
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sheetal.raghav0818@gmail.com",
    pass: "ejlz opdx vbyw wwfm",
  },
});
// ======================= CREATE ADMISSION ========================
exports.createAdmission = async (req, res) => {
  try {
    const {
      academic_year,
      level_class,
      section,
      admission_date,
      category,
      firstName,
      lastName,
      religion,
      bloodGroup,
      date_of_birth,
      gender,
      motherTongue,
      caste,
      mobile_no,
      email,
      city,
      state,
      present_address,
      permanentAddress,
      username,
      password,
      forget_password,
      guardianusername, // new field added
      guardianpassword, // new field added
      guardianconfirmPassword, // new field added
      guardian_name,
      relation,
      occupation,
      guardian_city,
      guardian_state,
      mobile_no_guardian,
      email_guardian,
      guardian_address,
      income,
      education,
      father_name,
      mother_name,
      document_name,
      document_number,
      transport_route,
      Vehicle_number,
      hostel_name,
      room_name,
      school_name,
      qualifications,
      remarks,
      status,
    } = req.body;

    // Fix room_name if it's accidentally sent as an array
let fixedRoomName = room_name;
if (Array.isArray(room_name)) {
  // Assume first item is the ObjectId
  fixedRoomName = room_name.find((v) => mongoose.Types.ObjectId.isValid(v));
}


    if (!level_class || !section || !firstName || !lastName || !username || !password) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const existingUser = await Admission.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let photo = "";
    let guardian_photo = "";

    if (req.files?.photo?.[0]) {
      const result = await uploadDocument(req.files.photo[0].buffer, "admission_images/photo");
      photo = result.url;
    }

    if (req.files?.guardian_photo?.[0]) {
      const result = await uploadDocument(req.files.guardian_photo[0].buffer, "admission_images/guardian_photo");
      guardian_photo = result.url;
    }

    const admission = new Admission({
      academic_year,
      level_class,
      section,
      admission_date: admission_date || new Date(),
      category,
      firstName,
      lastName,
      religion,
      bloodGroup,
      date_of_birth,
      gender,
      motherTongue,
      caste,
      mobile_no,
      email,
      city,
      state,
      present_address,
      permanentAddress,
      username,
      password: hashedPassword,
      forget_password,
      guardianusername, // new field added
      guardianpassword, // new field added
      guardianconfirmPassword, // new field added
      photo,
      guardian_name,
      relation,
      occupation,
      guardian_city,
      guardian_state,
      mobile_no_guardian,
      email_guardian,
      guardian_address,
      guardian_photo,
      income,
      education,
      father_name,
      mother_name,
      document_name,
      document_number,
      transport_route,
      Vehicle_number,
      hostel_name,
      room_name: fixedRoomName,
      school_name,
      qualifications,
      remarks,
      status,
    });

    const saved = await admission.save();
     // ✅ Send mail after saving
    const mailOptions = {
      from: "sheetal.raghav0818@gmail.com",
      to: email,
      subject: "🎓 Your Admission Registration Details",
      html: `
        <div style="padding: 20px; font-family: Arial;">
          <h2>Welcome ${firstName} ${lastName || ""}!!!,</h2>
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
          message: "Admission created successfully, but failed to send email.",
          data: saved,
        });
      } else {
        console.log("Email sent:", info.response);
        res.status(201).json({
          success: true,
          message: "Admission created and email sent successfully.",
          data: saved,
        });
      }
    });
  } catch (error) {
    console.error("Create Admission Error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// ======================= GET ALL ADMISSIONS ========================
exports.getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find()
      .select("-password")
      .populate("level_class")
      .populate("section")
      .populate("transport_route", "routeName")
      .populate("Vehicle_number", "vehicleNumber")
      .populate("hostel_name", "Hostel_Name")
      .populate("room_name", "roomName");

    res.status(200).json({ success: true, data: admissions });
  } catch (error) {
    console.error("Get All Admissions Error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// ======================= GET ADMISSION BY ID ========================
exports.getAdmissionById = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
      .select("-password")
      .populate("level_class")
      .populate("section")
      .populate("transport_route", "routeName")
      .populate("Vehicle_number", "vehicleNumber")
      .populate("hostel_name", "Hostel_Name")
      .populate("room_name", "roomName");

    if (!admission) return res.status(404).json({ error: "Admission not found" });

    res.status(200).json({ success: true, data: admission });
  } catch (error) {
    console.error("Get Admission By ID Error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// ======================= UPDATE ADMISSION ========================
exports.updateAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ error: "Admission not found" });

    const { password, ...rest } = req.body;

    if (password) rest.password = await bcrypt.hash(password, 10);

    if (req.files?.photo?.[0]) {
      if (admission.photo?.public_id) await deleteImage(admission.photo.public_id);
      const result = await uploadDocument(req.files.photo[0].buffer, "admission_images/photo");
      rest.photo = result.url;
    }

    if (req.files?.guardian_photo?.[0]) {
      if (admission.guardian_photo?.public_id) await deleteImage(admission.guardian_photo.public_id);
      const result = await uploadDocument(req.files.guardian_photo[0].buffer, "admission_images/guardian_photo");
      rest.guardian_photo = result.url;
    }

    const updated = await Admission.findByIdAndUpdate(req.params.id, rest, { new: true }).select("-password");

    res.status(200).json({ success: true, message: "Admission updated", data: updated });
  } catch (error) {
    console.error("Update Admission Error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// ======================= DELETE ADMISSION ========================
exports.deleteAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ error: "Admission not found" });

    if (admission.photo?.public_id) await deleteImage(admission.photo.public_id);
    if (admission.guardian_photo?.public_id) await deleteImage(admission.guardian_photo.public_id);

    await Admission.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Admission deleted successfully" });
  } catch (error) {
    console.error("Delete Admission Error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// ======================= LOGIN ========================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Please provide username and password" });
    }

    const user = await Admission.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({ success: true, message: "Login successful", data: userData });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// ======================= UPLOAD STUDENT DOCUMENT ========================
exports.uploadStudentDocument = async (req, res) => {
  try {
    const { admissionId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const urls = [];
    for (const file of req.files) {
      const result = await uploadDocument(file.buffer, "admission_documents", file.originalname, file.mimetype);
      if (result && result.url) urls.push(result.url);
    }

    const currentAdmission = await Admission.findById(admissionId);
    if (!currentAdmission) return res.status(404).json({ message: "Admission record not found" });

    let updateQuery;
    if (Array.isArray(currentAdmission.document)) {
      updateQuery = { $push: { document: { $each: urls } } };
    } else {
      const existingDocs = currentAdmission.document ? [currentAdmission.document] : [];
      updateQuery = { document: [...existingDocs, ...urls] };
    }

    const admission = await Admission.findByIdAndUpdate(admissionId, updateQuery, { new: true });

    res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      documentUrls: urls,
      admission,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Failed to upload documents", error: error.message });
  }
};
