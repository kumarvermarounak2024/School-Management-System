import React, { useState } from "react";
import { UploadCloud, FileDown } from "lucide-react";

const ImportQuestion = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (!selectedClass || !selectedSubject || !file) {
      alert("Please fill all fields and upload a CSV file.");
      return;
    }

    // Handle actual import logic here
    console.log({ selectedClass, selectedSubject, file });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-[#1e1e1e]">
      {/* Header */}
      <h2 className="text-blue-700 font-semibold mb-4 border-b-2 border-blue-700 inline-block cursor-pointer">
        <FileDown size={16} className="inline mr-2" />
        Download Sample Import File
      </h2>

      {/* Form */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Class */}
        <div>
          <label className="font-semibold text-sm block mb-1">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            <option value="">Select Class</option>
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="font-semibold text-sm block mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            <option value="">Select Subject</option>
            <option value="english">English</option>
            <option value="math">Math</option>
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="font-semibold text-sm block mb-1">
            CSV File <span className="text-red-500">*</span>
          </label>
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
            <UploadCloud className="text-gray-500 mb-2" size={32} />
            <span className="text-sm text-gray-500">
              {file ? file.name : "Drag and drop a file here or click"}
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleImport}
            className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 flex items-center gap-2"
          >
            <UploadCloud size={16} />
            Import
          </button>
          <button className="border border-blue-900 text-blue-900 px-6 py-2 rounded hover:bg-blue-50">
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportQuestion;
