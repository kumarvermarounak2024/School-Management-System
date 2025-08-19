import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

const HostelRoom = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    roomName: '',
    hostelmasterId: '',
    CategoryId: '',
    NoOfBeds: '',
    Price: '',
    Remarks: '',
  });

  const [rooms, setRooms] = useState([]);
  const [hostelData, setHostelData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);

  // Fetch all necessary data
  const fetchHostelName = async () => {
    try {
      const res = await axios.get(`${apiUrl}/hostel/getAll`);
      setHostelData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`${apiUrl}/hostel/category/getAll`);
      setCategoryData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/hostel/room/getAll`);
      setRooms(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHostelName();
    fetchCategory();
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing room
        await axios.put(`${apiUrl}/hostel/room/update/${currentRoomId}`, formData);
      } else {
        // Create new room
        await axios.post(`${apiUrl}/hostel/room/create`, formData);
      }
      fetchRooms();
      resetForm();
      setActiveTab('list');
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (room) => {
    setFormData({
      roomName: room.roomName,
      hostelmasterId: room.hostelmasterId?._id || '',
      CategoryId: room.CategoryId?._id || '',
      NoOfBeds: room.NoOfBeds,
      Price: room.Price,
      Remarks: room.Remarks,
    });
    setCurrentRoomId(room._id);
    setIsEditing(true);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`${apiUrl}/hostel/room/delete/${id}`);
        fetchRooms();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      roomName: '',
      hostelmasterId: '',
      CategoryId: '',
      NoOfBeds: '',
      Price: '',
      Remarks: '',
    });
    setIsEditing(false);
    setCurrentRoomId(null);
  };

  return (
    <div className="p-4 bg-[#f4f6fd] min-h-screen">
      {/* Tabs */}
      <div className="flex border-b border-blue-200 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 font-semibold ${activeTab === 'form' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'}`}
          onClick={() => {
            resetForm();
            setActiveTab('form');
          }}
        >
          🖊️ Create Room
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 font-semibold ${activeTab === 'list' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'}`}
          onClick={() => setActiveTab('list')}
        >
          📋 Room List
        </button>
      </div>

      {/* Form Tab */}
      {activeTab === 'form' && (
        <div className="mx-auto p-6 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Room Name *</label>
              <input
                type="text"
                name="roomName"
                value={formData.roomName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Name Here"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Hostel Name *</label>
              <select
                name="hostelmasterId"
                value={formData.hostelmasterId}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select</option>
                {hostelData.map((hostel) => (
                  <option value={hostel._id} key={hostel._id}>
                    {hostel.Hostel_Name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Category *</label>
              <select
                name="CategoryId"
                value={formData.CategoryId}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select</option>
                {categoryData.map((category) => (
                  <option value={category._id} key={category._id}>
                    {category.Category_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">No. of Beds *</label>
              <input
                type="number"
                name="NoOfBeds"
                value={formData.NoOfBeds}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Cost Per Bed *</label>
              <input
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Remark</label>
              <textarea
                name="Remarks"
                value={formData.Remarks}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-900 text-white px-8 py-2 rounded font-semibold"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
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

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="overflow-x-auto">
          <div className="flex justify-end mb-3">
            <input
              type="text"
              placeholder="🔍 Search Here..."
              className="border rounded px-4 py-2 w-72"
            />
          </div>
          {isLoading ? (
            <div className="text-center py-8">Loading rooms...</div>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-blue-100 text-gray-900 font-semibold">
                <tr>
                  <th className="border px-4 py-2">SL</th>
                  <th className="border px-4 py-2">Room Name</th>
                  <th className="border px-4 py-2">Hostel Name</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">No. of Beds</th>
                  <th className="border px-4 py-2">Cost Per Bed</th>
                  <th className="border px-4 py-2">Remark</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length > 0 ? (
                  rooms.map((room, idx) => (
                    <tr key={room._id} className="text-center">
                      <td className="border px-4 py-2">{idx + 1}</td>
                      <td className="border px-4 py-2">{room.roomName}</td>
                      <td className="border px-4 py-2">
                        {room.hostelmasterId?.Hostel_Name || 'N/A'}
                      </td>
                      <td className="border px-4 py-2">
                        {room.CategoryId?.Category_name || 'N/A'}
                      </td>
                      <td className="border px-4 py-2">{room.NoOfBeds}</td>
                      <td className="border px-4 py-2">Rs {room.Price?.toFixed(2)}</td>
                      <td className="border px-4 py-2">{room.Remarks || 'N/A'}</td>
                      <td className="border px-4 py-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(room._id)}
                          className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="border px-4 py-4 text-center">
                      No rooms found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {/* Pagination */}
          {rooms.length > 0 && (
            <div className="flex justify-end mt-4">
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 border rounded">{'<'}</button>
                <button className="px-3 py-1 bg-blue-900 text-white rounded">1</button>
                <button className="px-2 py-1 border rounded">{'>'}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HostelRoom;