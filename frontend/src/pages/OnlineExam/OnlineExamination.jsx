import React, { useState } from 'react';
import AddOnlineExam from './AddOnlineExam';
import OnlineExamList from './OnlineExamList';
import ImportQuestion from './ImportQuestion';
import QuestionList from './QusetionList';
import QuestionDetails from './QuestionDetails';
import Questions from './Questions';

const moduleDescriptions = {
    "Online Exam": ["Add Online Exam", "Online Exam List"],
    "Questions": ["onlineexam"],
};

const subModuleComponents = {
    "Add Online Exam": <AddOnlineExam />,
    "Online Exam List": <OnlineExamList />,
    "onlineexam": <Questions />

};

function OnlineExamination() {
    const [activeModule, setActiveModule] = useState("Online Exam"); // Default to "Online Exam"
    const [selectedSubModule, setSelectedSubModule] = useState("Add Online Exam"); // Default to "Add Online Exam"

    const handleModuleClick = (mod) => {
        setActiveModule(mod);
        // Set default submodule for the selected module
        const defaultSubModule = moduleDescriptions[mod][0].trim();
        setSelectedSubModule(defaultSubModule || null);
    };

    const handleSubModuleClick = (sub) => {
        setSelectedSubModule(sub.trim());
    };

    return (
        <div className="p-4">
            {/* Main Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                    {moduleDescriptions[activeModule]
                        .filter(sub => sub.trim()) // Filter out empty submodules
                        .map((sub) => (
                            <button
                                key={sub}
                                onClick={() => handleSubModuleClick(sub)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedSubModule === sub.trim()
                                    ? 'bg-[#143781] text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {sub.trim()}
                            </button>
                        ))}
                </div>
            )}

            {/* Selected Component */}
            {selectedSubModule && (
                <div className="p-4 bg-white rounded-md shadow">
                    {subModuleComponents[selectedSubModule.trim()] || (
                        <p className="text-gray-600">Component not found for this submodule.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default OnlineExamination;