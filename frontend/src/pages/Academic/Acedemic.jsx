import React, { useState } from 'react';
import Class from './Class'; // 👈 Import your component
import Section from './Section';
import Subject from './Subject';
import SubjectAssign from './SubjectAssign';
import CreateSchedule from './CreateSchedule';
import Teacher from './Teacher';
import TeacherSchedule from "../TeacherSchedule/TeacherSchedule"
import Promotion from '../Promotion/Promotion';
import ClassScheduleList from './ClassScheduleLis';
ClassScheduleList
// Add more as needed

const moduleDescriptions = {
  "Class&Section": ['Class', 'Section', 'Teacher'],
  Subject: ["Subject", "Subject Assign to Class"],
  "Class Schedule": ["Class Schedule" , "Class Schedule List"],
  "Teacher Schedule": ["Teacher Schedule"],
  Promotion: ["Promotion"]
};

const subModuleComponents = {
  Class: <Class />,
  Section: <Section />,
  Subject: <Subject/>,
  "Subject Assign to Class": <SubjectAssign/>,
  "Class Schedule":<CreateSchedule/>,
  "Class Schedule List" : <ClassScheduleList/>,
  Teacher:<Teacher/>,
  "Teacher Schedule": <TeacherSchedule />,
  "Promotion": <Promotion/>

//   Teacher: <Teacher />,
  // Add others as needed
};

const Academic = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [selectedSubModule, setSelectedSubModule] = useState('Class');

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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

      {/* Submodules */}
      {activeModule && moduleDescriptions[activeModule].length > 0 && (
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

export default Academic;
