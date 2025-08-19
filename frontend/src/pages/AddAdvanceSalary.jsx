import React, { useState, useEffect } from "react";
import axios from "axios";

const AddAdvanceSalary = () => {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    applicantName: "",
    designation: "",
    department: "",
    amount: "",
    reason: "",
    date: "",
  });
const [applicants, setApplicants] = useState([]);

  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState(null);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const designationRes = await axios.get(
        `${apiUrl}/designation/get`
      );
      setDesignations(designationRes.data);

      const departmentRes = await axios.get(
        `${apiUrl}/department/get`
      );
      setDepartments(departmentRes.data);

      const applicants = await axios.get(
        `${apiUrl}/staff/get`
      );
      console.log("emp",applicants.data )
      setApplicants(applicants.data.employees);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);


  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${apiUrl}/advancesalary/create`,
        formData
      );
      console.log("Submitted:", response.data);
      alert("Advance Salary submitted successfully!");

      // Reset form
      setFormData({
        applicantName: "",
        designation: "",
        department: "",
        amount: "",
        reason: "",
        date: "",
      });
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      alert("Submission failed!");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Applicant Name */}
        <div className="flex items-center gap-x-1">
  <label className="w-1/5 font-medium text-sm" htmlFor="applicantName">
    Applicant Name <span className="text-red-500">*</span>
  </label>
  <select
    id="applicantName"
    name="applicantName"
    value={formData.applicantName}
    onChange={handleChange}
    className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
    required
  >
    <option value="">Select applicant</option>
    {applicants.length > 0 ? (
      applicants.map((applicant) => (
        <option key={applicant._id} value={applicant._id}>
          {applicant.name}
        </option>
      ))
    ) : (
      <option disabled>No applicants found</option>
    )}
  </select>
</div>

        {/* Designation Dropdown */}
        <div className="flex items-center gap-x-1">
          <label className="w-1/5 font-medium text-sm" htmlFor="designation">
            Designation <span className="text-red-500">*</span>
          </label>
          <select
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
            required
          >
            <option value="">Select designation</option>
            {designations.length > 0 ? (
              designations.map((des) => (
                <option key={des._id} value={des._id}>
                  {des.name}
                </option>
              ))
            ) : (
              <option disabled>No designations found</option>
            )}
          </select>
        </div>

        {/* Department Dropdown */}
        <div className="flex items-center gap-x-1">
          <label className="w-1/5 font-medium text-sm" htmlFor="department">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
            required
          >
            <option value="">Select department</option>
            {departments.length > 0 ? (
              departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))
            ) : (
              <option disabled>No departments found</option>
            )}
          </select>
        </div>

        {/* Amount */}
        <div className="flex items-center gap-x-1">
          <label className="w-1/5 font-medium text-sm" htmlFor="amount">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
            placeholder="Enter amount"
            required
          />
        </div>

        {/* Reason */}
        <div className="flex items-start gap-x-1">
          <label className="w-1/5 font-medium text-sm pt-3" htmlFor="reason">
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
            placeholder="Enter reason"
            required
          ></textarea>
        </div>

        {/* Date */}
        <div className="flex items-center gap-x-1">
          <label className="w-1/5 font-medium text-sm" htmlFor="date">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-center">
          <button
            type="submit"
            className="bg-[#143781] hover:bg-[#0f296a] text-white px-8 py-2 rounded-md font-semibold transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdvanceSalary;
