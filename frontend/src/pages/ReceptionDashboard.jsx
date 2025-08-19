import { useEffect, useState } from "react";
import axios from "axios";
import birthdayImgAvtar from "../assets/images/birthday-img-avtar.png";
import birthdayImgBackground from "../assets/images/birthday-img-bg.png";
import newsBlogImg1 from "../assets/images/newsBlogImg1.jpg";

const ReceptionDashboard = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const [inquryData, setInquryData] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [studentsData, setStudentsData] = useState();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAllComplaints, setShowAllComplaints] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModalEvent, setShowModalEvent] = useState(false);
  // call the fetchAdmissinInquiryData, fetchVisitors, fetchStudents, staffList , section funtion
  useEffect(() => {
    fetchAdmissinInquiryData();
    fetchVisitors();
    fetchStudents();
    fetchComplaints();
    getAllStaff();
    fetchEvents();
  }, []);

  //  all fetchAdmissinInquiryData
  const fetchAdmissinInquiryData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/enquiries/getEnquiry`);
      if (response?.status === 200) {
        setInquryData(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // fetch all Visitors
  const fetchVisitors = async () => {
    try {
      const response = await axios.get(`${apiUrl}/visitors/getAllVisitors`);

      // Safely handle data shape
      const visitorsArray = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data?.visitors)
        ? response.data?.data?.visitors
        : [];

      setVisitors(visitorsArray);
    } catch (error) {
      console.error("Error fetching visitors:", error);
      setVisitors([]);
    }
  };
  // fetch all student
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
      if (response?.status === 200) {
        setStudentsData(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  // fetch all complaints
  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${apiUrl}/complaints/getAllComplains`);
      setComplaints(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching complaints", err);
    }
  };
  const getAllStaff = async () => {
    try {
      const res = await axios.get(`${apiUrl}/staff/get`);

      const employees = res?.data?.employees || [];

      setStaffList(employees);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${apiUrl}/event/getAll`);
      setEvents(res?.data);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };
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

  // Match the student birthday with current date and month
  const filterStudentBirthday = studentsData?.filter((student) =>
    isTodayDOB(student?.date_of_birth)
  );
  //  // Match the staff birthday with current date and month
  const filteredStaffBirthday = staffList?.filter((staff) =>
    isTodayDOB(staff?.dob)
  );

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "long", // "June" instead of "06"
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options); // Output: June 25, 2000
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
      {/* Dashboard Total Inquiries, visitors, admissin and coplaints counting section  */}
      <section>
        <div className="p-4">
          <div className="text-lg font-semibold mb-4">Hi! Welcome!</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Inquiries */}
            <div className="bg-white shadow p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h1 className="font-bold">Total Inquiries</h1>
                <div className="bg-[#D5DDFF] p-2 text-xs rounded-full w-[62px] flex items-center justify-center gap-x-1">
                  <span>
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.78091 4.07467L7.11424 6.408L10.4433 3.07892L11.7809 4.4165V0.916504H8.28091L9.61849 2.25409L7.11424 4.75834L4.78091 2.425L0.285156 6.92075L1.10999 7.74559L4.78091 4.07467Z"
                        fill="#151587"
                      />
                    </svg>
                  </span>
                  <span>10.0%</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-bold text-xl">
                  {inquryData?.length || 0}
                </span>
                <br />
                <span className="text-gray-500 text-sm">
                  5+ Add inqury today!
                </span>
              </div>
            </div>
            {/*Total visitors */}
            <div className="bg-white  shadow p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h1 className="font-bold">Total Visitors</h1>
                <div className="bg-[#D5DDFF] p-2 text-xs rounded-full w-[62px] flex items-center justify-center gap-x-1">
                  <span>
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.78091 4.07467L7.11424 6.408L10.4433 3.07892L11.7809 4.4165V0.916504H8.28091L9.61849 2.25409L7.11424 4.75834L4.78091 2.425L0.285156 6.92075L1.10999 7.74559L4.78091 4.07467Z"
                        fill="#151587"
                      />
                    </svg>
                  </span>
                  <span>10.0%</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-bold text-xl">
                  {visitors?.length || 0}
                </span>
                <br />
                <span className="text-gray-500 text-sm">
                  2+ new visitors added today!
                </span>
              </div>
            </div>
            {/*  Total admissin  */}
            <div className="bg-white shadow p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h1 className="font-bold">Total Admissins</h1>
                <div className="bg-[#D5DDFF] p-2 text-xs rounded-full w-[62px] flex items-center justify-center gap-x-1">
                  <span>
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.78091 4.07467L7.11424 6.408L10.4433 3.07892L11.7809 4.4165V0.916504H8.28091L9.61849 2.25409L7.11424 4.75834L4.78091 2.425L0.285156 6.92075L1.10999 7.74559L4.78091 4.07467Z"
                        fill="#151587"
                      />
                    </svg>
                  </span>
                  <span>10.0%</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-bold text-xl">
                  {studentsData?.length || 0}
                </span>
                <br />
                <span className="text-gray-500 text-sm">
                  10+ new admissin added today!
                </span>
              </div>
            </div>
            {/*  Total complaints  */}
            <div className="bg-white shadow p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h1 className="font-bold">Total Complaints</h1>
                <div className="bg-[#FFC5C5] p-2 text-xs rounded-full w-[62px] flex items-center justify-center gap-x-1">
                  <span>
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.78091 4.07467L7.11424 6.408L10.4433 3.07892L11.7809 4.4165V0.916504H8.28091L9.61849 2.25409L7.11424 4.75834L4.78091 2.425L0.285156 6.92075L1.10999 7.74559L4.78091 4.07467Z"
                        fill="#151587"
                      />
                    </svg>
                  </span>
                  <span>10.0%</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-bold text-xl">
                  {complaints?.length || 0}
                </span>
                <br />
                <span className="text-gray-500 text-sm">
                  -7 less coplaints today!
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complaints list, Event, Birthday, news and Updates */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Complaint List */}
          <div className="col-span-1 bg-[#E7FFE8] p-4 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Complaint List</h2>
              <button
                className="text-sm text-blue-600"
                onClick={() => setShowAllComplaints(!showAllComplaints)}
              >
                {showAllComplaints ? "Show Less" : "View All"}
              </button>
            </div>
            {(showAllComplaints ? complaints : complaints?.slice(0, 5))?.map(
              (complain, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-3 mb-3 rounded-lg ${
                    complain?.complainantName
                      ? "border-2 border-blue-100 bg-blue-50"
                      : "bg-white"
                  }`}
                >
                  <img
                    src={`https://i.pravatar.cc/40?img=${(i % 70) + 1}`}
                    alt={complain?.complainantName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{complain?.complainantName}</p>
                    <p className="text-sm text-gray-500">
                      {/* {complain?.complaintType} */}
                    </p>
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => {
                        setSelectedComplaint(complain);
                        setShowModal(true);
                      }}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Events */}
          <div className="col-span-1 bg-[#FFE2F8] p-4 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Events</h2>
              {/* <button className="bg-white text-sm px-3 py-1 rounded-full border">
                + Add
              </button> */}
            </div>
            {events?.length > 0 ? (
              events
                ?.filter((event) => event?.showWebsite)
                ?.map((event, index) => (
                  <div
                    key={index + 1}
                    className="flex bg-white p-4 rounded-lg mb-4 shadow justify-center items-center"
                  >
                    <img
                      src={event?.image?.url || newsBlogImg1}
                      alt="event-first-img"
                      className="w-[50px] h-[50px] rounded-[10px] "
                    />
                    <div className="pl-5">
                      {" "}
                      <p className="font-semibold">{event?.title}</p>
                      <p className="text-sm">{event?.description}</p>
                      <div className=" text-xs flex justify-between">
                        <span></span>{" "}
                        <button
                          onClick={() => handleReadMoreEvent(event)}
                          className="text-blue-300"
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
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex bg-white p-4 rounded-lg mb-4 shadow justify-center items-center">
                No Events...!!!
              </div>
            )}

            {/* Calendar */}
            <div className="bg-white rounded-md p-4 shadow">
              <div className="flex justify-between items-center mb-2">
                <button>&lt;</button>
                <h3 className="text-lg font-semibold">June 2025</h3>
                <button>&gt;</button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                  (day) => (
                    <span key={day} className="font-semibold text-gray-600">
                      {day}
                    </span>
                  )
                )}
                {[...Array(30)]?.map((_, i) => {
                  const day = i + 1;
                  let bg = "";
                  if ([3, 10, 17, 24]?.includes(day)) bg = "bg-red-100";
                  else if ([6, 14]?.includes(day)) bg = "bg-green-100";
                  else if ([13, 21]?.includes(day)) bg = "bg-yellow-100";
                  return (
                    <span key={day} className={`p-2 rounded-md ${bg}`}>
                      {day}
                    </span>
                  );
                })}
              </div>
              <div className="mt-3 flex justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-400 rounded-full"></span>Govt
                  Holiday
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  Events
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                  Meetings
                </span>
              </div>
            </div>
          </div>

          {/* News & Birthdays */}
          <div className="col-span-1 flex flex-col gap-4">
            {/* News & Updates */}
            <div className="bg-[#E4FFFCE5] p-4 rounded-xl shadow flex-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">News & Updates</h2>
                <button className="text-sm text-blue-600">View All</button>
              </div>
              {["Education Board", "Syllabus Update!"]?.map((title, i) => (
                <div key={i} className="flex items-center gap-4 mb-4">
                  <img
                    src={`https://picsum.photos/seed/news${i}/60/60`}
                    alt={title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-gray-500">
                      Education Board Updated new syllabus for recent activity &
                      technologies...
                    </p>
                    <p className="text-xs text-gray-400">5 mins to read</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Birthdays */}
            <div
              className=" bg-cover bg-center rounded-xl shadow text-black p-4"
              style={{
                backgroundImage: `url(${birthdayImgBackground})`,
              }}
            >
              <h2 className=" text-2xl font-bold my-5 text-center">
                Birthdays
              </h2>
              <div className="flex justify-center gap-4 flex-wrap">
                {filterStudentBirthday?.length > 0 ? (
                  filterStudentBirthday?.map((student, index) => (
                    <div
                      key={index + 1}
                      className="p-2 text-center bg-white shadow w-[214px] rounded-md"
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <img
                          src={student?.photo || birthdayImgAvtar}
                          alt="User"
                          className="w-10 h-10 rounded-full bg-[#7e85de]"
                        />
                        <p className="font-semibold">
                          {student?.firstName || "N/A"}{" "}
                          {student?.lastName || "N/A"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ">
                        <p className="w-30"> Celebration </p>{" "}
                        <span className="">:</span>
                        <span className="w-20">Birthday</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="w-10"> Date </p>
                        <span className="">:</span>
                        <span className="w-60">
                          {formatDate(student?.date_of_birth)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-center bg-white shadow w-[214px] rounded-md">
                    Student celebration✨🎂 coming soon...!!!
                  </div>
                )}
                {filteredStaffBirthday?.length > 0 ? (
                  filteredStaffBirthday?.map((staff, index) => (
                    <div
                      key={index + 1}
                      className="p-2 text-center bg-white shadow w-[214px] rounded-md"
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <img
                          src={staff?.profilePicture || birthdayImgAvtar}
                          alt="User"
                          className="w-10 h-10 rounded-full bg-[#7e85de]"
                        />
                        <p className="font-semibold">{staff?.name || "N/A"}</p>
                      </div>

                      <div className="flex items-center gap-2 ">
                        <p className="w-30"> Celebration </p>{" "}
                        <span className="">:</span>
                        <span className="w-20">Birthday</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="w-10"> Date </p>
                        <span className="">:</span>
                        <span className="w-60">{formatDate(staff?.dob)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-center bg-white shadow w-[214px] rounded-md">
                    Staff celebration✨🎂 coming soon for future
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-2xl shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black"
            >
              &times;
            </button>

            {/* Header */}
            <h2 className="text-xl font-bold text-center mb-6">
              Complain View Details
            </h2>

            {/* Optional profile / document image */}
            {selectedComplaint.document?.url && (
              <div className="flex justify-center mb-4">
                <img
                  src={selectedComplaint?.document?.url}
                  alt="Document"
                  className="w-20 h-20 rounded-full border-4 border-yellow-400 object-cover"
                />
              </div>
            )}

            {/* Name and Status */}
            <h3 className="text-center text-lg font-semibold text-gray-900">
              {selectedComplaint?.complainantName}
            </h3>
            <p className="text-center text-sm text-gray-600 mb-6">
              Complaint / {selectedComplaint?.status}
            </p>

            {/* Two-Column Info Layout */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700 px-10">
              <div>
                <p className="font-semibold ">Type</p>
                <p>{selectedComplaint?.complaintType}</p>
              </div>

              <div>
                <p className="font-semibold">Mobile No</p>
                <p>{selectedComplaint?.mobileNo}</p>
              </div>

              <div>
                <p className="font-semibold">Date</p>
                <p>{new Date(selectedComplaint?.date).toLocaleDateString()}</p>
              </div>

              {selectedComplaint?.assignTo?.name && (
                <div>
                  <p className="font-semibold">Assigned To</p>
                  <p>{selectedComplaint?.assignTo?.name}</p>
                </div>
              )}

              <div className="col-span-2">
                <p className="font-semibold">Note</p>
                <p>{selectedComplaint?.note}</p>
              </div>

              {selectedComplaint?.document?.url && (
                <div className="col-span-2">
                  <p className="font-semibold">Document</p>
                  <a
                    href={selectedComplaint?.document?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View Attached File
                  </a>
                </div>
              )}
            </div>

            {/* Footer Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
              src={selectedEvent?.image?.url || birthdayImgAvtar}
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

export default ReceptionDashboard;
