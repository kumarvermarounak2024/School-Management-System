import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

const ComplaintsForm = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const itemsPerPage = 5; // Number of complaints per page

  const [activeTab, setActiveTab] = useState("add");
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    complainantName: "",
    mobileNo: "",
    complaintType: "",
    note: "",
    date: "",
    dateOfSolution: "",
    status: "Pending",
    assignTo: "",
    document: null,
  });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [selectedComplaintType, setSelectedComplaintType] = useState("");  const [error, setError] = useState("");


  useEffect(() => {
    const fetchComplaintTypes = async () => {
      try {
        const res = await axios.get(`${apiUrl}/configuration/complaint-types`);
        setComplaintTypes(res.data);
      } catch (error) {
        console.error("Failed to fetch complaint types:", error);
      }
    };

    fetchComplaintTypes();
  }, []);


  useEffect(() => {
    if (activeTab === "list") {
      fetchComplaints();
    }
    if (activeTab === "add") {
      fetchEmployees();
    }
  }, [activeTab]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/complaints/getAllComplains`);
console.log("rescomplaint",res.data)
      
      setComplaints(res.data.data || []);
      setCurrentPage(1); // Reset to first page when fetching new data
      console.log("Fetched complaints:", res.data.data); // Debug log
    } catch (err) {
      console.error("Error fetching complaints", err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${apiUrl}/staff/get`);
      setEmployees(res.data.employees || []);
      console.log("Fetched employees:", res.data.employees); // Debug log
    } catch (err) {
      console.error("Error fetching employees", err);
      setEmployees([]);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.complainantName)
      newErrors.complainantName = "Complainant Name is required";
    if (!formData.mobileNo) newErrors.mobileNo = "Mobile Number is required";
    if (!formData.complaintType)
      // newErrors.complaintType = "Complaint Type is required";
    if (!formData.date) newErrors.date = "Complaint Date is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.assignTo) newErrors.assignTo = "Assign To is required";
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, document: e.target.files[0] }));
    }
  };

  const resetForm = () => {
    setFormData({
      complainantName: "",
      mobileNo: "",
      complaintType: "",
      note: "",
      date: "",
      dateOfSolution: "",
      status: "Pending",
      assignTo: "",
      document: null,
    });
    setErrors({});
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      try {
        const data = new FormData();
        data.append("complainantName", formData.complainantName);
        data.append("mobileNo", formData.mobileNo);
        data.append("complaintType", formData.complaintType);
        data.append("note", formData.note || "");
        data.append("date", formData.date);
        if (formData.dateOfSolution)
          data.append("dateOfSolution", formData.dateOfSolution);
        data.append("status", formData.status);
        data.append("assignTo", formData.assignTo);
        if (formData.document) data.append("document", formData.document);

        // Debug log
        for (let pair of data.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        if (editId) {
          await axios.put(
            `${apiUrl}/complaints/updateComplainById/${editId}`,
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          console.log("Complaint updated successfully");
        } else {
          await axios.post(`${apiUrl}/complaints/createComplain`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("Complaint created successfully");
        }

        resetForm();
        setActiveTab("list");
        fetchComplaints();
      } catch (error) {
        console.error("Error saving complaint", error.response?.data || error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`${apiUrl}/complaints/getComplainById/${id}`);
      const comp = res.data.data;
      if (comp) {
        setFormData({
          complainantName: comp.complainantName || "",
          mobileNo: comp.mobileNo || "",
  complaintType: comp.complaintType?._id || "",
          note: comp.note || "",
          date: comp.date ? comp.date.split("T")[0] : "",
          dateOfSolution: comp.dateOfSolution
            ? comp.dateOfSolution.split("T")[0]
            : "",
          status: comp.status || "Pending",
          assignTo: comp.assignTo?._id || comp.assignTo || "",
          document: null,
        });
        setEditId(id);
        setActiveTab("add");
      }
    } catch (err) {
      console.error("Error fetching complaint by id", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        await axios.delete(`${apiUrl}/complaints/deleteComplainById/${id}`);
        fetchComplaints();
      } catch (error) {
        console.error("Error deleting complaint", error);
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(complaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedComplaints = complaints.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    console.log("Changing to page:", page); // Debug log
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex space-x-4 mb-6 border-b pb-2">
        <button
          onClick={() => setActiveTab("list")}
          className={`pb-2 font-semibold ${activeTab === "list"
              ? "text-[#143781] border-b-2 border-[#143781]"
              : "text-gray-700"
            }`}
        >
          📋 Complaint List
        </button>
        <button
          onClick={() => {
            resetForm();
            setActiveTab("add");
          }}
          className={`pb-2 font-semibold ${activeTab === "add"
              ? "text-[#143781] border-b-2 border-[#143781]"
              : "text-gray-700"
            }`}
        >
          ➕ Add Complaint
        </button>
      </div>

      {activeTab === "list" ? (
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-700 font-medium">
              Loading...
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8 text-gray-700 font-medium">
              No complaints found.
            </div>
          ) : (
            <>
              <table className="min-w-full text-sm text-left text-gray-700 font-medium">
                <thead className="bg-[#E0EBFF]">
                  <tr>
                    <th className="p-2 border border-gray-300">#</th>
                    <th className="p-2 border border-gray-300">Complainant Name</th>
                    <th className="p-2 border border-gray-300">Type</th>
                    <th className="p-2 border border-gray-300">Note</th>
                    <th className="p-2 border border-gray-300">Date</th>
                    <th className="p-2 border border-gray-300">Status</th>
                    <th className="p-2 border border-gray-300">Assign To</th>
                    <th className="p-2 border border-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedComplaints.map((comp, i) => (
                    <tr key={comp._id} className="border-b">
                      <td className="p-2 border border-gray-300">{startIndex + i + 1}</td>
                      <td className="p-2 border border-gray-300">{comp.complainantName}</td>
<td className="p-2 border border-gray-300">
  {comp.complaintType?.name || complaintTypes.find(type => type._id === comp.complaintType)?.name || comp.complaintType}
</td>

                      <td className="p-2 border border-gray-300">{comp.note || "-"}</td>
                      <td className="p-2 border border-gray-300">
                        {comp.date ? comp.date.split("T")[0] : "-"}
                      </td>
                      <td className="p-2 border border-gray-300">{comp.status}</td>
                      <td className="p-2 border border-gray-300">
                        {comp.assignTo?.name || comp.assignTo || "-"}
                      </td>
                      <td className="p-2 border border-gray-300 space-x-2">
                        <div className="flex gap-6">
                          <button
                            onClick={() => handleEdit(comp._id)}
                            className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                            title="Edit Complaint"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(comp._id)}
                            className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                            title="Delete Complaint"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {complaints.length > 0 && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md font-medium ${currentPage === 1
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
                      className={`px-4 py-2 rounded-md font-medium ${currentPage === page
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
                    className={`px-4 py-2 rounded-md font-medium ${currentPage === totalPages
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#143781] text-white hover:bg-[#0f2a5c]"
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 mx-auto border p-6 rounded shadow"
          encType="multipart/form-data"
        >
          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium">
              Complainant Name *
            </label>
            <input
              name="complainantName"
              value={formData.complainantName}
              onChange={handleInputChange}
              className="border rounded w-1/2 p-2"
              placeholder="Enter complainant name"
            />
            {errors.complainantName && (
              <p className="text-red-600 text-sm">{errors.complainantName}</p>
            )}
          </div>

          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium">
              Mobile Number *
            </label>
            <input
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleInputChange}
              className="border rounded w-1/2 p-2"
              placeholder="Enter mobile number"
            />
            {errors.mobileNo && (
              <p className="text-red-600 text-sm">{errors.mobileNo}</p>
            )}
          </div>

             <div className="flex items-center">
      <label className="w-60 text-gray-700 font-medium">Complaint Type *</label>
<select
  name="complaintType"
  value={formData.complaintType}
  onChange={handleInputChange}
  className="border rounded w-1/2 p-2"
>
  <option value="">Select</option>
  {complaintTypes.map((type) => (
    <option key={type._id} value={type._id}>
      {type.name}
    </option>
  ))}
</select>

      {errors.complaintType && (
        <p className="text-red-600 text-sm">{errors.complaintType}</p>
      )}
    </div>

          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium">Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              rows={3}
              className="border rounded w-1/2 p-2"
              placeholder="Enter note or description"
            />
          </div>

          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium">
              Complaint Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="border rounded p-2 w-1/2"
            />
            {errors.date && (
              <p className="text-red-600 text-sm">{errors.date}</p>
            )}
          </div>

          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium">
              Date of Solution
            </label>
            <input
              type="date"
              name="dateOfSolution"
              value={formData.dateOfSolution}
              onChange={handleInputChange}
              className="border rounded p-2 w-1/2"
            />
          </div>

          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="border rounded p-2 w-1/2"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            {errors.status && (
              <p className="text-red-600 text-sm">{errors.status}</p>
            )}
          </div>

          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium">
              Assign To *
            </label>
            <select
              name="assignTo"
              value={formData.assignTo}
              onChange={handleInputChange}
              className="border rounded p-2 w-1/2"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
            {errors.assignTo && (
              <p className="text-red-600 text-sm">{errors.assignTo}</p>
            )}
          </div>

          <div className="flex items-center">
            <label className="w-60 text-gray-700 font-medium">Document</label>
            <input
              type="file"
              name="document"
              onChange={handleFileChange}
              className="border rounded p-2 w-1/2"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#143781] text-white px-6 py-2 rounded mt-4"
            >
              {editId ? "Update Complaint" : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ComplaintsForm;