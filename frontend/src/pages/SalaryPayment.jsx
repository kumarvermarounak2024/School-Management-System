import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaySlip from "./Payslip";
import { useNavigate } from "react-router-dom";
const SalaryPayment = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
const navigate = useNavigate()
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [month, setMonth] = useState("");
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [paidSalary, setPaidSalary] = useState([]);
  useEffect(() => {
    fetchInitialData();
    fetchPaidSalaryThisMonths();
  }, [navigate]);

  const fetchPaidSalaryThisMonths = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/salarypayment/salary-payments`
      );
      if (response?.status === 200) {
        setPaidSalary(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);

      // Fetch assigned salaries
      const assignedSalariesResponse = await axios.get(
        `${apiUrl}/salaryassign/getAllAssign`
      );

      if (assignedSalariesResponse?.data?.success) {
        const assignmentsData = assignedSalariesResponse?.data?.data || [];
        // Process assignments to get employee data with salary info
        const allEmployees = assignmentsData
          .filter((assignment) => assignment?.employeeId && assignment?.gradeId)
          .map((assignment) => {
            const employee = assignment?.employeeId;
            const gradeDetails = assignment?.gradeId;

            const assignedAllowancesTotal = (
              gradeDetails?.allowances || []
            )?.reduce((sum, al) => sum + (Number(al.amount) || 0), 0);

            const assignedDeductionsTotal = (
              gradeDetails?.deductions || []
            )?.reduce((sum, de) => sum + (Number(de?.amount) || 0), 0);

            const basicSalary = Number(gradeDetails?.basicSalary) || 0;
            const netSalary =
              Number(gradeDetails?.finalSalary) ||
              basicSalary + assignedAllowancesTotal - assignedDeductionsTotal;

            return {
              _id: employee?._id,
              name: employee?.name,
              staffId: employee?.staffId,
              role: employee?.role,
              department: employee?.department,
              designation: employee?.designation,
              email: employee?.email,
              mobile: employee?.mobile,
              basicSalary: basicSalary,
              assignedBasicSalary: basicSalary,
              allowances: gradeDetails?.allowances || [],
              deductions: gradeDetails?.deductions || [],
              netSalary: netSalary,
              overtimeRate: gradeDetails?.overtimeRate || 0,
              salaryGrade: gradeDetails,
              assignmentId: assignment?._id,
              assignedAt: assignment?.assignedAt,
              status: "",
            };
          });
        // Get unique roles and departments for filters
        const uniqueRoles = [
          ...new Set(allEmployees?.map((emp) => emp?.role)?.filter(Boolean)),
        ];
        const uniqueDepartments = [
          ...new Set(
            allEmployees?.map((emp) => emp.department?.name)?.filter(Boolean)
          ),
        ];

        setRoles(uniqueRoles);
        setDepartments(uniqueDepartments);
        setEmployees(allEmployees);

        // Set current month as default
        const currentMonth = new Date().toISOString().slice(0, 7);
        setMonth(currentMonth);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load employee salary data");
      setIsLoading(false);
    }
  };

  const fetchSalaryPayments = async () => {
    if (!month) return;

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${apiUrl}/salarypayment/salary-payments?month=${month}`
      );
      if (response?.data && response?.data?.success) {
        const paidSalaries = response.data.data || [];

        // Update employee status based on payment records
        setEmployees((prevEmployees) =>
          prevEmployees?.map((emp) => {
            const paymentRecord = paidSalaries?.find(
              (payment) => payment?.employeeId?._id === emp?._id
            );

            return {
              ...emp,
              status: paymentRecord ? "Paid" : "Unpaid",
              paymentId: paymentRecord?._id,
              paymentDate: paymentRecord?.createdAt, // use `createdAt` as payment date
            };
          })
        );

        // Extract available months from payment records
        const monthsWithPayments = [
          ...new Set(paidSalaries.map((payment) => payment.month)),
        ];
        setAvailableMonths(monthsWithPayments);
      }
    } catch (error) {
      console.error("Error fetching salary payments:", error);
      toast.error("Failed to load payment records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryPayments();
  }, [month]);

  const handlePaySalary = async (employeeId, salaryGrade, salaryassignId) => {
    try {
      const employee = employees?.find((emp) => emp?._id === employeeId);
      if (!employee) {
        toast.warning("Employee not found");
        return;
      }

      const paymentData = {
        employeeId,
        salaryassignId,
        salaryGrade,
        month,
        amount: employee.netSalary,
        status: true,
      };

      const response = await axios.post(
        `${apiUrl}/salarypayment/salary-payments`,
        paymentData
      );
      if (response?.status === 201) {
        toast.success(`Salary paid successfully for ${employee.name}!`);
      }

      // Update local state
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp._id === employeeId
            ? { ...emp, status: "Paid", paymentDate: paymentData.paymentDate }
            : emp
        )
      );
    } catch (error) {
      console.error("Error paying salary:");
      if (!error.response?.data?.success) {
        toast.error("Salary already paid for this month");
      }
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesRole = !role || emp.role === role;
    const matchesDepartment =
      !department || emp.department?.name === department;
    const matchesSearch =
      !search ||
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.staffId?.toLowerCase().includes(search.toLowerCase());

    return matchesRole && matchesDepartment && matchesSearch;
  });
  const handlePaySlip = (employee) => {
 
    setSelectedEmployee(employee);
  };

  const closePaySlip = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="border-b-2 border-[#1f2b6c] mb-4 flex items-center gap-4">
        <span className="text-lg font-semibold flex items-center gap-2 text-[#1f2b6c]">
          <span className="text-2xl">💰</span> Salary Payment
        </span>
      </div>

      <div className="border-b-2 border-[#1f2b6c] pb-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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
            {roles.map((roleOption, index) => (
              <option key={index} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2 rounded border focus:outline-none"
          >
            <option value="">All Departments</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Month
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full p-2 rounded border focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            className="p-2 rounded border focus:outline-none"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm font-medium">Rows Per Page</span>
        </div>

        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or staff ID..."
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
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#dbe3fc] text-[#1f2b6c] font-semibold">
              <tr>
                <th className="p-3 border">SL</th>
                <th className="p-3 border">Staff ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Designation</th>
                <th className="p-3 border">Department</th>
                <th className="p-3 border">Salary Grade</th>
                <th className="p-3 border">Basic Salary</th>
                <th className="p-3 border">Allowances</th>
                <th className="p-3 border">Deductions</th>
                <th className="p-3 border">Net Salary</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.slice(0, rowsPerPage).map((emp, index) => {
                const totalAllowances = emp.allowances.reduce(
                  (sum, allowance) => sum + (Number(allowance.amount) || 0),
                  0
                );
                const totalDeductions = emp.deductions.reduce(
                  (sum, deduction) => sum + (Number(deduction.amount) || 0),
                  0
                );

                return (
                  <tr key={emp._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{emp.staffId || "-"}</td>
                    <td className="p-3 border">{emp.name}</td>
                    <td className="p-3 border">
                      {emp.designation?.name || emp.role || "-"}
                    </td>
                    <td className="p-3 border">
                      {emp.department?.name || "-"}
                    </td>
                    <td className="p-3 border">
                      {emp?.salaryGrade?.salaryGrade || "-"}
                    </td>
                    <td className="p-3 border">
                      {emp.basicSalary?.toLocaleString() || "0"}
                    </td>
                    <td className="p-3 border">
                      {totalAllowances.toLocaleString()}
                    </td>
                    <td className="p-3 border">
                      {totalDeductions.toLocaleString()}
                    </td>
                    <td className="p-3 border font-semibold">
                      {emp.netSalary?.toLocaleString() || "0"}
                    </td>
                    <td className="p-3 border">
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          emp.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {emp.status}
                      </div>
                      {emp.paymentDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(emp.paymentDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="p-3 border">
                      <div className="flex flex-col gap-2">
                        <button
                          className={`px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition ${
                            emp.status === "Paid"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => {
                            if (emp.status !== "Paid")
                              handlePaySalary(
                                emp._id,
                                emp?.salaryGrade?._id,
                                emp?.assignmentId
                              );
                          }}
                          disabled={emp.status === "Paid"}
                        >
                          Pay Now
                        </button>

                        <button
                          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                          onClick={() => handlePaySlip(emp)}
                        >
                          Pay Slip
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="12" className="text-center p-4 text-gray-500">
                    No employees found with salary assignments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 max-w-3xl w-full relative">
            <button
              onClick={closePaySlip}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>
            <PaySlip employee={selectedEmployee} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryPayment;
