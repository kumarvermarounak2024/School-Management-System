import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Phone, Home, User, ArrowLeft } from "lucide-react";

const StudentProfile = ({ student: studentFromProp, onBack }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // student ID from URL

  const [student, setstudent] = useState(studentFromProp || null);
  const [loading, setLoading] = useState(!studentFromProp);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [issues, setIssues] = useState([]);

  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    if (student?._id) {
      fetchUploadedDocs(student._id);
    }
  }, [student]);
  // console.log("studentFromProp",studentFromProp)
  const fetchUploadedDocs = async (admissionId) => {
    try {
      const res = await axios.get(`${apiUrl}/admissions/get/${admissionId}`);
      // Check if documents are inside res.data.document OR res.data.admission.document
      console.log("datastu", res.data);
      const documents =
        res.data.document ||
        (res.data.admission && res.data.admission.document) ||
        [];
      setUploadedDocs(documents);
    } catch (error) {
      console.error("Fetch documents error:", error);
    }
  };

  useEffect(() => {
    getBookIssue();
  }, []);
  const getBookIssue = async () => {
    const response = await axios.get(`${apiUrl}/bookIssue/getAll`);
    console.log(response.data.data, "all book issue");
    setIssues(response?.data?.data);
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append("files", file);
    }

    try {
      setUploading(true);
      const res = await axios.post(
        `${apiUrl}/admissions/upload/${student._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload success:", res.data);
      setUploadedDocs(res.data.admission?.document || []);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const filterBookDetailsForStudent = issues
    ?.filter((book) => book?.user?._id === studentFromProp?._id)
    .map((data) => data);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => onBack()}
        className="flex items-center gap-2 text-gray-900 hover:underline mb-4"
      >
        <ArrowLeft size={18} />
        Back to Student List
      </button>

      <div className="flex items-center bg-gradient-to-r from-blue-900 to-teal-300 p-6 rounded-t-xl">
        <img
          src={student.photo || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-40 h-40 rounded-md object-cover border-4 border-white shadow-md"
        />
        <div className="ml-6">
          <div>
            <h2 className="text-3xl font-bold text-white">{student.name}</h2>
            <p className="text-white">{student.name || student.Name}</p>
          </div>

          {/* ✅ Added extra fields here */}
          <div className="mt-3 flex flex-col space-y-1 text-sm text-white">
            <div className="flex items-center gap-2">
              <Mail size={18} />
              <span>{student.email || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} />
              <span>{student.mobile_no || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>ID: {student.studentId || student._id || "-"}</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="font-semibold">DOB:</span>
              <span>
                {student.date_of_birth
                  ? new Date(student.dob).toLocaleDateString()
                  : "-"}
              </span>
            </div> */}
            {/* <div className="flex items-center gap-2">
              <span className="font-semibold">Class / Section:</span>
              <span>
                {student.level_class?.name || "-"} /{" "}
                {student.section?.name || "-"}
              </span>
            </div> */}
            <div className="flex items-center gap-2">
              <Home size={18} />
              <span>{student.permanentAddress || student.address || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded-b-xl">
        <div className="flex flex-col gap-4">
          {[
            "Basic Details",
            "Fees",
            "Promotion History",
            "Book Issue",
            "Exam Result",
            "Parent Information",
            "Documents",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg shadow-sm overflow-hidden mb-3"
            >
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
                  }`}
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

              {activeSection === item && (
                <div className="p-4 bg-white border-t border-gray-200 text-sm">
                  {item === "Basic Details" && student && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-lg">
                        <p>
                          <span className="font-bold text-blue-900">
                            Gender:{" "}
                          </span>
                          <span className="font-semibold text-gray-700">
                            {student.gender || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Date of Birth:{" "}
                          </span>
                          <span className="font-semibold text-gray-700">
                            {student.date_of_birth
                              ? new Date(
                                  student.date_of_birth
                                ).toLocaleDateString()
                              : "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Religion:{" "}
                          </span>
                          <span className="font-semibold text-gray-700">
                            {student.religion || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Blood Group:{" "}
                          </span>
                          <span className="font-semibold text-gray-700">
                            {student.bloodGroup || "-"}
                          </span>
                        </p>
                        {/* <p>
        <span className="font-bold text-blue-900">Present Address: </span>
        <span className="font-semibold text-gray-700">{student.presentAddress || "-"}</span>
      </p> */}
                        <p>
                          <span className="font-bold text-blue-900">
                            Permanent Address:{" "}
                          </span>
                          <span className="font-semibold text-gray-700">
                            {student.permanentAddress || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Mother Tongue:{" "}
                          </span>
                          <span className="font-semibold text-gray-700">
                            {student.motherTongue || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Category:{" "}
                          </span>
                          <span className="font-semibold text-gray-700">
                            {student.category || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Caste:{" "}
                          </span>
                          <span className="font-semibold text-gray-700">
                            {student.caste || "-"}
                          </span>
                        </p>

                        {student.socialLinks &&
                          Object.keys(student.socialLinks).length > 0 &&
                          (student.socialLinks.facebook ||
                            student.socialLinks.twitter ||
                            student.socialLinks.linkedin) && (
                            <div className="md:col-span-2 mt-6 pt-4 border-t border-gray-300">
                              <h4 className="font-bold text-blue-900 mb-3 text-lg">
                                Social Links:
                              </h4>
                              {student.socialLinks.facebook && (
                                <p className="mb-1">
                                  <span className="font-bold text-blue-900">
                                    Facebook:{" "}
                                  </span>
                                  <a
                                    href={student.socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline font-semibold"
                                  >
                                    {student.socialLinks.facebook}
                                  </a>
                                </p>
                              )}
                              {student.socialLinks.twitter && (
                                <p className="mb-1">
                                  <span className="font-bold text-blue-900">
                                    Twitter:{" "}
                                  </span>
                                  <a
                                    href={student.socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline font-semibold"
                                  >
                                    {student.socialLinks.twitter}
                                  </a>
                                </p>
                              )}
                              {student.socialLinks.linkedin && (
                                <p>
                                  <span className="font-bold text-blue-900">
                                    LinkedIn:{" "}
                                  </span>
                                  <a
                                    href={student.socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline font-semibold"
                                  >
                                    {student.socialLinks.linkedin}
                                  </a>
                                </p>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {item === "Parent Information" && student && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-lg text-gray-800">
                        <p>
                          <span className="font-bold text-blue-900">
                            Father Name:{" "}
                          </span>
                          <span className="font-semibold">
                            {student.father_name || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Mother Name:{" "}
                          </span>
                          <span className="font-semibold">
                            {student.mother_name || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Relation:{" "}
                          </span>
                          <span className="font-semibold">
                            {student.relation || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Occupation:{" "}
                          </span>
                          <span className="font-semibold">
                            {student.occupation || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Income:{" "}
                          </span>
                          <span className="font-semibold">
                            {student.income || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Education:{" "}
                          </span>
                          <span className="font-semibold">
                            {student.education || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Guardian Mobile No:{" "}
                          </span>
                          <span className="font-semibold">
                            {student.mobile_no_guardian || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            Guardian Email:{" "}
                          </span>
                          <span className="font-semibold">
                            {student.email_guardian || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            City:{" "}
                          </span>
                          <span className="font-semibold">
                            {student.guardian_city || "-"}
                          </span>
                        </p>
                        <p>
                          <span className="font-bold text-blue-900">
                            State:{" "}
                          </span>
                          <span className="font-semibold">
                            {student.guardian_state || "-"}
                          </span>
                        </p>
                        <p className="md:col-span-2">
                          <span className="font-bold text-blue-900">
                            Address:{" "}
                          </span>
                          <span className="font-semibold">
                            {student.guardian_address || "-"}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {item === "Fees" && (
                    <p className="text-gray-600 py-2">
                      Fees details will be shown here.
                    </p>
                  )}
                  {item === "Promotion History" && (
                    <p className="text-gray-600 py-2">
                      Promotion history will be shown here.
                    </p>
                  )}
                  {item === "Book Issue" &&
                    filterBookDetailsForStudent.map((book, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 mb-4 shadow bg-white"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={book.bookTitle?.coverImage}
                            alt="Book Cover"
                            className="w-20 h-28 object-cover rounded"
                          />
                          <div>
                            <h2 className="text-lg font-semibold text-[#151587]">
                              {book.bookTitle?.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                              Author: {book.bookTitle?.author}
                            </p>
                            <p className="text-sm text-gray-600">
                              Edition: {book.bookTitle?.edition}
                            </p>
                            <p className="text-sm text-gray-600">
                              Category: {book.bookCategory?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Class: {book.class?.Name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Issued To: {book.issuedTo?.name}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
                          <p>
                            <span className="font-medium">Issue Date:</span>{" "}
                            {new Date(book.issueDate).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-medium">Expiry Date:</span>{" "}
                            {new Date(book.expiryDate).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-medium">Status:</span>{" "}
                            {book.status}
                          </p>
                          <p>
                            <span className="font-medium">Fine:</span> ₹
                            {book.fine}
                          </p>
                        </div>
                      </div>
                    ))}

                  {item === "Exam Result" && (
                    <p className="text-gray-600 py-2">
                      Exam results will be shown here.
                    </p>
                  )}

                  {item === "Documents" && (
                    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
                      <h3 className="text-xl font-bold mb-5 text-blue-900 border-b pb-2">
                        Upload Documents
                      </h3>

                      <label className="block mb-4">
                        <span className="sr-only">Choose files</span>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100
                   cursor-pointer"
                        />
                      </label>

                      <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className={`w-1/6 py-2 rounded-md text-white font-semibold transition 
                  ${
                    uploading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </button>

                      <h4 className="text-lg font-semibold mt-8 mb-3 text-blue-900">
                        Uploaded Documents
                      </h4>

                      {uploadedDocs.length > 0 ? (
                        <ul className="space-y-3 max-h-48 overflow-y-auto">
                          {uploadedDocs.map((docUrl, idx) => (
                            <li
                              key={idx}
                              className="p-3 bg-blue-50 rounded-md shadow-sm flex items-center justify-between"
                            >
                              <a
                                href={docUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:underline font-medium"
                              >
                                Document {idx + 1}
                              </a>
                              <a
                                href={docUrl}
                                download
                                className="text-sm text-blue-500 hover:text-blue-700"
                                title="Download Document"
                              >
                                ⬇️
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">
                          No documents uploaded yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
