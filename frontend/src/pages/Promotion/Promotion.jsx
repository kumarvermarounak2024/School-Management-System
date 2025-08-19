import React from "react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import StudentProfile from "../StudnetProfile";
const Promotion = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [classList, setClassList] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentFullProfileData, setStudentFullProfileData] = useState(null);

  const [formData, setFormData] = useState({
    fromClassId: "",
    fromSectionId: "",
    toClassId: "",
    toSectionId: "",
    promotionDate: new Date().toISOString().split("T")[0], // Default to today's date
  });

  // Fetch classes and sections on component mount
  useEffect(() => {
    fetchClasses();
    fetchSections();
  }, []);

  // Fetch students when class or section changes
  useEffect(() => {
    if (formData.fromClassId && formData.fromSectionId) {
      fetchStudentsByClassAndSection();
    }
  }, [formData.fromClassId, formData.fromSectionId]);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/class/getAll`);
      setClassList(res.data.classes || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get(`${apiUrl}/section/getAll`);
      setSections(res.data.sections || []);
    } catch (err) {
      console.error("Error fetching sections:", err);
    }
  };

  const fetchStudentsByClassAndSection = async () => {
    try {
      const { fromClassId, fromSectionId } = formData;
      const res = await axios.get(
        `${apiUrl}/promotion/students/${fromClassId}/${fromSectionId}`
      );
      setStudents(res.data.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.fromClassId ||
      !formData.fromSectionId ||
      !formData.toClassId ||
      !formData.toSectionId ||
      !formData.promotionDate
    ) {
      alert("Please fill all required fields before submitting.");
      return;
    }

    if (students.length === 0) {
      alert("No students found to promote.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${apiUrl}/promotion/bulk-promote`,
        formData
      );
      alert("Students promoted successfully!");
      // Refresh the student list
      fetchStudentsByClassAndSection();
    }catch (err) {
  console.error('Error submitting promotion:', err.response?.data || err.message);
  alert(err.response?.data?.message || "Something went wrong while promoting students.");
}
 finally {
      setLoading(false);
    }
  };

  const handleApprove = (id) => {
    // Approval logic here (e.g., API call)
    console.log("Approved student ID:", id);
  };

  const handleDelete = (id) => {
    // Deletion logic here (e.g., API call)
    console.log("Deleted student ID:", id);
  };
  // const handleView = (studentId) => {
  //     navigate(`/student-profile/${studentId}`);
  //   };

  // Render student full profile if selected
  if (studentFullProfileData) {
    return (
      <StudentProfile
        student={studentFullProfileData}
        onBack={() => setStudentFullProfileData(null)}
      />
    );
  }
  return (
    <>
      {/* Class Session Promotion */}
      <div className="py-10">
        <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center">
          <div className="w-full md:w-1/2">
            <label className="block font-medium mb-1">
              Class <span className="text-red-600">*</span>
            </label>
            <select
              name="fromClassId" // Updated to match formData key
              value={formData.fromClassId}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            >
              <option value="">Select</option>
              {classList.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/2">
            <label className="block font-medium mb-1">
              Section <span className="text-red-600">*</span>
            </label>
            <select
              name="fromSectionId" // Updated to match formData key
              value={formData.fromSectionId}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            >
              <option value="">Select Section</option>
              {sections.map((sec) => (
                <option key={sec._id} value={sec._id}>
                  {sec.Name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Filter button */}
        <div className="flex justify-end my-10">
          <button className="flex items-center gap-2 border border-blue-300 px-4 py-2 rounded-md bg-white hover:bg-blue-50 transition w-[137px]">
            <svg
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1H15L10 7.5V17L6 13V7.5L1 1Z"
                fill="black"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className="font-semibold text-black">Filter</span>
          </button>
        </div>
      </div>
      {/* Next Session Promotion */}
      <div>
        <div className="flex justify-between">
          <button className="flex items-center gap-2 px-4 py-2 font-semibold border-1 p-1 relative">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="30" height="30" fill="white" />
              <rect
                x="0.5"
                y="0.5"
                width="29"
                height="29"
                stroke="#151587"
                stroke-opacity="0.7"
              />
              <rect x="5" y="5" width="20" height="20" fill="#151587" />
            </svg>
            <span className="font-semibold text-[#151587]">
              Carry Forward Due in Next Session
            </span>
          </button>
          <div className="flex gap-3">
            <button className="w-[32px]">
              <svg
                width="34"
                height="36"
                viewBox="0 0 34 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="1" y="1" width="32" height="33.5475" fill="white" />
                <rect
                  x="0.5"
                  y="0.5"
                  width="33"
                  height="34.5475"
                  stroke="#080808"
                  stroke-opacity="0.2"
                />
                <path
                  d="M5 30.354H29M19.3792 8.4247C19.3792 8.4247 19.3792 10.7096 21.5587 12.9945C23.7382 15.2794 25.9177 15.2794 25.9177 15.2794M10.7595 26.1439L15.3365 25.4584C15.9967 25.3595 16.6085 25.0388 17.0801 24.5444L28.0972 12.9945C29.3009 11.7326 29.3009 9.68661 28.0972 8.4247L25.9177 6.1398C24.714 4.87788 22.7624 4.87788 21.5587 6.1398L10.5416 17.6897C10.07 18.1841 9.76407 18.8255 9.66975 19.5177L9.0159 24.316C8.8706 25.3822 9.7424 26.2962 10.7595 26.1439Z"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
            <button className="w-[32px]">
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="1" y="1" width="32" height="32" fill="white" />
                <rect
                  x="0.5"
                  y="0.5"
                  width="33"
                  height="33"
                  stroke="#080808"
                  stroke-opacity="0.2"
                />
                <path
                  d="M11.667 29C10.9337 29 10.3061 28.7391 9.78433 28.2173C9.26255 27.6956 9.00121 27.0676 9.00033 26.3333V23.6667H6.33366C5.60033 23.6667 4.97277 23.4058 4.45099 22.884C3.92921 22.3622 3.66788 21.7342 3.66699 21V15.6667C3.66699 14.5333 4.05588 13.5836 4.83366 12.8173C5.61144 12.0511 6.55588 11.6676 7.66699 11.6667H26.3337C27.467 11.6667 28.4172 12.0502 29.1843 12.8173C29.9514 13.5844 30.3345 14.5342 30.3337 15.6667V21C30.3337 21.7333 30.0728 22.3613 29.551 22.884C29.0292 23.4067 28.4012 23.6676 27.667 23.6667H25.0003V26.3333C25.0003 27.0667 24.7394 27.6947 24.2177 28.2173C23.6959 28.74 23.0679 29.0009 22.3337 29H11.667ZM25.0003 10.3333H9.00033V7.66667C9.00033 6.93333 9.26166 6.30578 9.78433 5.784C10.307 5.26222 10.9345 5.00089 11.667 5H22.3337C23.067 5 23.695 5.26133 24.2177 5.784C24.7403 6.30667 25.0012 6.93422 25.0003 7.66667V10.3333ZM25.0003 17.6667C25.3781 17.6667 25.695 17.5387 25.951 17.2827C26.207 17.0267 26.3345 16.7102 26.3337 16.3333C26.3328 15.9564 26.2048 15.64 25.9497 15.384C25.6945 15.128 25.3781 15 25.0003 15C24.6225 15 24.3061 15.128 24.051 15.384C23.7959 15.64 23.6679 15.9564 23.667 16.3333C23.6661 16.7102 23.7941 17.0271 24.051 17.284C24.3079 17.5409 24.6243 17.6684 25.0003 17.6667ZM11.667 26.3333H22.3337V21H11.667V26.3333Z"
                  fill="#080808"
                  fill-opacity="0.7"
                />
              </svg>
            </button>
          </div>
        </div>
        <hr className="bg-[#151587] border-[0.99px] h-[2px] -mt-0.9" />
      </div>

      {/* Promote to Session, Class, Section */}
      <section className="py-10">
        <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center">
          <div className="w-full md:w-1/2">
            <label className="block font-medium mb-1">
              Promotion Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              name="promotionDate"
              value={formData.promotionDate}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>
          <div className="w-full md:w-1/2">
            <label className="block font-medium mb-1">
              Promote to Class <span className="text-red-600">*</span>
            </label>
            <select
              name="toClassId"
              value={formData.toClassId}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            >
              <option value="">Select Target Class</option>
              {classList.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/2">
            <label className="block font-medium mb-1">
              Promote to Section <span className="text-red-600">*</span>
            </label>
            <select
              name="toSectionId"
              value={formData.toSectionId}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            >
              <option value="">Select Target Section</option>
              {sections.map((sec) => (
                <option key={sec._id} value={sec._id}>
                  {sec.Name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Promotion Table */}
      {/* Promotion Table */}
      <section>
        <div className="sm:p-10">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-black bg-white">
              <thead className="bg-[#D5DDFF] text-left">
                <tr>
                  <th className="p-2 border border-black whitespace-nowrap">
                    SL
                  </th>
                  <th className="p-2 border border-black whitespace-nowrap">
                    Student
                  </th>
                  <th className="p-2 border border-black whitespace-nowrap">
                    Register No
                  </th>
                  <th className="p-2 border border-black whitespace-nowrap">
                    Guardian Name
                  </th>
                  <th className="p-2 border border-black whitespace-nowrap">
                    Mark Summary
                  </th>
                  <th className="p-2 border border-black whitespace-nowrap">
                    Roll No
                  </th>
                  <th className="p-2 border border-black whitespace-nowrap">
                    Current Due Amount
                  </th>
                  <th className="p-2 border border-black whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-4 text-center border border-black"
                    >
                      <div className="flex justify-center items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading students...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-4 text-center border border-black text-red-500"
                    >
                      {error}
                    </td>
                  </tr>
                ) : students.length > 0 ? (
                  students.map((student, index) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="p-2 border border-black text-center">
                        {index + 1}
                      </td>
                      <td className="p-2 border border-black whitespace-nowrap">
                        {student.firstName || "N/A"} {student.lastName || ""}
                      </td>
                      <td className="p-2 border border-black whitespace-nowrap text-center">
                        {student.registration_no || "N/A"}
                      </td>
                      <td className="p-2 border border-black whitespace-nowrap">
                        {student.guardian_name || "N/A"}
                      </td>
                      <td className="p-2 border border-black whitespace-nowrap text-center">
                        <button
                          className="flex items-center justify-center gap-1 border rounded-lg border-gray-400 px-2 py-1 hover:bg-gray-100 transition-colors"
                          onClick={() => setStudentFullProfileData(student)}
                        >
                          <FaEye className="text-blue-600" />
                          <span className="text-sm">View</span>
                        </button>
                      </td>
                      <td className="p-2 border border-black whitespace-nowrap text-center">
                        {student.roll_no || "N/A"}
                      </td>
                      <td className="p-2 border border-black whitespace-nowrap text-center font-medium">
                        ₹{student.currentDueAmount || "0"}
                      </td>
                      <td className="p-2 border border-black whitespace-nowrap text-center flex gap-2 justify-center">
                        <button
                          className="p-2 bg-green-100 hover:bg-green-200 border border-green-400 text-green-600 rounded"
                          onClick={() => handleApprove(student._id)}
                        >
                          ✔️
                        </button>
                        <button
                          className="p-2 bg-red-100 hover:bg-red-200 border border-red-400 text-red-600 rounded"
                          onClick={() => handleDelete(student._id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-4 text-center border border-black"
                    >
                      {formData.fromClassId && formData.fromSectionId
                        ? "No students found in selected class/section"
                        : "Please select both class and section to view students"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* Promotion Button */}
      <div className="flex justify-end items-center my-5">
        <button
          className="flex justify-end items-center px-6 py-2 bg-[#151587] text-white font-normal rounded-lg disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading || students.length === 0}
        >
          {loading ? "Processing..." : "Promote Students"}
        </button>
      </div>
    </>
  );
};
export default Promotion;
