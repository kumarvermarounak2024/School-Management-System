import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

const AdmissionEnquiry = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const itemsPerPage = 5; // Number of enquiries per page

  const [activeTab, setActiveTab] = useState("form");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [classList, setClassList] = useState([]);

  // State for storing dropdown data
  const [references, setReferences] = useState([]);
  const [responses, setResponses] = useState([]);

  // State for selected values
  const [selectedReference, setSelectedReference] = useState("");
  const [selectedResponse, setSelectedResponse] = useState("");

  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    previousSchool: "",
    fatherName: "",
    motherName: "",
    mobileNo: "",
    email: "",
    address: "",
    noOfChild: "",
    assigned: "",
    reference: "",
    response: "",
    responseText: "",
    note: "",
    date: "",
    classApplyingFor: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch references data from API
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const res = await axios.get(`${apiUrl}/configuration/references`);
        console.log("References data:", res.data);
        setReferences(res.data); // ya res.data.data agar aapka response aise ho
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    };

    fetchReferences();
  }, []);

  const toggleStatus = (id) => {
    const updated = enquiries.map((enquiry) =>
      enquiry._id === id
        ? {
            ...enquiry,
            status: enquiry.status === "Active" ? "Inactive" : "Active",
          }
        : enquiry
    );
    setEnquiries(updated);
  };

  // Fetch responses data from API
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get(`${apiUrl}/configuration/responses`);
        console.log("Responses data:", res.data);
        setResponses(res.data); // ya res.data.data agar aapka response aise wrapped ho
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };

    fetchResponses();
  }, []);
  // Handlers for dropdown changes
  const handleReferenceChange = (e) => {
    setSelectedReference(e.target.value);
    // Optional: Clear errors if any
    setErrors((prev) => ({ ...prev, reference: "" }));
  };

  const handleResponseChange = (e) => {
    setSelectedResponse(e.target.value);
    // Optional: Clear errors if any
    setErrors((prev) => ({ ...prev, response: "" }));
  };

  // Fetch enquiries
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/enquiries/getEnquiry`);
      setEnquiries(res.data.data);
      setCurrentPage(1); // Reset to first page when fetching new data
    } catch (err) {
      console.error("Failed to fetch enquiries", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff list
  const fetchStaffList = async () => {
    try {
      const res = await axios.get(`${apiUrl}/staff/get`);
      setStaffList(res.data.employees || []);
    } catch (error) {
      console.error("Failed to fetch staff list", error);
    }
  };

  // Fetch class list
  const fetchClassList = async () => {
    try {
      const res = await axios.get(`${apiUrl}/class/getAll`);
      setClassList(res.data.classes || []);
    } catch (error) {
      console.error("Failed to fetch class list", error);
    }
  };

  useEffect(() => {
    if (activeTab === "list") fetchEnquiries();
    if (activeTab === "form") {
      fetchStaffList();
      fetchClassList();
    }
  }, [activeTab]);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.fatherName) newErrors.fatherName = "Father Name is required";
    if (!formData.motherName) newErrors.motherName = "Mother Name is required";
    if (!formData.mobileNo) newErrors.mobileNo = "Mobile No is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.noOfChild) newErrors.noOfChild = "No. of Child is required";
    if (!formData.assigned) newErrors.assigned = "Assigned staff is required";
    if (!formData.reference) newErrors.reference = "Reference is required";
    if (!formData.response) newErrors.response = "Response is required";
    if (!formData.classApplyingFor)
      newErrors.classApplyingFor = "Class applying for is required";
    if (!formData.date) newErrors.date = "Date is required";
    return newErrors;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const payload = {
      name: formData.name,
      gender: formData.gender,
      dateOfBirth: formData.dob || null,
      previousSchool: formData.previousSchool,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      mobileNo: formData.mobileNo,
      email: formData.email,
      address: formData.address,
      noOfChild: Number(formData.noOfChild),
      assigned: formData.assigned,
      reference: formData.reference,
      response: formData.response,
      responseText: formData.responseText,
      note: formData.note,
      date: formData.date || new Date().toISOString(),
      classApplyingFor: formData.classApplyingFor,
    };

    try {
      if (editId) {
        await axios.put(
          `${apiUrl}/enquiries/updateEnquiryById/${editId}`,
          payload
        );
        alert("Enquiry updated successfully");
        setEditId(null);
      } else {
        await axios.post(`${apiUrl}/enquiries/createEnquiry`, payload);
        alert("Enquiry added successfully");
      }
      setFormData({
        name: "",
        gender: "",
        dob: "",
        previousSchool: "",
        fatherName: "",
        motherName: "",
        mobileNo: "",
        email: "",
        address: "",
        noOfChild: "",
        assigned: "",
        reference: "",
        response: "",
        responseText: "",
        note: "",
        date: "",
        classApplyingFor: "",
      });
      setErrors({});
      setActiveTab("list");
      fetchEnquiries();
    } catch (err) {
      console.error("Failed to submit enquiry", err);
      alert("Failed to submit enquiry");
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Edit enquiry: fetch by ID
  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`${apiUrl}/enquiries/getEnquiryById/${id}`);
      const data = res.data.data;

      setFormData({
        name: data.name || "",
        gender: data.gender || "",
        dob: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : "",
        previousSchool: data.previousSchool || "",
        fatherName: data.fatherName || "",
        motherName: data.motherName || "",
        mobileNo: data.mobileNo || "",
        email: data.email || "",
        address: data.address || "",
        noOfChild: data.noOfChild?.toString() || "",
        assigned: data.assigned?._id || "",
        reference: data.reference?._id || data.reference || "",
        response: data.response || "",
        responseText: data.responseText || "",
        note: data.note || "",
        date: data.date ? data.date.substring(0, 10) : "",
        classApplyingFor: data.classApplyingFor?._id || "",
      });
      setEditId(id);
      setActiveTab("form");
    } catch (err) {
      console.error("Failed to fetch enquiry by ID", err);
    }
  };

  // Delete enquiry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?"))
      return;
    try {
      await axios.delete(`${apiUrl}/enquiries/deleteEnquiryById/${id}`);
      alert("Enquiry deleted successfully");
      fetchEnquiries();
    } catch (err) {
      console.error("Failed to delete enquiry", err);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(enquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEnquiries = enquiries.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 border-b-2 font-medium ${
            activeTab === "list"
              ? "text-[#143781] border-[#143781]"
              : "text-gray-700"
          }`}
        >
          📃 Enquiry List
        </button>
        <button
          onClick={() => {
            setActiveTab("form");
            setEditId(null);
            setFormData({
              name: "",
              gender: "",
              dob: "",
              previousSchool: "",
              fatherName: "",
              motherName: "",
              mobileNo: "",
              email: "",
              address: "",
              noOfChild: "",
              assigned: "",
              reference: "",
              response: "",
              responseText: "",
              note: "",
              date: "",
              classApplyingFor: "",
            });
            setErrors({});
          }}
          className={`px-4 py-2 font-medium ${
            activeTab === "form"
              ? "text-[#143781] border-b-2 border-[#143781]"
              : "text-gray-700"
          }`}
        >
          ➕ Add Enquiry
        </button>
      </div>

      {/* List Tab */}
      {activeTab === "list" &&
        (loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 font-medium">
                <thead className="bg-[#D5DDFF]">
                  <tr>
                    <th className="p-2">Sl</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Mobile No</th>
                    <th className="p-2">Guardian</th>
                    <th className="p-2">Reference</th>
                    <th className="p-2">Enquiry Date</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEnquiries.map((enquiry, idx) => (
                    <tr
                      key={enquiry._id}
                      className="bg-white border-b border-[#143781]"
                    >
                      <td className="p-2">{startIndex + idx + 1}</td>
                      <td className="p-2">{enquiry.name}</td>
                      <td className="p-2">{enquiry.mobileNo}</td>
                      <td className="p-2">
                        Father: {enquiry.fatherName}
                        <br />
                        Mother: {enquiry.motherName}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {enquiry.reference?.name ||
                          references.find(
                            (ref) => ref._id === enquiry.reference
                          )?.name ||
                          enquiry.reference ||
                          "-"}
                      </td>
                      <td className="p-2">
                        {enquiry.date ? enquiry.date.substring(0, 10) : ""}
                      </td>
                      <td className="p-2">
                        <span
                          onClick={() => toggleStatus(enquiry._id)}
                          className={`cursor-pointer px-2 py-1 rounded text-xs ${
                            enquiry.status === "Inactive"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {enquiry.status || "Inactive"}
                        </span>
                      </td>
                      <td className="p-2 space-x-2">
                        <div className="flex gap-8">
                          <button
                            onClick={() => handleEdit(enquiry._id)}
                            className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(enquiry._id)}
                            className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {enquiries.length > 0 && (
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  )
                )}
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
        ))}

      {/* Form Tab */}
      {activeTab === "form" && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name */}
          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Gender */}
          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium" htmlFor="gender">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium">
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            />
          </div>

          {/* Previous School */}
          <div className="flex items-center">
            <label
              className="w-60 text-gray-700 font-medium"
              htmlFor="previousSchool"
            >
              Previous School
            </label>
            <input
              id="previousSchool"
              type="text"
              name="previousSchool"
              value={formData.previousSchool}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            />
          </div>

          {/* Father Name */}
          <div className="flex items-center">
            <label
              className="w-60 text-gray-700 font-medium"
              htmlFor="fatherName"
            >
              Father Name *
            </label>
            <input
              id="fatherName"
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            />
            {errors.fatherName && (
              <p className="text-red-500 text-sm">{errors.fatherName}</p>
            )}
          </div>

          {/* Mother Name */}
          <div className="flex items-center">
            <label
              className="w-60 text-gray-700 font-medium"
              htmlFor="motherName"
            >
              Mother Name *
            </label>
            <input
              id="motherName"
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            />
            {errors.motherName && (
              <p className="text-red-500 text-sm">{errors.motherName}</p>
            )}
          </div>

          {/* Mobile No */}
          <div className="flex items-center">
            <label
              className="w-60 text-gray-700 font-medium"
              htmlFor="mobileNo"
            >
              Mobile No *
            </label>
            <input
              id="mobileNo"
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            />
            {errors.mobileNo && (
              <p className="text-red-500 text-sm">{errors.mobileNo}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            />
          </div>

          {/* Address */}
          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium" htmlFor="address">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          {/* No of Child */}
          <div className="flex items-center">
            <label
              className="w-60 text-gray-700 font-medium"
              htmlFor="noOfChild"
            >
              Number of Child *
            </label>
            <input
              id="noOfChild"
              type="number"
              min="1"
              name="noOfChild"
              value={formData.noOfChild}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            />
            {errors.noOfChild && (
              <p className="text-red-500 text-sm">{errors.noOfChild}</p>
            )}
          </div>

          {/* Assigned Staff */}
          <div className="flex items-center">
            <label
              className="w-60 text-gray-700 font-medium"
              htmlFor="assigned"
            >
              Assigned Staff *
            </label>
            <select
              id="assigned"
              name="assigned"
              value={formData.assigned}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            >
              <option value="">Select Staff</option>
              {staffList.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.name}
                </option>
              ))}
            </select>
            {errors.assigned && (
              <p className="text-red-500 text-sm">{errors.assigned}</p>
            )}
          </div>

          {/* Reference */}
          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium">
              Reference *
            </label>
            <select
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="border rounded w-1/2 p-2"
            >
              <option value="">Select</option>
              {references.map((ref) => (
                <option key={ref._id} value={ref._id}>
                  {ref.name}
                </option>
              ))}
            </select>
            {errors.reference && (
              <p className="text-red-600 text-sm">{errors.reference}</p>
            )}
          </div>

          {/* Response */}
          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium">Response *</label>
            <select
              name="response"
              value={formData.response}
              onChange={handleChange}
              className="border rounded w-1/2 p-2"
            >
              <option value="">Select</option>
              {responses.map((resp) => (
                <option key={resp._id} value={resp._id}>
                  {resp.name}
                </option>
              ))}
            </select>
            {errors.response && (
              <p className="text-red-600 text-sm">{errors.response}</p>
            )}
          </div>

          {/* Response Text */}
          <div className="flex items-center">
            <label
              className="w-60 text-gray-700 font-medium"
              htmlFor="responseText"
            >
              Response Text
            </label>
            <textarea
              id="responseText"
              name="responseText"
              value={formData.responseText}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            />
          </div>

          {/* Note */}
          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium" htmlFor="note">
              Note
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            />
          </div>

          {/* Enquiry Date */}
          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium" htmlFor="date">
              Enquiry Date *
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>

          {/* Class Applying For */}
          <div className="flex items-center">
            <label
              className="w-60 text-gray-700 font-medium"
              htmlFor="classApplyingFor"
            >
              Class Applying For *
            </label>
            <select
              id="classApplyingFor"
              name="classApplyingFor"
              value={formData.classApplyingFor}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded w-1/2"
            >
              <option value="">Select Class</option>
              {classList.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.Name}
                </option>
              ))}
            </select>
            {errors.classApplyingFor && (
              <p className="text-red-500 text-sm">{errors.classApplyingFor}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#143781] text-white px-6 py-2 rounded mt-4"
            >
              {editId ? "Update Enquiry" : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdmissionEnquiry;
