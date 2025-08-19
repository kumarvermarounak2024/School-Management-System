import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { FaPlus, FaList } from "react-icons/fa";
import axios from "axios";

export default function EventManager() {
  const apiUrl =
    import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [activeTab, setActiveTab] = useState("list");
  const [holiday, setHoliday] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [audience, setAudience] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null);
  const [createdBy, setCreatedBy] = useState("Admin");
  const [showWebsite, setShowWebsite] = useState(false);
  const [publish, setPublish] = useState(false);
  const [events, setEvents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${apiUrl}/event/getAll`);
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };
  const fetchEventType = async () => {
    try {
      const res = await axios.get(`${apiUrl}/eventtype/list`);
      console.log("type", res);
      setEventList(res.data); // Adjust based on actual response shape
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEventType();
  }, []);

  const resetForm = () => {
    setTitle("");
    setType("");
    setAudience("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setHoliday(false);
    setShowWebsite(false);
    setPublish(false);
    setImage(null);
    setCreatedBy("Admin");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image); // this can be a File or null
    formData.append("title", title);
    formData.append("type", type);
    formData.append("audience", audience);
    formData.append("description", description);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("isHoliday", holiday);
    formData.append("showWebsite", showWebsite);
    formData.append("publish", publish);
    formData.append("createdBy", createdBy);
    const payload = {
      title,
      type,
      audience,
      description,
      startDate,
      endDate,
      isHoliday: holiday,
      showWebsite,
      publish,
      createdBy,
      image: image?.name || "",
    };

    try {
      if (editId) {
        await axios.put(`${apiUrl}/event/update/${editId}`, payload);
      } else {
        await axios.post(`${apiUrl}/event/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      fetchEvents();
      resetForm();
      setActiveTab("list");
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  const handleEdit = (event) => {
    setTitle(event.title);
    setType(event.type?._id || event.type); // ✅ store only ID
    setAudience(event.audience);
    setDescription(event.description);
    setStartDate(event.startDate?.slice(0, 10));
    setEndDate(event.endDate?.slice(0, 10));
    setHoliday(event.isHoliday);
    setShowWebsite(event.showWebsite);
    setPublish(event.publish);
    setImage({ name: event.image });
    setCreatedBy(event.createdBy || "Admin");
    setEditId(event._id);
    setActiveTab("create");
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`${apiUrl}/event/delete/${id}`);
        fetchEvents();
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b mb-4">
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

      {/* List Tab */}
      {activeTab === "list" && (
        <div className="bg-gray-50 p-4 rounded shadow">
          <div className="flex justify-between items-center mb-3">
            <input
              type="text"
              placeholder="Search..."
              className="border p-2 rounded w-1/3"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Start Date</th>
                  <th className="p-2 border">End Date</th>
                  <th className="p-2 border">Audience</th>
                  <th className="p-2 border">Created By</th>
                  <th className="p-2 border">Website</th>
                  <th className="p-2 border">Publish</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, i) => (
                  <tr key={event._id}>
                    <td className="p-2 border">{i + 1}</td>
                    <td className="p-2 border">{event.title}</td>
                    <td className="p-2 border">{event.type?.name}</td>
                    <td className="p-2 border">
                      {event.startDate?.slice(0, 10)}
                    </td>
                    <td className="p-2 border">
                      {event.endDate?.slice(0, 10)}
                    </td>
                    <td className="p-2 border">{event.audience}</td>
                    <td className="p-2 border">{event.createdBy}</td>
                    <td className="p-2 border">
                      {event.showWebsite ? "Yes" : "No"}
                    </td>
                    <td className="p-2 border">
                      {event.publish ? "Yes" : "No"}
                    </td>
                    <td className="p-2 border flex gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                      >
                        {" "}
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                      >
                        {" "}
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Tab */}
      {activeTab === "create" && (
        <div className="bg-gray-50 p-4 rounded shadow ">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                className="w-1/2 p-2 border rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="holiday"
                checked={holiday}
                onChange={(e) => setHoliday(e.target.checked)}
              />
              <label htmlFor="holiday" className="text-sm">
                Holiday
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium">Type</label>
              <select
                value={type}
                disabled={holiday}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-1/2 p-2 border rounded"
              >
                <option value="">Select Event Type</option>
                {eventList.map((eventType) => (
                  <option key={eventType._id} value={eventType._id}>
                    {eventType.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Audience</label>
              <select
                className="w-1/2 p-2 border rounded"
                disabled={holiday}
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              >
                <option value="">Select</option>
                <option>All</option>
                <option>Students</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                className="w-1/2 p-2 border rounded"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                className="w-1/2 p-2 border rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                className="w-1/2 p-2 border rounded"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={showWebsite}
                onChange={setShowWebsite}
                className={`${
                  showWebsite ? "bg-blue-600" : "bg-gray-300"
                } relative inline-flex h-5 w-10 items-center rounded-full`}
              >
                <span className="sr-only">Show Website</span>
                <span
                  className={`${
                    showWebsite ? "translate-x-5" : "translate-x-1"
                  } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                />
              </Switch>
              <span className="text-sm">Show Website</span>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={publish}
                onChange={setPublish}
                className={`${
                  publish ? "bg-blue-600" : "bg-gray-300"
                } relative inline-flex h-5 w-10 items-center rounded-full`}
              >
                <span className="sr-only">Publish</span>
                <span
                  className={`${
                    publish ? "translate-x-5" : "translate-x-1"
                  } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                />
              </Switch>
              <span className="text-sm">Publish</span>
            </div>

            <div>
              <label className="block text-sm font-medium">Image</label>
              <input
                type="file"
                className="w-full"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              className="bg-[#143781] text-white px-6 py-4 rounded "
            >
              {editId ? "Update Event" : "Save Event"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
