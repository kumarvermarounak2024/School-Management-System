const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const connectDB = require("./config/db");

const app = express();
app.use(morgan('dev')); 

// ✅ Step 1 - Connect to DB first
connectDB();

// ✅ Step 2 - Setup Middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Step 3 - Setup CORS
const corsOptions = {
  origin: ["http://localhost:5173", "https://serene-jelly-f8d0f2.netlify.app", "http://103.174.102.139:3300", "https://school.manasvitech.in"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
const enquiryRoutes = require("./routes/enquiryRoutes");
const visitorRoutes = require("./routes/visitorsRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const postalRoutes = require("./routes/postalRoutes");
const complaintRoutes = require("./routes/complainRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const designationRoutes = require("./routes/designationRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const configurationRoutes = require("./routes/configurationRoutes");
const userRoutes = require("./routes/userRoutes");
const idcarttemplateRoutes = require("./routes/idcardTemplateRoute");
const classRoutes = require("./routes/classRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const studentIdCardRoutes = require("./routes/studentidcareRoutes");
const employeeIdCardRoutes = require("./routes/employeeIdCareRoutes");
const advancesalaryRoutes = require("./routes/Human_Resources_Routes/advance_salaryRoutes");
const salaryassignRoutes = require("./routes/Human_Resources_Routes/Salary_assignRoutes");
const salaryPaymentRoutes = require("./routes/Human_Resources_Routes/salary_paymentRoutes");
const awardRoutes = require("./routes/Human_Resources_Routes/awardRoutes");
const leavecategoryRoutes = require("./routes/Leave_Management/leaveCategoryRoutes");
const leaveAddRoutes = require("./routes/Leave_Management/add_leaveRoutes");
const payrollRoutes = require("./routes/Human_Resources_Routes/PayrollRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subjectRoutes = require("./routes/Academic/subjectRoutes");
const assignedSubjectRoutes = require("./routes/Academic/AssignedSubjectRoute");
const classScheduleRoutes = require("./routes/Academic/classscheduleRoute");
const classTeacherRoutes = require("./routes/Academic/classTeacherAssignRoutes");
const uploadRoutes = require("./routes/excelUpload");
const TeacherScheduleRoutes = require("./routes/Academic/TeacherScheduleRoute");
const promotionRoutes = require("./routes/Academic/promotionRoutes");
const attachmentRoutes = require("./routes/bookattachmentRoutes");
const homeworkRoutes = require("./routes/homeworkRoutes");
const examRoutes = require("./routes/Examination/ExaminationRoutes");
const examScheduleRoutes = require("./routes/Examination/examinationScheduleRoutes");
// const onlineExaminationRoutes=require('./routes/Examination/onlineExaminationRoutes');
// const questionRoutes=require('./routes/OnlineExam/questionRoutes')
const examGradeRoutes = require("./routes/Examination/examGradeRoutes");
const marksRoutes = require("./routes/Examination/marksRoutes");
// const hostelmasterRoutes = require('./routes/Hostels/Hostel_masterRoutes');
// const hostelAllotmentRoutes = require('./routes/Hostels/Hostel_AllotmentRoutes');

const hostelmasterRoutes = require("./routes/Hostels/hostelmasterRoutes");
const hostelAllocationRoutes = require("./routes/Hostels/hostelAllocationRoutes");
const studentAttendanceRoutes = require("./routes/studentAttendance/studentAttendanceRoutes");
const employeeAttendanceRoutes = require("./routes/EmployeeAttendance/EmployeeAttendance");
const examAttendanceRoutes = require("./routes/ExamAttendance/examAttendanceRoutes");
const vehicleMaster = require("./routes/Transportation/vehicleMaster");
const transportRoute = require("./routes/Transportation/routeTransport");
const stoppageRoute = require("./routes/Transportation/stoppageRoute");
const vehicleAssignRoute = require("./routes/Transportation/vehicleAssignRoute");
const allocationRoute = require("./routes/Transportation/allocationRoute");

const booksRoute = require("./routes/Library/booksRoute");
const libraryBookCategory = require("./routes/Library/bookscategoryRoute");
const bookIssueRoutes = require("./routes/Library/booksissueandreturnRoute");

const eventtypeRoutes = require("./routes/EventFolder/EventTypeRoute");
const eventRoutes = require("./routes/EventFolder/EventRoute");
const FeeTypeRoutes = require("./routes/Fee/FeeTypeRoute");
const FeeGroupRoutes = require("./routes/Fee/FeeGroupRoute");
const FineSetupRoutes = require("./routes/Fee/FineSetupRoute");
const FeeInvoiceRoutes = require("./routes/Fee/FeeInvoiceRoute");
const dueFeeRoute = require("./routes/Fee/dueFeeRoute");
const feeReminderRoute = require("./routes/Fee/feeReminderRoute");
const inventoryListRoutes = require("./routes/Fee/feeInventoryRoute");
const feeAllocationRoute = require("./routes/Fee/feeAllocationRoute");
const ledgerRoutes = require("./routes/Accounting/ledgerRoute");
const transactionRoutes = require("./routes/Accounting/transactionRoute");
//Reports
const admissionReportRoutes = require("./routes/Reports/admissionsReportRoute");
const classSectionReportRoutes = require("./routes/Reports/class&sectionReportRoute");

const feeReportRoutes = require("./routes/Reports/studentFeeReportRoute");
const receiptRoutes = require("./routes/Accounting/receiptRoute");
const contraRoutes = require("./routes/Accounting/contraRoute");
const journalRoutes = require("./routes/Accounting/journalRoute");
const receiptandpaymentRoutes = require("./routes/Accounting/receiptandpaymentRoute");
const authUserRouter = require("./routes/authRoutes/authRoutes");

const studentAttendanceReportRoutes = require("./routes/Reports/AttendanceReportRoute");
const certificateRoutes = require("./routes/Certificate/certificateRoute")



// // Trust the first proxy
app.set("trust proxy", 1);

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/postal", postalRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/designation", designationRoutes);
app.use("/api/staff", employeeRoutes);
app.use("/api/configuration", configurationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/idcard", idcarttemplateRoutes);
app.use("/api/class", classRoutes);
app.use("/api/section", sectionRoutes);
app.use("/api/studentIDCard", studentIdCardRoutes);
app.use("/api/employeeIDCard", employeeIdCardRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/advancesalary", advancesalaryRoutes);
app.use("/api/leavecategory", leavecategoryRoutes);
app.use("/api/leaveadd", leaveAddRoutes);
app.use("/api/salaryassign", salaryassignRoutes);
app.use("/api/salarypayment", salaryPaymentRoutes);
app.use("/api/awards", awardRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/assignedSubject", assignedSubjectRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classSchedule", classScheduleRoutes);
app.use("/api/classTeacher", classTeacherRoutes);
app.use("/api/teacherSchedule", TeacherScheduleRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/promotion", promotionRoutes);
app.use("/api/attachment", attachmentRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/examination", examRoutes);
app.use("/api/grade", examGradeRoutes);
app.use("/api/examination/schedule", examScheduleRoutes);
// app.use("/api/onlineExams",onlineExaminationRoutes)
// app.use("/api/questionRoutes", questionRoutes);
app.use("/api/transportRoute", transportRoute);
app.use("/api/marks", marksRoutes);
app.use("/api/hostel", hostelmasterRoutes);
app.use("/api/hostelAllocation", hostelAllocationRoutes);
app.use("/api/studentattendances", studentAttendanceRoutes);
app.use("/api/employeeattendances", employeeAttendanceRoutes);
app.use("/api/examattendances", examAttendanceRoutes);
app.use("/api/vehicleMaster", vehicleMaster);
app.use("/api/stoppage", stoppageRoute);
app.use("/api/vehicleAssign", vehicleAssignRoute);
app.use("/api/allocationRoute", allocationRoute);
app.use("/api/booksCategory", libraryBookCategory);
app.use("/api/booksRoute", booksRoute);
app.use("/api/bookIssue", bookIssueRoutes);

app.use("/api/eventtype", eventtypeRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/feetype", FeeTypeRoutes);
app.use("/api/feegroup", FeeGroupRoutes);
app.use("/api/finesetup", FineSetupRoutes);
app.use("/api/feeInvoice", FeeInvoiceRoutes);
app.use("/api/dueFee", dueFeeRoute);
app.use("/api/feeReminder", feeReminderRoute);
app.use("/api/inventoryList", inventoryListRoutes);

app.use("/api/feeAllocation", feeAllocationRoute);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/receipt", receiptRoutes);
app.use("/api/contraRoute", contraRoutes);
app.use("/api/journalRoute", journalRoutes);

app.use("/api/reports/Admission", admissionReportRoutes);
app.use("/api/reports/classSection", classSectionReportRoutes);
app.use("/api/reports/fee", feeReportRoutes);
app.use("/api/receiptandpayment", receiptandpaymentRoutes);
app.use("/api/user/auth", authUserRouter);
app.use("/api/reports/Attendance", studentAttendanceReportRoutes);
app.use("/api/certificates", certificateRoutes);


const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
