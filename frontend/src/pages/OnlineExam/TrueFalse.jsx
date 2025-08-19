import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AiOutlinePlusCircle } from 'react-icons/ai';
import TestQuestionEditer from './TestQuestionEditer';

function TrueFalse() {
    const navigate = useNavigate();
    const [trueFalseQue, setTrueFalseQue] = useState({
        type: "trueFalse",
        questions: []
    });
    const [formData, setFormData] = useState({
        question: '',
        marks: '',
        answer: ''
    });

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleAddMore = (e) => {
        e.preventDefault();
        if (!formData.question || !formData.marks || !formData.answer) {
            alert('Please fill all fields.');
            return;
        }
        setTrueFalseQue(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    question: formData.question,
                    marks: parseInt(formData.marks),
                    answer: formData.answer
                }
            ]
        }));
        // Clear fields
        setFormData({
            question: '',
            marks: '',
            answer: ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare the final questions array by including the current form data if fields are filled
        const updatedQuestions = [...trueFalseQue.questions];
        if (formData.question && formData.marks && formData.answer) {
            updatedQuestions.push({
                question: formData.question,
                marks: parseInt(formData.marks),
                answer: formData.answer
            });
        }

        // Check if there are any questions to submit
        if (updatedQuestions.length === 0) {
            alert('Please add at least one question.');
            return;
        }

        // Create the final submission data
        const finalData = {
            type: "trueFalse",
            questions: updatedQuestions
        };

        // Log the data to the console
        console.log('Submitted True/False Questions:', finalData);
        alert('True/False questions submitted! (Placeholder)');

        // Reset state
        setTrueFalseQue({ type: "trueFalse", questions: [] });
        setFormData({
            question: '',
            marks: '',
            answer: ''
        });
    };

    return (
        <div className="p-4">
            <div className="border-b-2 border-[#151587] mb-6">
                <h1 className="text-lg font-bold text-[#151587] px-2 border-b-2 border-[#151587]">
                    True/False Question
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <TestQuestionEditer
                    title="Question"
                    value={formData.question}
                    onChange={handleInputChange('question')}
                />

                <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto gap-4">
                    <div className="w-full md:w-1/4 p-4 flex items-start">
                        <h2 className="text-lg font-semibold text-gray-700">Marks*</h2>
                    </div>
                    <div className="w-full md:w-3/4 flex flex-col">
                        <input
                            type="number"
                            className="w-full h-12 p-4 outline-none border-2 border-[#151587] rounded-lg"
                            placeholder="Enter marks"
                            value={formData.marks}
                            onChange={handleInputChange('marks')}
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto gap-4">
                    <div className="w-full md:w-1/4 p-4 flex items-start">
                        <h2 className="text-lg font-semibold text-gray-700">Correct Answer*</h2>
                    </div>
                    <div className="w-full md:w-3/4 flex flex-col">
                        <select
                            className="w-full h-12 p-4 outline-none border-2 border-[#151587] rounded-lg"
                            value={formData.answer}
                            onChange={handleInputChange('answer')}
                            required
                        >
                            <option value="">Select option</option>
                            <option value="True">True</option>
                            <option value="False">False</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={handleAddMore}
                        className="text-black flex items-center gap-3 font-semibold rounded-lg py-2 px-7 border-2 border-[#151587] hover:bg-[#151587] hover:text-white transition"
                    >
                        <AiOutlinePlusCircle className="h-6 w-6" /> Add More
                    </button>
                </div>

                <div className="flex justify-center gap-6 mt-6">
                    <button
                        type="submit"
                        className="bg-[#151587] text-white font-semibold rounded-lg py-2 px-10 hover:bg-[#0f0f5e] transition"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="border-2 border-[#151587] text-[#151587] font-semibold rounded-lg py-2 px-10 hover:bg-[#151587] hover:text-white transition"
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TrueFalse;