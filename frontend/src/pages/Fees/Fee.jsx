import React, { useState } from "react";

import FeeGroup from "./FeeGroup";
import FeeType from "./FeeType";
import FineSetup from "./FineSetup";
import InvoiceManager from "./InvoiceManager";
import FeeAllocation from "./FeeAllocation";
import FeePay from "./FeePay";
import FeeDue from "./FeeDue";
import FeeReminder from "./FeeReminder";

const moduleComponents = {
  "Fees Type": <FeeType />,
  "Fees Group": <FeeGroup />,
  "Fine Setup": <FineSetup />,
  "Fees Pay/Invoice": ["FeePay", "Invoice"], // Submodules
  "Fees Allocation": <FeeAllocation />,
  "Fees Due": <FeeDue />,
  "Fees FeeReminder": <FeeReminder />,
};

const subModuleComponents = {
  Invoice: <InvoiceManager />,
  FeePay: <FeePay />,
};

const Fee = () => {
  const [activeModule, setActiveModule] = useState("Fees Type");
  const [selectedSubModule, setSelectedSubModule] = useState("FeePay");

  const handleModuleClick = (mod) => {
    setActiveModule(mod);
    setSelectedSubModule(null); // reset submodule
  };

  const handleSubModuleClick = (sub) => {
    setSelectedSubModule(sub);
  };

  return (
    <div className="p-4">
      {/* Main Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
        {Object.keys(moduleComponents).map((mod) => (
          <button
            key={mod}
            onClick={() => handleModuleClick(mod)}
            className={`w-full px-4 py-2 text-center rounded font-semibold transition duration-200 ${
              activeModule === mod
                ? "bg-[#143781] text-white"
                : "bg-[#d5ddff] text-black hover:bg-opacity-80"
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Submodules */}
      {activeModule &&
        Array.isArray(moduleComponents[activeModule]) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {moduleComponents[activeModule].map((sub) => (
              <button
                key={sub}
                onClick={() => handleSubModuleClick(sub)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedSubModule === sub
                    ? "bg-[#143781] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

      {/* Selected Component */}
      <div className="p-4 bg-white rounded-md shadow">
        {/* If module has submodules, render selected submodule */}
        {Array.isArray(moduleComponents[activeModule]) ? (
          selectedSubModule ? (
            subModuleComponents[selectedSubModule] || (
              <p className="text-gray-600">
                Component not found for this submodule.
              </p>
            )
          ) : (
            <p className="text-gray-500">Please select a submodule.</p>
          )
        ) : (
          // Otherwise render the module component directly
          moduleComponents[activeModule]
        )}
      </div>
    </div>
  );
};

export default Fee;
