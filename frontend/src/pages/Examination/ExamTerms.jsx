import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { Pencil, Trash2 } from "lucide-react";

const ExamTerms = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [name, setName] = useState("");
  const [examTerms, setExamTerms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [documentId, setDocumentId] = useState(null);

  const fetchExamTerms = async () => {
    try {
      const res = await axios.get(`${apiUrl}/examination/getAll`);
      if (res.data.length > 0) {
        const examDoc = res.data[0];
        const terms = examDoc.examTerms || [];
        setExamTerms(Array.isArray(terms) ? terms : []);
        setDocumentId(examDoc._id);
      }
    } catch (error) {
      console.error("Failed to fetch exam terms:", error);
    }
  };

  useEffect(() => {
    fetchExamTerms();
  }, []);

  const handleAddOrUpdate = async () => {
    if (!name.trim()) return;

    try {
      let updatedTerms = [...examTerms];

      if (editIndex !== null) {
        updatedTerms[editIndex].name = name;
      } else {
        updatedTerms.push({ name });
      }

      if (documentId) {
        await axios.put(`${apiUrl}/examination/update/${documentId}`, {
          examTerms: updatedTerms,
        });
      } else {
        const response = await axios.post(`${apiUrl}/examination/create`, {
          examTerms: [{ name }],
        });
        setDocumentId(response.data._id);
      }

      setName("");
      setEditIndex(null);
      fetchExamTerms();
    } catch (error) {
      console.error("Error saving exam term:", error);
    }
  };

  const handleEdit = (term, index) => {
    setName(term.name);
    setEditIndex(index);
  };

  const handleDelete = async (indexToDelete) => {
    try {
      const updatedTerms = examTerms.filter((_, idx) => idx !== indexToDelete);

      await axios.put(`${apiUrl}/examination/update/${documentId}`, {
        examTerms: updatedTerms,
      });

      fetchExamTerms();
    } catch (err) {
      console.error("Error deleting exam term:", err);
    }
  };

  const filteredTerms = examTerms.filter((term) =>
    term.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-4 border-b pb-2">
        <h2 className="text-blue-800 font-semibold text-lg">✍️ Add Exam Term</h2>
        <h2 className="text-blue-800 font-semibold text-lg">📋 Exam Term List</h2>
      </div>

      <div className="bg-gray-50 flex flex-col p-6 rounded-lg shadow mb-6">
        <label className="block mb-2 font-semibold">
          Term Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Term name here"
          className="border rounded p-2 w-1/2 mb-4"
        />
        <button
          onClick={handleAddOrUpdate}
          className="bg-blue-900 text-white w-20 px-6 py-2 rounded hover:bg-blue-800"
        >
          {editIndex !== null ? "Update" : "Save"}
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-blue-800 font-semibold">📋 Exam Terms List</h3>
        <div className="relative">
          <FaSearch className="absolute top-2 left-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Here..."
            className="pl-8 pr-4 py-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="w-full border text-left">
        <thead className="bg-blue-100">
          <tr>
            <th className="p-2 border">Term Name</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTerms.map((term, index) => (
            <tr key={index} className="border-t">
              <td className="p-2 border">{term.name}</td>
              <td className="p-2 border flex gap-2">
                <button
                  className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                  onClick={() => handleEdit(term, index)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <button className="bg-white border border-blue-900 text-blue-900 px-6 py-2 rounded hover:bg-blue-50">
          Back
        </button>
      </div>
    </div>
  );
};

export default ExamTerms;
