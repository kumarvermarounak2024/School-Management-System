import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const IDCard = React.forwardRef(({ employee }, ref) => {
  return (
    <div ref={ref} className="w-[350px] h-[220px] border rounded-lg shadow-md bg-white p-4 text-sm font-sans">
      <div className="flex items-center space-x-4">
        <img
          src={employee.profilePicture}
          alt="Profile"
          className="w-20 h-20 object-cover rounded-full border"
        />
        <div>
          <h2 className="font-bold text-lg">{employee.name}</h2>
          <p className="text-gray-700">{employee.designation?.name}</p>
          <p className="text-gray-700">{employee.department?.name}</p>
        </div>
      </div>
      <div className="mt-3">
        <p><span className="font-semibold">Staff ID:</span> {employee.staffId}</p>
        <p><span className="font-semibold">Gender:</span> {employee.gender}</p>
        <p><span className="font-semibold">Blood Group:</span> {employee.bloodGroup || 'N/A'}</p>
        <p><span className="font-semibold">Mobile:</span> {employee.mobile}</p>
      </div>
    </div>
  );
});

const EmployeeIdCard = ({ employee }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${employee.name}_ID_Card`,
  });

  return (
    <div className="my-4 space-y-4">
      <div className="hidden">
        <IDCard employee={employee} ref={componentRef} />
      </div>
      <button
        onClick={handlePrint}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
      >
        Generate ID Card
      </button>
    </div>
  );
};

export default EmployeeIdCard;
