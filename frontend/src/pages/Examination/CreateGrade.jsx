import React, { useState } from "react";

const CreateGrade = () => {
  const [formData, setFormData] = useState({
    name: "",
    point: "",
    minPercentage: "",
    maxPercentage: "",
    remark: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add API submission logic here
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-blue-200 mb-8">
        <div className="flex space-x-6">
          <button className="py-2 px-4 text-sm border-b-2 border-blue-800 text-blue-800 font-semibold">
            ✏️ Create Grade
          </button>
          <button className="py-2 px-4 text-sm border-b-2 border-transparent hover:border-blue-800">
            ☰ Grade List
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#f6f8fc] max-w-2xl mx-auto p-6 rounded-md shadow-sm space-y-6"
      >
        {/* Grade Name */}
        <div className="flex items-center">
          <label className="w-48 font-medium text-gray-700">Grade Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="flex-1 border rounded px-4 py-2"
          />
        </div>

        {/* Grade Point */}
        <div className="flex items-center">
          <label className="w-48 font-medium text-gray-700">
            Grade Point <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="point"
            value={formData.point}
            onChange={handleChange}
            className="flex-1 border rounded px-4 py-2"
            required
          />
        </div>

        {/* Minimum Percentage */}
        <div className="flex items-center">
          <label className="w-48 font-medium text-gray-700">
            Minimum Percentage <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="minPercentage"
            value={formData.minPercentage}
            onChange={handleChange}
            className="flex-1 border rounded px-4 py-2"
            required
          />
        </div>

        {/* Maximum Percentage */}
        <div className="flex items-center">
          <label className="w-48 font-medium text-gray-700">
            Maximum Percentage <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="maxPercentage"
            value={formData.maxPercentage}
            onChange={handleChange}
            className="flex-1 border rounded px-4 py-2"
            required
          />
        </div>

        {/* Remark */}
        <div className="flex items-start">
          <label className="w-48 font-medium text-gray-700 pt-2">Remark</label>
          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            rows={3}
            className="flex-1 border rounded px-4 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 pt-4">
          <button
            type="submit"
            className="bg-blue-900 text-white px-8 py-2 rounded font-semibold hover:bg-blue-800"
          >
            Save
          </button>
          <button
            type="button"
            className="border border-blue-900 text-blue-900 px-8 py-2 rounded font-semibold hover:bg-blue-50"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGrade;
