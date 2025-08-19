import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const HostelList = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

  const [hostels, setHostels] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchHostels = async () => {
    try {
      const res = await axios.get(`${apiUrl}/hostel/getAll`);
      setHostels(res.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch hostels");
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hostel?")) {
      try {
        await axios.delete(`${apiUrl}/hostel/delete/${id}`);
        toast.success("Hostel deleted");
        fetchHostels();
      } catch (error) {
        toast.error("Failed to delete hostel");
      }
    }
  };

  const handleEdit = (hostel) => {
    setEditData({
      ...hostel
    });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${apiUrl}/hostel/update/${editData._id}`, editData);
      toast.success("Hostel updated");
      setEditData(null);
      fetchHostels();
    } catch (error) {
      toast.error("Failed to update hostel");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Hostel List</h2>
      <table className="w-full border text-center border-black">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-black px-2 py-1">S.No</th>
            <th className="border border-black px-2 py-1">Name</th>
            <th className="border border-black px-2 py-1">Address</th>
            <th className="border border-black px-2 py-1">Remarks</th>
            <th className="border border-black px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hostels.map((hostel, index) => (
            <tr key={hostel._id}>
              <td className="border px-2 py-1">{index + 1}</td>
              <td className="border px-2 py-1">
                {editData?._id === hostel._id ? (
                  <input
                    value={editData.Hostel_Name}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        Hostel_Name: e.target.value,
                      }))
                    }
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  hostel.Hostel_Name
                )}
              </td>
              <td className="border px-2 py-1">
                {editData?._id === hostel._id ? (
                  <textarea
                    value={editData.Hostel_Address}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        Hostel_Address: e.target.value,
                      }))
                    }
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  hostel.Hostel_Address
                )}
              </td>
              <td className="border px-2 py-1">
                {editData?._id === hostel._id ? (
                  <textarea
                    value={editData.Remarks}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        Remarks: e.target.value,
                      }))
                    }
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  hostel.Remarks
                )}
              </td>
              <td className="border px-2 py-1 flex gap-2">
                {editData?._id === hostel._id ? (
                  <>
                    <button
                      onClick={handleEditSubmit}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditData(null)}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(hostel)}
                      className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(hostel._id)}
                      className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HostelList;
