const mongoose = require("mongoose");

const AdmissionSchema = new mongoose.Schema(
  {
    academic_year: String,
    level_class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    registration_no: {
      type: String,
      unique: true,
    },
    roll_no: String,
    admission_date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST", "EWS"],
      default: "General",
    },
 role: {
      type: String,
      enum: ["Student"],
      default: "Student",
    },
    // Student Details
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    religion: String,
    bloodGroup: String,
    date_of_birth: Date,
    gender: String,
    motherTongue: String,
    caste: String,
    mobile_no: String,
    email: String,
    city: String,
    state: String,
    present_address: {
      address: String,
      city: String,
      no_current_address: { type: Boolean, default: false },
    },
    permanentAddress: String,
    photo: { type: String, default: "" },

    // Login Details
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    forget_password: String,

    // Parent Details
     guardianusername: {     //new fieldd add 
      type: String,
      unique: true,
    },
    guardianpassword: {     //new fieldd add 
      type: String,
      required: true,
    },
    guardianconfirmPassword: {   //new fieldd add 
      type: String,
      required: true,
    },

    // Guardian Details
    guardian_name: String,
    relation: String,
    occupation: String,
    guardian_city: String,
    guardian_state: String,
    mobile_no_guardian: String,
    email_guardian: String,
    guardian_address: String,
    guardian_photo: { type: String, default: "" },
    income: String,
    education: String,
    father_name: String,
    mother_name: String,

    // Document Details
    document_name: String,
    document_number: String,

    // Transport Details
    transport_route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
    Vehicle_number: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    // Hostel Details
    hostel_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelMaster",
    },
    room_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelRoom",
    },

    // Previous School Details
    school_name: String,
    qualifications: String,
    remarks: String,

    document: [String],
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
     passwordResetOTP: {
      type: String,
    },
    
    passwordResetOTPExpires: {
      type: Date,
    },
      loginOTP: {
      type: String,
    },
      loginOTPExpiry: {
      type: String,
    },
     suspended: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

// Auto-generate registration_no like RMS-001
AdmissionSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    // Generate registration_no like RMS-001
    if (!this.registration_no) {
      const lastAdmission = await mongoose
        .model("Admission")
        .findOne({})
        .sort({ createdAt: -1 })
        .select("registration_no");

      let nextNumber = 1;

      if (lastAdmission?.registration_no) {
        const numberPart = parseInt(
          lastAdmission.registration_no.split("-")[1]
        );
        if (!isNaN(numberPart)) nextNumber = numberPart + 1;
      }

      const formatted = String(nextNumber).padStart(3, "0");
      this.registration_no = `RMS-${formatted}`;
    }

    // Generate roll_no based on level_class only
    if (!this.roll_no && this.level_class) {
      const lastRoll = await mongoose
        .model("Admission")
        .find({ level_class: this.level_class })
        .sort({ roll_no: -1 })
        .limit(1)
        .select("roll_no");

      let nextRoll = 1;

      if (lastRoll.length && !isNaN(parseInt(lastRoll[0].roll_no))) {
        nextRoll = parseInt(lastRoll[0].roll_no) + 1;
      }

      this.roll_no = String(nextRoll);
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Admission", AdmissionSchema);
