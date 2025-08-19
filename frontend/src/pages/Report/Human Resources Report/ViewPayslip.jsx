import React from "react";
import { useParams, useNavigate ,useLocation} from "react-router-dom";

const ViewPayslip = () => {
    const { id } = useParams(); // get staff index or ID
  const navigate = useNavigate();
  const location = useLocation();
  const { fromModule, fromSubmodule } = location.state || {};

  const handleBack = () => {
    if (fromModule && fromSubmodule) {
      // Send state back to /report
      navigate("/report", {
        state: {
          activeModule: fromModule,
          activeSubmodule: fromSubmodule
        }
      });
    } else {
      navigate("/report"); // fallback
    }
  };
  return (
    <div className="min-h-screen bg-[#f5f7fc] px-6 py-8 text-sm">
        <button onClick={handleBack} className="...">
        ← Back to Payroll
      </button>

      <div className="bg-gray-50 border border-indigo-200 rounded-md p-8">
        {/* Payslip Header */}
        <div className="flex justify-between mb-4">
          <div></div>
          <div className="text-right leading-6">
            <p className="font-semibold">Payslip No. : #0001</p>
            <p>Date : 12-June-2025</p>
            <p>Salary Month : June</p>
          </div>
        </div>

        {/* To / From Section */}
        <div className="flex justify-between mb-4">
          <div className="leading-6">
            <p className="font-semibold">To :</p>
            <p>Shyam</p>
            <p>Department : Teacher</p>
            <p>Designation : Teacher</p>
            <p>Mobile No. : 0987654321</p>
          </div>
          <div className="text-right leading-6">
            <p className="font-semibold">From :</p>
            <p>MPS</p>
            <p>Raja Park</p>
            <p>0987654321</p>
            <p>abcd21@gmail.com</p>
          </div>
        </div>

        {/* Tables for Allowances and Deductions */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Allowances */}
          <div className="border border-gray-400 rounded-md">
            <h3 className="bg-gray-100 text-center font-semibold border-b border-gray-400 py-2">
              Allowances
            </h3>
            <table className="w-full text-center">
              <thead className="border-b border-gray-400">
                <tr>
                  <th className="py-2 border-r border-gray-400">Name Of Allowances</th>
                  <th className="py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 border-r border-gray-400">Salary Allowance</td>
                  <td className="py-2">Rs. 1000.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div className="border border-gray-400 rounded-md">
            <h3 className="bg-gray-100 text-center font-semibold border-b border-gray-400 py-2">
              Deductions
            </h3>
            <table className="w-full text-center">
              <thead className="border-b border-gray-400">
                <tr>
                  <th className="py-2 border-r border-gray-400">Name Of Deductions</th>
                  <th className="py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 border-r border-gray-400">PF</td>
                  <td className="py-2">Rs. 1500.00</td>
                </tr>
                <tr>
                  <td className="py-2 border-r border-gray-400">Advance Salary</td>
                  <td className="py-2">Rs. 5000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Salary Summary */}
        <div className="flex justify-end mb-6">
          <table className="border border-gray-500 text-right w-72 text-sm">
            <tbody>
              <tr>
                <td className="border px-3 py-1 font-semibold">Basic Salary</td>
                <td className="border px-3 py-1">Rs. 25000.00</td>
              </tr>
              <tr>
                <td className="border px-3 py-1 font-semibold">Total Allowance</td>
                <td className="border px-3 py-1">Rs. 1000.00</td>
              </tr>
              <tr>
                <td className="border px-3 py-1 font-semibold">Total Deduction</td>
                <td className="border px-3 py-1">Rs. 6500.00</td>
              </tr>
              <tr>
                <td className="border px-3 py-1 font-semibold">Net Salary</td>
                <td className="border px-3 py-1">
                  Rs. 19500.00
                  <br />
                  <span className="text-xs font-medium">(NINETEEN THOUSAND FIVE HUNDREDS)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <button className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">
            Cancel
          </button>
          <button className="px-6 py-2 bg-white border border-gray-500 hover:bg-gray-100 rounded text-sm">
            🖨 Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPayslip;
