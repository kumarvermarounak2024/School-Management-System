import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Pencil, Trash2 } from 'lucide-react';
const LeaveCategoryForm = () => {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/leavecategory/getAll`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!categoryName.trim()) {
      alert("Please enter a leave category name.");
      return;
    }

    try {
      if (editId) {
        // Update category
        await axios.put(`${apiUrl}/leavecategory/update/${editId}`, {
          categoryName,
        });
        alert("Category updated successfully.");
      } else {
        // Create category
        await axios.post(`${apiUrl}/leavecategory/create`, {
          categoryName,
        });
        alert("Category saved successfully.");
      }

      setCategoryName("");
      setEditId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving/updating category:", error);
      alert("An error occurred while saving/updating.");
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setCategoryName(cat.categoryName);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${apiUrl}/leavecategory/delete/${id}`);
      alert("Category deleted successfully.");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 space-y-6 font-sans">
      {/* Leave Category Form */}
      <div className="border p-4 rounded shadow w-full max-w-xl">
        <h3 className="font-semibold mb-4">✒ Leave Category</h3>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Leave Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Enter category name"
          />
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-1 px-4 py-2 border rounded text-sm font-semibold"
        >
          <span>{editId ? "✏" : "➕"}</span>
          <span>{editId ? "Update" : "Save"}</span>
        </button>
      </div>

      {/* Manage Leave Category Table */}
      <div>
        <h3 className="text-blue-700 font-semibold text-md border-b-2 border-blue-700 inline-block pb-1 mb-4">
          ☰ Manage Leave Category
        </h3>
        <table className="w-full table-auto border text-sm">
          <thead className="bg-blue-100 text-left">
            <tr>
              <th className="border px-4 py-2">Leave Category</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center border px-4 py-2">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id}>
                  <td className="border px-4 py-2">{cat.categoryName}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <div className="flex gap-5">

                   
                    <button    className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
 onClick={() => handleEdit(cat)}>
                      <Pencil size={16} />
                    </button>
                    <button  className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
 onClick={() => handleDelete(cat._id)}>
                      <Trash2 size={16} />
                    </button>
                     </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveCategoryForm;
