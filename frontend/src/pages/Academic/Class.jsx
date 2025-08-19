import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaList } from 'react-icons/fa';
import { Pencil, Trash2 } from 'lucide-react';

const Class = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [activeTab, setActiveTab] = useState('create');
  const [className, setClassName] = useState('');
  const [classNumeric, setClassNumeric] = useState('');
  const [classList, setClassList] = useState([]);
  const [editingClassId, setEditingClassId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/class/getAll`);
      setClassList(res.data.classes);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSave = async () => {
    if (!className || !classNumeric) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingClassId) {
        await axios.put(`${apiUrl}/class/update/${editingClassId}`, {
          Name: className,
          Class_Numeric: Number(classNumeric),
        });
        alert('Class updated successfully');
      } else {
        await axios.post(`${apiUrl}/class/create`, {
          Name: className,
          Class_Numeric: Number(classNumeric),
        });
        alert('Class created successfully');
      }

      setClassName('');
      setClassNumeric('');
      setEditingClassId(null);
      fetchClasses();
      setActiveTab('list');
    } catch (err) {
      console.error('Error saving class:', err);
      alert('Error saving class');
    }
  };

  const handleEdit = (cls) => {
    setEditingClassId(cls._id);
    setClassName(cls.Name);
    setClassNumeric(cls.Class_Numeric);
    setActiveTab('create');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      await axios.delete(`${apiUrl}/class/delete/${id}`);
      fetchClasses();
    } catch (err) {
      console.error('Error deleting class:', err);
    }
  };

  const filteredClasses = classList.filter((cls) =>
    cls.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 p-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b mb-4">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${
            activeTab === 'create'
              ? 'text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]'
              : 'text-gray-600 hover:text-[#143781]'
          }`}
        >
          <FaPlus /> {editingClassId ? 'Edit Class' : 'Create Class'}
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${
            activeTab === 'list'
              ? 'text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]'
              : 'text-gray-600 hover:text-[#143781]'
          }`}
        >
          <FaList /> Class List
        </button>
      </div>

      {/* Create Class Form */}
      {activeTab === 'create' && (
        <div className="bg-white p-4 rounded shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Class Name</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded"
                placeholder="Class Name Here"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Class Numeric</label>
              <input
                type="number"
                value={classNumeric}
                onChange={(e) => setClassNumeric(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded"
                placeholder="Class Numeric Here"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={handleSave}
              className="bg-[#143781] text-white px-4 py-2 rounded hover:bg-opacity-90"
            >
              {editingClassId ? 'Update' : 'Save'}
            </button>
            {editingClassId && (
              <button
                onClick={() => {
                  setEditingClassId(null);
                  setClassName('');
                  setClassNumeric('');
                }}
                className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Class List Table */}
      {activeTab === 'list' && (
        <div className="bg-white p-4 rounded shadow-md">
          {/* Search and Tools */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="flex gap-2">
              <button
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(classList));
                  alert('Class data copied to clipboard!');
                }}
              >
                📋
              </button>
              <button
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                onClick={() => {
                  navigator.clipboard.readText().then((text) => {
                    alert('Paste functionality not implemented yet.\nData: ' + text);
                  });
                }}
              >
                📥
              </button>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by class name..."
              className="border px-3 py-2 rounded w-full sm:w-64"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {filteredClasses.length === 0 ? (
              <p className="text-gray-500">No classes found.</p>
            ) : (
              <table className="min-w-full text-sm text-left border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Class Name</th>
                    <th className="p-2 border">Class Numeric</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.map((cls) => (
                    <tr key={cls._id} className="border-t">
                      <td className="p-2 border">{cls.Name}</td>
                      <td className="p-2 border">{cls.Class_Numeric}</td>
                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(cls)}
                            className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cls._id)}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Class;
