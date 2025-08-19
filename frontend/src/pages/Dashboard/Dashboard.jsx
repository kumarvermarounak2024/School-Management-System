import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useEffect, useState } from "react";
import axios from "axios";
import AmountBarChart from "./AmountBarChart";
import IncomeExpensePieChart from "./IncomeExpensePieChart";
import StudentStrengthPieChart from "./StudentStrengthPieChart";
import eventImg1 from "../../assets/images/event-img1.jpg";
import birthdayImgBackground from "../../assets/images/birthday-img-bg.png";
import newsBlogImg1 from "../../assets/images/newsBlogImg1.jpg";
import newsBlogImg2 from "../../assets/images/newsBlogImg2.jpg";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
const Dashboard = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const [staffData, setStaffData] = useState([]);
  const [studentsData, setStudentsData] = useState();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModalEvent, setShowModalEvent] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [studentAssignedRoutes, setStudentAssignedRoutes] = useState([])
  const [StudentAttendanceTotal, getStudentAttendanceTotal] = useState('')
  // console.log(studentAssignedRoutes,'studentAssignedRoutes///studentAssignedRoutes')
  // call the fetch staff, Student, class, section funtion
  useEffect(() => {
    fetchStaffData();
    fetchStudents();
    fetchEvents();
    getdata();
    getStudentAttendance();
    fetchRoutes()
    getDataAssignedStudent()
  }, []);

  const getStudentAttendance = async () => {

    try {
      const response = await axios.get(`${apiUrl}/studentattendances/report`);
      console.log(response?.data, "response?.data")
      const totalPresent = response?.data?.summary?.totalPresent
      const totalAbsent = response?.data?.summary?.totalAbsent
      const totalStudent = totalPresent + totalAbsent;
      console.log(totalPresent, "sjdjdjdj")
      // const totalPresent = r
      getStudentAttendanceTotal(totalPresent);

    } catch (error) {
      console.error("Error fetching student attendance:", error);
    }
  };
  const getDataAssignedStudent = async () => {
    try {
      const response = await axios.get(`${apiUrl}/allocationRoute/getAll`)
      setStudentAssignedRoutes(response?.data)

    } catch (error) {
      console.log(error, "eror while getting allocation list data")
    }
  }

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/transportRoute/getAll`);
      const data = response?.data?.data || [];
      setRoutes(data);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast.error("Failed to fetch routes");
    }
  };

  const getdata = async () => {
    try {
      const response = await axios.get(`${apiUrl}/vehicleMaster/getAll`);
      const data = response?.data?.data || response?.data || [];
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };
  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "long", // "June" instead of "06"
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options); // Output: June 25, 2000
  };
  // fetch all staff roles
  const fetchStaffData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/staff/get`);
      if (response?.status === 200) {
        setStaffData(response?.data?.employees);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // fetch all student
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
      if (response.status === 200) {
        setStudentsData(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  const teacherCount = staffData?.filter(
    (staff) => staff?.role === "Teacher"
  )?.length;

  // Match To current day and month
  const isTodayDOB = (dobString) => {
    if (!dobString) return false;
    const dob = new Date(dobString);
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset);

    return (
      dob.getUTCDate() === istDate.getUTCDate() &&
      dob.getUTCMonth() === istDate.getUTCMonth()
    );
  };

  // Match the student birthday with current date
  const filterStudentBirthday = studentsData?.filter((student) =>
    isTodayDOB(student?.date_of_birth)
  );
  const filteredStaffBirthday = staffData?.filter((staff) =>
    isTodayDOB(staff?.dob)
  );

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${apiUrl}/event/getAll`);
      setEvents(res?.data);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };
  const handleReadMoreEvent = (event) => {
    setSelectedEvent(event);
    setShowModalEvent(true);
  };

  const closeModalEvent = () => {
    setSelectedEvent(null);
    setShowModalEvent(false);
  };

  return (
    <>
      {/* Dashboard Staff, Teacher and Student counting section  */}
      <section>
        <div className="p-4">
          <div className="text-lg font-semibold mb-4">Hi! Welcome!</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total staff */}
            <div className="bg-white shadow p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h1 className="font-bold">Total Staff</h1>
               
              </div>
              <div className="mt-4">
                <span className="font-bold text-xl">{staffData?.length}</span>
                <br />
                <span className="text-gray-500 text-sm">Staff</span>
              </div>
            </div>
            {/*Total Teacher */}
            <div className="bg-white  shadow p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h1 className="font-bold">Total Teacher</h1>
               
              </div>
              <div className="mt-4">
                <span className="font-bold text-xl">{teacherCount || 0}</span>
                <br />
                <span className="text-gray-500 text-sm">techers</span>
              </div>
            </div>
            {/*  Total Student  */}
            <div className="bg-white shadow p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h1 className="font-bold">Total Student</h1>
               
              </div>
              <div className="mt-4">
                <span className="font-bold text-xl">
                  {studentsData?.length || "0"}
                </span>
                <br />
                <span className="text-gray-500 text-sm">Students</span>
              </div>
            </div>
            {/* Total Student attendance */}
            <div className="bg-white shadow p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h1 className="font-bold">Students Attendance</h1>
                
              </div>
              <div className="mt-4">
                <span className="font-bold text-xl">{StudentAttendanceTotal}</span>
                <br />
                <span className="text-gray-500 text-sm">Attendance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* chart income vs expenses total student and amount chart section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {/* Pie Chart - Income vs Expenses */}
          <div className="bg-white shadow p-4 sm:p-6 rounded-md">
            <div className="flex items-center justify-center font-bold text-center mb-4">
              <h1 className="text-sm">Income vs Expenses</h1>
              <span className="ml-2">
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 18 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.89014 15.6855L0.380252 0.686301L17.7008 0.686301L8.89014 15.6855Z"
                    fill="#080808"
                  />
                </svg>
              </span>
            </div>
            <div className="w-full h-[220px] sm:h-[260px] md:h-[300px] border border-t-0">
              <IncomeExpensePieChart />
            </div>
          </div>

          {/* Bar Chart - Amount */}
          <div className="bg-white shadow p-4 sm:p-6 rounded-md">
            <div className="flex items-center justify-center font-bold text-center mb-4">
              <h1 className="text-sm">Amount</h1>
            </div>
            <div className="w-full  border border-t-0 pb-10">
              <AmountBarChart />
            </div>
          </div>
          {/*  Total Strength  */}

          {/* Pie Chart - Student Strength */}
          <div className="bg-white shadow p-4 sm:p-6 rounded-md">
            <div className="flex items-center justify-center font-bold text-center mb-4">
              <h1 className="text-sm">Student Strength</h1>
            </div>
            <div className="w-full h-[220px] sm:h-[260px] md:h-[300px] border border-t-0">
              <StudentStrengthPieChart />
            </div>
          </div>
        </div>
      </section>
      {/* Teacher & Staff, Student List, Admission Fees & Payments, Expenses Card naviagation connection card */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 p-4 bg-[#f5f7fc]">
          {/* Teacher and Staff */}
          <div className="flex justify-center">
            <Link to={"/staff"}>
              {" "}
              <button className="w-[237px] py-3 bg-[#D5DDFF] text-indigo-800 font-medium rounded-xl shadow hover:bg-indigo-200 transition text-[20px]">
                Teachers & Staff
              </button>
            </Link>
          </div>
          {/* Student List */}
          <div className="flex justify-center">
            <Link to={"/student"}>
              <button className="w-[237px] py-3 bg-[#D5DDFF] text-indigo-800 font-medium rounded-xl shadow hover:bg-indigo-200 transition text-[20px]">
                Student List
              </button>
            </Link>
          </div>
          <div className="flex justify-center">
            <Link to={"/admissionform"}>
              <button className="w-[237px] py-3 bg-[#D5DDFF] text-indigo-800 font-medium rounded-xl shadow hover:bg-indigo-200 transition text-[20px]">
                Admission
              </button>
            </Link>
          </div>
          {/* Fees & Payments */}
          <div className="flex justify-center">
            <Link to={"/fees"}>
              <button className="w-[237px] py-3 bg-[#D5DDFF] text-indigo-800 font-medium rounded-xl shadow hover:bg-indigo-200 transition text-[20px]">
                Fees & Payments
              </button>
            </Link>
          </div>
          {/* Expenses */}
          <div className="flex justify-center">
            <Link to={"#"}>
              <button className="w-[237px] py-3 bg-[#D5DDFF] text-indigo-800 font-medium rounded-xl shadow hover:bg-indigo-200 transition text-[20px]">
                Expenses
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Transpotation, Attendance Summary, Event, Birthday, news and blogs */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4">
          {/* Transportation Card */}
          <div className="bg-[#FDFFE8] shadow rounded-xl p-5 text-[#080808]">
            <h2 className="text-lg mb-2 text-center font-bold">
              Transportation
            </h2>
            <div className="flex items-center gap-2 text-[#080808]">
              <p className="w-40">Total Buses </p>{" "}
              <span className="w-10">:</span>
              <span className="w-20">{vehicles?.length}</span>
            </div>
            <div className="flex items-center gap-2 my-4 text-[#080808]">
              <p className="w-40">Total Routes </p>{" "}
              <span className="w-10">:</span>
              <span className="w-20">{routes?.length}</span>
            </div>
            <div className="flex items-center gap-2 text-[#080808]">
              <p className="w-40">Students Assigned </p>{" "}
              <span className="w-10">:</span>
              <span className="w-20">{studentAssignedRoutes?.length}</span>
            </div>
          </div>

          {/* Attendance Summary Card */}
          <div className=" bg-[#E7FFE8] shadow rounded-xl p-7 text-[#080808]">
            <h2 className="text-lg mb-2 text-center font-bold">
              Attendance Summary
            </h2>
            <div className="flex items-center gap-2">
              <p className="w-40"> Student Present </p>{" "}
              <span className="w-10">:</span>
              <span className="w-20">{StudentAttendanceTotal}/{studentsData?.length}</span>
            </div>
            <div className="flex items-center gap-2 my-3">
              <p className="w-40"> Teacher Present </p>{" "}
              <span className="w-10">:</span>
              <span className="w-20">87/100</span>
            </div>
          </div>

          {/* Events Card */}
          <div className=" bg-[#FFE2F8] shadow rounded-xl p-2 text-gray-800">
            <h2 className="text-lg font-bold text-center mb-2">Events</h2>
            {events?.length > 0 ? (
              events
                ?.filter((event) => event?.showWebsite)
                ?.map((event, index) => (
                  <div
                    key={index + 1}
                    className="flex bg-white p-7 rounded-lg relative mb-2"
                  >
                    <img
                      src={event?.image?.url || eventImg1}
                      alt="event-first-img"
                      className="w-[50px] h-[50px] rounded-[10px] "
                    />
                    <div className="pl-5">
                      {" "}
                      <p className="font-semibold">{event?.title}</p>
                      <p className="text-sm">{event?.description}</p>
                    </div>
                    <button
                      onClick={() => handleReadMoreEvent(event)}
                      className="absolute top-16 bottom-0 right-0 p-2 text-blue-300"
                    >
                      read more
                    </button>
                  </div>
                ))
            ) : (
              <div className="flex bg-white p-4 rounded-lg mb-4 shadow justify-center items-center">
                No Events...!!!
              </div>
            )}
          </div>

          {/* Birthdays Card */}
          <div
            className=" bg-cover bg-center rounded-xl shadow text-black p-4"
            style={{ backgroundImage: `url(${birthdayImgBackground})` }}
          >
            <h2 className=" text-2xl font-bold my-5 text-center">Birthdays</h2>

            {filteredStaffBirthday.length > 0 ? (
              filteredStaffBirthday?.map((staff, index) => (
                <div
                  key={index + 1}
                  className="p-2 my-2 ml-3 bg-white shadow rounded-md"
                >
                  <div className="flex gap-2">
                    <img
                      src={staff?.profilePicture}
                      alt="User"
                      className="w-10 h-10 rounded-full bg-[#594F27]"
                    />

                    <p className="font-semibold ">{staff?.name || "N/A"}</p>
                  </div>
                  <p className="text-sm px-2">Celebration: Birthday</p>
                  <p className="text-sm px-2">Date: {formatDate(staff?.dob)}</p>
                </div>
              ))
            ) : (
              <div className="p-2 text-center bg-white shadow rounded-md my-2">
                Staff celebration✨🎂 <br /> coming soon...!!!
              </div>
            )}

            {filterStudentBirthday?.length > 0 ? (
              filterStudentBirthday?.map((student, index) => (
                <div
                  key={index + 1}
                  className="p-3 my-5 ml-3 bg-white shadow rounded-md"
                >
                  <div className="flex gap-2">
                    <img
                      src={student?.photo}
                      alt="User"
                      className="w-10 h-10 rounded-full bg-[#594F27]"
                    />

                    <p className="font-semibold ">
                      {" "}
                      {student?.firstName || "N/A"} {student?.lastName || "N/A"}
                    </p>
                  </div>
                  <p className="text-sm px-2">Celebration: Birthday</p>
                  <p className="text-sm px-2">
                    Date: {formatDate(student?.date_of_birth)}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-2 text-center bg-white shadow rounded-md my-2">
                Student celebration✨🎂 <br /> coming soon...!!!
              </div>
            )}
          </div>
          {/* News nad Blogs */}
          <div className=" bg-[#E0FEFB] shadow rounded-xl p-4 text-gray-800">
            <h2 className="text-lg font-semibold mb-2">News and Blogs</h2>
            <div className="flex bg-white p-4 rounded-lg">
              <img
                src={newsBlogImg1}
                alt="event-first-img"
                className="w-[50px] h-[50px] rounded-[10px] "
              />
              <div className="pl-5">
                {" "}
                <p className="font-semibold">Tech Fest – 2025</p>
                <p className="text-sm">
                  Delhi Public School: Upcoming event for students for activity
                  & technologies.
                </p>
                <div className=" text-xs flex justify-between">
                  <span>5 min read</span>{" "}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    read more{" "}
                    <svg
                      width="4"
                      height="8"
                      viewBox="0 0 4 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 0.653816L0.594902 0L3.83518 3.5633C3.88741 3.6204 3.92887 3.68829 3.95715 3.76308C3.98544 3.83787 4 3.91807 4 3.99907C4 4.08008 3.98544 4.16028 3.95715 4.23507C3.92887 4.30986 3.88741 4.37775 3.83518 4.43485L0.594902 8L0.00056076 7.34618L3.04179 4L0 0.653816Z"
                        fill="#BABABA"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex bg-white p-4 rounded-lg my-5">
              <img
                src={newsBlogImg2}
                alt="event-first-img"
                className="w-[50px] h-[50px] rounded-[10px] "
              />
              <div className="pl-5">
                {" "}
                <p className="font-semibold">Tech Fest – 2025</p>
                <p className="text-sm">
                  Delhi Public School: Upcoming event for students for activity
                  & technologies.
                </p>
                <div className=" text-xs flex justify-between">
                  <span>5 min read</span>{" "}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    read more{" "}
                    <svg
                      width="4"
                      height="8"
                      viewBox="0 0 4 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 0.653816L0.594902 0L3.83518 3.5633C3.88741 3.6204 3.92887 3.68829 3.95715 3.76308C3.98544 3.83787 4 3.91807 4 3.99907C4 4.08008 3.98544 4.16028 3.95715 4.23507C3.92887 4.30986 3.88741 4.37775 3.83518 4.43485L0.594902 8L0.00056076 7.34618L3.04179 4L0 0.653816Z"
                        fill="#BABABA"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* showModalEvent && selectedEvent */}
      {showModalEvent && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center">
            <div className="text-right">
              {/* ❌ Close Button */}
              <button
                onClick={closeModalEvent}
                className="  hover:text-gray-700 text-xl text-red-500"
              >
                &times;
              </button>
            </div>

            {/* ✅ Image */}
            <img
              src={selectedEvent?.image?.url}
              alt="event-detail"
              className="w-full h-40 object-cover rounded mb-4 mx-auto"
            />

            {/* ✅ Title */}
            <h2 className="text-xl font-semibold mb-2">
              {selectedEvent?.title}
            </h2>

            {/* ✅ Description */}
            <p className="text-sm text-gray-700 mb-4">
              {selectedEvent?.description}
            </p>

            {/* ✅ Event Info */}
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <span className="font-semibold text-red-600">🔴 Start:</span>{" "}
                {new Date(selectedEvent?.startDate)?.toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold text-red-600">🔴 End:</span>{" "}
                {new Date(selectedEvent?.endDate)?.toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  👤 Created By:
                </span>{" "}
                {selectedEvent?.createdBy}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
