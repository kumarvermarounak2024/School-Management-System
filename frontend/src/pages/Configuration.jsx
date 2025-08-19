import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

const Configurations = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [activeTab, setActiveTab] = useState("references");
  const [formValue, setFormValue] = useState("");
  const [data, setData] = useState({
    references: [],
    responses: [],
    callingPurposes: [],
    visitingPurposes: [],
    complaintTypes: [],
  });
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const tabs = [
    { key: "references", label: "References" },
    { key: "responses", label: "Responses" },
    { key: "callingPurposes", label: "Calling Purposes" },
    { key: "visitingPurposes", label: "Visiting Purposes " },
    { key: "complaintTypes", label: "Complaint Types" },
  ];

const endpointMap = {
  references: "references",
  responses: "responses",
  callingPurposes: "calling-purposes",
  visitingPurposes: "visiting-purposes",
  complaintTypes: "complaint-types",
};
useEffect(() => {
  fetchData(activeTab);
}, [activeTab]);


const fetchData = async (type) => {
  try {
    const endpoint = endpointMap[type];
    const res = await axios.get(`${apiUrl}/configuration/${endpoint}`);
    setData((prev) => ({ ...prev, [type]: res.data }));
  } catch (err) {
    setError(`Error fetching data for ${type}`);
    setData((prev) => ({ ...prev, [type]: [] }));
  }
};

const handleAdd = async () => {
  if (!formValue.trim()) {
    setError("Please enter a value");
    return;
  }

  try {
    const endpoint = endpointMap[activeTab];
    const res = await axios.post(`${apiUrl}/configuration/${endpoint}`, {
      name: formValue,
    });

    setData((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], res.data],
    }));

    setFormValue("");
    setError("");
  } catch (err) {
    setError(`Error adding data to ${activeTab}`);
  }
};

const handleUpdate = async (index) => {
  const id = data[activeTab][index]?._id;
  if (!id) return;

  try {
    const endpoint = endpointMap[activeTab];
    const res = await axios.put(`${apiUrl}/configuration/${endpoint}/${id}`, {
      name: editValue,
    });

    const updated = [...data[activeTab]];
    updated[index] = res.data;

    setData((prev) => ({ ...prev, [activeTab]: updated }));
    setEditIndex(null);
    setEditValue("");
    setError("");
  } catch (err) {
    setError(`Error updating data in ${activeTab}`);
  }
};

const handleDelete = async (index) => {
  const id = data[activeTab][index]?._id;
  if (!id) return;

  try {
    const endpoint = endpointMap[activeTab];
    await axios.delete(`${apiUrl}/configuration/${endpoint}/${id}`);

    const updated = [...data[activeTab]];
    updated.splice(index, 1);
    setData((prev) => ({ ...prev, [activeTab]: updated }));
  } catch (err) {
    setError(`Error deleting data from ${activeTab}`);
  }
};


  return (
    <div>
      <div className="border-b border-[#143781] pb-2 mb-4 flex items-center gap-2">
        {/* <Pencil className="text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-700">Configurations</h3> */}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md shadow text-sm font-medium ${
              activeTab === tab.key
                ? "bg-[#D5DDFF] text-[#000] border border-[#143781]"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Add {tabs.find((t) => t.key === activeTab)?.label}
          </h2>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Enter name"
            className="w-full border border-gray-400 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 mb-3"
          />
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#143781] hover:bg-[#364972] text-white font-medium px-4 py-2 rounded-md shadow"
          >
            <PlusCircle className="w-4 h-4" /> Save
          </button>
        </div>

        <div className="bg-white border rounded-xl shadow overflow-x-auto p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            {tabs.find((t) => t.key === activeTab)?.label} List
          </h2>
          <table className="w-full text-left text-sm">
            <thead className="bg-[#D5DDFF]">
              <tr>
                <th className="p-3">Sl</th>
                <th className="p-3">Name</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data[activeTab].map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 capitalize">
                    {editIndex === index ? (
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border border-gray-400 rounded-md px-2 py-1 w-full"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    {editIndex === index ? (
                      <button
                        onClick={() => handleUpdate(index)}
                        className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditIndex(index);
                          setEditValue(item.name);
                        }}
                        className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {data[activeTab].length === 0 && (
                <tr>
                  <td colSpan="3" className="p-3 text-gray-500 italic">
                    No entries found{" "}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Configurations;
