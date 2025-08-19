import React, { useEffect, useState } from "react";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GiveAward = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const [staffList, setStaffList] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studnetData, setStudentData] = useState([]);
  console.log(designations, "designations");

  const [formData, setFormData] = useState({
    role: "",
    winner: "",
    awardName: "",
    giftItem: "",
    cashPrice: "",
    awardReason: "",
    givenDate: "",
  });
  const fetchDesignations = async () => {
    try {
      const res = await axios.get(`${apiUrl}/designation/get`);
      setDesignations(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching designations:", err);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const getAllStaff = async () => {
    try {
      const res = await axios.get(`${apiUrl}/staff/get`);
      console.log("staff response:", res.data);

      const employees = res.data.employees || [];
      setStaffList(employees);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);
  const studentData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/awards/get`);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${apiUrl}/awards/create`, formData);
      toast.success("Award successfully submitted!");
      console.log("Success:", data);

      // Reset form except givenDate
      setFormData({
        role: "",
        winner: "",
        awardName: "",
        giftItem: "",
        cashPrice: "",
        awardReason: "",
        givenDate: formData.givenDate,
      });
    } catch (error) {
      console.error("Error submitting award:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit the award. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gray-50 ">
      {/* Header Navigation */}
      <div className=" mb-6 bg-gray-50  flex space-x-6 text-sm text-[#1f1f1f] font-medium">
        <div className="flex  text-lg items-center space-x-2 border-b-2 border-[#3F45C3] text-[#3F45C3] pb-2">
          <span>🖊️</span>
          <span>Give Award</span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 mx-auto p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select Role</option>
              {designations?.map((role, index) => (
                <option key={index + 1} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Winner */}
          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-1">
              Winner <span className="text-red-500">*</span>
            </label>
            {/* winner name dropdown */}
            <select
              name="winner"
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2"
              value={formData.winner}
              onChange={handleChange}
            >
              <option value="">Select Winner</option>
              {staffList
                ?.filter(
                  (staff) =>
                    staff?.designation?.name?.toLowerCase() ===
                    formData?.role?.toLocaleLowerCase()
                )
                .map((staff) => (
                  <option key={staff._id} value={staff.name}>
                    {staff.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Award Name */}
          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-1">
              Award Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="awardName"
              placeholder="Enter award name"
              value={formData.awardName}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Gift Item */}
          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-1">
              Gift Item <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="giftItem"
              placeholder="Enter gift item"
              value={formData.giftItem}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Cash Price */}
          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-1">
              Cash Price
            </label>
            <input
              type="number"
              name="cashPrice"
              placeholder="Enter cash price"
              value={formData.cashPrice}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Given Date */}
          <div>
            <label className="block text-sm font-medium text-[#1f1f1f] mb-1">
              Given Date
            </label>
            <input
              type="date"
              name="givenDate"
              value={formData.givenDate}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Award Reason - full width */}
        <div>
          <label className="block text-sm font-medium text-[#1f1f1f] mb-1">
            Award Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            name="awardReason"
            value={formData.awardReason}
            onChange={handleChange}
            placeholder="Enter reason"
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 h-24"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-[#6b7abb]" : "bg-[#0C1F6F] hover:bg-[#172d8c]"
            } text-white px-8 py-2 rounded-md`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                role: "",
                winner: "",
                awardName: "",
                giftItem: "",
                cashPrice: "",
                awardReason: "",
                givenDate: formData.givenDate,
              })
            }
            className="border border-[#0C1F6F] text-[#0C1F6F] px-8 py-2 rounded-md hover:bg-[#e6e8f6]"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default GiveAward;
