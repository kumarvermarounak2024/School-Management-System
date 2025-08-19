import React, { useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import axios from "axios";

export default function StudentDailyReport() {
  const [date, setDate] = useState("");

  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const [studentAttendance, setStudentAttendance] = useState([]);

  const handleShow = async () => {
    console.log(date, "date");
    try {
      const response = await axios.get(`${apiUrl}/reports/Attendance/attendance/class-report?date=${date}`);
      console.log(response?.data?.data, "response of student attendance");
      setStudentAttendance(response?.data?.data || []);
    } catch (error) {
      console.log(error, "error");
      setStudentAttendance([]);
    }
  };

  return (
    <div className="bg-[#f4f6fd] min-h-screen p-4 md:p-8">
      {/* Date Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-5">
          Date <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="date"
            placeholder="dd/mm/yyyy"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <CalendarDays className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Show Button */}
      <div className="text-center mb-10">
        <button
          className="bg-[#0d1b82] text-white px-6 py-2 rounded hover:bg-[#0b166e]"
          onClick={handleShow}
        >
          Show
        </button>
      </div>

      {/* Attendance Report Title */}
      <div className="border-t border-blue-800 relative mb-10">
        <span className="absolute -top-3 left-3 bg-[#eaebf3] px-2 text-[#0d1b82] font-semibold">
          ▭ Attendance Report
        </span>
      </div>

      {/* Icons and Search */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex gap-3">
          <button className="border rounded p-1 text-[#0d1b82]">📄</button>
          <button className="border rounded p-1 text-[#0d1b82]">🖨️</button>
        </div>
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search Here..."
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Attendance Summary Table */}
      <div className="overflow-x-auto mb-20">
        <table className="w-full text-sm border border-collapse border-gray-400">
          <thead>
            <tr className="bg-[#d3d9f2] text-[#0d1b82]">
              <th className="border border-gray-400 px-3 py-2">SL</th>
              <th className="border border-gray-400 px-3 py-2">Class</th>
              <th className="border border-gray-400 px-3 py-2">Total Students</th>
              <th className="border border-gray-400 px-3 py-2">Total Present</th>
              <th className="border border-gray-400 px-3 py-2">Total Absent</th>
              <th className="border border-gray-400 px-3 py-2">Present (%)</th>
              <th className="border border-gray-400 px-3 py-2">Absent (%)</th>
            </tr>
          </thead>
          <tbody>
            {studentAttendance.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">No data found</td>
              </tr>
            ) : (
              studentAttendance.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-400 px-3 py-2 text-center">{idx + 1}</td>
                  <td className="border border-gray-400 px-3 py-2 text-center">{item.className}</td>
                  <td className="border border-gray-400 px-3 py-2 text-center">{item.totalStudents}</td>
                  <td className="border border-gray-400 px-3 py-2 text-center">{item.totalPresent}</td>
                  <td className="border border-gray-400 px-3 py-2 text-center">{item.totalAbsent}</td>
                  <td className="border border-gray-400 px-3 py-2 text-center">{item.presentPercent}%</td>
                  <td className="border border-gray-400 px-3 py-2 text-center">{item.absentPercent}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cancel Button */}
      <div className="text-center mt-10">
        <button className="border border-[#0d1b82] text-[#0d1b82] px-6 py-2 rounded hover:bg-[#e1e5fa]">
          Cancel
        </button>
      </div>
    </div>
  );
}