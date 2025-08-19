import React, { useState, useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import axios from "axios";

import StaffProfile from "./StaffProfile";

export default function StaffList() {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStaff, setEditedStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingStaff, setViewingStaff] = useState(null);
  const [activeRole, setActiveRole] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // number of staff per page

  const getAllStaff = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/staff/get`);
      console.log("staff response:", res.data);

      const employees = res.data.employees || [];
      employees.forEach((staff) => {
        console.log(
          `Staff ${staff.name} document details:`,
          staff.documentDetails || staff.documents || "No documents"
        );
      });

      setStaffList(employees);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/staff/delete/${id}`);
      getAllStaff();
    } catch (err) {
      console.error("Failed to delete staff:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedStaff({
        ...editedStaff,
        profilePicture: URL.createObjectURL(file),
        profilePictureFile: file,
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!editedStaff?.staffId) return;

      const formData = new FormData();
      for (const key in editedStaff) {
        if (key === "profilePictureFile") {
          formData.append("profilePicture", editedStaff[key]);
        } else {
          formData.append(key, editedStaff[key]);
        }
      }

      await axios.put(
        `${apiUrl}/staff/updated/${editedStaff.staffId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setIsEditing(false);
      setSelectedStaff(null);
      getAllStaff();
    } catch (err) {
      console.error("Failed to update staff:", err.response?.data || err.message);
    }
  };

  // Filter staff by activeRole
  const filteredStaff = activeRole
    ? staffList.filter(
        (staff) => staff.role?.toLowerCase() === activeRole.toLowerCase()
      )
    : staffList;

  // Pagination calculations
  const totalPages = Math.ceil(filteredStaff.length / pageSize);
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle page change safely
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (viewingStaff) {
    return <StaffProfile staff={viewingStaff} onBack={() => setViewingStaff(null)} />;
  }

  const toggleStatus = async (staffId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      const response = await axios.patch(
        `${apiUrl}/admissions/updateStatus/${staffId}`,
        { status: newStatus }
      );
      if (response.status === 200) {
        // Assuming you have a toast system, otherwise remove
        // toast.success(`staff status updated to ${newStatus}`);
        getAllStaff(); // Refresh staff list
      }
    } catch (error) {
      // toast.error("Failed to update status");
      console.error("Failed to update status");
    }
  };

  return (
    <div className="p-4">
      {/* Role Filter */}
      <div className="flex gap-4 mb-4 overflow-x-auto whitespace-nowrap">
        {["All", "Admin", "Teacher", "Accountant", "Librarian", "Receptionist"].map(
          (role) => (
            <button
              key={role}
              onClick={() => {
                setActiveRole(role === "All" ? "" : role);
                setCurrentPage(1); // Reset page on filter change
              }}
              className={`px-4 py-2 border-b-2 font-medium flex-shrink-0 ${
                activeRole === role || (role === "All" && !activeRole)
                  ? "border-[#143781] text-[#143781]"
                  : "border-transparent text-gray-600"
              }`}
            >
              {role}
            </button>
          )
        )}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center py-10">Loading staff...</p>
      ) : (
        <>
          <div className="overflow-auto shadow border rounded-md">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#D5DDFF] text-gray-700">
                <tr>
                  <th className="p-2">Sl</th>
                  <th className="p-2">Photo</th>
                  <th className="p-2">Staff ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Designation</th>
                  <th className="p-2">Department</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Mobile</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStaff.map((staff, index) => (
                  <tr key={staff.staffId} className="border-b">
                    <td className="p-2">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="p-2 text-center">
                      <img
                        src={staff.profilePicture || "https://via.placeholder.com/50"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="p-2">{staff.staffId}</td>
                    <td className="p-2">{staff.name}</td>
                    <td className="p-2">{staff.designation?.name || "-"}</td>
                    <td className="p-2">{staff.department?.name || "-"}</td>
                    <td className="p-2">{staff.email}</td>
                    <td className="p-2">{staff.mobile}</td>
                    <td className="border px-2 py-1">
                      <button
                        onClick={() => toggleStatus(staff._id, staff.status)}
                        className={`px-2 py-1 rounded text-white ${
                          staff.status === "Active" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {staff.status === "Active" ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="p-2 flex gap-2">
                      <div className="flex gap-4">
                        <button
                          onClick={() => setViewingStaff(staff)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(staff._id)}
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

          {/* Pagination */}
          {filteredStaff.length > 0 && (
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
        </>
      )}

      {/* Edit Modal */}
      {isEditing && editedStaff && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-auto flex items-center justify-center px-4 py-10"></div>
      )}
    </div>
  );
}
