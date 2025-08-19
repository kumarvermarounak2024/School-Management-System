import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeAttendance = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [selectedRoll, setSelectedRoll] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [staffRole, setStaffRole] = useState([]);
const [allStaffData, setAllStaffData] = useState([]);

  // Fetch unique roles
  const getAllStaff = async () => {
    try {
      const res = await axios.get(`${apiUrl}/staff/get`);
      console.log("staff",res.data)
      const allEmployees = res.data.employees || [];
      const allRoles = allEmployees.map((emp) => emp.role);
      const uniqueRoles = [...new Set(allRoles)];
      setStaffRole(uniqueRoles);
          setAllStaffData(allEmployees); // 👈 store all for lookup

    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  // Fetch attendance list by role
  const handleShow = async () => {
    if (selectedRoll && selectedDate) {
      try {
        const res = await axios.get(`${apiUrl}/employeeattendances/list`, {
          params: { role: selectedRoll },
        });
      console.log("employeeattendance",res)
        if (res.data.success) {
          // Initialize status and remarks per employee
          const employeesWithStatus = res.data.employees.map((emp) => {
    const fullEmp = allStaffData.find((s) => s._id === emp._id); // 👈 match by ID
    return {
      ...emp,
      profilePicture: fullEmp?.profilePicture || "",
      status: "",
      remarks: "",
    };
  });
          setAttendanceData(employeesWithStatus);
          setShowTable(true);
        } else {
          alert("No data found for this role");
          setAttendanceData([]);
          setShowTable(false);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        alert("Failed to fetch data");
      }
    } else {
      alert("Please select Role and Date");
    }
  };

  // Handle radio status change
  const handleStatusChange = (employeeId, status) => {
    setAttendanceData((prev) =>
      prev.map((emp) =>
        emp._id === employeeId ? { ...emp, status } : emp
      )
    );
  };

  // Handle remarks change
  const handleRemarksChange = (employeeId, remarks) => {
    setAttendanceData((prev) =>
      prev.map((emp) =>
        emp._id === employeeId ? { ...emp, remarks } : emp
      )
    );
  };

  // Save attendance POST request
  const handleSave = async () => {
    // Validate that all employees have status set
    for (const emp of attendanceData) {
      if (!emp.status) {
        alert(`Please select status for ${emp.name}`);
        return;
      }
    }

    const payload = {
      role: selectedRoll,
      date: selectedDate,
      attendances: attendanceData.map(({ _id, status, remarks }) => ({
        employeeId: _id,
        status,
        remarks,
      })),
    };

    try {
      const res = await axios.post(
        `${apiUrl}/employeeattendances/create`,
        payload
      );
      if (res.data.success) {
        alert("Attendance saved successfully!");
        // Optionally reset or keep data as is
      } else {
        alert("Failed to save attendance");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Error occurred while saving attendance");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Filters */}
      <div className="bg-gray-100 shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Role Dropdown */}
        <div>
          <label className="block text-m font-medium text-gray-700">Role*</label>
          <select
            value={selectedRoll}
            onChange={(e) => setSelectedRoll(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
          >
            <option value="">Select Role</option>
            {staffRole.map((role, idx) => (
              <option key={idx} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-m font-medium text-gray-700">Date *</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
          />
        </div>

        {/* Show Button */}
        <div className="flex items-end">
          <button
            onClick={handleShow}
            className="bg-[#143781] text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            Show
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      {showTable && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 border">SL</th>
                <th className="px-4 py-2 border">Photo</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">StaffId</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((emp, idx) => (
                  <tr key={emp._id} className="text-center">
                    <td className="border px-4 py-2">{idx + 1}</td>
                    <td className="border px-4 py-2">
                      <img
                        src={emp.profilePicture || "https://via.placeholder.com/40"}
                        alt={emp.name}
                        className="h-10 w-10 rounded-full mx-auto"
                      />
                    </td>
                    <td className="border px-4 py-2">{emp.name}</td>
                    <td className="border px-4 py-2">{emp.staffId}</td>
                    <td className="border px-4 py-2">
                      <div className="flex justify-center gap-4">
                        {["Present", "Absent", "Late", "Half Day"].map(
                          (status) => (
                            <label key={status}>
                              <input
                                type="radio"
                                name={`status_${emp._id}`}
                                className="mr-1"
                                checked={emp.status === status}
                                onChange={() =>
                                  handleStatusChange(emp._id, status)
                                }
                              />
                              {status}
                            </label>
                          )
                        )}
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-2 py-1"
                        placeholder="Enter remarks"
                        value={emp.remarks}
                        onChange={(e) =>
                          handleRemarksChange(emp._id, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setShowTable(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendance;
