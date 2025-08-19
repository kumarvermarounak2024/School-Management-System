import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

const AddDepartment = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/department/get`);
      setDepartments(response.data);
    } catch (err) {
      setError("Error fetching departments.");
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddOrUpdate = async () => {
    if (!department.trim()) return;
    setLoading(true);
    setError("");
    try {
      if (editId) {
        await axios.put(`${apiUrl}/department/update/${editId}`, {
          name: department.trim(),
        });

        const updatedDepartments = departments.map((d) =>
          d._id === editId ? { ...d, name: department.trim() } : d
        );
        setDepartments(updatedDepartments);
        setEditId(null);
      } else {
        const res = await axios.post(`${apiUrl}/department/create`, {
          name: department.trim(),
        });
        setDepartments([...departments, res.data.data]);
      }

      setDepartment("");
    } catch (err) {
      setError("Error adding/updating department.");
      console.error("Error adding/updating department:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`${apiUrl}/department/delete/${id}`);
        setDepartments(departments.filter((d) => d._id !== id));
      } catch (err) {
        setError("Error deleting department.");
        console.error("Error deleting department:", err);
      }
    }
  };

  const handleEdit = (id, name) => {
    setDepartment(name);
    setEditId(id);
  };

  return (
    <div className=" bg-gray-50">
      <div className=" rounded-lg shadow p-6">
        <div className="border-b pb-2 mb-4 flex items-center gap-2">
          <Pencil className="text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-700">
            {editId ? "Edit Department" : "Add Department"}
          </h3>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-1/2 border border-gray-400 rounded px-3 py-2 shadow-sm focus:outline-none"
            placeholder="Enter department name"
          />
        </div>

        <button
          onClick={handleAddOrUpdate}
          disabled={loading}
          className="flex items-center gap-2 bg-[#143781] hover:bg-[#2e4371] text-white px-4 py-2 rounded shadow"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <PlusCircle className="w-4 h-4" /> {editId ? "Update" : "Save"}
            </>
          )}
        </button>

        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>

      <div className=" bg-white mt-6 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#D5DDFF]">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr
                key={dept._id}
                className="border-t hover:bg-gray-50 even:bg-gray-100"
              >
                <td className="p-3 capitalize">{dept.name || "N/A"}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(dept._id, dept.name)}
                    className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(dept._id)}
                    className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {departments.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">
                  No departments found{" "}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddDepartment;
