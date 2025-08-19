import React, { useState } from 'react';

import OneWord from './OneWord';
import TrueFalse from './TrueFalse';
import Descriptive from './Descriptive';
import Objecctive from './Objecctive';

function AddQuestion() {
    const buttons = {
        "Add Question": ["Objective", "One Word", "True/False", "Descriptive"],
        "Question List": []
    };

    const subArray = {
        "Objective": <Objecctive />,
        "One Word": <OneWord />,
        "True/False": <TrueFalse />,
        "Descriptive": <Descriptive />,
    };

    const [activeModule, setActiveModule] = useState("Add Question");
    const [selectSubArray, setSelectSubArray] = useState("Objective");

    const handleButtons = (btn) => {
        setActiveModule(btn);
        // Reset submodule to default when switching to a module with submodules
        if (btn === "Add Question") {
            setSelectSubArray("Objective");
        } else {
            setSelectSubArray(""); // Clear submodule for Question List
        }
    };

    const handleSubModule = (sub) => {
        setSelectSubArray(sub);
    };

    return (
        <div className="p-4">
            <div className="border-b-2 border-[#151587] mb-6">
                <h1 className="text-lg font-bold text-[#151587] px-2 border-b-2 border-[#151587]">
                    Add Question
                </h1>
            </div>

            <div className="flex space-x-4 mb-6">
                {Object.keys(buttons).map((btn) => (
                    <button
                        key={btn}
                        onClick={() => handleButtons(btn)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${activeModule === btn
                            ? 'bg-[#151587] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {btn}
                    </button>
                ))}
            </div>

            {activeModule === "Add Question" && buttons[activeModule].length > 0 && (
                <div className="flex flex-wrap gap-4 mb-6">
                    {buttons[activeModule].map((sub) => (
                        <button
                            key={sub}
                            onClick={() => handleSubModule(sub)}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${selectSubArray === sub
                                ? 'bg-[#151587] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            )}

            <div>
                {selectSubArray && subArray[selectSubArray] ? (
                    subArray[selectSubArray]
                ) : (
                    <p className="text-gray-700 text-center">No component selected</p>
                )}
            </div>
        </div>
    );
}

export default AddQuestion;