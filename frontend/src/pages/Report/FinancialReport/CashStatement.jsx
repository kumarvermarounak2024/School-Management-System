import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import enGB from "date-fns/locale/en-GB";
registerLocale("en-GB", enGB);

const CashStatement = () => {
  const [startDate, setStartDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState("");

  // Helper function to get dates based on selection
  const handleRangeChange = (e) => {
    const value = e.target.value;
    setSelectedRange(value);

    const today = new Date();
    let newDate = null;

    switch (value) {
      case "today":
        newDate = today;
        break;
      case "yesterday":
        newDate = new Date(today);
        newDate.setDate(today.getDate() - 1);
        break;
      case "last7days":
        newDate = new Date(today);
        newDate.setDate(today.getDate() - 7);
        break;
      case "last30days":
        newDate = new Date(today);
        newDate.setDate(today.getDate() - 30);
        break;
      case "lastMonth":
        // Set to the first day of last month
        newDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        break;
      case "lastYear":
        newDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        break;
      default:
        newDate = null;
    }

    setStartDate(newDate);
  };

  const leftEntries = [
    { particular: "To Balance B/d", amount: 10000 },
    { particular: "To Fees Receipt", amount: 7000 },
  ];

  const rightEntries = [
    { particular: "To Balance B/d", amount: 5000 },
    { particular: "To Fees Receipt", amount: 12000 },
  ];

  const totalLeft = leftEntries.reduce((sum, item) => sum + item.amount, 0);
  const totalRight = rightEntries.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Dropdown for predefined date ranges */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Select Date Range
        </label>
        <select
          value={selectedRange}
          onChange={handleRangeChange}
          className="w-60 border rounded px-4 py-2 outline-none bg-white"
        >
          <option value="">Select Range</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="lastMonth">Last Month</option>
          <option value="lastYear">This Year</option>
          <option value="lastYear">Last Year</option>
          <option value="lastYear">Custom Range</option>
        </select>
      </div>

      {/* DatePicker */}
      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Date <span className="text-red-500">*</span>
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            setSelectedRange("");
          }}
          locale="en-GB"
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/yyyy"
          showPopperArrow={false}
          className="w-60 border rounded px-4 py-2 outline-none"
          isClearable
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
        />
      </div>

      <div className="overflow-auto border border-black">
        <table className="min-w-full border border-black text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-4 py-2">Date</th>
              <th className="border border-black px-4 py-2">Particular</th>
              <th className="border border-black px-4 py-2">Amount</th>
              <th className="border border-black px-4 py-2">Date</th>
              <th className="border border-black px-4 py-2">Particular</th>
              <th className="border border-black px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-4 py-2"></td>
              <td className="border border-black px-4 py-2 font-semibold">
                {leftEntries.map((entry, idx) => (
                  <div key={idx} className="mb-1">{entry.particular}</div>
                ))}
              </td>
              <td className="border border-black px-4 py-2 font-semibold">
                {leftEntries.map((entry, idx) => (
                  <div key={idx} className="mb-1">{entry.amount.toLocaleString()}</div>
                ))}
              </td>
              <td className="border border-black px-4 py-2"></td>
              <td className="border border-black px-4 py-2 font-semibold">
                {rightEntries.map((entry, idx) => (
                  <div key={idx} className="mb-1">{entry.particular}</div>
                ))}
              </td>
              <td className="border border-black px-4 py-2 font-semibold">
                {rightEntries.map((entry, idx) => (
                  <div key={idx} className="mb-1">{entry.amount.toLocaleString()}</div>
                ))}
              </td>
            </tr>
            <tr className="font-bold text-right">
              <td colSpan="2" className="border border-black px-4 py-2 text-right">Total</td>
              <td className="border border-black px-4 py-2">{totalLeft.toLocaleString()}</td>
              <td colSpan="2" className="border border-black px-4 py-2 text-right">Total</td>
              <td className="border border-black px-4 py-2">{totalRight.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <button className="border border-blue-500 text-blue-600 px-6 py-2 rounded hover:bg-blue-100 transition">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CashStatement;
