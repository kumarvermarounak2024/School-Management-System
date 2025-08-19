import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SalaryTemplate from './SalaryTemplate';
import SalaryAssign from './SalaryAssign';
import SalaryPayment from './SalaryPayment';
import AddAdvanceSalary from './AddAdvanceSalary';
import ManageAdvanceSalary from './ManageAdvanceSalary';
import LeaveCategoryForm from './LeaveCategoryForm';
import LeaveAdd from './LeaveAdd';
import GiveAward from './GiveAward';
import AwardList from './AwardList';
const moduleDescriptions = {
  Payroll: ['Salary Template', 'Salary Assign', 'Salary Payment'],
  'Advance Salary': ['Add Advance Salary', 'Manage Advance Salary'],
  Leave: ['Leave Category', ,'Add Leave Category', ],
  Awards: ['Give Award', 'Award List'],
};

const subModuleComponents = {
  'Salary Template': <SalaryTemplate />,
  'Salary Assign': <SalaryAssign />,
  'Salary Payment': <SalaryPayment />,
  'Add Advance Salary': <AddAdvanceSalary />,
  'Manage Advance Salary': <ManageAdvanceSalary />,
  'Leave Category': <LeaveCategoryForm />,
  'Manage Leave Category': <ManageAdvanceSalary/>,
  'Add Leave Category': <LeaveAdd/>,
  'Give Award' : <GiveAward/>,
  'Award List' : <AwardList/>
  // Add missing components here as needed
};

const HumanResources = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [selectedSubModule, setSelectedSubModule] = useState('Salary Template');
  const navigate = useNavigate();


  const handleModuleClick = (mod) => {
    setActiveModule(mod);
    setSelectedSubModule(null); // Reset previously selected submodule
  };

  const handleSubModuleClick = (sub) => {
    setSelectedSubModule(sub);
  };

  return (
    <div >
    

      {/* Main Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.keys(moduleDescriptions).map((mod) => (
          <button
            key={mod}
            onClick={() => handleModuleClick(mod)}
            className={`w-full px-4 py-2 text-center rounded font-semibold transition duration-200 ${
              activeModule === mod
                ? 'bg-[#143781] text-white'
                : 'bg-[#d5ddff] text-black hover:bg-opacity-80'
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Submodules (Tabs) */}
      {activeModule && moduleDescriptions[activeModule] && (
        <div className="flex flex-wrap gap-2 mb-4">
          {moduleDescriptions[activeModule].map((sub) => (
            <button
              key={sub}
              onClick={() => handleSubModuleClick(sub)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedSubModule === sub
                  ? 'bg-[#143781] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Selected Submodule Component */}
      {selectedSubModule && (
        <div className=" rounded-md shadow">
          {subModuleComponents[selectedSubModule] || (
            <p className="text-gray-600">Component not found for this submodule.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HumanResources;
