import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const PostalRecord = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const itemsPerPage = 5; // Number of postal records per page

  const [activeTab, setActiveTab] = useState("add");
  const [postalList, setPostalList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [formData, setFormData] = useState({
    type: "",
    reference_no: "",
    sender_title: "",
    receiver_title: "",
    address: "",
    note: "",
    date: "",
    confidential: false,
    document_file: null,
  });

  const fetchPostalRecords = async () => {
    try {
      const res = await axios.get(`${apiUrl}/postal/getAllPostal`);
      setPostalList(res.data.data || []);
      setCurrentPage(1); // Reset to first page when fetching new data
      console.log("Fetched postal records:", res.data.data); // Debug log
    } catch (error) {
      console.error("Error fetching postal records:", error);
      toast.error("Failed to fetch postal records.");
    }
  };

  useEffect(() => {
    if (activeTab === "list") {
      fetchPostalRecords();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.reference_no ||
      !formData.sender_title ||
      !formData.receiver_title ||
      !formData.date
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const postData = new FormData();
      for (let key in formData) {
        if (key === "document_file" && formData.document_file) {
          postData.append("document_file", formData.document_file);
        } else {
          postData.append(key, formData[key]);
        }
      }

      if (editingId) {
        await axios.put(
          `${apiUrl}/postal/updatePostalById/${editingId}`,
          postData
        );
        toast.success("Postal record updated successfully!");
      } else {
        await axios.post(`${apiUrl}/postal/createPostal`, postData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Postal record created successfully!");
      }

      resetForm();
      setActiveTab("list");
      fetchPostalRecords();
    } catch (error) {
      console.error("Error saving postal record:", error);
      toast.error("Failed to save postal record.");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`${apiUrl}/postal/getPostalById/${id}`);
      const data = res.data.data;
      setFormData({
        type: data.type || "",
        reference_no: data.reference_no || "",
        sender_title: data.sender_title || "",
        receiver_title: data.receiver_title || "",
        address: data.address || "",
        note: data.note || "",
        date: data.date?.split("T")[0] || "",
        confidential: data.confidential || false,
        document_file: null, // File inputs can't be pre-filled
      });
      setEditingId(id);
      setActiveTab("add");
    } catch (error) {
      console.error("Error fetching record:", error);
      toast.error("Failed to fetch record.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${apiUrl}/postal/deletePostalById/${id}`);
      fetchPostalRecords();
      toast.success("Deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete record.");
    }
  };

  const resetForm = () => {
    setFormData({
      type: "",
      reference_no: "",
      sender_title: "",
      receiver_title: "",
      address: "",
      note: "",
      date: "",
      confidential: false,
      document_file: null,
    });
    setEditingId(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(postalList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPostalList = postalList.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    console.log("Changing to page:", page); // Debug log
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="bg-gray-50">
        <div>
          {/* Tab Navigation */}
          <div className="flex space-x-4 border-b mb-4">
            <button
              onClick={() => setActiveTab("list")}
              className={`pb-2 font-semibold ${activeTab === "list"
                  ? "text-[#143781] border-b-2 border-[#143781]"
                  : "text-gray-700"
                }`}
            >
              📃 Postal Record List
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
              ➕ Add Postal Record
            </button>
          </div>

          {/* List Tab */}
          {activeTab === "list" && (
            <div>
              {postalList.length === 0 ? (
                <p className="text-gray-600 text-center">No postal records found.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border text-left text-gray-700">
                      <thead className="bg-[#E0EBFF]">
                        <tr>
                          <th className="p-2">Sl</th>
                          <th className="p-2">Type</th>
                          <th className="p-2">Sender Title</th>
                          <th className="p-2">Receiver Title</th>
                          <th className="p-2">Date</th>
                          <th className="p-2">Confidential</th>
                          <th className="p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedPostalList.map((item, index) => (
                          <tr key={item._id} className="border-b">
                            <td className="p-2">{startIndex + index + 1}</td>
                            <td className="p-2">{item.type}</td>
                            <td className="p-2">{item.sender_title}</td>
                            <td className="p-2">{item.receiver_title}</td>
                            <td className="p-2">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              {item.confidential ? "Yes" : "No"}
                            </td>
                            <td className="p-2 space-x-2 text-lg">
                              <div className="flex gap-7">
                                <button
                                  className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                                  onClick={() => handleEdit(item._id)}
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                                  onClick={() => handleDelete(item._id)}
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
                </>
              )}
            </div>
          )}

          {/* Add/Edit Tab */}
          {activeTab === "add" && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Type */}
              <div className="flex items-center">
                <label className="w-60 text-gray-700 font-medium">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded w-1/2"
                  required
                >
                  <option value="">Select</option>
                  <option value="Receive">Receive</option>
                  <option value="Send">Send</option>
                </select>
              </div>

              {/* Other Fields */}
              {[
                { label: "Reference No", name: "reference_no", required: true },
                { label: "Sender Title", name: "sender_title", required: true },
                { label: "Receiver Title", name: "receiver_title", required: true },
                { label: "Address", name: "address", textarea: true },
                { label: "Note", name: "note", textarea: true },
              ].map((field, idx) => (
                <div key={idx} className="flex items-start">
                  <label className="w-60 text-gray-700 font-medium">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.textarea ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="border border-gray-400 p-2 rounded w-1/2"
                      rows={3}
                      required={field.required}
                    />
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="border border-gray-400 p-2 rounded w-1/2"
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              {/* Date */}
              <div className="flex items-center">
                <label className="w-60 text-gray-700 font-medium">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded w-1/2"
                  required
                />
              </div>

              {/* File Upload */}
              <div className="flex items-center">
                <label className="w-60 text-gray-700 font-medium">
                  Document File
                </label>
                <input
                  type="file"
                  name="document_file"
                  onChange={handleChange}
                  className="w-1/2"
                />
              </div>

              {/* Confidential Checkbox */}
              <div className="flex items-center">
                <label className="w-60 text-gray-700 font-medium">
                  Confidential
                </label>
                <input
                  type="checkbox"
                  name="confidential"
                  checked={formData.confidential}
                  onChange={handleChange}
                  className="h-5 w-5"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  className="bg-[#143781] text-white px-6 py-2 rounded mt-4"
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default PostalRecord;