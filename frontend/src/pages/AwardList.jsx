import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaPrint, FaTrashAlt } from "react-icons/fa";
import { Eye, Pencil, Trash2 } from "lucide-react";

const AwardList = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [awards, setAwards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [staffList, setStaffList] = useState([]);
    const [designations, setDesignations] = useState([]);
  
  const [editForm, setEditForm] = useState({
    role: "",
    winner: "",
    awardName: "",
    giftItem: "",
    cashPrice: "",
    awardReason: "",
    givenDate: "",
  });
 const fetchDesignations = async () => {
    try {
      const res = await axios.get(`${apiUrl}/designation/get`);
      setDesignations(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching designations:", err);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);
  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const res = await axios.get(`${apiUrl}/awards/all`);
      setAwards(res.data);
    } catch (err) {
      console.error("Error fetching awards:", err);
    }
  };
  const getAllStaff = async () => {
    try {
      const res = await axios.get(`${apiUrl}/staff/get`);
      console.log("staff response:", res.data);

      const employees = res.data.employees || [];
      setStaffList(employees);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);
  const handleDelete = async (awardId) => {
    if (!window.confirm("Are you sure you want to delete this award?")) return;

    try {
      const res = await axios.delete(`${apiUrl}/awards/${awardId}`);
      if (res.status === 200) {
        setAwards((prev) => prev.filter((a) => a._id !== awardId));
        alert("Award deleted successfully.");
      } else {
        alert("Failed to delete award.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting award.");
    }
  };

  const deleteAllAwards = async () => {
    try {
      const res = await axios.delete(`${apiUrl}/awards/delete-all`);
      if (res.status === 200) {
        setAwards([]); // Clear frontend state
        alert("All awards deleted successfully.");
      } else {
        alert("Failed to delete awards.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting awards.");
    }
  };

  const filteredAwards = awards.filter((award) =>
    award.winner?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (award) => {
    setSelectedAward(award);
    setEditForm({
      role: award.role,
      winner: award.winner,
      awardName: award.awardName,
      giftItem: award.giftItem,
      cashPrice: award.cashPrice,
      awardReason: award.awardReason,
      givenDate: new Date(award.givenDate).toISOString().split("T")[0], // Format: yyyy-mm-dd
    });
    setIsEditModalOpen(true);
  };
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${apiUrl}/awards/${selectedAward._id}`,
        editForm
      );
      if (res.status === 200) {
        setAwards((prev) =>
          prev.map((a) => (a._id === selectedAward._id ? res.data : a))
        );
        alert("Award updated successfully.");
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating award.");
    }
  };

  return (
    <div className="bg-[#f2f4fc] min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#cdd3f0] pb-3">
        <h2 className="text-lg font-semibold text-[#3b489e] border-b-2 border-[#3b489e]">
          🎖️ Award List
        </h2>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 mt-4">
        {/* Print Icon */}
        <FaPrint
          className="text-gray-600 cursor-pointer hover:text-green-600"
          title="Print Award List"
          onClick={() => window.print()}
        />

        {/* Delete Icon */}
        <FaTrashAlt
          className="text-gray-600 cursor-pointer hover:text-red-600"
          title="Delete All Awards"
          onClick={() => {
            if (window.confirm("Are you sure you want to delete all awards?")) {
              deleteAllAwards();
            }
          }}
        />
      </div>

      {/* Search Box */}
      <div className="mt-4 flex justify-end">
        <div className="flex items-center border border-gray-300 bg-white rounded-md px-3 py-2 w-full max-w-md">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search Here..."
            className="w-full outline-none text-sm bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border border-gray-300 text-sm text-center bg-[#f2f4fc]">
          <thead className="bg-[#dde3fd] text-gray-800">
            <tr>
              <th className="border px-4 py-2">SL</th>
              <th className="border px-4 py-2">Winner</th>
              <th className="border px-4 py-2">Roll</th>
              <th className="border px-4 py-2">Award Name</th>
              <th className="border px-4 py-2">Gift Item</th>
              <th className="border px-4 py-2">Cash Price</th>
              <th className="border px-4 py-2">Award Reason</th>
              <th className="border px-4 py-2">Given Date</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredAwards.length > 0 ? (
              filteredAwards.map((award, index) => (
                <tr key={award._id || index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2 text-left">
                    <span className="font-semibold block">{award.winner}</span>
                  </td>
                  <td className="border px-4 py-2">{award.role}</td>
                  <td className="border px-4 py-2">{award.awardName}</td>
                  <td className="border px-4 py-2">{award.giftItem}</td>
                  <td className="border px-4 py-2">{award.cashPrice}</td>
                  <td className="border px-4 py-2">{award.awardReason}</td>
                  <td className="border px-4 py-2">
                    {new Date(award.givenDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-5">
                      <button
                        className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                        onClick={() => handleEdit(award)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                        onClick={() => handleDelete(award._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="border px-4 py-4 text-center text-gray-500"
                >
                  No awards found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Optional) */}
      <div className="flex justify-end mt-4">
        <div className="flex items-center space-x-2 bg-white rounded-md shadow px-4 py-1">
          <button className="text-gray-600">&lt;</button>
          <span className="px-2 text-[#3b489e] font-semibold">1</span>
          <button className="text-gray-600">&gt;</button>
        </div>
      </div>
      {/* update award modal  */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#3b489e]">
              Edit Award
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* role select */}
              <select
                className="w-full px-3 py-2 border rounded"
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
              >
            {designations?.map((role, index) => (
                <option key={index + 1} value={role.name}>
                  {role.name}
                </option>
              ))}
              </select>

              {/* winner name dropdown */}
              <select
                className="w-full px-3 py-2 border rounded mt-2"
                value={editForm.winner}
                onChange={(e) =>
                  setEditForm({ ...editForm, winner: e.target.value })
                }
              >
                <option value="">Select Winner</option>
                {staffList?.filter((staff)=>staff?.designation?.name?.toLowerCase()===editForm?.role?.toLocaleLowerCase()).map((staff) => (
                  <option key={staff._id} value={staff.name}>
                    {staff.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Award Name"
                value={editForm.awardName}
                onChange={(e) =>
                  setEditForm({ ...editForm, awardName: e.target.value })
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Gift Item"
                value={editForm.giftItem}
                onChange={(e) =>
                  setEditForm({ ...editForm, giftItem: e.target.value })
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Cash Price"
                value={editForm.cashPrice}
                onChange={(e) =>
                  setEditForm({ ...editForm, cashPrice: e.target.value })
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Award Reason"
                value={editForm.awardReason}
                onChange={(e) =>
                  setEditForm({ ...editForm, awardReason: e.target.value })
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="date"
                value={editForm.givenDate}
                onChange={(e) =>
                  setEditForm({ ...editForm, givenDate: e.target.value })
                }
                className="border rounded px-3 py-2 col-span-2"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-[#3b489e] text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardList;
