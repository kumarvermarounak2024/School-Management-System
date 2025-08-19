import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from 'lucide-react';

const VisitorRecord = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [visitors, setVisitors] = useState([]);
    const [visitingPurposeOptions, setVisitingPurposeOptions] = useState([]);

const [formData, setFormData] = useState({
  visitingPurpose: "",
  name: "",
  mobileNo: "",
  date: "",
  entryTime: "",
  exitTime: "",
  numberOfVisitor: "1", // Default to 1 instead of empty
  idNumber: "",
  tokenPass: "",
  note: "",
});
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null); // Changed from editIndex to editId
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 5; // Number of visitors per page
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    if (activeTab === "list") {
      fetchVisitors();
    }
  }, [activeTab]);

  const fetchVisitors = async () => {
    try {
      const response = await axios.get(`${apiUrl}/visitors/getAllVisitors`);
      console.log("Visitors API Response:", response.data);

      // Safely handle data shape
      const visitorsArray =
        Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data?.visitors)
            ? response.data.data.visitors
            : [];

      setVisitors(visitorsArray);
      setCurrentPage(1); // Reset to first page when fetching new data
    } catch (error) {
      console.error("Error fetching visitors:", error);
      setVisitors([]);
    }
  };

  // visiting purpose 


    useEffect(() => {
    const fetchVisitingPurposes = async () => {
      try {
        const res = await axios.get(`${apiUrl}/configuration/visiting-purposes`);
        setVisitingPurposeOptions(res.data);
      } catch (error) {
        console.error("Failed to fetch complaint types:", error);
      }
    };

    fetchVisitingPurposes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const validate = () => {
    const newErrors = {};
    if (!formData.visitingPurpose) newErrors.visitingPurpose = "Visiting purpose is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.entryTime) newErrors.entryTime = "Entry time is required";
    if (!formData.exitTime) newErrors.exitTime = "Exit time is required";
    if (!formData.numberOfVisitor) newErrors.numberOfVisitor = "Number of visitors is required";
    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo)) newErrors.mobileNo = "Enter a valid 10-digit mobile number";
    if (formData.numberOfVisitor && formData.numberOfVisitor <= 0) newErrors.numberOfVisitor = "Must be at least 1 visitor";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      try {
        if (editId) {
          await axios.patch(`${apiUrl}/visitors/updateVisitorsById/${editId}`, formData);
          console.log("Visitor updated successfully");
        } else {
          await axios.post(`${apiUrl}/visitors/createVisitors`, formData);
          console.log("Visitor added successfully");
        }
        resetForm();
        setActiveTab("list");
        fetchVisitors();
      } catch (error) {
        console.error("Error saving visitor:", error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const resetForm = () => {
    setFormData({
      visitingPurpose: "",
      name: "",
      mobileNo: "",
      date: "",
      entryTime: "",
      exitTime: "",
      numberOfVisitor: "",
      idNumber: "",
      tokenPass: "",
      note: "",
    });
    setErrors({});
    setEditId(null);
  };

const handleEdit = async (id) => {
  try {
    console.log("Editing visitor with ID:", id); // Debug log
    const response = await axios.get(`${apiUrl}/visitors/getVisitorsById/${id}`);
    console.log("Full API Response:", response); // Debug entire response
    
    // Handle different possible response structures
    const visitor = response.data?.data?.visitor || 
                   response.data?.visitor || 
                   response.data;
    
    console.log("Extracted Visitor Data:", visitor); // Debug extracted data

    if (!visitor) {
      throw new Error("No visitor data found in response");
    }

    // Prepare form data with proper fallbacks
    const formValues = {
      visitingPurpose: visitor.visitingPurpose || visitor.visitingPurpose || "",
      name: visitor.name || "",
      mobileNo: visitor.mobileNo || visitor.mobile || "",
      date: visitor.date ? visitor.date.split('T')[0] : "",
      entryTime: visitor.entryTime || "",
      exitTime: visitor.exitTime || "",
      numberOfVisitor: visitor.numberOfVisitor?.toString() || 
                     visitor.visitorCount?.toString() || 
                     "1",
      idNumber: visitor.idNumber || visitor.id || "",
      tokenPass: visitor.tokenPass || visitor.passNumber || "",
      note: visitor.note || visitor.notes || "",
    };

    console.log("Form Values to Set:", formValues); // Debug before setting
    
    // Set form data and switch tab
    setFormData(formValues);
    setEditId(id);
    setActiveTab("add");
    
    // Force update if needed
    setTimeout(() => {
      console.log("Current formData after set:", formData); // Debug after set
    }, 100);

  } catch (error) {
    console.error("Error in handleEdit:", error);
    alert(`Failed to load visitor: ${error.message}`);
  }
};


  const handleAddNew = () => {
    resetForm();
    setActiveTab("add");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this visitor?")) {
      try {
        await axios.delete(`${apiUrl}/visitors/deleteVisitorsById/${id}`);
        fetchVisitors();
      } catch (error) {
        console.error("Error deleting visitor:", error);
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(visitors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVisitors = visitors.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    console.log("Changing to page:", page); // Debug log
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div>
        <div className="flex flex-wrap space-x-4 mb-4 border-b">
          <button
            onClick={() => setActiveTab("list")}
            className={`pb-2 font-semibold ${activeTab === "list"
                ? "text-[#143781] border-b-2 border-[#143781]"
                : "text-gray-700 font-medium-600"
              }`}
          >
            📃 Visitor List
          </button>
          <button
            onClick={handleAddNew}
            className={`pb-2 font-semibold ${activeTab === "add"
                ? "text-[#143781] border-b-2 border-[#143781]"
                : "text-gray-700 font-medium-600"
              }`}
          >
            ➕ Add Visitor
          </button>
        </div>

        {activeTab === "list" ? (
          <div className="overflow-x-auto">
            {Array.isArray(paginatedVisitors) && paginatedVisitors.length === 0 ? (
              <div className="text-gray-700 font-medium-500 text-center py-8">No visitors found.</div>
            ) : (
              <>
                <table className="min-w-full text-sm text-left text-gray-700 font-medium divide-y divide-gray-200">
                  <thead className="bg-[#E0EBFF] hover:bg-[#2152AC] hover:text-white">
                    <tr>
                      <th className="p-2">Sl</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Visiting Purpose</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Entry Time</th>
                      <th className="p-2">Exit Time</th>
                      <th className="p-2">Number Of Visitors</th>
                      <th className="p-2">Token/Pass</th>
                      <th className="p-2">Note</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVisitors.map((visitor, index) => (
                      <tr key={visitor._id} className="bg-white border-b">
                        <td className="p-2">{startIndex + index + 1}</td>
                        <td className="p-2">
                          {visitor.name} <br />
                          <span className="block">Mobile: {visitor.mobileNo || "-"}</span>
                          <span className="block">ID: {visitor.idNumber || "-"}</span>
                        </td>
<td className="p-2">
  {
    visitingPurposeOptions.find(
      (opt) => opt._id === visitor.visitingPurpose
    )?.name || visitor.visitingPurpose
  }
</td>
                        <td className="p-2">{visitor.date?.split("T")[0] || "-"}</td>
                        <td className="p-2">{visitor.entryTime || "-"}</td>
                        <td className="p-2">{visitor.exitTime || "-"}</td>
                        <td className="p-2">{visitor.numberOfVisitor || "-"}</td>
                        <td className="p-2">{visitor.tokenPass || "-"}</td>
                        <td className="p-2">{visitor.note || "-"}</td>
                        <td className="p-3 space-x-2">
                          <div className="flex gap-7">
                            <button
                              onClick={() => handleEdit(visitor._id)}
                              className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                              title="Edit Visitor"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(visitor._id)}
                              className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                              title="Delete Visitor"
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
                {visitors.length > 0 && (
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
           <form className="space-y-5" onSubmit={handleSubmit}>
      {[
   
        {
          label: "Visiting Purpose *",
          name: "visitingPurpose",
          type: "select",
          options: visitingPurposeOptions.length ? visitingPurposeOptions : [""], // backend se aaye options yaha use honge
        },
        { label: "Name *", name: "name", type: "text" },
        { label: "Mobile No", name: "mobileNo", type: "text" },
        { label: "Date *", name: "date", type: "date" },
        { label: "Entry Time *", name: "entryTime", type: "time" },
        { label: "Exit Time *", name: "exitTime", type: "time" },
        { label: "Number Of Visitor *", name: "numberOfVisitor", type: "number" },
        { label: "ID Number", name: "idNumber", type: "text" },
        { label: "Token/Pass", name: "tokenPass", type: "text" },
        { label: "Note", name: "note", type: "textarea" },
      ].map((field, index) => (
        <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
          <label className="w-full md:w-[250px] font-medium text-gray-700">
            {field.label}
          </label>
          {field.type === "select" ? (
          <select
  name={field.name}
  value={formData[field.name]}
  onChange={handleInputChange}
  className="border p-2 rounded w-full md:w-1/2"
>
  <option value="">Select purpose</option>
  {field.options.map((opt, i) => (
    <option key={opt._id || i} value={opt._id}>
      {opt.name}
    </option>
  ))}
</select>
          ) : field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              className="border p-2 rounded w-full md:w-1/2"
              rows={3}
              placeholder={`Enter ${field.label.replace(" *", "")}`}
            />
          ) : (
            <input
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleInputChange}
              className="border p-2 rounded w-full md:w-1/2"
              placeholder={`Enter ${field.label.replace(" *", "")}`}
            />
          )}
          {errors[field.name] && (
            <div className="text-red-500 text-sm w-full md:w-auto">{errors[field.name]}</div>
          )}
        </div>
      ))}
      <div className="flex justify-center mt-8 space-x-4">
      <button
  type="submit"
  className="bg-[#143781] text-white px-6 py-2 rounded mt-4"
>
  {editId ? "Update" : "Save"}
</button>

      </div>
    </form>
        )}
      </div>
    </div>
  );
};

export default VisitorRecord;