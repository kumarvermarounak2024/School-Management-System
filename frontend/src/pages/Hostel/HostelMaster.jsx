import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HostelMaster = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    Hostel_Name: '',
    Hostel_Address: '',
    Remarks: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Hostel_Name, Hostel_Address } = formData;

    if (!Hostel_Name || !Hostel_Address) {
      toast.warn("Hostel Name and Address are required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/hostel/create`, formData);
      toast.success("Hostel created successfully");
      setFormData({ Hostel_Name: '', Hostel_Address: '', Remarks: '' });
    } catch (err) {
      toast.error("Failed to save hostel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-4 mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-medium mb-1">
              Hostel Name <span className="text-red-500">*</span>
            </label>
            <input
              name="Hostel_Name"
              value={formData.Hostel_Name}
              onChange={handleInputChange}
              className="w-1/2 border p-2 rounded"
              placeholder="Enter hostel name"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Hostel Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="Hostel_Address"
              value={formData.Hostel_Address}
              onChange={handleInputChange}
              rows="3"
              className="w-1/2 border p-2 rounded"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Remarks</label>
            <textarea
              name="Remarks"
              value={formData.Remarks}
              onChange={handleInputChange}
              rows="2"
              className="w-1/2 border p-2 rounded"
              placeholder="Enter remarks"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelMaster;
