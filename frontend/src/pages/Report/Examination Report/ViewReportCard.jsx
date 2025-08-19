import React from "react";
 // replace with actual image path or use placeholder
import { useNavigate, useLocation, useParams } from "react-router-dom";

const ViewReportCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // agar use kar rahe ho to
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
    <div className="min-h-screen bg-[#f5f7fc] p-6 text-sm">
       <button onClick={handleBack} className="...">
        ← Back to Report card
      </button>
      <div className="bg-white border border-gray-400 rounded-md p-4">
        {/* Header Section */}
        <div className="grid grid-cols-4 gap-4 border-b border-gray-400 pb-4">
          <div className="col-span-3 grid grid-cols-2 gap-2">
            <div>
              <p><span className="font-semibold">Name:</span> Sarika Tiwari</p>
              <p><span className="font-semibold">Father Name:</span> Shyamlal</p>
              <p><span className="font-semibold">Mother Name:</span> Geeta</p>
            </div>
            <div>
              <p><span className="font-semibold">Register No.:</span> RSM-0057</p>
              <p><span className="font-semibold">Admission Date:</span> 18-June-2025</p>
              <p><span className="font-semibold">Class:</span> Class 2 (Section A)</p>
            </div>
            <div>
              <p><span className="font-semibold">Roll Number:</span> 106</p>
              <p><span className="font-semibold">Date Of Birth:</span> 27-Feb-2000</p>
              <p><span className="font-semibold">Gender:</span> Female</p>
            </div>
          </div>
          <div className="flex justify-end">
            <img src='' alt="student" className="h-24 w-24 rounded object-cover border" />
          </div>
        </div>

        {/* Subjects Table */}
        <table className="w-full text-center border mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Subjects</th>
              <th className="border px-4 py-2">Maximum Marks</th>
              <th className="border px-4 py-2">Marks Obtained</th>
            </tr>
          </thead>
          <tbody>
            {['English', 'Maths', 'Hindi', 'SST', 'Science'].map(subject => (
              <tr key={subject}>
                <td className="border px-4 py-2">{subject}</td>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2"></td>
              </tr>
            ))}
            <tr>
              <td className="border px-4 py-2 font-semibold">GRAND TOTAL :</td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2"></td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">GRAND TOTAL IN WORDS :</td>
              <td className="border px-4 py-2" colSpan={2}></td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Percentage</td>
              <td className="border px-4 py-2" colSpan={2}></td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Result</td>
              <td className="border px-4 py-2" colSpan={2}></td>
            </tr>
          </tbody>
        </table>

        {/* Attendance Section */}
        <div className="border border-t-0 border-gray-400 mt-4">
          <h3 className="text-center font-semibold py-2 border-b border-gray-400">Attendance</h3>
          <table className="w-full text-left">
            <tbody>
              <tr>
                <td className="border px-4 py-2 w-1/2">No. Of Days</td>
                <td className="border px-4 py-2">0</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">No. Of Days Attended</td>
                <td className="border px-4 py-2">0</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Attendance Percentage</td>
                <td className="border px-4 py-2">0.00%</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Remark</td>
                <td className="border px-4 py-2">Improve Your Handwriting</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-4 text-center mt-4 text-sm border-t pt-4 border-gray-300">
          <p><span className="font-semibold">Print Date :</span> 18-June-2025</p>
          <p className="font-semibold">Principal Signature</p>
          <p className="font-semibold">Class Teacher Signature</p>
          <p className="font-semibold">Parents Signature</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button className="border px-6 py-2 rounded text-indigo-600 border-indigo-600 hover:bg-indigo-50">
            Cancel
          </button>
          <button className="flex items-center border px-4 py-2 rounded bg-white hover:bg-gray-100">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5a.5.5 0 0 0-.5.5V10h-1v1h7v-1h-1V5.5a.5.5 0 0 0-.5-.5h-4zM6 6h4v4H6V6z"/>
              <path fillRule="evenodd" d="M1 2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2zm1 0a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2z"/>
            </svg>
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewReportCard;
