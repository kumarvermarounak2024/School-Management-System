import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const TemplateList = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [templateData, setTemplateData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    salaryGrade: "",
    basicSalary: "",
    overtimeRate: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [showView, setShowView] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [templateData, searchTerm]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/payroll/getAll`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setTemplateData(data);
      setFilteredData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    const filtered = templateData.filter((item) =>
      item.salaryGrade.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleEditClick = (template) => {
    setEditingId(template._id);
    setEditFormData({
      salaryGrade: template.salaryGrade,
      basicSalary: template.basicSalary,
      overtimeRate: template.overtimeRate,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/payroll/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to update template");
      }

      const updatedData = templateData.map((item) =>
        item._id === id ? { ...item, ...editFormData } : item
      );
      setTemplateData(updatedData);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/payroll/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete template");
      }

      setTemplateData(templateData.filter((item) => item._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleView = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/payroll/get/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch payroll template");
      }
      const data = await response.json();
      setViewData(data);
      setShowView(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const closeViewModal = () => {
    setShowView(false);
    setViewData(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="bg-white shadow rounded-md p-4">
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-3">
          <select className="border p-2 rounded" disabled>
            <option>5</option>
          </select>
          <span className="font-semibold">Rows Per Page</span>
        </div>
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search Here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded p-2 pl-10"
          />
          <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-[#B6C5E7] text-sm">
          <thead className="bg-[#E0E7FF]">
            <tr>
              <th className="p-2 border">SL</th>
              <th className="p-2 border">Salary Grades</th>
              <th className="p-2 border">Basic Salary</th>
              <th className="p-2 border">Overtime Rate (Per Hour)</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item._id} className="bg-white hover:bg-gray-50">
                <td className="p-2 border">{indexOfFirstItem + index + 1}</td>
                {editingId === item._id ? (
                  <>
                    <td className="p-2 border">
                      <input
                        type="text"
                        name="salaryGrade"
                        value={editFormData.salaryGrade}
                        onChange={handleEditFormChange}
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        name="basicSalary"
                        value={editFormData.basicSalary}
                        onChange={handleEditFormChange}
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        name="overtimeRate"
                        value={editFormData.overtimeRate}
                        onChange={handleEditFormChange}
                        className="border p-1 w-full"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border">{item.salaryGrade}</td>
                    <td className="p-2 border">{item.basicSalary}</td>
                    <td className="p-2 border">{item.overtimeRate}</td>
                  </>
                )}
                <td className="p-2 border">
                  <div className="flex flex-wrap gap-2">
                    {editingId === item._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(item._id)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Eye
                            size={16}
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => handleView(item._id)}
                          />
                        </div>
                        <div className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center">
                          <Pencil
                            size={16}
                            className="cursor-pointer"
                            onClick={() => handleEditClick(item)}
                          />
                        </div>
                        {deleteConfirm === item._id ? (
                          <>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-gray-600 hover:text-gray-800 text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center">
                            <Trash2
                              size={16}
                              className="cursor-pointer"
                              onClick={() => setDeleteConfirm(item._id)}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100"
        >
          ◀
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 border ${
              currentPage === index + 1
                ? "bg-[#E0E7FF] font-bold"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100"
        >
          ▶
        </button>
      </div>

      {/* View Modal */}
      {showView && viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">
              Payroll Template Details
            </h2>
            <p>
              <strong>Salary Grade:</strong> {viewData.salaryGrade}
            </p>
            <p>
              <strong>Basic Salary:</strong> ₹{viewData.basicSalary}
            </p>
            <p>
              <strong>Overtime Rate:</strong> ₹{viewData.overtimeRate} / hour
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={closeViewModal}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateList;
