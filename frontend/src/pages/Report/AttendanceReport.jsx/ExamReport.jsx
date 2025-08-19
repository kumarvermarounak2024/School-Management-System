import React, { useState } from "react";
import { Search } from "lucide-react";

export default function ExamReport() {
  const [filters, setFilters] = useState({
    exam: "",
    class: "class 10",
    section: "Section A",
    subject: "",
    student: "",
  });

  const handleChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div className="bg-[#f4f6fd] min-h-screen p-6 md:p-10 text-sm">
      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        <div>
          <label className="block mb-1 text-[#0d1b82] font-medium">Exam <span className="text-red-500">*</span></label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={filters.exam}
            onChange={(e) => handleChange("exam", e.target.value)}
          >
            <option value="">Select</option>
            <option value="Mid-Term">Mid-Term</option>
            <option value="Final">Final</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-[#0d1b82] font-medium">Class <span className="text-red-500">*</span></label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={filters.class}
            onChange={(e) => handleChange("class", e.target.value)}
          >
            <option value="class 10">class 10</option>
            <option value="class 9">class 9</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-[#0d1b82] font-medium">Section <span className="text-red-500">*</span></label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={filters.section}
            onChange={(e) => handleChange("section", e.target.value)}
          >
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-[#0d1b82] font-medium">Subject <span className="text-red-500">*</span></label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={filters.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
          >
            <option value="">Select</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-[#0d1b82] font-medium">Student Name <span className="text-red-500">*</span></label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={filters.student}
            onChange={(e) => handleChange("student", e.target.value)}
          >
            <option value="">Select</option>
            <option value="Ravi">Ravi</option>
            <option value="Anjali">Anjali</option>
          </select>
        </div>
        <div className="flex items-end justify-center md:justify-start mt-2">
          <button className="bg-[#0d1b82] text-white px-6 py-2 rounded hover:bg-[#0b166e]">
            Show
          </button>
        </div>
      </div>

      {/* Report Title */}
      <div className="border-t border-[#0d1b82] relative mb-10">
        <span className="absolute -top-3 left-3 bg-[#eef0f9] px-2 text-[#0d1b82] font-semibold text-sm">
          ▭ Attendance Report
        </span>
      </div>

      {/* Tools and Search */}
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div className="flex gap-2 text-[#0d1b82]">
          <button className="border rounded p-2 text-xl">📄</button>
          <button className="border rounded p-2 text-xl">🖨️</button>
        </div>
        <div className="relative w-full md:w-1/4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search Here..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Report Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-center text-sm border-collapse border-gray-400 mb-10">
          <thead className="bg-[#d3d9f2] text-[#0d1b82]">
            <tr>
              <th className="border border-gray-400 px-2 py-2">SL</th>
              <th className="border border-gray-400 px-2 py-2">Name</th>
              <th className="border border-gray-400 px-2 py-2">Register No.</th>
              <th className="border border-gray-400 px-2 py-2">Roll No.</th>
              <th className="border border-gray-400 px-2 py-2">Subject</th>
              <th className="border border-gray-400 px-2 py-2">Remarks</th>
              <th className="border border-gray-400 px-2 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="border px-2 py-2">1</td>
              <td className="border px-2 py-2"></td>
              <td className="border px-2 py-2"></td>
              <td className="border px-2 py-2"></td>
              <td className="border px-2 py-2"></td>
              <td className="border px-2 py-2"></td>
              <td className="border px-2 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cancel Button */}
      <div className="text-center mt-10">
        <button className="border border-[#0d1b82] text-[#0d1b82] px-8 py-2 rounded hover:bg-[#dce0fa]">
          Cancel
        </button>
      </div>
    </div>
  );
}
