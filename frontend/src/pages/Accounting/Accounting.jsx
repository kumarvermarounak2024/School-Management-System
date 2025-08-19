import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Ledger from './Ledger';
import Payment from './Payment';
import Receipt from './Receipt';

import Journal from './Journal';
import Receipt$PaymentAccount from './Receipt$PaymentAccount';
import Contra from './Contra';

const moduleDescriptions = {
  "Ledger": {
    type: 'component',
    component: <Ledger />
  },
  "Transaction": {
    type: 'submodules',
    submodules: ['Payment', 'Receipt', 'Contra', 'Journal']
  }, "Receipt & Payment Account": {
    type: 'component',
    component: <Receipt$PaymentAccount />
  }
};

const subModuleComponents = {
  Payment: <Payment />,
  Receipt: <Receipt />,
  Contra: <Contra />,
  Journal: <Journal />
};

const Accounting = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [selectedSubModule, setSelectedSubModule] = useState('');
  const navigate = useNavigate();

  const handleModuleClick = (mod) => {
    setActiveModule(mod);
    setSelectedSubModule('');
  };

  const handleSubModuleClick = (sub) => {
    setSelectedSubModule(sub);
  };

  const currentModule = moduleDescriptions[activeModule];

  return (
    <div>
      {/* Main Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.keys(moduleDescriptions).map((mod) => (
          <button
            key={mod}
            onClick={() => handleModuleClick(mod)}
            className={`w-full px-4 py-2 text-center rounded font-bold transition duration-200 ${activeModule === mod
              ? 'bg-[#143781] text-white'
              : 'bg-[#d5ddff] text-black hover:bg-opacity-80'
              }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Submodules (Tabs) */}
      {currentModule?.type === 'submodules' && (
        <div className="flex flex-wrap gap-2 mb-4">
          {currentModule.submodules.map((sub) => (
            <button
              key={sub}
              onClick={() => handleSubModuleClick(sub)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${selectedSubModule === sub
                ? 'bg-[#143781] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Component Rendering */}
      <div className="rounded-md shadow">
        {currentModule?.type === 'component' && currentModule.component}
        {selectedSubModule && currentModule?.type === 'submodules' && (
          subModuleComponents[selectedSubModule] || (
            <p className="text-gray-600">Component not found for this submodule.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Accounting;
