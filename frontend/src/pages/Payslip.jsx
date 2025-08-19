import React from "react";

const PaySlip = ({ employee }) => {
  if (!employee) {
    return (
      <div className="p-6 text-center text-gray-500">
        No payslip data to display.
      </div>
    );
  }

  const totalAllowances = employee?.allowances?.reduce(
    (sum, allowance) => sum + (Number(allowance?.amount) || 0),
    0
  );

  const totalDeductions = employee?.deductions?.reduce(
    (sum, deduction) => sum + (Number(deduction?.amount) || 0),
    0
  );

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#143781]">
        Salary Pay Slip
      </h2>

      <div className="mb-6 border-b pb-4">
        <h3 className="font-semibold text-lg mb-2">Employee Details</h3>
        <p>
          <strong>Name:</strong> {employee?.name}
        </p>
        <p>
          <strong>Staff ID:</strong> {employee?.staffId || "-"}
        </p>
        <p>
          <strong>Designation:</strong>{" "}
          {employee?.designation?.name || employee?.role || "-"}
        </p>
        <p>
          <strong>Department:</strong> {employee?.department?.name || "-"}
        </p>
        <p>
          <strong>Salary Grade:</strong>{" "}
          {employee?.salaryGrade?.salaryGrade || "-"}
        </p>
      </div>

      <div className="mb-6 border-b pb-4">
        <h3 className="font-semibold text-lg mb-2">Salary Details</h3>
        <p>
          <strong>Basic Salary:</strong>{" "}
          {employee?.basicSalary?.toLocaleString() || "0"}
        </p>
        <p>
          <strong>Total Allowances:</strong> {totalAllowances?.toLocaleString()}
        </p>
        <p>
          <strong>Total Deductions:</strong> {totalDeductions?.toLocaleString()}
        </p>
        <p className="font-semibold text-lg mt-2">
          Net Salary: {employee?.netSalary?.toLocaleString() || "0"}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Payment Status</h3>
        <p>
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              employee?.status === "Paid"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {employee?.status}
          </span>
        </p>
        {employee?.paymentDate && (
          <p className="text-sm text-gray-500 mt-1">
            Paid On: {new Date(employee?.paymentDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaySlip;
