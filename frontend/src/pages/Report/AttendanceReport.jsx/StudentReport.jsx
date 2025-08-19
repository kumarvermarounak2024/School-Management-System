import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";


const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const daysInMonth = 30;
const month = 5; // June (0-indexed)
const year = 2025;

// Create calendar headers with weekend marking
const generateMonthDays = () => {
  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return {
      day: weekdays[date.getDay()],
      date: String(i + 1).padStart(2, "0"),
      isWeekend: date.getDay() === 0,
    };
  });
};

const statusColors = {
  W: "bg-red-300 text-black",
  P: "bg-green-100 text-green-800",
  A: "bg-red-100 text-red-800",
  L: "bg-yellow-100 text-yellow-800",
  H: "bg-blue-100 text-blue-800",
  HD: "bg-purple-100 text-purple-800",
};

const monthDays = generateMonthDays();

// Sample student data
const students = [
  {
    name: "John Doe",
    attendance: monthDays.map((d, i) => (d.isWeekend ? "W" : "P")),
  },
  {
    name: "Jane Smith",
    attendance: monthDays.map((d, i) => (d.isWeekend ? "W" : (i % 5 === 0 ? "A" : "P"))),
  },
];

export default function StudentReport() {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    fetchClasses();
    fetchSections();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/class/getAll`);
      setClassList(res.data.classes || []);
    } catch (err) {
      toast.error("Failed to fetch classes");
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get(`${apiUrl}/section/getAll`);
      setSectionList(res.data.sections || []);
    } catch (err) {
      toast.error("Failed to fetch sections");
    }
  };

  // Helper to get all days in selected month
  const getMonthDays = () => {
    if (!selectedMonth) return [];
    const [year, month] = selectedMonth.split("-").map(Number);
    const days = new Date(year, month, 0).getDate();
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(year, month - 1, i + 1);
      return {
        day: weekdays[date.getDay()],
        date: String(i + 1).padStart(2, "0"),
        full: `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
        isWeekend: date.getDay() === 0,
      };
    });
  };
  const monthDays = getMonthDays();

  // Fetch and filter attendance data
  const handleShow = async () => {
    try {
      const res = await axios.get(`${apiUrl}/reports/Attendance/report`);
      const apiData = res.data.data || [];
      setAttendanceData(apiData);
      // Filter by class, section, and month
      const filtered = apiData.filter((student) => {
        const classMatch = selectedClass ? student.class === selectedClass : true;
        const sectionMatch = selectedSection ? student.section === selectedSection : true;
        return classMatch && sectionMatch;
      });
      setFilteredStudents(filtered);
    } catch (err) {
      toast.error("Failed to fetch attendance report");
    }
  };

  // Map status string to color classes
  const statusColorMap = {
    Present: "bg-green-100 text-green-800",
    Absent: "bg-red-100 text-red-800",
    Late: "bg-yellow-100 text-yellow-800",
    Holiday: "bg-blue-100 text-blue-800",
    "Half Day": "bg-purple-100 text-purple-800",
    W: "bg-red-300 text-black",
    P: "bg-green-100 text-green-800",
    A: "bg-red-100 text-red-800",
    L: "bg-yellow-100 text-yellow-800",
    H: "bg-blue-100 text-blue-800",
    HD: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="p-4 md:p-8 bg-[#f4f6fd] min-h-screen">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold">Class </label>
          <select
            className="w-full p-2 border rounded"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classList.map(cls => (
              <option key={cls._id} value={cls.Name}>{cls.Name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">Section </label>
          <select
            className="w-full p-2 border rounded"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="">Select Section</option>
            {sectionList.map(sec => (
              <option key={sec._id} value={sec.Name}>{sec.Name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">Month</label>
          <input
            type="month"
            className="w-full p-2 border rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>
      {/* Show Button */}
      <div className="text-center mb-10">
        <button className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-700" onClick={handleShow}>
          Show
        </button>
      </div>
      {/* Attendance Report Header */}
      <div className="flex items-center mb-10">
        <div className="flex-grow border-t border-blue-800"></div>
        <div className="mx-4 text-blue-800 font-semibold whitespace-nowrap">▭ Attendance Report</div>
        <div className="flex-grow border-t border-blue-800"></div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-sm mb-10">
        <div className="flex items-center gap-1 border px-2 py-1 rounded bg-white shadow-sm">
          <span>Weekends:</span> <span className="font-bold">W</span>
        </div>
        <div className="flex items-center gap-1 border px-2 py-1 rounded bg-green-100 shadow-sm">
          <span>Present:</span> <span className="text-green-600 font-bold">P</span>
        </div>
        <div className="flex items-center gap-1 border px-2 py-1 rounded bg-red-100 shadow-sm">
          <span>Absent:</span> <span className="text-red-600 font-bold">A</span>
        </div>
        <div className="flex items-center gap-1 border px-2 py-1 rounded bg-blue-100 shadow-sm">
          <span>Holiday:</span> <span className="text-blue-500 font-bold">H</span>
        </div>
        <div className="flex items-center gap-1 border px-2 py-1 rounded bg-yellow-100 shadow-sm">
          <span>Late:</span> <span className="text-yellow-500 font-bold">L</span>
        </div>
        <div className="flex items-center gap-1 border px-2 py-1 rounded bg-purple-100 shadow-sm">
          <span>Half Day:</span> <span className="text-purple-600 font-bold">HD</span>
        </div>
      </div>
      {/* Search */}
      <div className="flex justify-end mb-4">
        <div className="relative w-full md:w-1/3">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search Student..."
            className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          // Add search logic if needed
          />
        </div>
      </div>
      {/* Attendance Table */}
      <div className="overflow-x-auto border rounded mt-10">
        {/* Header Row */}
        <div className="flex w-full">
          <div className="min-w-[150px] border-r border-gray-300 bg-white text-sm font-semibold text-center py-2">
            Student Name
          </div>
          <div className={`grid w-full text-xs`}
            style={{ gridTemplateColumns: `repeat(${monthDays.length}, minmax(40px, 1fr))` }}>
            {monthDays.map((d, idx) => (
              <div
                key={idx}
                className={`text-center border border-gray-300 p-1 ${d.isWeekend ? "bg-red-300 font-semibold" : ""}`}
              >
                <div>{d.day}</div>
                <div>{d.date}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Data Rows */}
        {filteredStudents.map((student, index) => (
          <div key={index} className="flex w-full border-t border-gray-200">
            <div className="min-w-[150px] border-r border-gray-300 bg-white text-sm text-center py-2">
              {student.studentName}
            </div>
            <div className={`grid w-full text-xs`}
              style={{ gridTemplateColumns: `repeat(${monthDays.length}, minmax(40px, 1fr))` }}>
              {monthDays.map((d, idx) => {
                const status = student.dailyStatus[d.full] || "";
                return (
                  <div
                    key={idx}
                    className={`border border-gray-200 text-center py-1 ${statusColorMap[status] || ""}`}
                  >
                    {status ? status[0] : ""}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {/* Cancel Button */}
      <div className="text-center mt-20">
        <button className="border border-blue-800 text-blue-800 px-6 py-2 rounded hover:bg-blue-50">
          Cancel
        </button>
      </div>
    </div>
  );
}
