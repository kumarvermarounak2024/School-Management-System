import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GradeManager = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const [activeTab, setActiveTab] = useState("create");
  const [grades, setGrades] = useState([]);
const [editingId, setEditingId] = useState(null); // for update

  const [formData, setFormData] = useState({
    gradeName: "",
    gradePoint: "",
    minPercentage: "",
    maxPercentage: "",
    remark: "",
  });

  // Fetch all grades
  const fetchGrades = async () => {
    try {
      const res = await axios.get(`${apiUrl}/grade/getAll`);
      setGrades(res.data);
    } catch (error) {
      console.error("Error fetching grades", error);
      toast.error("Failed to fetch grades");
    }
  };

  useEffect(() => {
    if (activeTab === "list") {
      fetchGrades();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    gradeName: formData.gradeName,
    gradePoint: parseFloat(formData.gradePoint),
    minPercentage: parseFloat(formData.minPercentage),
    maxPercentage: parseFloat(formData.maxPercentage),
    remark: formData.remark,
  };

  try {
    if (editingId) {
      // Update mode
      await axios.put(`${apiUrl}/grade/update/${editingId}`, payload);
      toast.success("Grade updated successfully!");
    } else {
      // Create mode
      await axios.post(`${apiUrl}/grade/create`, payload);
      toast.success("Grade created successfully!");
    }

    setFormData({
      gradeName: "",
      gradePoint: "",
      minPercentage: "",
      maxPercentage: "",
      remark: "",
    });
    setEditingId(null);
    if (activeTab === "list") fetchGrades(); // refresh list if on list tab
  } catch (error) {
    console.error("Error saving/updating grade", error);
    toast.error(error.response?.data?.message || "Error saving/updating grade");
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this grade?")) return;

  try {
    await axios.delete(`${apiUrl}/grade/delete/${id}`);
    toast.success("Grade deleted successfully!");
    fetchGrades(); // Refresh list
  } catch (error) {
    console.error("Error deleting grade", error);
    toast.error("Failed to delete grade");
  }
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-blue-200 mb-6">
        <button
          onClick={() => setActiveTab("create")}
          className={`py-2 px-4 text-sm font-semibold border-b-2 ${
            activeTab === "create"
              ? "border-blue-800 text-blue-800"
              : "border-transparent"
          }`}
        >
          ✏️ Create Grade
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`py-2 px-4 text-sm font-semibold border-b-2 ${
            activeTab === "list"
              ? "border-blue-800 text-blue-800"
              : "border-transparent"
          }`}
        >
          ☰ Grade List
        </button>
      </div>

      {/* Create Form */}
      {activeTab === "create" ? (
        <form
          onSubmit={handleSubmit}
          className="bg-[#f6f8fc] mx-auto p-6 rounded-md shadow-sm space-y-6"
        >
          <div className="flex items-center">
            <label className="w-48 font-medium text-gray-700">Grade Name</label>
            <input
              type="text"
              name="gradeName"
              value={formData.gradeName}
              onChange={handleChange}
              className="flex-1 border rounded px-4 py-2"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="w-48 font-medium text-gray-700">Grade Point *</label>
            <input
              type="number"
              name="gradePoint"
              value={formData.gradePoint}
              onChange={handleChange}
              className="flex-1 border rounded px-4 py-2"
              step="0.01"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="w-48 font-medium text-gray-700">Min % *</label>
            <input
              type="number"
              name="minPercentage"
              value={formData.minPercentage}
              onChange={handleChange}
              className="flex-1 border rounded px-4 py-2"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="w-48 font-medium text-gray-700">Max % *</label>
            <input
              type="number"
              name="maxPercentage"
              value={formData.maxPercentage}
              onChange={handleChange}
              className="flex-1 border rounded px-4 py-2"
              required
            />
          </div>

          <div className="flex items-start">
            <label className="w-48 font-medium text-gray-700 pt-2">Remark</label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              rows={3}
              className="flex-1 border rounded px-4 py-2"
            />
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <button
              type="submit"
              className="bg-blue-900 text-white px-8 py-2 rounded font-semibold hover:bg-blue-800"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  gradeName: "",
                  gradePoint: "",
                  minPercentage: "",
                  maxPercentage: "",
                  remark: "",
                })
              }
              className="border border-blue-900 text-blue-900 px-8 py-2 rounded font-semibold hover:bg-blue-50"
            >
              Clear
            </button>
          </div>
        </form>
      ) : (
        <div className="mx-auto bg-white p-4 rounded shadow">
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Grade Name</th>
                <th className="p-2 border">Grade Point</th>
                <th className="p-2 border">Min %</th>
                <th className="p-2 border">Max %</th>
                <th className="p-2 border">Remark</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade._id} className="hover:bg-gray-100">
                  <td className="p-2 border">{grade.gradeName}</td>
                  <td className="p-2 border">{grade.gradePoint}</td>
                  <td className="p-2 border">{grade.minPercentage}</td>
                  <td className="p-2 border">{grade.maxPercentage}</td>
                  <td className="p-2 border">{grade.remark}</td>
                  <td className="border px-3 py-2 flex justify-center gap-2">
                    <button
  onClick={() => {
    setFormData({
      gradeName: grade.gradeName,
      gradePoint: grade.gradePoint,
      minPercentage: grade.minPercentage,
      maxPercentage: grade.maxPercentage,
      remark: grade.remark,
    });
    setEditingId(grade._id);
    setActiveTab("create");
  }}
  className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
>
  <Pencil size={16} />
</button>

                   <button
  onClick={() => handleDelete(grade._id)}
  className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
>
  <Trash2 size={16} />
</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GradeManager;
