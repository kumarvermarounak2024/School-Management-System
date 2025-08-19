import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

const FeeGroup = () => {
  const [activeTab, setActiveTab] = useState("form");
  const [formData, setFormData] = useState({
    feeGroup: "",
    description: "",
  });
  const [feeDetails, setFeeDetails] = useState([
    { checked: false, feeType: "", dueDate: "", amount: "" },
  ]);
  const [feeGroups, setFeeGroups] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const apiUrl = "http://localhost:4100/api/feegroup";

  useEffect(() => {
    fetchFeeGroups();
    fetchFeeTypes();
  }, []);

  const fetchFeeGroups = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${apiUrl}/getall`);
      setFeeGroups(res.data || []);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch fee groups:", err);
      setIsLoading(false);
    }
  };

  const fetchFeeTypes = async () => {
    try {
      const res = await axios.get("http://localhost:4100/api/feetype/getall");
      setFeeTypes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch fee types", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeeDetailChange = (index, field, value) => {
    const updated = [...feeDetails];
    updated[index][field] = value;
    setFeeDetails(updated);
  };

  const addNewFeeDetailRow = () => {
    setFeeDetails([...feeDetails, { checked: false, feeType: "", dueDate: "", amount: "" }]);
  };

  const removeFeeDetailRow = (index) => {
    if (feeDetails.length > 1) {
      const updated = [...feeDetails];
      updated.splice(index, 1);
      setFeeDetails(updated);
    }
  };

  const resetForm = () => {
    setFormData({ feeGroup: "", description: "" });
    setFeeDetails([{ checked: false, feeType: "", dueDate: "", amount: "" }]);
    setEditId(null);
  };

  const handleSubmit = async () => {
    try {
      const filteredFeeDetails = feeDetails.filter(
        (item) => item.feeType && item.dueDate && item.amount
      );

      if (!formData.feeGroup) {
        alert("Fee Group Name is required");
        return;
      }

      if (filteredFeeDetails.length === 0) {
        alert("At least one fee detail is required");
        return;
      }

      const payload = {
        feeGroup: formData.feeGroup,
        description: formData.description,
        feeDetails: filteredFeeDetails,
      };

      if (editId) {
        await axios.patch(`${apiUrl}/update/${editId}`, payload);
      } else {
        await axios.post(`${apiUrl}/create`, payload);
      }

      resetForm();
      fetchFeeGroups();
      setActiveTab("list");
    } catch (err) {
      console.error("Error submitting fee group:", err);
    }
  };

  const handleEdit = (group) => {
    setFormData({
      feeGroup: group.feeGroup,
      description: group.description,
    });
    setFeeDetails(group.feeDetails || [{ checked: false, feeType: "", dueDate: "", amount: "" }]);
    setEditId(group._id);
    setActiveTab("form");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this?");
    if (!confirmed) return;

    try {
      await axios.delete(`${apiUrl}/delete/${id}`);
      fetchFeeGroups();
    } catch (err) {
      console.error("Failed to delete fee group:", err);
    }
  };

  const filteredFeeGroups = feeGroups.filter((f) =>
    f.feeGroup?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 bg-[#f4f6fd] min-h-screen">
      {/* Tabs */}
      <div className="flex border-b border-blue-200 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 font-semibold ${
            activeTab === "form"
              ? "text-blue-700 border-b-2 border-blue-700"
              : "text-gray-600"
          }`}
          onClick={() => {
            resetForm();
            setActiveTab("form");
          }}
        >
          🖊️ Add Fee Group
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 font-semibold ${
            activeTab === "list"
              ? "text-blue-700 border-b-2 border-blue-700"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("list")}
        >
          📋 Fee Group List
        </button>
      </div>

      {/* Form Tab */}
      {activeTab === "form" && (
        <div className="mx-auto p-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <label className="md:w-1/4 w-full font-medium">Fee Group Name *</label>
              <input
                type="text"
                name="feeGroup"
                value={formData.feeGroup}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter fee group name"
                required
              />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <label className="md:w-1/4 w-full font-medium">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter description..."
              />
            </div>

            <div className="p-4 bg-[#f4f6fd] rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Fee Details</h3>
                <div className="flex gap-2">
                  <button
                    onClick={addNewFeeDetailRow}
                    className="bg-[#143781] text-white px-3 py-1 rounded text-sm"
                  >
                    + Add Row
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-indigo-100 text-left text-gray-700">
                      <th className="px-4 py-2 border">✔</th>
                      <th className="px-4 py-2 border">Fees Type Name *</th>
                      <th className="px-4 py-2 border">Due Date *</th>
                      <th className="px-4 py-2 border">Amount *</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {feeDetails.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2 border text-center">
                          <input
                            type="checkbox"
                            checked={item.checked || false}
                            onChange={(e) =>
                              handleFeeDetailChange(idx, "checked", e.target.checked)
                            }
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="px-4 py-2 border">
                          <select
                            value={item.feeType}
                            onChange={(e) =>
                              handleFeeDetailChange(idx, "feeType", e.target.value)
                            }
                            className="border px-2 py-1 w-full rounded"
                            required
                          >
                            <option value="">Select Fee Type</option>
                            {feeTypes.map((type) => (
                              <option key={type._id} value={type.feeType}>
                                {type.feeType}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2 border">
                          <input
                            type="date"
                            value={item.dueDate}
                            onChange={(e) =>
                              handleFeeDetailChange(idx, "dueDate", e.target.value)
                            }
                            className="border px-2 py-1 w-full rounded"
                            required
                          />
                        </td>
                        <td className="px-4 py-2 border">
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) =>
                              handleFeeDetailChange(idx, "amount", e.target.value)
                            }
                            className="border px-2 py-1 w-full rounded"
                            required
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-8 py-2 rounded font-semibold"
              >
                {editId ? "Update" : "Save"}
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setActiveTab("list");
                }}
                className="border border-blue-900 text-blue-900 px-8 py-2 rounded font-semibold"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Tab */}
      {activeTab === "list" && (
        <div className="overflow-x-auto">
          <div className="flex justify-end mb-3">
            <input
              type="text"
              placeholder="🔍 Search Here..."
              className="border rounded px-4 py-2 w-72"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <table className="min-w-full bg-[#f4f6fd] border border-gray-200">
              <thead className="bg-blue-100 text-gray-900 font-semibold">
                <tr>
                  <th className="border px-4 py-2">SL</th>
                  <th className="border px-4 py-2">Fee Group Name</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeeGroups.length > 0 ? (
                  filteredFeeGroups.map((group, idx) => (
                    <tr key={group._id} className="text-center">
                      <td className="border px-4 py-2">{idx + 1}</td>
                      <td className="border px-4 py-2">{group.feeGroup}</td>
                      <td className="border px-4 py-2">{group.description}</td>
                      <td className="border px-4 py-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(group)}
                          className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(group._id)}
                          className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="border px-4 py-4 text-center">
                      No fee groups found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default FeeGroup;