import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Pencil, Trash2 } from 'lucide-react';

const ManageAdvanceSalary = () => {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [records, setRecords] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [deductMonthOptions, setDeductMonthOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);  // For edit mode
  const [editedRecord, setEditedRecord] = useState({}); // Store edited values
const [editFormData, setEditFormData] = useState(null);

  // Helper to get current month name like "May 2025"
  const getCurrentMonth = () => {
    const now = new Date();
    return now.toLocaleString("default", { month: "long", year: "numeric" });
  };

  useEffect(() => {
    fetchAdvanceSalaries();
  }, []);

  const fetchAdvanceSalaries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/advancesalary/getAll`);
      let data = res.data.data;

      // If deductMonth is empty/null, set to current month
      data = data.map(item => ({
        ...item,
        deductMonth: item.deductMonth || getCurrentMonth(),
      }));
      setRecords(data);

      // Extract unique deduct months for dropdown options (include current month too)
      const months = Array.from(new Set(data.map(item => item.deductMonth).filter(Boolean)));
      if (!months.includes(getCurrentMonth())) months.push(getCurrentMonth());
      setDeductMonthOptions(months);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`${apiUrl}/advancesalary/delete/${id}`);
        fetchAdvanceSalaries();
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  // Handle edit button click
// In startEditing:
const startEditing = (item) => {
  setEditFormData(item); // Okay
  setEditingId(item._id); // ✅ Add this line
  setEditedRecord({ deductMonth: item.deductMonth }); // ✅ Initialize edited record
  window.scrollTo({ top: 0, behavior: "smooth" });
};



  // Handle input change during edit
  const handleEditChange = (field, value) => {
    setEditedRecord(prev => ({ ...prev, [field]: value }));
  };

  // Save one updated record
const handleUpdate = async (id) => {
  try {
    await axios.put(`${apiUrl}/advancesalary/update/${id}`, {
      deductMonth: editedRecord.deductMonth || getCurrentMonth(),
    });
    alert("Record updated successfully.");
    setEditingId(null);
    setEditedRecord({});
    setEditFormData(null);
    fetchAdvanceSalaries();
  } catch (error) {
    console.error("Error updating record:", error);
    alert("Failed to update record.");
  }
};


  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditedRecord({});
  };

  // Filter records by search term
  const filteredRecords = records.filter(
    (item) =>
      item.applicantName?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.designation?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 font-sans">
      

      {/* Deduct Month Selector (disabled for now) */}
      <div>
        <label className="block font-semibold mb-1">
          Deduct Month <span className="text-red-500">*</span>
        </label>
        <select className="border border-gray-300 rounded px-3 py-2 w-64" disabled>
          {deductMonthOptions.length > 0 ? (
            deductMonthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))
          ) : (
            <option>No months available</option>
          )}
        </select>
      </div>

      {/* Table Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Rows Per Page</span>
        </div>
        <div className="flex items-center border rounded px-3 py-1 bg-gray-50">
          <span className="text-gray-500 mr-2">🔍</span>
          <input
            type="text"
            placeholder="Search Here..."
            className="bg-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="overflow-x-auto">
  <table className="w-full table-auto border text-sm min-w-[800px]">
    <thead className="bg-blue-100 text-left">
      <tr>
        <th className="border px-2 py-1">SL</th>
        <th className="border px-2 py-1">Profile Picture</th>
        <th className="border px-2 py-1">Applicant</th>
        <th className="border px-2 py-1">Staff Roll</th>
        <th className="border px-2 py-1">Deduct Month</th>
        <th className="border px-2 py-1">Applied On</th>
        <th className="border px-2 py-1">Created At</th>
        <th className="border px-2 py-1">Status</th>
        <th className="border px-2 py-1">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredRecords.slice(0, rowsPerPage).map((item, i) => (
        <tr key={item._id}>
          <td className="border px-2 py-1">{i + 1}</td>

          <td className="border px-2 py-1">
            <img
              src={item.applicantName?.profilePicture || "https://via.placeholder.com/40"}
              className="h-10 w-10 rounded-full object-cover"
              alt="Applicant"
            />
          </td>

          <td className="border px-2 py-1">{item.applicantName?.name || "N/A"}</td>
          <td className="border px-2 py-1">{item.designation?.name || "N/A"}</td>

          <td className="border px-2 py-1">
            {editingId === item._id ? (
              <select
                className="border border-gray-300 rounded px-1 py-0.5"
                value={editedRecord.deductMonth}
                onChange={(e) => handleEditChange("deductMonth", e.target.value)}
              >
                {deductMonthOptions.length > 0
                  ? deductMonthOptions.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))
                  : <option>{item.deductMonth || "N/A"}</option>}
              </select>
            ) : (
              item.deductMonth || "N/A"
            )}
          </td>

          <td className="border px-2 py-1">
            {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
          </td>

          <td className="border px-2 py-1">
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
          </td>

          <td className="border px-2 py-1">Payment</td>

          <td className="border px-2 py-1">
            <div className="flex flex-wrap gap-2">
              {editingId === item._id ? (
                <>
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => handleUpdate(item._id)}
                  >
                    ✔️
                  </button>
                  <button
                    className="text-gray-600 hover:underline"
                    onClick={cancelEditing}
                  >
                    ❌
                  </button>
                </>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  <button
                    className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                    onClick={() => startEditing(item)}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                    onClick={() => handleDelete(item._id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
     )}

      {/* Pagination */}
      <div className="flex justify-end items-center space-x-2 mt-2">
        <button className="px-2 py-1 border rounded">◀</button>
        <span className="px-3 py-1 bg-blue-100 border rounded">1</span>
        <button className="px-2 py-1 border rounded">▶</button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center mt-4">
        {/* Remove old Save button because we update one-by-one now */}
        <button
          onClick={() => fetchAdvanceSalaries()}
          className="bg-[#143781] text-white px-6 py-2 rounded cursor-pointer hover:bg-blue-900"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ManageAdvanceSalary;
