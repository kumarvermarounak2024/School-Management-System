import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Phone, Home, User, ArrowLeft, Briefcase } from "lucide-react"; // Added Briefcase icon

const StaffProfile = ({ staff: staffFromProp, onBack }) => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState(staffFromProp?._id);
  console.log(staffId, "staffId");
  const [staff, setStaff] = useState(staffFromProp || null);
  const [loading, setLoading] = useState(!staffFromProp); // Only load if staffFromProp is not provided
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [staffSalaryTrans, setStaffSalaryTrans] = useState(null);
  const [teacherSchedule, setteacherScheduleData] = useState([]);
  useEffect(() => {
    const fetchStaffSalary = async () => {
      try {
        console.log("Staff Object:", staff);
        console.log("Document Details:", staff?.document_details);

        const res = await axios.get(
          `${apiUrl}/salaryassign/getAssign/${staffId}`
        );
        setStaffSalaryTrans(res?.data?.data?.gradeId);
        // setStaff(res.data.employee);
      } catch (err) {
        console.error("Failed to fetch staff details:", err);
      }
    };
    fetchStaffSalary();
  }, [staffId, staffFromProp]);

  if (loading) {
    return <div className="p-6 text-center">Loading staff profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!staff) {
    return <div className="p-6 text-center">Staff member not found.</div>;
  }

  useEffect(() => {
    fetchTeacherSchedule();
  }, []);
  // fetch setteacherSchedule
  const fetchTeacherSchedule = async () => {
    try {
      const response = await axios.get(`${apiUrl}/classSchedule/getAll`);
      console.log("response", response.data.data);
      setteacherScheduleData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(staff,'staffstaff');
  // console.log(teacherSchedule,"teacherSchedule")
  // const filteredSchedule = teacherSchedule?.map((data)=>data?.employeeId)
  // console.log(filteredSchedule,'filteredSchedule')
  const classScheduledFiltered = teacherSchedule?.filter(
    (data) => data?.employeeId?._id?.toString() === staff?._id?.toString()
  );

  console.log(classScheduledFiltered, "classScheduledFiltered");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => {
          if (onBack) {
            onBack();
          } else {
            navigate("/stafflist");
          }
        }}
        className="flex items-center gap-2 text-gray-900 hover:underline mb-4"
      >
        <ArrowLeft size={18} />
        Back to Staff List
      </button>

      <div className="flex items-center bg-gradient-to-r from-blue-900 to-teal-300 p-6 rounded-t-xl">
        <img
          src={staff.profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-40 h-40 rounded-md object-cover border-4 border-white shadow-md"
        />
        <div className="ml-6">
          <div>
            <h2 className="text-3xl font-bold text-white">{staff.name}</h2>
            <p className="text-white">
              {staff.designation?.name || staff.designation}
            </p>
            <p className="text-white">
              {staff.department?.name || staff.department}
            </p>
          </div>
          <div className="mt-3 flex flex-col space-y-1 text-sm text-white">
            <div className="flex items-center gap-2">
              <Mail size={18} />
              <span>{staff.email || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} />
              <span>{staff.mobile || "-"}</span>
            </div>
            {staff.branch && (
              <div className="flex items-center gap-2">
                <Home size={18} />
                <span>{staff.branch}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>ID: {staff.staffId || staff._id || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={18} />
              <span>Role: {staff.role || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded-b-xl">
        <div className="flex flex-col gap-4">
          {" "}
          {/* Main container for all accordion items */}
          {[
            "Basic Details",
            "Salary Transaction",
            "Bank Account",
            "Documents Details",
            "Class Schedule",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg shadow-sm overflow-hidden mb-3"
            >
              {" "}
              {/* Group title and content, add mb-3 for spacing between items */}
              {/* Clickable Title Bar (Reverted Styling) */}
              <div
                onClick={() =>
                  setActiveSection(activeSection === item ? null : item)
                }
                className={`flex items-center space-x-2 p-3 cursor-pointer transition-colors rounded-t-lg 
                  ${
                    activeSection === item
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                  }
                  ${
                    activeSection === item ? "rounded-b-none" : "rounded-b-lg"
                  } /* Adjust rounding when open */`}
              >
                <span
                  className={`${
                    activeSection === item ? "text-white" : "text-yellow-600"
                  }`}
                >
                  🔸
                </span>
                <span
                  className={`font-medium ${
                    activeSection === item ? "text-white" : "text-gray-800"
                  }`}
                >
                  {item}
                </span>
              </div>
              {/* Conditionally Rendered Content for this item */}
              {activeSection === item && (
                <div className="p-4 bg-white border-t border-gray-200 text-sm">
                  {item === "Basic Details" && staff && (
  <div className="p-4">
   
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <p className="text-lg">
        <span className="font-bold text-blue-900">Gender: </span>
        <span className="font-semibold text-gray-700">{staff.gender || "-"}</span>
      </p>
      <p className="text-lg">
        <span className="font-bold text-blue-900">Date of Birth: </span>
        <span className="font-semibold text-gray-700">
          {staff.dob ? new Date(staff.dob).toLocaleDateString() : "-"}
        </span>
      </p>
      <p className="text-lg">
        <span className="font-bold text-blue-900">Religion: </span>
        <span className="font-semibold text-gray-700">{staff.religion || "-"}</span>
      </p>
      <p className="text-lg">
        <span className="font-bold text-blue-900">User Name: </span>
        <span className="font-semibold text-gray-700">{staff.username || "-"}</span>
      </p>
      <p className="text-lg">
        <span className="font-bold text-blue-900">Present Address: </span>
        <span className="font-semibold text-gray-700">{staff.presentAddress || "-"}</span>
      </p>
      <p className="text-lg">
        <span className="font-bold text-blue-900">Permanent Address: </span>
        <span className="font-semibold text-gray-700">{staff.permanentAddress || "-"}</span>
      </p>

      {staff.socialLinks &&
        Object.keys(staff.socialLinks).length > 0 &&
        (staff.socialLinks.facebook ||
          staff.socialLinks.twitter ||
          staff.socialLinks.linkedin) && (
          <div className="md:col-span-2 mt-6 pt-4 border-t border-gray-300">
            <h4 className="font-bold text-blue-900 mb-3 text-lg">
              Social Links:
            </h4>
            {staff.socialLinks.facebook && (
              <p className="text-lg mb-1">
                <span className="font-bold text-blue-900">Facebook: </span>
                <a
                  href={staff.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {staff.socialLinks.facebook}
                </a>
              </p>
            )}
            {staff.socialLinks.twitter && (
              <p className="text-lg mb-1">
                <span className="font-bold text-blue-900">Twitter: </span>
                <a
                  href={staff.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {staff.socialLinks.twitter}
                </a>
              </p>
            )}
            {staff.socialLinks.linkedin && (
              <p className="text-lg">
                <span className="font-bold text-blue-900">LinkedIn: </span>
                <a
                  href={staff.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {staff.socialLinks.linkedin}
                </a>
              </p>
            )}
          </div>
        )}
    </div>
  </div>
)}

                {item === "Bank Account" && staff && staff.bankDetails && (
  <div className="p-4">
   
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <p className="text-lg">
        <span className="font-bold text-blue-900">Account Holder: </span>
        <span className="font-semibold text-gray-700">{staff.bankDetails.accountHolderName || "-"}</span>
      </p>
      <p className="text-lg">
        <span className="font-bold text-blue-900">Bank Name: </span>
        <span className="font-semibold text-gray-700">{staff.bankDetails.bankName || "-"}</span>
      </p>
      <p className="text-lg">
        <span className="font-bold text-blue-900">Account Number: </span>
        <span className="font-semibold text-gray-700">{staff.bankDetails.accountNumber || "-"}</span>
      </p>
      <p className="text-lg">
        <span className="font-bold text-blue-900">IFSC Code: </span>
        <span className="font-semibold text-gray-700">{staff.bankDetails.ifscCode || "-"}</span>
      </p>
      <p className="text-lg">
        <span className="font-bold text-blue-900">Branch: </span>
        <span className="font-semibold text-gray-700">{staff.bankDetails.bankBranch || "-"}</span>
      </p>
      <p className="text-lg">
        <span className="font-bold text-blue-900">Bank Address: </span>
        <span className="font-semibold text-gray-700">{staff.bankDetails.bankAddress || "-"}</span>
      </p>
    </div>
  </div>
)}



                  {item === "Salary Transaction" && (
                    <p className="text-gray-600 py-2">
                      Salary transaction details will be shown here.{" "}
                      {staffSalaryTrans?.basicSalary}
                    </p>
                  )}

                 {item === "Documents Details" &&
  staff &&
  Array.isArray(staff.document_details) && (
    <div className="p-4">
     

      {staff.document_details.length === 0 ? (
        <p className="text-center text-gray-500 italic mt-6">
          No documents available.
        </p>
      ) : (
        <div className="space-y-6">
          {staff.document_details.map((doc, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-300 hover:shadow-lg transition-shadow duration-300"
            >
              <p className="mb-2 text-lg">
                <span className="font-bold text-blue-900 ">Title: </span>
                <span className="font-semibold text-gray-700">{doc.title || "-"}</span>
              </p>
              <p className="mb-2 text-lg">
                <span className="font-bold text-blue-900">Type: </span>
                <span className="font-semibold text-gray-700">{doc.documentType || "-"}</span>
              </p>
              <p className="mb-3 text-lg">
                <span className="font-bold text-blue-900">File: </span>
                {doc.document_file ? (
                  <a
                    href={doc.document_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-3 py-1 text-white bg-purple-900 rounded hover:bg-purple-800 transition"
                  >
                    View File
                  </a>
                ) : (
                  <span className="text-gray-400">No file available</span>
                )}
              </p>
              <p className="text-lg">
                <span className="font-bold text-blue-900">Remarks: </span>
                <span className="font-semibold text-gray-700">{doc.remarks || "-"}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )}

                  


                {item === "Class Schedule" && (
  <div >
    {classScheduledFiltered.map((schedule) => (
      <div
        key={schedule._id}
        className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow duration-300"
      >
        <p className="mb-3 text-lg">
          <span className="font-bold text-purple-900">Class Room: </span>
          <span className="font-semibold text-gray-700">{schedule.class_room}</span>
        </p>
        <p className="mb-3 text-lg">
          <span className="font-bold text-purple-900">Day: </span>
          <span className="font-semibold text-gray-700">{schedule.day}</span>
        </p>
        <p className="mb-3 text-lg">
          <span className="font-bold text-purple-900">Time: </span>
          <span className="font-semibold text-gray-700">
            {schedule.startTime} - {schedule.endTime}
          </span>
        </p>
        <p className="mb-3 text-lg">
          <span className="font-bold text-purple-900">Teacher: </span>
          <span className="font-semibold text-gray-700">{schedule.employeeId?.name}</span>
        </p>
        <p className="text-lg">
          <span className="font-bold text-purple-900">Subject: </span>
          <span className="font-semibold text-gray-700">{schedule.subjectId?.subjectName}</span>
        </p>
      </div>
    ))}
  </div>
)}



                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Removed the empty div <div className="p-6"></div> as content is now within the white card */}
    </div>
  );
};

export default StaffProfile;
