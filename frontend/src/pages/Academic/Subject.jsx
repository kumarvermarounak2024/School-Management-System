import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaList } from "react-icons/fa";
import { Pencil, Trash2 } from "lucide-react";

const Subject = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [activeTab, setActiveTab] = useState("create");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectAuthor, setSubjectAuthor] = useState("");
  const [subjectType, setSubjectType] = useState("Theory");
  const [subjects, setSubjects] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${apiUrl}/subject/getAll`);
      setSubjects(res.data.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSave = async () => {
    if (!subjectName || !subjectCode || !subjectType) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        subjectName,
        subjectCode,
        subjectAuthor,
        subjectType,
      };

      if (editId) {
        await axios.put(`${apiUrl}/subject/update/${editId}`, payload);
        alert("Subject updated successfully");
      } else {
        await axios.post(`${apiUrl}/subject/create`, payload);
        alert("Subject created successfully");
      }

      setSubjectName("");
      setSubjectCode("");
      setSubjectAuthor("");
      setSubjectType("Theory");
      setEditId(null);
      fetchSubjects();
    } catch (err) {
      console.error("Error saving subject:", err);
      alert("Error saving subject");
    }
  };

  const handleEdit = (subject) => {
    setEditId(subject._id);
    setSubjectName(subject.subjectName);
    setSubjectCode(subject.subjectCode);
    setSubjectAuthor(subject.subjectAuthor);
    setSubjectType(subject.subjectType);
    setActiveTab("create");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await axios.delete(`${apiUrl}/subject/delete/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error("Error deleting subject:", err);
    }
  };

  return (
    <div className="p-4">
      {/* Responsive Tabs */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 border-b mb-4">
        <button
          onClick={() => setActiveTab("create")}
          className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${
            activeTab === "create"
              ? "text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]"
              : "text-gray-600 hover:text-[#143781]"
          }`}
        >
          <FaPlus /> Create Subject
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${
            activeTab === "list"
              ? "text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]"
              : "text-gray-600 hover:text-[#143781]"
          }`}
        >
          <FaList /> Subject List
        </button>
      </div>

      {/* Create Subject Form */}
      {activeTab === "create" && (
        <div className="bg-white p-4 rounded shadow-md max-w-3xl">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="w-full sm:w-40 font-medium">Subject Name *</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              placeholder="Name Here"
            />
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="w-full sm:w-40 font-medium">Subject Code *</label>
            <input
              type="text"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              placeholder="Code Here"
            />
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="w-full sm:w-40 font-medium">Subject Author</label>
            <input
              type="text"
              value={subjectAuthor}
              onChange={(e) => setSubjectAuthor(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              placeholder="Author Here"
            />
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="w-full sm:w-40 font-medium">Subject Type *</label>
            <select
              value={subjectType}
              onChange={(e) => setSubjectType(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            >
              <option value="Theory">Theory</option>
              <option value="Practical">Practical</option>
              <option value="Lab">Lab</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            className="bg-[#143781] text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            {editId ? "Update" : "Save"}
          </button>
        </div>
      )}

      {/* Subject List Table */}
      {activeTab === "list" && (
        <div className="bg-white p-4 rounded shadow-md overflow-x-auto">
          {subjects.length === 0 ? (
            <p className="text-gray-500">No subjects available.</p>
          ) : (
            <table className="w-full min-w-[600px] border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border-b">Subject Name</th>
                  <th className="p-2 border-b">Code</th>
                  <th className="p-2 border-b">Author</th>
                  <th className="p-2 border-b">Type</th>
                  <th className="p-2 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject._id} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{subject.subjectName}</td>
                    <td className="p-2 border-b">{subject.subjectCode}</td>
                    <td className="p-2 border-b">{subject.subjectAuthor || "-"}</td>
                    <td className="p-2 border-b">{subject.subjectType}</td>
                    <td className="p-2 border-b text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(subject)}
                        className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(subject._id)}
                        className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Subject;
