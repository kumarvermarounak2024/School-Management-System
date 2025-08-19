import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaList} from 'react-icons/fa';
import { Pencil, Trash2 } from 'lucide-react';

const Section = () => {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [activeTab, setActiveTab] = useState('create');
  const [sectionName, setSectionName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [sections, setSections] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSections = async () => {
    try {
      const res = await axios.get(`${apiUrl}/section/getAll`);
      setSections(res.data.sections || []);
    } catch (err) {
      console.error('Error fetching sections:', err);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const resetForm = () => {
    setSectionName('');
    setCapacity('');
    setEditId(null);
  };

  const handleSave = async () => {
    if (!sectionName.trim() || !capacity) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editId) {
        await axios.put(`${apiUrl}/section/update/${editId}`, {
          Name: sectionName,
          Capacity: Number(capacity),
        });
        alert('Section updated successfully');
      } else {
        await axios.post(`${apiUrl}/section/create`, {
          Name: sectionName,
          Capacity: Number(capacity),
        });
        alert('Section created successfully');
      }

      resetForm();
      fetchSections();
    } catch (err) {
      console.error('Error saving section:', err);
      alert('Error saving section');
    }
  };

  const handleEdit = (section) => {
    setEditId(section._id);
    setSectionName(section.Name);
    setCapacity(section.Capacity);
    setActiveTab('create');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    try {
      await axios.delete(`${apiUrl}/section/delete/${id}`);
      fetchSections();
    } catch (err) {
      console.error('Error deleting section:', err);
    }
  };

  const filteredSections = sections.filter((section) =>
    section.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b mb-4">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${
            activeTab === 'create'
              ? 'text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]'
              : 'text-gray-600 hover:text-[#143781]'
          }`}
        >
          <FaPlus /> Create Section
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${
            activeTab === 'list'
              ? 'text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]'
              : 'text-gray-600 hover:text-[#143781]'
          }`}
        >
          <FaList /> Section List
        </button>
      </div>

      {/* Form */}
     {activeTab === 'create' && (
  <div className="bg-white p-4 rounded shadow-md">
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="w-full md:w-1/2">
        <label className="block font-medium mb-1">Section Name</label>
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded"
          placeholder="Section Name Here"
        />
      </div>
      <div className="w-full md:w-1/2">
        <label className="block font-medium mb-1">Capacity</label>
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded"
          placeholder="Capacity Here"
        />
      </div>
    </div>
    <button
      onClick={handleSave}
      className="bg-[#143781] text-white px-4 py-2 rounded hover:bg-opacity-90"
    >
      {editId ? 'Update' : 'Save'}
    </button>
  </div>
)}

      {/* List */}
      {activeTab === 'list' && (
        <div className="bg-white p-4 rounded shadow-md w-full overflow-x-auto">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2"
            />
          </div>

          {filteredSections.length === 0 ? (
            <p className="text-gray-500">No sections available.</p>
          ) : (
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border-b">Section Name</th>
                  <th className="p-2 border-b">Capacity</th>
                  <th className="p-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSections.map((section) => (
                  <tr key={section._id}>
                    <td className="p-2 border-b">{section.Name}</td>
                    <td className="p-2 border-b">{section.Capacity}</td>
                    <td className="p-2 border-b">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(section)}
   className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                          title="Edit"
                        >
    <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(section._id)}
   className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                          title="Delete"
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
      )}
    </div>
  );
};

export default Section;
