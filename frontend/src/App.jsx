import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import AdmissionEnquiry from './pages/AdmissionEnquiry'
import PostalRecord from './pages/PostalRecord'
import Complaints from './pages/Complaints'
import VisitorRecord from './pages/VisitorRecord'
import AddStaffForm from './pages/AddStaffForm'
import AddDepartment from './pages/AddDepartment'
import AddDesignation from './pages/AddDesignation'
import CsvImport from './pages/Import'
import Configration from './pages/Configuration'
import StudentListPage from './pages/StudentListPage'
import StaffList from './pages/StaffList'
import Home from './pages/Home'
import Reception from './pages/Reception'
import Staff from './pages/Staff'
import CardManagement from './pages/CardManagement'
import IDCardTemplate from './pages/IDCardTemplate'
import IdCardTemplateList from './pages/IdCardTemplateList'
import StaffProfile from './pages/StaffProfile'
import HumanResources from './pages/HumanResources'
import SalaryTemplate from './pages/SalaryTemplate'
import SalaryAssign from './pages/SalaryAssign'
import SalaryPayment from './pages/SalaryPayment'
import AddAdvanceSalary from './pages/AddAdvanceSalary'
import StudentIDCardGenerate from './pages/StudentIDCardGenerate'
import EmployeeIdCardGenerate from './pages/EmployeeIdCardGenrate'
import AdmissionForm from './pages/AdmissionForm'
import ManageAdvanceSalary from './pages/ManageAdvanceSalary'
import LeaveCategoryForm from './pages/LeaveCategoryForm'
import LeaveAdd from './pages/LeaveAdd'
import IDCardView from './pages/IDCardView'
import IDCardEdit from './pages/IDCardEdit'
import Breadcrumb from './components/Breadcrumpb'
import EmployeeIdCardPreview from './pages/EmployeeIdCardPreview'
import Academic from './pages/Academic/Acedemic'
import TemplateList from './components/TemplateList'
import GiveAward from './pages/GiveAward'
import AwardList from './pages/AwardList'
import Dashboard from './pages/Dashboard/Dashboard'
import Student from './pages/Student'
import CreateAttachmentForm from './pages/BookAttachment/CreateAttachmentForm'
import AttachmentsTable from './pages/BookAttachment/AttachmentsTable'
import HomeWork from './pages/Homework/HomeWork'
import Examination from './pages/Examination/Examination'
import ScheduleDetails from './pages/Examination/ScheduleDetails'
import OnlineExamination from './pages/OnlineExam/OnlineExamination'
import AddOnlineExam from './pages/OnlineExam/AddOnlineExam'
import OnlineExamList from './pages/OnlineExam/OnlineExamList'
import Hostel from './pages/Hostel/Hostel'
import Transportation from './pages/Transportation/Transportation'
import OnlineHoldExam from './pages/OnlineExam/OnlineHoldExam'
import CreateRoute from './pages/Transportation/CreateRoute'
import CreateVehicle from './pages/Transportation/CreateVehicle'

import StudentProfile from './pages/StudnetProfile'
import CreateStopPage from './pages/Transportation/CreateStopPage'
import Library from './pages/Library/Library'
import AssignVehicle from './pages/Transportation/AssignVehicle'
import AddBookname from './pages/Library/AddBookCategory'
import Attendance from './pages/Attendence/Attendance'
import Event from './pages/EventFolder/Event'
// import FeeType from './pages/Fees/FeeType'
// import FeeGroup from './pages/Fees/FeeGroup'
// import FineSetup from './pages/Fees/FineSetup'
import Fee from './pages/Fees/Fee'
import CreateBooks from './pages/Library/CreateBooks'
import VehicleAllocation from './pages/Transportation/VehicleAllocation'
import BookIssue from './pages/Library/Bookissue'
import Accounting from './pages/Accounting/Accounting'
import { ToastContainer } from 'react-toastify'
import InvoiceDetails from './pages/Fees/FeeInvoiceDetails'
import Report from './pages/Report/Report'
import LoginForm from './Login/LoginForm'
import ForgetPassword from './Login/ForgetPassword'
import ViewPayslip from './pages/Report/Human Resources Report/ViewPayslip'
import InvoiceManager from './pages/Fees/InvoiceManager'
import Certificate from './pages/Certificate/Certificate'
import ViewReportCard from './pages/Report/Examination Report/ViewReportCard'
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='home' element={<Home />} />
            <Route path='breadcurmb' element={<Breadcrumb />} />
            <Route path='reception' element={<Reception />} />
            <Route path='admissionenquiry' element={<AdmissionEnquiry />} />
            <Route path='postalrecord' element={<PostalRecord />} />
            <Route path='complaints' element={<Complaints />} />
            <Route path='visitor' element={<VisitorRecord />} />
            <Route path='admissionform' element={<AdmissionForm />} />
            <Route path='staff' element={<Staff />} />
            <Route path='addstaffform' element={<AddStaffForm />} />
            <Route path='adddepartment' element={<AddDepartment />} />
            <Route path='adddesignation' element={<AddDesignation />} />
            <Route path='stafflist' element={<StaffList />} />
            <Route path='staffprofile/:id' element={<StaffProfile />} />
            <Route path='csvimport' element={<CsvImport />} />
            <Route path='configuration' element={<Configration />} />
            <Route path='student' element={<Student />} />
            <Route path='studentlist' element={<StudentListPage />} />
            <Route path='cardmanagement' element={<CardManagement />} />
            <Route path='idcardtemplate' element={<IDCardTemplate />} />
            <Route path="/templates" element={<TemplateList />} />
            <Route path='IdCardTemplateList' element={<IdCardTemplateList />} />
            <Route path='/idcardview/:id' element={<IDCardView />} />
            <Route path='/idcardedit/:id' element={<IDCardEdit />} />
            <Route path='StudentIDCardGenerate' element={<StudentIDCardGenerate />} />
            <Route path='EmployeeIdCardGenerate' element={<EmployeeIdCardGenerate />} />
            <Route path="/employee-idcard-preview" element={<EmployeeIdCardPreview />} />
            <Route path='humanresources' element={<HumanResources />} />
            <Route path='salarytemplate' element={<SalaryTemplate />} />
            <Route path='salaryassign' element={<SalaryAssign />} />
            <Route path='salarypayment' element={<SalaryPayment />} />
            <Route path='salaryadvance' element={<AddAdvanceSalary />} />
            <Route path='managesalaryadvance' element={<ManageAdvanceSalary />} />
            <Route path='leaveCategoryform' element={<LeaveCategoryForm />} />
            <Route path='leaveAdd' element={<LeaveAdd />} />
            <Route path='academic' element={<Academic />} />
            <Route path='/give-award' element={<GiveAward />} />
            <Route path='/award-list' element={<AwardList />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='create-attachment' element={<CreateAttachmentForm />} />
            <Route path='attachment-table' element={<AttachmentsTable />} />
            <Route path='homework' element={<HomeWork />} />
            <Route path='Examination' element={<Examination />} />
            <Route path='OnlineExamination' element={<OnlineExamination />} />
            <Route path='/Examination/scheduleDetails/:id' element={<ScheduleDetails />} />
            <Route path='/AddOnlineExam/:id' element={<AddOnlineExam />} />
            <Route path='/onlineExamHold' element={<OnlineHoldExam />} />
            <Route path='/hostel' element={<Hostel />} />
            <Route path='/createRoute/:id' element={<CreateRoute />} />
            <Route path='/createRoute/' element={<CreateRoute />} />
            <Route path='/transportation' element={<Transportation />} />
            <Route path="/student-profile/:id" element={<StudentProfile />} />
            <Route path='/transportation/:name' element={<Transportation />} />
            <Route path='/createVehicle/:id' element={<CreateVehicle />} />
            <Route path='/createStopPage/:id' element={<CreateStopPage />} />
            <Route path='/createVehicle' element={<CreateVehicle />} />

            <Route path="/student-profile/:id" element={<StudentProfile />} />
            <Route path='/attendance' element={<Attendance />} />
            <Route path='/event' element={<Event />} />
            <Route path="/fees" element={<Fee />} />
            <Route path='/fee-collection' element={<InvoiceManager />} />
            <Route path="/invoice/:id" element={<InvoiceDetails />} />


            <Route path='/library' element={<Library />} />
            <Route path='/assignVehicle/:id' element={<AssignVehicle />} />
            <Route path='/addBookname/:id' element={<AddBookname />} />
            <Route path='/library/:name' element={<Library />} />
            <Route path='/createBooks/:id' element={<CreateBooks />} />
            <Route path='/VehicleAllocation/:id' element={<VehicleAllocation />} />
            <Route path='/bookIssue/:id' element={<BookIssue />} />

            <Route path='/accounting' element={<Accounting />} />
            <Route path='/certificate' element={<Certificate />} />
            <Route path='/report' element={<Report />} />
  <Route path="/viewReportCard/:id" element={<ViewReportCard />} />
  <Route path="/viewpayslip/:id" element={<ViewPayslip />} />

          </Route>
        </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </div>
  )
}

export default App