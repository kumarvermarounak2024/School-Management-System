import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalaryAssign = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [role, setRole] = useState("");
  const [designation, setDesignation] = useState("");
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [salaryGrades, setSalaryGrades] = useState([]);
  const [employeeGrades, setEmployeeGrades] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const staffResponse = await axios.get(`${apiUrl}/staff/get`);
        const employeeData = staffResponse.data.employees;
        setEmployees(employeeData);

        const uniqueRoles = [...new Set(employeeData.map((emp) => emp.role))];
        setRoles(uniqueRoles);

        const uniqueDesignations = [
          ...new Set(
            employeeData.map((emp) => emp.designation?.name).filter(Boolean)
          ),
        ];
        setDesignations(uniqueDesignations);

        const gradesResponse = await axios.get(`${apiUrl}/payroll/getAll`);
        const gradesData = gradesResponse.data.map((grade) => ({
          id: grade._id,
          gradeName: grade.salaryGrade,
          basicSalary: grade.basicSalary,
          allowances: grade.allowances,
          deductions: grade.deductions,
          fullData: grade,
        }));
        setSalaryGrades(gradesData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTotalSalary = (grade) => {
    if (!grade) return 0;
    const totalAllowances =
      grade.allowances?.reduce(
        (sum, allowance) => sum + (allowance.amount || 0),
        0
      ) || 0;
    const totalDeductions =
      grade.deductions?.reduce(
        (sum, deduction) => sum + (deduction.amount || 0),
        0
      ) || 0;
    return (grade.basicSalary || 0) + totalAllowances - totalDeductions;
  };

  const handleGradeChange = (employeeId, gradeId) => {
    setEmployeeGrades((prev) => ({
      ...prev,
      [employeeId]: gradeId,
    }));
  };

  const handleSave = async () => {
    try {
      const assignments = Object.entries(employeeGrades)
        .filter(([_, gradeId]) => gradeId)
        .map(([employeeId, gradeId]) => ({
          employeeId,
          gradeId,
        }));
      if (assignments.length === 0) {
        toast.warning("No salary assignments to save");
        return;
      }

      await axios.post(`${apiUrl}/salaryassign/assign`, { assignments });
      toast.success("Salary assignments saved successfully!");
    } catch (error) {
      console.error("Error saving salary assignments:", error);
      toast.error("Failed to save salary assignments");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesRole = !role || emp.role === role;
    const matchesDesignation =
      !designation || emp.designation?.name === designation;
    const matchesSearch =
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id?.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesDesignation && matchesSearch;
  });

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="border-b-2 border-[#1f2b6c] pb-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 rounded border focus:outline-none"
          >
            <option value="">All Roles</option>
            {roles.map((r, index) => (
              <option key={index} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Designation
          </label>
          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full p-2 rounded border focus:outline-none"
          >
            <option value="">All Designations</option>
            {designations.map((d, index) => (
              <option key={index} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-b-2 border-[#1f2b6c] mb-4 flex items-center gap-4">
        <span className="text-lg font-semibold flex items-center gap-2 text-[#1f2b6c]">
          <span className="text-2xl">👥</span> Employee Salary Assign
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <div className="text-sm font-medium">Showing 5 per page</div>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or ID..."
            className="w-full p-2 pl-10 rounded border focus:outline-none"
          />
          <span className="absolute left-3 top-2.5 text-lg text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1f2b6c]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-[#dbe3fc] text-[#1f2b6c] font-semibold">
              <tr>
                <th className="p-3 border">SL</th>
                <th className="p-3 border">Staff ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Designation</th>
                <th className="p-3 border">Department</th>
                <th className="p-3 border">Salary Grade</th>
                <th className="p-3 border">Total Salary</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((emp, index) => {
                const selectedGrade = salaryGrades.find(
                  (grade) => grade.id === employeeGrades[emp._id]
                );
                const totalSalary = selectedGrade
                  ? calculateTotalSalary(selectedGrade)
                  : null;

                return (
                  <tr key={emp._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 border">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="p-3 border">{emp.staffId}</td>
                    <td className="p-3 border">{emp.name}</td>
                    <td className="p-3 border">
                      {emp.designation?.name || "-"}
                    </td>
                    <td className="p-3 border">
                      {emp.department?.name || "-"}
                    </td>
                    <td className="p-3 border">
                      <select
                        className="p-1 rounded border focus:outline-none w-full"
                        value={employeeGrades[emp._id] || ""}
                        onChange={(e) =>
                          handleGradeChange(emp._id, e.target.value)
                        }
                      >
                        <option value="">Select Grade</option>
                        {salaryGrades.map((grade) => (
                          <option key={grade.id} value={grade.id}>
                            {grade.gradeName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 border">
                      {totalSalary ? totalSalary.toLocaleString() : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < totalPages ? prev + 1 : prev
            )
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          className="bg-[#143781] text-white px-6 py-2 rounded mt-4"
          onClick={handleSave}
          disabled={Object.keys(employeeGrades).length === 0}
        >
          Save Assignments
        </button>
      </div>
    </div>
  );
};

export default SalaryAssign;
