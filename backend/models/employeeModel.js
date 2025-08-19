const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    religion: String,
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    dob: {
      type: Date,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    profilePicture: String,
    role: {
      type: String,
      enum: ["Admin", "Teacher", "Accountant", "Librarian", "Receptionist"],
      required: true,
    },
    joiningDate: Date,
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
    },
    qualification: String,
    experienceDetails: String,
    totalExperience: String,
    username: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    password: {
      type: String,
      required: true,
    },
    retypePassword: {
      type: String,
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
    },
    bankDetails: {
      accountHolderName: { type: String },
      bankName: { type: String },
      accountNumber: { type: String },
      ifscCode: String,
      bankBranch: String,
      bankAddress: String,
    },
    document_details: [
      {
        title: String,
        documentType: String,
        document_file: String,
        remarks: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    suspended: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
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
  },
  { timestamps: true }
);

employeeSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  if (!this.name || this.name.length < 3) {
    return next(
      new Error("Name must be at least 3 characters long to generate staffId")
    );
  }

  const namePrefix = this.name
    .replace(/\s+/g, "")
    .substring(0, 3)
    .toUpperCase();
  const regex = new RegExp("^" + namePrefix);
  const count = await mongoose.models.Employee.countDocuments({
    staffId: regex,
  });

  this.staffId = `${namePrefix}${String(count + 1).padStart(3, "0")}`;
  next();
});

module.exports = mongoose.model("Employee", employeeSchema);
