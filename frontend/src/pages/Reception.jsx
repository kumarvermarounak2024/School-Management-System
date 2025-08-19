import React, { useState } from 'react';
import AdmissionEnquiry from './AdmissionEnquiry';
import PostalRecord from './PostalRecord';
import VisitorRecord from './VisitorRecord';
import Complaints from './Complaints';
import Configration from './Configuration';
import ReceptionDashboard from './ReceptionDashboard';

const moduleComponents = {
  'Reception Dashboard': <ReceptionDashboard />,
  'Admission Enquiry': <AdmissionEnquiry />,
  'Postal Record': <PostalRecord />,
  'Visitor Log': <VisitorRecord />,
  'Complaints': <Complaints />,
  'Configuration': <Configration />
};

const receptionModules = Object.keys(moduleComponents);

const Reception = () => {
  // 👇 Default module is 'Reception Dashboard'
  const [selectedModule, setSelectedModule] = useState('Reception Dashboard');

  return (
    <div className="pt-4">
      <div className="p-4 flex flex-wrap justify-between space-y-2 md:space-y-0 md:space-x-4">
        {receptionModules.map((mod, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedModule(mod)}
            className={`px-4 py-2 w-full md:flex-1 text-black rounded font-semibold transition duration-200 ease-in-out ${
              selectedModule === mod
                ? 'bg-[#143781] text-white'
                : 'bg-[#D5DDFF] text-black bg-opacity-60 hover:bg-opacity-80'
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* 📄 Selected Module Content */}
      <div className="p-4">
        {moduleComponents[selectedModule]}
      </div>
    </div>
  );
};

export default Reception;
