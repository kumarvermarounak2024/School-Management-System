import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

const AddDesignation = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [designation, setDesignation] = useState("");
  const [designations, setDesignations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDesignations = async () => {
    try {
      const res = await axios.get(`${apiUrl}/designation/get`);
      setDesignations(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching designations:", err);
      setError("Failed to fetch designations");
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const handleAddOrUpdate = async () => {
    if (!designation.trim()) return;
    setLoading(true);
    setError("");

    try {
      if (editId) {
        await axios.put(`${apiUrl}/designation/update/${editId}`, {
          name: designation.trim(),
        });

        const updated = designations.map((d) =>
          d._id === editId ? { ...d, name: designation.trim() } : d
        );
        setDesignations(updated);
        setEditId(null);
      } else {
        const res = await axios.post(`${apiUrl}/designation/create`, {
          name: designation.trim(),
        });
        setDesignations([...designations, res.data.data]);
      }

      setDesignation("");
    } catch (err) {
      console.error("Error saving designation:", err);
      setError("Failed to save designation");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (d) => {
    setDesignation(d.name);
    setEditId(d._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this designation?")) {
      try {
        await axios.delete(`${apiUrl}/designation/delete/${id}`);
        setDesignations(designations.filter((d) => d._id !== id));
      } catch (err) {
        console.error("Error deleting designation:", err);
        setError("Failed to delete designation");
      }
    }
  };

  return (
    <div className=" bg-gray-50">
      <div className=" rounded-lg shadow p-6">
        <div className="border-b pb-2 mb-4 flex items-center gap-2">
          <Pencil className="text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-700">
            {editId ? "Edit Designation" : "Add Designation"}
          </h3>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Designation Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-1/2 border border-gray-400 rounded px-3 py-2 shadow-sm focus:outline-none"
            placeholder="Enter designation name"
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

      <div className="bg-white mt-6 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#D5DDFF]">
            <tr>
              <th className="p-3 text-left">Designation</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {designations.map((d) => (
              <tr
                key={d._id}
                className="border-t hover:bg-gray-50 even:bg-gray-100"
              >
                <td className="p-3 capitalize">{d.name || "N/A"}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(d._id)}
                    className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {designations.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">
                  No designations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddDesignation;
