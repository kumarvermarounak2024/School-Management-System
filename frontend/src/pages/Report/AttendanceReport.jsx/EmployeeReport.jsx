import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const statusColors = {
  W: "bg-red-300 text-black",
  P: "bg-green-100 text-green-800",
  A: "bg-red-100 text-red-800",
  L: "bg-yellow-100 text-yellow-800",
  H: "bg-blue-100 text-blue-800",
  HD: "bg-purple-100 text-purple-800",
  "-": "",
};

export default function EmployeeReport() {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [designationList, setDesignationList] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    getDesignation();
  }, []);

  const getDesignation = async () => {
    const res = await axios.get(`${apiUrl}/designation/get`);
    setDesignationList(res.data.data || res.data || []);
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
        isWeekend: date.getDay() === 0,
      };
    });
  };
  const monthDays = getMonthDays();

  // Fetch and filter attendance data
  const handleShow = async () => {
    try {
      console.log(selectedRole, "selectedRole");
      console.log(selectedMonth, "selectedMonth");
      const res = await axios.get(`${apiUrl}/reports/Attendance/staff/report?role=${selectedRole}&month=${selectedMonth}`);
      const apiData = res.data.data || [];
      console.log(apiData, "apiData");
      setAttendanceData(apiData);
      // Filter by role and month
      const filtered = apiData.filter((emp) => {
        const roleMatch = selectedRole ? emp.role === selectedRole : true;
        // Optionally filter by month if needed
        return roleMatch;
      });
      setFilteredEmployees(filtered);
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#f4f6fd] min-h-screen">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold">Role </label>
          <select
            className="w-full p-2 border rounded"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select Role</option>
            {designationList.map((d) => (
              <option key={d._id} value={d.name}>{d.name}</option>
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
      {/* Attendance Report Header with horizontal line */}
      <div className="flex items-center mb-10">
        <div className="flex-grow border-t border-blue-800"></div>
        <div className="mx-4 text-blue-800 font-semibold whitespace-nowrap">▭ Attendance Report</div>
        <div className="flex-grow border-t border-blue-800"></div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-sm mb-10">
        {[
          { label: "Weekends", value: "W", bg: "bg-white", text: "font-bold" },
          { label: "Present", value: "P", bg: "bg-green-100", text: "text-green-600" },
          { label: "Absent", value: "A", bg: "bg-red-100", text: "text-red-600" },
          { label: "Holiday", value: "H", bg: "bg-blue-100", text: "text-blue-500" },
          { label: "Late", value: "L", bg: "bg-yellow-100", text: "text-yellow-500" },
          { label: "Half Day", value: "HD", bg: "bg-purple-100", text: "text-purple-600" },
        ].map((item, idx) => (
          <div key={idx} className={`flex items-center gap-1 border px-2 py-1 rounded ${item.bg} shadow-sm`}>
            <span>{item.label}:</span> <span className={`${item.text} font-bold`}>{item.value}</span>
          </div>
        ))}
      </div>
      {/* Search */}
      <div className="flex justify-end mb-4">
        <div className="relative w-full md:w-1/3">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search Employee..."
            className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
      {/* Attendance Table */}
      <div className="overflow-x-auto border rounded mt-10">
        {/* Header Row */}
        <div className="flex w-full">
          <div className="min-w-[150px] border-r border-gray-300 bg-white text-sm font-semibold text-center py-2">
            Employee Name
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
        {filteredEmployees.map((emp, index) => (
          <div key={index} className="flex w-full border-t border-gray-200">
            <div className="min-w-[150px] border-r border-gray-300 bg-white text-sm text-center py-2">
              {emp.employeeName || emp.name}
            </div>
            <div
              className="grid w-full text-xs"
              style={{ gridTemplateColumns: `repeat(${monthDays.length}, minmax(40px, 1fr))` }}
            >
              {monthDays.map((d, idx) => {
                const status = emp.dailyStatus && emp.dailyStatus[idx] ? emp.dailyStatus[idx] : "-";
                return (
                  <div
                    key={idx}
                    className={`border border-gray-200 text-center py-1 ${statusColors[status] || ""}`}
                  >
                    {status !== "-" ? status : ""}
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
