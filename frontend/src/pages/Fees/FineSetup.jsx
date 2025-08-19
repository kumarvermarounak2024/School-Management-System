import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

const apiUrl = 'http://localhost:4100/api/finesetup';

const FineSetup = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [formData, setFormData] = useState({
    feeGroup: '',
    feeType: '',
    fineType: '',
    fineValue: '',
    lateFeeFrequency: '',
  });

  const [rooms, setRooms] = useState([]);
  const [feeGroups, setFeeGroups] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchFeeGroups();
    fetchFeeTypes();
    fetchFineSetups();
  }, []);

  const fetchFeeGroups = async () => {
    try {
      const res = await axios.get('http://localhost:4100/api/feegroup/getall');
      setFeeGroups(res.data);
    } catch (err) {
      console.error('Failed to fetch fee groups', err);
    }
  };

  const fetchFeeTypes = async () => {
    try {
      const res = await axios.get('http://localhost:4100/api/feetype/getall');
      setFeeTypes(res.data);
    } catch (err) {
      console.error('Failed to fetch fee types', err);
    }
  };

  const fetchFineSetups = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/getall`);
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to fetch fine setups', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      feeGroup: '',
      feeType: '',
      fineType: '',
      fineValue: '',
      lateFeeFrequency: '',
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.feeGroup || !formData.feeType) return alert('All required fields must be filled');
      const payload = {
        ...formData,
        feeGroup: formData.feeGroup,
        feeType: formData.feeType,
      };

      if (isEditing) {
        await axios.patch(`${apiUrl}/update/${editId}`, payload);
      } else {
        await axios.post(`${apiUrl}/create`, payload);
      }

      fetchFineSetups();
      resetForm();
      setActiveTab('list');
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  const handleEdit = (room) => {
    setFormData({
      feeGroup: room.feeGroup._id,
      feeType: room.feeType._id,
      fineType: room.fineType,
      fineValue: room.fineValue,
      lateFeeFrequency: room.lateFeeFrequency,
    });
    setEditId(room._id);
    setIsEditing(true);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/delete/${id}`);
      fetchFineSetups();
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const term = searchTerm.toLowerCase();
    return (
      room.feeGroup?.feeGroup?.toLowerCase().includes(term) ||
      room.feeType?.feeType?.toLowerCase().includes(term) ||
      room.fineType?.toLowerCase().includes(term) ||
      room.fineValue?.toString().toLowerCase().includes(term) ||
      room.lateFeeFrequency?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedRooms = filteredRooms.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="p-4 bg-[#f4f6fd] min-h-screen">
      {/* Tabs */}
      <div className="flex border-b border-blue-200 mb-6">
        <button className={`flex items-center gap-2 px-4 py-2 font-semibold ${activeTab === 'form' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'}`} onClick={() => { resetForm(); setActiveTab('form'); }}>
          🖊️ Add Fine
        </button>
        <button className={`flex items-center gap-2 px-4 py-2 font-semibold ${activeTab === 'list' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'}`} onClick={() => { fetchFineSetups(); setActiveTab('list'); }}>
          📋 Fine List
        </button>
      </div>

      {/* Form */}
      {activeTab === 'form' && (
        <div className="flex flex-col min-h-[59vh] p-6 w-full mx-auto space-y-6">
          <FormRow label="Fee Group Name *">
            <select name="feeGroup" value={formData.feeGroup} onChange={handleChange} className="w-full border px-3 py-2 rounded bg-white">
              <option value="">Select Fee Group</option>
              {feeGroups.map((group) => (
                <option key={group._id} value={group._id}>{group.feeGroup}</option>
              ))}
            </select>
          </FormRow>

          <FormRow label="Fee Type Name *">
            <select name="feeType" value={formData.feeType} onChange={handleChange} className="w-full border px-3 py-2 rounded bg-white">
              <option value="">Select Fee Type</option>
              {feeTypes.map((type) => (
                <option key={type._id} value={type._id}>{type.feeType}</option>
              ))}
            </select>
          </FormRow>

          <FormRow label="Fine Type *">
            <select name="fineType" value={formData.fineType} onChange={handleChange} className="w-full border px-3 py-2 rounded bg-white">
              <option value="">Select Fine Type</option>
              <option value="Fixed Amount">Fixed Amount</option>
              <option value="Percent">Percent</option>
            </select>
          </FormRow>

          <FormRow label="Fine Value *">
            <input type="text" name="fineValue" value={formData.fineValue} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Enter fine value" />
          </FormRow>

          <FormRow label="Late Fee Frequency *">
            <select name="lateFeeFrequency" value={formData.lateFeeFrequency} onChange={handleChange} className="w-full border px-3 py-2 rounded bg-white">
              <option value="">Select Frequency</option>
              <option value="Fixed">Fixed</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Annually">Annually</option>
            </select>
          </FormRow>

          <div className="pt-8 flex justify-center gap-6">
            <button onClick={handleSubmit} className="bg-blue-900 text-white px-8 py-2 rounded font-semibold">
              {isEditing ? 'Update' : 'Save'}
            </button>
            <button onClick={() => { resetForm(); setActiveTab('list'); }} className="border border-blue-900 text-blue-900 px-8 py-2 rounded font-semibold">
              Back
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {activeTab === 'list' && (
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-3">
            <input type="text" placeholder="🔍 Search Here..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="border rounded px-4 py-2 w-72" />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading fine setups...</div>
          ) : (
            <>
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-blue-100 text-gray-900 font-semibold">
                  <tr>
                    <th className="border px-4 py-2">SL</th>
                    <th className="border px-4 py-2">Group Name</th>
                    <th className="border px-4 py-2">Fee Type</th>
                    <th className="border px-4 py-2">Fine Type</th>
                    <th className="border px-4 py-2">Fine Value</th>
                    <th className="border px-4 py-2">Frequency</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRooms.length > 0 ? (
                    paginatedRooms.map((room, idx) => (
                      <tr key={room._id} className="text-center">
                        <td className="border px-4 py-2">{startIdx + idx + 1}</td>
                        <td className="border px-4 py-2">{room.feeGroup?.feeGroup || '-'}</td>
                        <td className="border px-4 py-2">{room.feeType?.feeType || '-'}</td>
                        <td className="border px-4 py-2">{room.fineType}</td>
                        <td className="border px-4 py-2">{room.fineValue}</td>
                        <td className="border px-4 py-2">{room.lateFeeFrequency}</td>
                        <td className="border px-4 py-2 flex justify-center gap-2">
                          <button onClick={() => handleEdit(room)} className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleDelete(room._id)} className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="border px-4 py-4 text-center">No fine setups found</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const FormRow = ({ label, children }) => (
  <div className="flex flex-col md:flex-row items-center gap-4">
    <label className="md:w-1/4 font-medium">{label}</label>
    <div className="w-full md:w-3/4">{children}</div>
  </div>
);

export default FineSetup;
