import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageLeaveTable from "./ManageLeaveTable";
import { Eye, Pencil, Trash2 } from 'lucide-react';

const LeaveAdd = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const navigate = useNavigate();
  const location = useLocation();

  // Initialize activeTab based on the current path
  const [activeTab, setActiveTab] = useState(() => {
    return location.pathname === "/manage-leave" ? "list" : "add";
  });

  const [formData, setFormData] = useState({
    applicant: "",
    role: "",
    leaveCategory: "",
    leaveDateStart: "",
    leaveDateEnd: "",
    reason: "",
    attachment: null,
    comments: "",
  });

  const initialFormData = {
    applicant: "",
    role: "",
    leaveCategory: "",
    leaveDateStart: "",
    leaveDateEnd: "",
    reason: "",
    attachment: null,
    comments: "",
  };

  const [applicants, setApplicants] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leaveCategories, setLeaveCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Effect to sync activeTab with URL changes
  useEffect(() => {
    if (location.pathname === "/manage-leave") {
      setActiveTab("list");
    } else {
      setActiveTab("add");
    }
  }, [location.pathname]);

  // Effect to fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true);
        // Fetch staff data for applicants and roles
        const staffResponse = await fetch(
          `${apiUrl}/staff/get`
        );
        if (!staffResponse.ok) {
          throw new Error(`HTTP error! status: ${staffResponse.status}`);
        }
        const staffData = await staffResponse.json();

        if (staffData && Array.isArray(staffData.employees)) {
          const fetchedApplicants = staffData.employees.map(emp => ({
            id: emp._id,
            name: emp.name
          }));
          setApplicants(fetchedApplicants);

          const uniqueDesignations = [];
          const designationMap = new Map();
          staffData.employees.forEach(emp => {
            if (emp.designation && typeof emp.designation === 'object' && emp.designation._id && emp.designation.name) {
              if (!designationMap.has(emp.designation._id)) {
                designationMap.set(emp.designation._id, { id: emp.designation._id, name: emp.designation.name });
                uniqueDesignations.push({ id: emp.designation._id, name: emp.designation.name });
              }
            }
          });
          setRoles(uniqueDesignations); // 'roles' state now holds designations
        } else {
          setApplicants([]);
          setRoles([]);
        }

        // Fetch leave categories
        const categoryResponse = await fetch(
          `${apiUrl}/leavecategory/getAll`
        );
        if (!categoryResponse.ok) {
          throw new Error(`HTTP error! status: ${categoryResponse.status}`);
        }
        const categoryData = await categoryResponse.json();

        // Process leave categories
        if (Array.isArray(categoryData)) { // Assuming categoryData is the array itself based on previous fix
          setLeaveCategories(
            categoryData.map((cat) => ({
              id: cat._id,
              name: cat.categoryName,
            }))
          );
        } else if (categoryData && Array.isArray(categoryData.data)) { // Fallback if it's nested under 'data'
           setLeaveCategories(
            categoryData.data.map((cat) => ({
              id: cat._id,
              name: cat.categoryName,
            }))
          );
        } else {
          setLeaveCategories([]);
        }

      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
        setApplicants([]);
        setRoles([]);
        setLeaveCategories([]);
        toast.error("Failed to load dropdown data", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      if (key === "leaveDateStart") {
        if (value !== null && value !== undefined) {
          dataPayload.append("leaveDateFrom", value);
        }
      } else if (key === "leaveDateEnd") {
        if (value !== null && value !== undefined) {
          dataPayload.append("leaveDateTo", value);
        }
      } else if (key === "attachment") {
        if (value instanceof File) {
          dataPayload.append(key, value, value.name);
        }
      } else if (value !== null && value !== undefined) {
        dataPayload.append(key, value);
      }
    });

    try {
      const response = await fetch(
        `${apiUrl}/leaveadd/create`,
        {
          method: "POST",
          body: dataPayload,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Leave application submitted successfully:", result);

        toast.success("Leave application submitted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setFormData(initialFormData);

        const fileInput = document.getElementById("attachment");
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        let errorResult;
        let errorMessage = `Server error: ${response.status}`;
        try {
          errorResult = await response.json();
          if (errorResult && errorResult.message) {
            errorMessage = errorResult.message;
          } else if (
            typeof errorResult === "string" &&
            errorResult.trim() !== ""
          ) {
            errorMessage = errorResult;
          }
        } catch (jsonError) {
          try {
            const textError = await response.text();
            if (textError && textError.trim() !== "") {
              errorMessage = textError;
            }
          } catch (textParseError) {
            errorMessage = response.statusText || errorMessage;
          }
        }

        toast.error(`Error: ${errorMessage}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Network error submitting form:", error);
      toast.error("A network error occurred while submitting the form.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "list"
              ? "bg-[#143781] text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveTab("list")}
        >
          Manage Leave
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "add"
              ? "bg-[#143781] text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveTab("add")}
        >
          Add Leave
        </button>
      </div>

      {activeTab === "list" && <ManageLeaveTable />}

      {activeTab === "add" && (
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {isLoading ? (
            <div className="text-center py-4">Loading dropdown data...</div>
          ) : (
            <>
              <div className="flex items-center gap-x-1">
                <label
                  className="w-1/5 font-medium text-sm"
                  htmlFor="applicant"
                >
                  Applicant <span className="text-red-500">*</span>
                </label>
                <select
                  id="applicant"
                  name="applicant"
                  value={formData.applicant}
                  onChange={handleChange}
                  className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
                  required
                >
                  <option value="">Select Applicant</option>
                  {applicants.map((applicant) => (
                    <option key={applicant.id} value={applicant.id}>
                      {applicant.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-x-1">
                <label className="w-1/5 font-medium text-sm" htmlFor="role">
                  Designation <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
                  required
                >
                  <option value="">Select Designation</option>
                  {roles.map((designation) => (
                    <option key={designation.id} value={designation.id}>
                      {designation.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-x-1">
                <label
                  className="w-1/5 font-medium text-sm"
                  htmlFor="leaveCategory"
                >
                  Leave Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="leaveCategory"
                  name="leaveCategory"
                  value={formData.leaveCategory}
                  onChange={handleChange}
                  className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
                  required
                >
                  <option value="">Select Category</option>
                  {leaveCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-x-1">
                <label
                  className="w-1/5 font-medium text-sm"
                  htmlFor="leaveDateStart"
                >
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="leaveDateStart"
                  name="leaveDateStart"
                  value={formData.leaveDateStart}
                  onChange={handleChange}
                  className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-x-1">
                <label
                  className="w-1/5 font-medium text-sm"
                  htmlFor="leaveDateEnd"
                >
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="leaveDateEnd"
                  name="leaveDateEnd"
                  value={formData.leaveDateEnd}
                  onChange={handleChange}
                  className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
                  required
                />
              </div>

              <div className="flex items-start gap-x-1">
                <label
                  className="w-1/5 font-medium text-sm pt-3"
                  htmlFor="reason"
                >
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-x-1">
                <label
                  className="w-1/5 font-medium text-sm"
                  htmlFor="attachment"
                >
                  Attachment <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={handleChange}
                  className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-x-1">
                <label className="w-1/5 font-medium text-sm" htmlFor="comments">
                  Comments <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  className="w-1/2 border border-[#B6C5E7] rounded-md p-3 text-sm"
                  required
                />
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="bg-[#143781] hover:bg-[#0f296a] text-white px-8 py-2 rounded-md font-semibold transition"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default LeaveAdd;
