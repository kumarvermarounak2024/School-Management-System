import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

const AllocationRoom = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const [classes, setClasses] = useState([]);
  const [section, setSection] = useState([]);
  const [studentName, setStudentName] = useState([]);
  const [hostelName, setHostelsName] = useState([]);
  const [roomName, setroomName] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("form");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    class: "",
    section: "",
    studentName: "",
    fatherName: "",
    hostelName: "",
    roomName: "",
    category: "",
    hostelFees: "",
  });

  const [allocations, setAllocations] = useState([]);
  // Fetch All Data
  const fetchAllocations = async () => {
    try {
      const res = await axios.get(`${apiUrl}/hostelAllocation/getAll`);
      console.log("allocationget", res);
      setAllocations(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  // Delete Allocation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${apiUrl}/hostelAllocation/delete/${id}`);
      alert("Deleted successfully");
      fetchAllocations(); // Refresh list
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`${apiUrl}/hostelAllocation/getById/${id}`);
      const data = res.data?.data;

      if (data) {
        setEditingId(id);

        setFormData({
          class: data.class?._id || "",
          section: data.section?._id || "",
          studentName: data.studentName?._id || "",
          fatherName: data.fatherName || "",
          hostelName: data.hostelName?._id || "",
          roomName: data.roomName?._id || "",
          category: data.category?._id || "",
          hostelFees: data.hostelFees || "",
        });

        setActiveTab("form"); // Form tab open kar dena
      }
    } catch (error) {
      console.error("Failed to fetch data by ID", error);
    }
  };

  const selectedClass = formData.class;
  const selectedSection = formData.section;

  const getClasses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/class/getAll`);
      console.log(response?.data?.classes, "classes");
      setClasses(response?.data?.classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error(
        `Error: ${error?.response?.data?.message || "Failed to fetch classes"}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  const getSection = async () => {
    try {
      const response = await axios.get(`${apiUrl}/section/getAll`);
      console.log(response?.data?.sections, "section");
      setSection(response?.data?.sections);
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast.error(
        `Error: ${
          error?.response?.data?.message || "Failed to fetch sections"
        }`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  const getStudentName = async () => {
    if (!formData.class || !formData.section) {
      setStudentName([]);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
      console.log(response?.data?.data, "students");
      console.log("stu", response);
      const filteredStudents = response?.data?.data?.filter((student) => {
        return (
          student.level_class?._id === formData.class &&
          student.section?._id === formData.section
        );
      });

      setStudentName(filteredStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error(
        `Error: ${error?.response?.data?.message || "Failed to fetch students"}`
      );
      setStudentName([]);
    }
  };

  const gethostelName = async () => {
    try {
      const response = await axios.get(`${apiUrl}/hostel/getAll`);
      console.log(response?.data?.data, "hostel");
      setHostelsName(response?.data?.data);
    } catch (error) {
      console.error("Error fetching hostel names:", error);
    }
  };

  const getroomName = async () => {
    try {
      const response = await axios.get(`${apiUrl}/hostel/room/getAll`);
      console.log(response, "rooms");
      setroomName(response?.data?.data);
    } catch (error) {
      console.error("Error fetching room numbers:", error);
    }
  };

  const getCategoty = async () => {
    try {
      const response = await axios.get(`${apiUrl}/hostel/category/getAll`);
      console.log(response?.data?.data, "category");
      setCategory(response?.data?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        getClasses(),
        getSection(),
        gethostelName(),
        getroomName(),
        getCategoty(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (formData.class && formData.section) {
      getStudentName();
    } else {
      setStudentName([]);
    }
  }, [formData.class, formData.section]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update mode
        const response = await axios.put(
          `${apiUrl}/hostelAllocation/update/${editingId}`,
          formData
        );
        console.log("Allocation updated:", response.data);

        // List update karne ke liye dobara fetch karo
        await fetchAllocations();

        setEditingId(null); // edit mode band karo
      } else {
        // Create mode
        const response = await axios.post(
          `${apiUrl}/hostelAllocation/create`,
          formData
        );
        console.log("Allocation saved:", response.data);

        // List update karne ke liye dobara fetch karo
        await fetchAllocations();
      }

      // Form reset
      setFormData({
        class: "",
        section: "",
        studentName: "",
        fatherName: "",
        hostelName: "",
        roomName: "",
        category: "",
        hostelFees: "",
      });

      setActiveTab("list"); // list tab pe aao
    } catch (error) {
      console.error("Error saving/updating allocation:", error);
    }
  };

  return (
    <div className="p-4">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "form"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("form")}
            >
              📝 Room Allocation
            </button>
            <button
              className={`px-4 py-2 font-medium ml-4 ${
                activeTab === "list"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("list")}
            >
              📋 Allocation List
            </button>
          </div>

          {activeTab === "form" && (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Class Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class *
                </label>
                <select
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({ ...formData, class: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Class</option>
                  {classes.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.Name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section *
                </label>
                <select
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Section</option>
                  {section.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.Name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name *
                </label>
                <select
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Student</option>
                  {studentName.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Father Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father Name *
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) =>
                    setFormData({ ...formData, fatherName: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Hostel Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hostel Name *
                </label>
                <select
                  value={formData.hostelName}
                  onChange={(e) =>
                    setFormData({ ...formData, hostelName: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  {" "}
                  <option value="">Select Hostel</option>
                  {hostelName.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.Hostel_Name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number *
                </label>
                <select
                  value={formData.roomName}
                  onChange={(e) =>
                    setFormData({ ...formData, roomName: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Room</option>

                  {roomName.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.roomName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  {category.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.Category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hostel Fees Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hostel Fees *
                </label>
                <input
                  type="text"
                  value={formData.hostelFees}
                  onChange={(e) =>
                    setFormData({ ...formData, hostelFees: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-center gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-800 text-white font-semibold py-2 px-8 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      class: "",
                      section: "",
                      studentName: "",
                      fatherName: "",
                      hostelName: "",
                      roomName: "",
                      category: "",
                      hostelFees: "",
                    })
                  }
                  className="border border-blue-800 text-blue-800 font-semibold py-2 px-8 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {activeTab === "list" && (
            <>
              <div className="flex justify-end mb-2">
                <input
                  type="text"
                  placeholder="Search Here..."
                  className="border px-3 py-2 w-1/3 rounded"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-collapse rounded text-sm">
                  <thead>
                    <tr className="bg-blue-100 text-left">
                      <th className="border px-4 py-2">SL</th>
                      <th className="border px-4 py-2">Student Name</th>
                      <th className="border px-4 py-2">Father Name</th>
                      <th className="border px-4 py-2">Hostel Name</th>
                      <th className="border px-4 py-2">Room Name</th>
                      <th className="border px-4 py-2">Category</th>
                      <th className="border px-4 py-2">Hostel Fees</th>
                      <th className="border px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          No data found
                        </td>
                      </tr>
                    ) : (
                      allocations.map((item, index) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">
                            {item.studentName?.firstName}{" "}
                            {item.studentName?.lastName}
                          </td>
                          <td className="border px-4 py-2">
                            {item.fatherName}
                          </td>
                          <td className="border px-4 py-2">
                            {item.hostelName?.Hostel_Name}
                          </td>
                          <td className="border px-4 py-2">
                            {item.roomName?.roomName}
                          </td>
                          <td className="border px-4 py-2">
                            {item.category?.Category_name}
                          </td>
                          <td className="border px-4 py-2">
                            {item.hostelFees}
                          </td>
                          <td className="border px-4 py-2 space-x-2 flex items-center">
                            <button
                              onClick={() => handleEdit(item._id)}
                              className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div className="flex justify-center mt-4">
                  <button className="border px-3 py-1 rounded-l">{"<"}</button>
                  <button className="border-t border-b px-3 py-1 bg-blue-100 font-medium">
                    1
                  </button>
                  <button className="border px-3 py-1 rounded-r">{">"}</button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AllocationRoom;
