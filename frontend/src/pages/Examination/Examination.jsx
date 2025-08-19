import React, { useState } from 'react';

import ExamRoom from './ExamRoom';
import ExamSetup from './ExamSetup';
import ExamTerms from './ExamTerms';
import AddSchedule from './AddSchedule';
import ScheduleList from './ScheduleList';
import MarksEntry from './MarksEntry';
import GradeManager from './GradeManager';
// Add more as needed

const moduleDescriptions = {
  "Exam": ['Exam Terms', 'Exam Room', 'Exam Setup'],
  "Exam Schedule": ["Add Schedule", "Schedule List"],
  "Mark": ["Grade Manager","Marks Entry"],
};

const subModuleComponents = {
  "Exam Room": <ExamRoom />,
  "Exam Setup": <ExamSetup />,
  "Exam Terms": <ExamTerms />,
  "Add Schedule": <AddSchedule />,
  "Schedule List": <ScheduleList />,
  "Marks Entry":<MarksEntry/>,
  "Grade Manager":<GradeManager/>
};

const Examination = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [selectedSubModule, setSelectedSubModule] = useState('Exam Terms');

  const handleModuleClick = (mod) => {
    setActiveModule(mod);
    setSelectedSubModule(null);
  };

  const handleSubModuleClick = (sub) => {
    setSelectedSubModule(sub);
  };

  return (
    <div className="p-4">
      {/* Main Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.keys(moduleDescriptions).map((mod) => (
          <button
            key={mod}
            onClick={() => handleModuleClick(mod)}
            className={`w-full px-4 py-2 text-center rounded font-semibold transition duration-200 ${activeModule === mod
              ? 'bg-[#143781] text-white'
              : 'bg-[#d5ddff] text-black hover:bg-opacity-80'
              }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Submodules */}
      {activeModule && moduleDescriptions[activeModule].length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {moduleDescriptions[activeModule].map((sub) => (
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

      {/* Selected Component */}
      {selectedSubModule && (
        <div className="p-4 bg-white rounded-md shadow">
          {subModuleComponents[selectedSubModule] || (
            <p className="text-gray-600">Component not found for this submodule.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Examination;
