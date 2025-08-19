// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const EmployeeIdCardPreview = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const employees = state?.generatedData || [];
//   const template = state?.template || "Unknown Template";

//   console.log("Received State:", state);

//   if (!employees || employees.length === 0) {
//     return (
//       <div className="p-6 text-center">
//         <p>No employee data available.</p>
//         <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">🪪 Generated Employee ID Cards</h1>
//       <div className="grid md:grid-cols-2 gap-6">
//        {employees.map((emp) => (
//   <div key={emp._id} className="border border-gray-400 rounded p-4 shadow-md bg-white">
//     <p><strong>Name:</strong> {emp.name || "N/A"}</p>
//     <p><strong>Mobile:</strong> {emp.mobile || "N/A"}</p>
//     <p><strong>Role:</strong> {emp.role || "N/A"}</p>
//     <p><strong>Department:</strong> {emp.department?.name || "N/A"}</p>
//     <p><strong>Designation:</strong> {emp.designation?.name || "N/A"}</p>
//     <p><strong>Template Used:</strong> {template}</p>
//   </div>
// ))}

//       </div>
//     </div>
//   );
// };

// export default EmployeeIdCardPreview;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Trophy } from "lucide-react";

const EmployeeIdCardPreview = () => {
      const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const { state } = useLocation();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [template, setTemplate] = useState("Unknown Template");


  const userData = async (id) => {
    console.log("dkdkdk")
    try {

      const response = await axios.get(`${apiUrl}/employeeIDCard/get/${id}`)
      console.log(response, "tsddkdj")
    } catch (error) {
      console.log(error, "error while fetching the user data")
    }
  }

  useEffect(() => {


    console.log(state?.employees?._id, "get id ")
    const id = state?.employees?._id

    console.log(id, "ddjdjdjdjd")

    if (id) {
      userData(id);
    } else {
      setEmployees(state?.generatedData || []);
      setTemplate(state?.template || "Unknown");
    }
  }, [state]);

  if (!employees.length) {
    return (
      <div className="p-6 text-center">
        <p>No employee data available.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🪪 Generated Employee ID Cards</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {employees.map((emp) => (
          <div key={emp._id} className="border border-gray-400 rounded p-4 shadow-md bg-white">
            <p><strong>Name:</strong> {emp.name || "N/A"}</p>
            <p><strong>Mobile:</strong> {emp.mobile || "N/A"}</p>
            <p><strong>Role:</strong> {emp.role || "N/A"}</p>
            <p><strong>Department:</strong> {emp.department?.name || "N/A"}</p>
            <p><strong>Designation:</strong> {emp.designation?.name || "N/A"}</p>
            <p><strong>Template Used:</strong> {template}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeIdCardPreview;

