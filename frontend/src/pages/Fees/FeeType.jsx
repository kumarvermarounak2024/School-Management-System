import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

// const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL || 'http://localhost:4100';

const FeeType = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [formData, setFormData] = useState({ feeType: '', description: '' });
  const [feeTypes, setFeeTypes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchFeeTypes = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:4100/api/feetype/getall`);
      setFeeTypes(res.data);
    } catch (err) {
      console.error('Error fetching fee types:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeTypes();
  }, []);

  const resetForm = () => {
    setFormData({ feeType: '', description: '' });
    setIsEditing(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async () => {
    if (!formData.feeType.trim()) return alert('Fee Type Name is required');
    try {
      await axios.post(`http://localhost:4100/api/feetype/create`, formData);
      fetchFeeTypes();
      resetForm();
      setActiveTab('list');
    } catch (err) {
      console.error('Error creating fee type:', err);
    }
  };

  const handleEditSubmit = async () => {
    if (!formData.feeType.trim()) return alert('Fee Type Name is required');
    try {
      await axios.patch(`http://localhost:4100/api/feetype/update/${editId}`, formData);
      fetchFeeTypes();
      resetForm();
      setActiveTab('list');
    } catch (err) {
      console.error('Failed to update fee type:', err);
    }
  };

  const handleEdit = async (fee) => {
    try {
      const res = await axios.get(`http://localhost:4100/api/feetype/get/${fee._id}`);
      setFormData({
        feeType: res.data.feeType || '',
        description: res.data.description || '',
      });
      setEditId(fee._id);
      setIsEditing(true);
      setActiveTab('form');
    } catch (err) {
      console.error('Error fetching fee type:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee type?')) return;
    try {
      await axios.delete(`http://localhost:4100/api/feetype/delete/${id}`);
      fetchFeeTypes();
    } catch (err) {
      console.error('Error deleting fee type:', err);
    }
  };

  const filteredFeeTypes = feeTypes.filter((f) =>
    f.feeType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 bg-[#f4f6fd] min-h-screen">
      <div className="flex border-b border-blue-200 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 font-semibold ${activeTab === 'form' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'}`}
          onClick={() => {
            resetForm();
            setActiveTab('form');
          }}
        >
          🖊️ Add Fee Type
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 font-semibold ${activeTab === 'list' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'}`}
          onClick={() => {
            resetForm();
            setActiveTab('list');
          }}
        >
          📋 Fee Type List
        </button>
      </div>

      {activeTab === 'form' && (
        <div className="flex flex-col min-h-[59vh] p-6 w-full mx-auto">
          <div className="flex-grow">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col md:flex-row items-center gap-4 mt-10">
                <label className="md:w-1/4 font-medium">Fee Type Name *</label>
                <input
                  type="text"
                  name="feeType"
                  value={formData.feeType}
                  onChange={handleChange}
                  className="w-full md:w-3/4 border px-3 py-2 rounded"
                  placeholder="Enter fee type name"
                />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4">
                <label className="md:w-1/4 font-medium">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full md:w-3/4 border px-3 py-2 rounded"
                  placeholder="Enter description..."
                />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 flex justify-center gap-6">
            {isEditing ? (
              <button
                onClick={handleEditSubmit}
                className="bg-blue-900 text-white px-8 py-2 rounded font-semibold"
              >
                Update
              </button>
            ) : (
              <button
                onClick={handleCreateSubmit}
                className="bg-blue-900 text-white px-8 py-2 rounded font-semibold"
              >
                Save
              </button>
            )}
            <button
              onClick={() => {
                resetForm();
                setActiveTab('list');
              }}
              className="border border-blue-900 text-blue-900 px-8 py-2 rounded font-semibold"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="overflow-x-auto">
          <div className="flex justify-end mb-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search Here..."
              className="border rounded px-4 py-2 w-72"
            />
          </div>
          {isLoading ? (
            <div className="text-center py-8">Loading fee types...</div>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-blue-100 text-gray-900 font-semibold">
                <tr>
                  <th className="border px-4 py-2">SL</th>
                  <th className="border px-4 py-2">Fee Type Name</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeeTypes.length > 0 ? (
                  filteredFeeTypes.map((fee, idx) => (
                    <tr key={fee._id} className="text-center">
                      <td className="border px-4 py-2">{idx + 1}</td>
                      <td className="border px-4 py-2">{fee.feeType}</td>
                      <td className="border px-4 py-2">{fee.description}</td>
                      <td className="border px-4 py-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(fee)}
                          className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(fee._id)}
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
                      No fee types found
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

export default FeeType;
