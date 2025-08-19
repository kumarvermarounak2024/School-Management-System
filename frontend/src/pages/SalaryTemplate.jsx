import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import axios from "axios";
import TemplateList from "../components/TemplateList";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SalaryTemplate() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [activeTab, setActiveTab] = useState("createTemplate");
  const [formData, setFormData] = useState({
    salaryGrade: "",
    basicSalary: "",
    overtimeRate: "",
  });
  const [allowances, setAllowances] = useState([
    { id: 1, name: "", amount: "" },
  ]);
  const [deductions, setDeductions] = useState([
    { id: 1, name: "", amount: "" },
  ]);
  const [loading, setLoading] = useState(false);

  const addAllowanceRow = () => {
    setAllowances([
      ...allowances,
      { id: allowances.length + 1, name: "", amount: "" },
    ]);
  };

  const addDeductionRow = () => {
    setDeductions([
      ...deductions,
      { id: deductions.length + 1, name: "", amount: "" },
    ]);
  };

  const handleAllowanceChange = (index, field, value) => {
    const newAllowances = [...allowances];
    newAllowances[index][field] = value;
    setAllowances(newAllowances);
  };

  const handleDeductionChange = (index, field, value) => {
    const newDeductions = [...deductions];
    newDeductions[index][field] = value;
    setDeductions(newDeductions);
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const validAllowances = allowances
        .filter((a) => a.name && a.amount)
        .map(({ name, amount }) => ({ name, amount: Number(amount) }));

      const validDeductions = deductions
        .filter((d) => d.name && d.amount)
        .map(({ name, amount }) => ({ name, amount: Number(amount) }));

      const baseSalary = Number(formData.basicSalary);
      const totalAllowances = validAllowances.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      const totalDeductions = validDeductions.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      const finalSalary = baseSalary + totalAllowances - totalDeductions;

      const payload = {
        salaryGrade: formData.salaryGrade,
        basicSalary: baseSalary,
        overtimeRate: Number(formData.overtimeRate),
        allowances: validAllowances,
        deductions: validDeductions,
        finalSalary,
      };

      const response = await axios.post(
        `${apiUrl}/payroll/create`,
        payload
      );

      // Check if the response itself is okay and contains data
      if (response && response.data) {
        if (response.data.success) {
          setFormData({
            salaryGrade: "",
            basicSalary: "",
            overtimeRate: "",
          });
          setAllowances([{ id: 1, name: "", amount: "" }]);
          setDeductions([{ id: 1, name: "", amount: "" }]);
          toast.success("Salary template created successfully!");           setActiveTab("templateList"); // This should navigate to template list
        } else {
          // API indicated failure
          const errorMessage =
            response.data.message ||
            "Failed to create salary template. Please try again.";
          toast.success(errorMessage);
          console.error("API Error:", response.data);
        }
      } else {
        // No response.data or unexpected response structure
        toast.error("Received an unexpected response from the server.");
        console.error("Unexpected server response:", response);
      }
    } catch (error) {
      console.error("Error creating salary template:", error);
      // Handle axios error (network error, server error status codes like 500, 400 etc.)
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <ToastContainer />
      {/* Tabs */}
      <div className="border-b border-[#595A8C] flex space-x-6 mb-6 text-sm select-none">
        <button
          className={`flex items-center space-x-1 pb-2 font-semibold ${
            activeTab === "templateList"
              ? "text-[#143781] border-b-2 border-[#143781]"
              : "text-gray-500 hover:text-[#143781]"
          }`}
          onClick={() => setActiveTab("templateList")}
        >
          <FaList className="w-4 h-4" />
          <span>Template List</span>
        </button>
        <button
          className={`flex items-center space-x-1 pb-2 font-semibold ${
            activeTab === "createTemplate"
              ? "text-[#143781] border-b-2 border-[#143781]"
              : "text-gray-500 hover:text-[#143781]"
          }`}
          onClick={() => setActiveTab("createTemplate")}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke={activeTab === "createTemplate" ? "#143781" : "gray"}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          <span>Create Template</span>
        </button>
      </div>

      {/* Template List */}
      {activeTab === "templateList" && <TemplateList />}

      {/* Create Template Form */}
      {activeTab === "createTemplate" && (
        <div>
          <div className="grid grid-col-1 md:grid-cols-3 gap-6 max-w-5xl mb-6">
            <div>
              <label className="block font-semibold mb-1" htmlFor="salaryGrade">
                Salary Grade <span className="text-red-500">*</span>
              </label>
              <input
                id="salaryGrade"
                placeholder="Grade Name Here"
                className="border border-[#B6C5E7] rounded-md p-3 w-full text-sm placeholder:text-[#8A9BB5]"
                type="text"
                value={formData.salaryGrade}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="basicSalary">
                Basic Salary <span className="text-red-500">*</span>
              </label>
              <input
                id="basicSalary"
                placeholder="Basic Salary Here"
                className="border border-[#B6C5E7] rounded-md p-3 w-full text-sm placeholder:text-[#8A9BB5]"
                type="number"
                value={formData.basicSalary}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label
                className="block font-semibold mb-1"
                htmlFor="overtimeRate"
              >
                Overtime Rate (Per Hour)
              </label>
              <input
                id="overtimeRate"
                placeholder="Overtime Rate Here"
                className="border border-[#B6C5E7] rounded-md p-3 w-full text-sm placeholder:text-[#8A9BB5]"
                type="number"
                value={formData.overtimeRate}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            {/* Allowance Section */}
            <section className="border border-[#B6C5E7] rounded-md bg-white p-5">
              <h3 className="flex items-center font-semibold mb-4 text-sm text-[#333] select-none">
                Allowance
              </h3>
              {allowances.map((a, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 text-sm mb-4"
                >
                  <input
                    placeholder="Name Of Allowance"
                    className="border border-[#B6C5E7] rounded-md p-3 text-sm placeholder:text-[#8A9BB5]"
                    type="text"
                    value={a.name}
                    onChange={(e) =>
                      handleAllowanceChange(index, "name", e.target.value)
                    }
                  />
                  <input
                    placeholder="Amount"
                    className="border border-[#B6C5E7] rounded-md p-3 text-sm placeholder:text-[#8A9BB5]"
                    type="number"
                    value={a.amount}
                    onChange={(e) =>
                      handleAllowanceChange(index, "amount", e.target.value)
                    }
                  />
                </div>
              ))}
              <button
                onClick={addAllowanceRow}
                type="button"
                className="flex items-center space-x-2 bg-white text-black font-semibold rounded-md border border-gray-400 px-4 py-2 hover:bg-gray-100 transition select-none"
              >
                <span className="text-lg font-extrabold">+</span>
                <span>Add Rows</span>
              </button>
            </section>

            {/* Deduction Section */}
            <section className="border border-[#B6C5E7] rounded-md bg-white p-5">
              <h3 className="flex items-center font-semibold mb-4 text-sm text-[#333] select-none">
                Deduction
              </h3>
              {deductions.map((d, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 text-sm mb-4"
                >
                  <input
                    placeholder="Name Of Deduction"
                    className="border border-[#B6C5E7] rounded-md p-3 text-sm placeholder:text-[#8A9BB5]"
                    type="text"
                    value={d.name}
                    onChange={(e) =>
                      handleDeductionChange(index, "name", e.target.value)
                    }
                  />
                  <input
                    placeholder="Amount"
                    className="border border-[#B6C5E7] rounded-md p-3 text-sm placeholder:text-[#8A9BB5]"
                    type="number"
                    value={d.amount}
                    onChange={(e) =>
                      handleDeductionChange(index, "amount", e.target.value)
                    }
                  />
                </div>
              ))}
              <button
                onClick={addDeductionRow}
                type="button"
                className="flex items-center space-x-2 bg-white text-black font-semibold rounded-md border border-gray-400 px-4 py-2 hover:bg-gray-100 transition select-none"
              >
                <span className="text-lg font-extrabold">+</span>
                <span>Add Rows</span>
              </button>
            </section>
          </div>

          {/* Save Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#143781] text-white rounded-md px-16 py-3 font-semibold hover:bg-[#0f296a] transition select-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
      
      <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  closeOnClick
  pauseOnHover
  draggable
  theme="light"
/>


    </div>
    
  );
}
