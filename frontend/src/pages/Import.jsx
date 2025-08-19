import React, { useState } from "react";

const Import = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  return (
    <div>
      {/* Header */}
      <div className="border-b border-orange-300 pb-2 mb-4 flex items-center gap-2">
      </div>

      {/* Download Button */}
      <div className="text-right mb-4">
        <button className="bg-[#03834B] hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md shadow">
          Download Sample files
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-white border border-gray-300 rounded-xl shadow p-4 mb-6">
        <p className="text-sm font-bold mb-2 text-gray-700">Instructions:</p>
        <ol className="list-decimal pl-4 text-sm space-y-1 text-gray-700 font-medium">
          <li>Download the first sample file.</li>
          <li>Open the downloaded 'csv' file and carefully fill the details of the student.</li>
          <li>
            The date format in "Birthday" and "AdmissionDate" should be Y-m-d (2025-05-06)            </li>
          <li>Do not import duplicate "Roll Number" and "Register No".</li>
          <li>For student "Gender", use values: Male, Female.</li>
          <li>
            If "Automatically Generate login details" is enabled, leave "username" and "password" blank            </li>
          <li>
            Enter Category ID (from Category page) for the "Category" column            </li>
          <li>
            To use the same parent for multiple students, enter "GuardianUsername" and leave other guardian fields blank            </li>
        </ol>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-300 rounded-xl shadow p-4">
        <div className="grid gap-5">
          {/* Class Dropdown */}
          <div className="flex items-center gap-4">
            <label className="w-36 text-sm font-medium text-gray-700">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-60 border border-gray-400 rounded-md px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Class</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
            </select>
          </div>

          {/* Section Dropdown */}
          <div className="flex items-center gap-4">
            <label className="w-36 text-sm font-medium text-gray-700">
              Section <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-60 border border-gray-400 rounded-md px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>

          {/* CSV File Input */}
          <div className="flex items-center gap-4">
            <label className="w-36 text-sm font-medium text-gray-700">
              Select CSV File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files[0])}
              className="w-60 border border-gray-400 rounded-md px-3 py-2 shadow-sm bg-white focus:outline-none"
            />
          </div>

          {/* Import Button */}
          <div className="pt-4 text-center">
            <button className="bg-[#03834B] hover:bg-green-700 text-white font-medium px-8 py-2 rounded-md shadow text-lg">
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Import;
