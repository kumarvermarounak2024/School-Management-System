import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const ExamRoom = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [room, setRoom] = useState("");
  const [seats, setSeats] = useState("");
  const [examRooms, setExamRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [documentId, setDocumentId] = useState(null); // Exam document _id

  const fetchExamRooms = async () => {
    try {
      const res = await axios.get(`${apiUrl}/examination/getAll`);
      if (res.data.length > 0) {
        const examDoc = res.data[0]; // Assuming only one exam document
        setExamRooms(examDoc.examRooms || []);
        setDocumentId(examDoc._id);
      }
    } catch (error) {
      console.error("Failed to fetch exam rooms:", error);
      toast.error("Failed to fetch exam rooms");
    }
  };

  useEffect(() => {
    fetchExamRooms();
  }, []);

  const handleAddOrUpdate = async () => {
    if (!room.trim() || !seats.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      const updatedRooms = [...examRooms];
      if (editIndex !== null) {
updatedRooms[editIndex] = { roomNumber: room, noOfSeats: parseInt(seats) };
      } else {

updatedRooms.push({ roomNumber: room, noOfSeats: parseInt(seats) });
      }

      await axios.put(`${apiUrl}/examination/update/${documentId}`, {
        examRooms: updatedRooms
      });

      toast.success(editIndex !== null ? "Room updated successfully" : "Room added successfully");
      setRoom("");
      setSeats("");
      setEditIndex(null);
      fetchExamRooms();
    } catch (error) {
      console.error("Error saving exam room:", error);
      toast.error("Error saving exam room");
    }
  };

  const handleEdit = (roomData, index) => {
   // ✅ Correct
setRoom(roomData.roomNumber);
setSeats(roomData.noOfSeats.toString());
    setEditIndex(index);
  };

  const handleDelete = async (indexToDelete) => {
    try {
      const updatedRooms = examRooms.filter((_, idx) => idx !== indexToDelete);
      await axios.put(`${apiUrl}/examination/update/${documentId}`, {
        examRooms: updatedRooms
      });

      toast.success("Room deleted successfully");
      fetchExamRooms();
    } catch (err) {
      console.error("Error deleting exam room:", err);
      toast.error("Failed to delete exam room");
    }
  };

  const filteredRooms = examRooms.filter((roomData) =>
roomData?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-4 border-b pb-2">
        <h2 className="text-blue-800 font-semibold text-lg">✍️ Add Exam Room</h2>
        <h2 className="text-blue-800 font-semibold text-lg">📋 Exam Room List</h2>
      </div>

      <div className="bg-gray-50 p-6 flex flex-col rounded-lg shadow mb-6">
        <label className="block mb-2 font-semibold">
          Room No. <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room number here"
          className="border rounded p-2 w-1/2 mb-4"
        />
        <label className="block mb-2 font-semibold">
          No. of Seats <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          placeholder="Number of seats"
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
        <h3 className="text-blue-800 font-semibold">📋 Exam Rooms List</h3>
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
            <th className="p-2 border">Room No.</th>
            <th className="p-2 border">No. of Seats</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((roomData, index) => (
            <tr key={index} className="border-t">
              <td className="p-2 border">{roomData.roomNumber}</td>
<td className="p-2 border">{roomData.noOfSeats}</td>
              <td className="p-2 border flex gap-2">
                <button
                  className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                  onClick={() => handleEdit(roomData, index)}
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

export default ExamRoom;
