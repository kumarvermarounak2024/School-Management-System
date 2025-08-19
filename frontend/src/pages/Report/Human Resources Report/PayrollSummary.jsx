import React, { useState } from 'react';
import { FaSearch, FaPrint, FaFilePdf, FaEye } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const PayrollSummary = () => {
  const [date, setDate] = useState('');
const navigate = useNavigate();

  const payrollData = [
    {
      name: 'Shyam',
      designation: 'Teacher',
      salary: 25000,
      allowance: 1000,
      deduction: 6500,
      netSalary: 19500,
      payVia: 'Cash',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        {/* Date Filter */}
        <div className="mb-6">
          <label className="block font-semibold text-sm mb-1">Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            className="w-full border border-gray-400 rounded px-4 py-2"
            placeholder="dd/mm/yyyy"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Show Button */}
        <div className="flex justify-center mb-6">
          <button className="bg-[#10069F] hover:bg-[#0a0473] text-white px-6 py-2 rounded-lg">
            Show
          </button>
        </div>

        {/* Payroll Summary Section */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg text-[#10069F] mb-4">🗂 Payroll Summary</h3>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-3 text-gray-600">
              <FaFilePdf className="text-xl cursor-pointer hover:text-black" />
              <FaPrint className="text-xl cursor-pointer hover:text-black" />
            </div>
            <button className="text-sm border px-4 py-2 rounded shadow bg-white">Generate</button>
          </div>

          {/* Search */}
          <div className="flex items-center border rounded px-2 py-1 w-64 mb-4">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search Here..."
              className="w-full outline-none"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-indigo-100 text-center">
                <tr>
                  <th className="border px-3 py-2"><input type="checkbox" /></th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Designation</th>
                  <th className="border px-3 py-2">Salary</th>
                  <th className="border px-3 py-2">Allowance (+)</th>
                  <th className="border px-3 py-2">Deduction (-)</th>
                  <th className="border px-3 py-2">Net Salary</th>
                  <th className="border px-3 py-2">Pay Via</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((item, index) => (
                  <tr key={index} className="text-center bg-white hover:bg-gray-50">
                    <td className="border px-3 py-2"><input type="checkbox" /></td>
                    <td className="border px-3 py-2">{item.name}</td>
                    <td className="border px-3 py-2">{item.designation}</td>
                    <td className="border px-3 py-2">Rs. {item.salary.toFixed(2)}</td>
                    <td className="border px-3 py-2">Rs. {item.allowance.toFixed(2)}</td>
                    <td className="border px-3 py-2">Rs. {item.deduction.toFixed(2)}</td>
                    <td className="border px-3 py-2">Rs. {item.netSalary.toFixed(2)}</td>
                    <td className="border px-3 py-2">{item.payVia}</td>
                    <td className="border px-3 py-2">
                   <button
  onClick={() =>
  navigate(`/viewpayslip/${index}`, {
    state: {
      fromModule: 'HR Report',
      fromSubmodule: 'Payroll Summary'
    }
  })
} // or item._id if available
  className="flex items-center justify-center space-x-1 text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded"
>
  <FaEye className="text-sm" />
  <span className="text-sm">View Payslip</span>
</button>

                    </td>
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

export default PayrollSummary;
