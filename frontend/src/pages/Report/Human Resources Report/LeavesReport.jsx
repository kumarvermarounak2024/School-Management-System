import React, { useState } from 'react';
import { FaSearch, FaPrint } from 'react-icons/fa';

const LeavesReport = () => {
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');

  const data = [
    {
      sl: 1,
      role: 'Teacher',
      applicant: 'op-c300082b',
      category: 'Annual',
      start: '17-June-2025',
      end: '18-June-2025',
      days: 1,
      applyDate: '15-June-2025',
      status: 'Accepted',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Role & Date Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-semibold text-sm mb-1">Role <span className="text-red-500">*</span></label>
            <select
              className="w-full border border-gray-400 rounded px-4 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1">Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              className="w-full border border-gray-400 rounded px-4 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Show Button */}
        <div className="flex justify-center mb-6">
          <button className="bg-[#10069F] hover:bg-[#0a0473] text-white px-6 py-2 rounded-lg">
            Show
          </button>
        </div>

        {/* Leaves List Section */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg text-[#10069F] mb-4">🗂 Leaves List</h3>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-3">
              <button className="text-gray-500 hover:text-black">
                <FaPrint className="text-xl" />
              </button>
              <button className="text-sm border px-4 py-2 rounded shadow bg-white">Generate</button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center border rounded px-2 py-1 w-64">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search Here..."
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="border px-4 py-2">SL</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Applicant</th>
                  <th className="border px-4 py-2">Leave Category</th>
                  <th className="border px-4 py-2">Date of Start</th>
                  <th className="border px-4 py-2">Date of End</th>
                  <th className="border px-4 py-2">Days</th>
                  <th className="border px-4 py-2">Apply Date</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.sl} className="text-center bg-white hover:bg-gray-50">
                    <td className="border px-4 py-2">{item.sl}</td>
                    <td className="border px-4 py-2">{item.role}</td>
                    <td className="border px-4 py-2">{item.applicant}</td>
                    <td className="border px-4 py-2">{item.category}</td>
                    <td className="border px-4 py-2">{item.start}</td>
                    <td className="border px-4 py-2">{item.end}</td>
                    <td className="border px-4 py-2">{item.days}</td>
                    <td className="border px-4 py-2">{item.applyDate}</td>
                    <td className="border px-4 py-2 text-green-600 font-semibold">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cancel Button */}
          <div className="flex justify-center mt-6">
            <button className="border border-indigo-700 text-indigo-700 px-6 py-2 rounded hover:bg-indigo-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavesReport;
