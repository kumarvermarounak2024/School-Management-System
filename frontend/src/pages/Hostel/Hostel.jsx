import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import HostelMaster from "./HostelMaster";
import HostelCategory from "./HostelCategory";
import HostelRoom from "./HostelRoom";
import AllocationRoom from "./AllocationList";
import HostelMasterAndList from "./HostelMasterAndList";
const moduleComponents = {
  "Hostel Master": <HostelMasterAndList />,
  "Hostel Category ": <HostelCategory />,
  "Hostel Room": <HostelRoom />,
  "Allocation List": <AllocationRoom />,
  // "Hostel Master": <HostelMaster/>,
  // "Hostel Category ":<HostelCategory/>,
  // "Hostel Room": <HostelRoom/>,
  // "Room Allocation": <AllocationRoom/>
};

const receptionModules = Object.keys(moduleComponents);

const Hostel = () => {
  const [selectedModule, setSelectedModule] = useState("Student List");
  const navigate = useNavigate();

  return (
    <div className="pt-4">
      <div className="p-4 flex flex-wrap justify-between space-y-2 md:space-y-0 md:space-x-4">
        {receptionModules.map((mod, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedModule(mod)}
            className={`px-4 py-2 w-full md:flex-1 text-black  rounded font-semibold transition duration-200 ease-in-out ${
              selectedModule === mod
                ? "bg-[#143781] text-white "
                : "bg-[#D5DDFF] text-black bg-opacity-60 hover:bg-opacity-80"
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* 📄 Selected Module Content */}
      <div>
        {selectedModule && (
          <div className="p-4">{moduleComponents[selectedModule]}</div>
        )}
      </div>
    </div>
  );
};

export default Hostel;
