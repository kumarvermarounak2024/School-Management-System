import React, { useState, useEffect } from "react";
import { FaPlus, FaList } from "react-icons/fa";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Event = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const [activeTab, setActiveTab] = useState("create");
  const [eventName, setEventName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [eventList, setEventList] = useState([]);
  const [editId, setEditId] = useState(null);

  // 🔄 Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${apiUrl}/eventtype/list`);
      setEventList(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "list") {
      fetchEvents();
    }
  }, [activeTab]);

  // ➕ Create Event
  const handleSave = async () => {
    try {
      if (editId) {
        const res = await axios.put(`${apiUrl}/eventtype/update/${editId}`, {
          name: eventName,
        });
        if (res.status === 200) {
          toast.success("Event type updated successfully");

          setEditId(null);
          setEventName("");
          fetchEvents();
        }
      } else {
        await axios.post(`${apiUrl}/eventtype/create`, { name: eventName });
        setEventName("");
        alert("Event created successfully");
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  // ❌ Delete Event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      await axios.delete(`${apiUrl}/eventtype/delete/${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // 🔍 Filtered Events
  const filteredEvents = eventList.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (event) => {
    setEventName(event?.name);
    setEditId(event._id);
    setActiveTab("create");
  };
  const handleUpdateEventType = async (id) => {
    try {
      await axios.put(`${apiUrl}/eventtype/update/${editId}`, {
        name: eventName,
      });
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="bg-gray-50 p-4">
      {/* Tabs */}
      <div className="flex gap-4 border-b mb-4">
        <button
          onClick={() => setActiveTab("create")}
          className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${
            activeTab === "create"
              ? "text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]"
              : "text-gray-600 hover:text-[#143781]"
          }`}
        >
          <FaPlus /> Create Event
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${
            activeTab === "list"
              ? "text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]"
              : "text-gray-600 hover:text-[#143781]"
          }`}
        >
          <FaList /> Event List
        </button>
      </div>

      {/* Create Event Form */}
      {activeTab === "create" && (
        <div className="bg-white p-4 rounded shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Event Name</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                placeholder="Enter event name"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              className="bg-[#143781] text-white px-4 py-2 rounded hover:bg-opacity-90"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Event List Table */}
      {activeTab === "list" && (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search event..."
              className="border px-3 py-2 rounded w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            {filteredEvents.length === 0 ? (
              <p className="text-gray-500">No events found.</p>
            ) : (
              <table className="min-w-full text-sm border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Event Name</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="border-t">
                      <td className="p-2 border">{event.name}</td>
                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                            onClick={() => handleDelete(event._id)}
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

export default Event;
