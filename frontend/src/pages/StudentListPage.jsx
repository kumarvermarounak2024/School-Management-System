import React, { useState, useEffect } from "react";
import axios from "axios";
import pic from "../assets/images/face.png";
import { toast, ToastContainer } from "react-toastify";
import StudnetProfile from "./StudnetProfile";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";

export default function StudentListPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentFullProfileData, setStudentFullProfileData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsFetched, setStudentsFetched] = useState(false); 

  const itemsPerPage = 5;
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    fetchClasses();
    fetchSections();
  }, [navigate]);




  const formatAgeDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const ageDate = new Date(dateString);
    return ageDate.toLocaleString("en-GB", options);
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/class/getAll`);
      setClasses(res.data.classes || []);
    } catch (err) {
      setError("Failed to load classes");
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get(`${apiUrl}/section/getAll`);
      setSections(res.data.sections || []);
    } catch (err) {
      setError("Failed to load sections");
    }
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    setStudentsFetched(true); 
    try {
      const params = {};
      if (selectedClass !== "All") params.class = selectedClass;
      if (selectedSection !== "All") params.section = selectedSection;

      const res = await axios.get(`${apiUrl}/admissions/getAllAdmissions`, {
        params,
      });
      setStudents(res.data.data || []);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load students");
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = async (id, openProfile = false) => {
    try {
      const res = await axios.get(`${apiUrl}/admissions/getAdmissionById/${id}`);
      setSelectedStudent(res?.data?.data);
      setShowQuickView(!openProfile);
      setShowProfile(openProfile);
    } catch (err) {
      setError("Failed to load student details");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this student?")) {
        const response = await axios.delete(
          `${apiUrl}/admissions/deleteAdmissionById/${id}`
        );
        if (response?.status === 200) {
          toast.success("Deleted successfully");
        }
        fetchStudents();
      }
    } catch (err) {
      setError("Failed to delete student");
    }
  };

  const closeOverlay = () => {
    setShowQuickView(false);
    setShowProfile(false);
    setSelectedStudent(null);
  };

  const getStringValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return value.Name || value.className || value.sectionName || JSON.stringify(value);
    }
    return value || "N/A";
  };

  const toggleStatus = async (studentId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      const response = await axios.patch(
        `${apiUrl}/admissions/updateStatus/${studentId}`,
        { status: newStatus }
      );
      if (response.status === 200) {
        toast.success(`Student status updated to ${newStatus}`);
        fetchStudents();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredStudents = students.filter((student) => {
    if (selectedClass === "All" && selectedSection === "All") {
      return true;
    }
    return (
      (selectedClass === "All" ||
        student?.level_class?.Name?.toLowerCase() === selectedClass?.toLowerCase()) &&
      (selectedSection === "All" ||
        student?.section?.Name?.toLowerCase() === selectedSection?.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage; 
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (studentFullProfileData) {
    return (
      <StudnetProfile
        student={studentFullProfileData}
        onBack={() => setStudentFullProfileData(null)}
      />
    );
  }

  return (
    <>
      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1 font-medium">Class *</label>
            <select
              className="w-full border border-gray-400 rounded p-2"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="All">All Classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls.Name || cls.className}>
                  {cls.Name || cls.className}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Section *</label>
            <select
              className="w-full border border-gray-400 rounded p-2"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="All">All Sections</option>
              {sections.map((sec) => (
                <option key={sec._id} value={sec.Name || sec.sectionName}>
                  {sec.Name || sec.sectionName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex">
            <button
              onClick={fetchStudents}
              className="bg-[#143781] text-white px-6 py-2 rounded mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Show Students"}
            </button>
          </div>
        </div>

        {studentsFetched && (
          <div className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Student List</h3>
              <span className="text-sm text-gray-600">
                {filteredStudents.length > 0 && `Showing ${filteredStudents.length} students`}
              </span>
            </div>

            {isLoading ? (
              <p className="text-center py-4">Loading students...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-center">
                  <thead className="bg-gray-100 text-sm">
                    <tr>
                      <th className="border px-2 py-1">Photo</th>
                      <th className="border px-2 py-1">Name</th>
                      <th className="border px-2 py-1">Class</th>
                      <th className="border px-2 py-1">Section</th>
                      <th className="border px-2 py-1">Register No</th>
                      <th className="border px-2 py-1">Roll Number</th>
                      <th className="border px-2 py-1">Age</th>
                      <th className="border px-2 py-1">Guardian</th>
                      <th className="border px-2 py-1">Status</th>
                      <th className="border px-2 py-1">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.length ? (
                      paginatedStudents.map((student) => (
                        <tr key={student._id}>
                          <td className="border px-2 py-1">
                            <img
                              src={student.photo || pic}
                              className="h-10 w-10 rounded-full object-cover mx-auto"
                              alt="student"
                            />
                          </td>
                          <td className="border px-2 py-1">
                            {`${student.firstName} ${student.lastName}`}
                          </td>
                          <td className="border px-2 py-1">
                            {getStringValue(student?.level_class?.Name || student.class)}
                          </td>
                          <td className="border px-2 py-1">
                            {getStringValue(student.section)}
                          </td>
                          <td className="border px-2 py-1">{student.registration_no}</td>
                          <td className="border px-2 py-1">{student.roll_no}</td>
                          <td className="border px-2 py-1">
                            {formatAgeDate(student.date_of_birth)}
                          </td>
                          <td className="border px-2 py-1">{student.guardian_name}</td>
                          <td className="border px-2 py-1">
                            <button
                              onClick={() => toggleStatus(student._id, student.status)}
                              className={`px-2 py-1 rounded text-white ${
                                student.status === "Active" ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              {student.status}
                            </button>
                          </td>
                          <td className="border px-2 py-1 space-x-2">
                            <div className="flex gap-3 justify-center">
                              <button
                                onClick={() => handleViewClick(student._id)}
                                title="Quick View"
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => setStudentFullProfileData(student)}
                                title="Full Profile"
                                className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                              >
                                ➡️
                              </button>
                              <button
                                onClick={() => handleDelete(student._id)}
                                title="Delete"
                                className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="py-4 text-gray-500">
                          No students found. Please select filters and click 'Show Students'.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {filteredStudents.length > 0 && (
                  <div className="flex justify-center items-center mt-4 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-md font-medium ${
                        currentPage === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#143781] text-white hover:bg-[#0f2a5c]"
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md font-medium ${
                          currentPage === page
                            ? "bg-[#143781] text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-md font-medium ${
                        currentPage === totalPages
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#143781] text-white hover:bg-[#0f2a5c]"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {selectedStudent && (showQuickView || showProfile) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
                onClick={closeOverlay}
              >
                ✖
              </button>

              {showQuickView && selectedStudent && (
                <div className="max-w-xl mx-auto mt-4 bg-white rounded-lg">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    Quick View
                  </h2>

                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-md overflow-hidden border-4 border-yellow-400">
                      <img
                        src={selectedStudent.photo || "https://via.placeholder.com/100"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="mt-2 font-semibold text-xl">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h3>
                    <p className="text-gray-600">
                      Student / {selectedStudent.category || "N/A"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div>
                      <strong>Register No</strong>
                      <p>{selectedStudent.registration_no}</p>
                    </div>
                    <div>
                      <strong>Roll</strong>
                      <p>{selectedStudent.roll_no}</p>
                    </div>
                    <div>
                      <strong>Class</strong>
                      <p>{getStringValue(selectedStudent?.level_class?.Name)}</p>
                    </div>
                    <div>
                      <strong>Section</strong>
                      <p>{getStringValue(selectedStudent?.section)}</p>
                    </div>
                    <div>
                      <strong>Date Of Birth</strong>
                      <p>{formatAgeDate(selectedStudent.date_of_birth)}</p>
                    </div>
                    <div>
                      <strong>Guardian</strong>
                      <p>{selectedStudent.guardian_name}</p>
                    </div>
                    <div>
                      <strong>Email</strong>
                      <p>{selectedStudent.email || "N/A"}</p>
                    </div>
                    <div>
                      <strong>Mobile No</strong>
                      <p>{selectedStudent.mobile_no || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <strong>Address</strong>
                      <p>{selectedStudent.permanentAddress || "N/A"}</p>
                    </div>
                  </div>

                  <div className="mt-6 text-right">
                    <button
                      onClick={() => setShowQuickView(false)}
                      className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}