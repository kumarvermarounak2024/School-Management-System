import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
const StudentAttendance = () => {
      const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showTable, setShowTable] = useState(false);
 const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [attendanceInputs, setAttendanceInputs] = useState({});

  
  const handleShow = async () => {
  if (selectedClass && selectedSection && selectedDate) {
    console.log(selectedClass, selectedSection, selectedDate);
console.log("Sending Request with:", {
  level_class: selectedClass,
  section: selectedSection,
  date: selectedDate
});

    try {
      const res = await axios.get(
        `${apiUrl}/studentattendances/list`,
        {
          params: {
            level_class: selectedClass,
            section: selectedSection,
            date: selectedDate,
          },
        }
      );
      setAttendanceData(res.data.data || []);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  }
};

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [classRes, sectionRes,] = await Promise.all([
        axios.get(`${apiUrl}/class/getAll`),
        axios.get(`${apiUrl}/section/getAll`),
      ]);
      setClasses(classRes.data.classes || []);
      setSections(sectionRes.data.sections || []);
    } catch (err) {
      console.error('Dropdown fetch error:', err);
    }
  };
  const handleSave = async () => {
  // Prepare attendances array from attendanceData and attendanceInputs
  const attendances = attendanceData.map((student) => ({
    studentId: student._id, // Make sure this matches your API requirement
    status: attendanceInputs[student._id]?.status || "Absent", // Default to Absent if not selected
    remarks: attendanceInputs[student._id]?.remarks || "", // Empty remarks if not provided
  }));

  const payload = {
    classId: selectedClass,
    sectionId: selectedSection,
    date: selectedDate,
    attendances,
  };

  console.log("Final Payload:", payload); // For debugging

  try {
    const res = await axios.post(
      `${apiUrl}/studentattendances/create`,
      payload
    );
    
    // Check if response has success message
    if (res.data.message === "Attendance submitted successfully.") {
      alert("Attendance saved successfully!");
      console.log("API Response:", res.data);
      
      // Optional: Reset form or show updated data
      setAttendanceInputs({});
    } else {
      alert("Attendance saved but unexpected response format.");
    }
  } catch (error) {
    console.error("Error submitting attendance:", error);
    
    // Show detailed error message if available
    const errorMsg = error.response?.data?.message || 
                    error.message || 
                    "Failed to submit attendance";
    alert(`Error: ${errorMsg}`);
  }
};
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Filters */}
      <div className="bg-gray-100 shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-m font-medium text-gray-700">Class *</label>
          <select
      value={selectedClass}
      onChange={(e) => setSelectedClass(e.target.value)}
      className="w-full border border-gray-300 px-3 py-2 rounded"
    >
      <option value="">Select Class</option>
      {classes.map((cls) => (
        <option key={cls._id} value={cls._id}>
          {cls.Name}
        </option>
      ))}
    </select>
        </div>
            {/* className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1" */}

        <div>
          <label className="block text-m font-medium text-gray-700">Section *</label>
          <select
      value={selectedSection}
      onChange={(e) => setSelectedSection(e.target.value)}
      className="w-full  border border-gray-300 px-3 py-2 rounded"
    >
      <option value="">Select Section</option>
      {sections.map((sec) => (
        <option key={sec._id} value={sec._id}>
          {sec.Name}
        </option>
      ))}
    </select>
        </div>

        <div>
          <label className="block text-m font-medium text-gray-700">Date *</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
          />
        </div>
      </div>

      <div className="text-center mb-4">
        <button 
                      className="bg-[#143781] text-white px-4 py-2 rounded hover:bg-opacity-90"

        onClick={handleShow}>Show</button>
      </div>

      {/* Table */}
      {showTable && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 border">SL</th>
                <th className="px-4 py-2 border">Student Name</th>
                <th className="px-4 py-2 border">Roll no.</th>
                <th className="px-4 py-2 border">Register No.</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Remarks</th>
              </tr>
            </thead>
           <tbody>
  {attendanceData.map((student, index) => (
    <tr key={student._id} className="text-center">
      <td className="border px-4 py-2">{index + 1}</td>
      <td className="border px-4 py-2">{student.firstName} {student.lastName}</td>
      <td className="border px-4 py-2">{student.roll_no}</td>
      <td className="border px-4 py-2">{student.registration_no}</td>
      <td className="border px-4 py-2">
        <div className="flex justify-center gap-2">
          {["Present", "Absent", "Late", "Half Day"].map((status) => (
            <label key={status}>
              <input
                type="radio"
                name={`status-${student._id}`}
                value={status}
                  checked={attendanceInputs[student._id]?.status === status || 
          (!attendanceInputs[student._id]?.status && status === "Present")}
                onChange={(e) =>
                  setAttendanceInputs((prev) => ({
                    ...prev,
                    [student._id]: {
                      ...prev[student._id],
                      status: e.target.value,
                    },
                  }))
                }
                className="mr-1"
              />
              {status}
            </label>
          ))}
        </div>
      </td>
      <td className="border px-4 py-2">
        <input
          type="text"
          placeholder="Remarks"
          className="border border-gray-300 rounded-md px-2 py-1"
          onChange={(e) =>
            setAttendanceInputs((prev) => ({
              ...prev,
              [student._id]: {
                ...prev[student._id],
                remarks: e.target.value,
              },
            }))
          }
        />
      </td>
    </tr>
  ))}
</tbody>


          </table>

          <div className="flex justify-center gap-4 mt-6">
  <button
    onClick={handleSave}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    Save
  </button>
  <button
    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
  >
    Cancel
  </button>
</div>

        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
