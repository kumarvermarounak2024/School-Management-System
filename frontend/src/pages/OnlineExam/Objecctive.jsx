import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TestQuestionEditer from './TestQuestionEditer';
import { AiOutlinePlusCircle } from 'react-icons/ai';

function Objective() {
    const navigate = useNavigate();
    const [objectiveQue, setObjectiveQue] = useState({
        type: "objective",
        questions: []
    });
    const [formData, setFormData] = useState({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctAnswer: ''
    });

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleRadioChange = (e) => {
        setFormData(prev => ({ ...prev, correctAnswer: e.target.value }));
    };

    const validateForm = () => {
        if (!formData.question.trim()) {
            alert('Please enter a question.');
            return false;
        }
        if (!formData.option1.trim() || !formData.option2.trim() || !formData.option3.trim() || !formData.option4.trim()) {
            alert('Please fill all option fields.');
            return false;
        }
        if (new Set([formData.option1.trim(), formData.option2.trim(), formData.option3.trim(), formData.option4.trim()]).size < 4) {
            alert('All options must be unique.');
            return false;
        }
        if (!formData.correctAnswer || !['option1', 'option2', 'option3', 'option4'].includes(formData.correctAnswer)) {
            alert('Please select a valid correct answer.');
            return false;
        }
        return true;
    };

    const handleAddMore = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setObjectiveQue(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    question: formData.question.trim(),
                    options: [
                        formData.option1.trim(),
                        formData.option2.trim(),
                        formData.option3.trim(),
                        formData.option4.trim()
                    ],
                    correctAnswer: formData.correctAnswer
                }
            ]
        }));
        // Clear fields
        setFormData({
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correctAnswer: ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let updatedQuestions = [...objectiveQue.questions];
        // Add current question if fields are filled and valid
        if (formData.question && formData.option1 && formData.option2 && formData.option3 && formData.option4 && formData.correctAnswer && validateForm()) {
            updatedQuestions.push({
                question: formData.question.trim(),
                options: [
                    formData.option1.trim(),
                    formData.option2.trim(),
                    formData.option3.trim(),
                    formData.option4.trim()
                ],
                correctAnswer: formData.correctAnswer
            });
            setObjectiveQue(prev => ({
                ...prev,
                questions: updatedQuestions
            }));
        }
        if (updatedQuestions.length === 0) {
            alert('Please add at least one question.');
            return;
        }
        // Log updated state
        console.log('Submitted Objective Questions:', { ...objectiveQue, questions: updatedQuestions });
        alert('Objective questions submitted! (Placeholder)');
        // Reset state
        setObjectiveQue({ type: "objective", questions: [] });
        setFormData({
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correctAnswer: ''
        });
    };

    const handleBack = () => {
        if (
            formData.question ||
            formData.option1 ||
            formData.option2 ||
            formData.option3 ||
            formData.option4 ||
            formData.correctAnswer ||
            objectiveQue.questions.length > 0
        ) {
            if (!window.confirm('You have unsaved changes. Are you sure you want to go back?')) {
                return;
            }
        }
        navigate(-1);
    };

    return (
        <div className="p-4">
            <div className="border-b-2 border-[#151587] mb-6">
                <h1 className="text-lg font-bold text-[#151587] px-2 border-b-2 border-[#151587]">
                    Objective Question
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <TestQuestionEditer
                    title="Question"
                    value={formData.question}
                    onChange={handleInputChange('question')}
                />
                <TestQuestionEditer
                    title="Option 1"
                    value={formData.option1}
                    onChange={handleInputChange('option1')}
                />
                <TestQuestionEditer
                    title="Option 2"
                    value={formData.option2}
                    onChange={handleInputChange('option2')}
                />
                <TestQuestionEditer
                    title="Option 3"
                    value={formData.option3}
                    onChange={handleInputChange('option3')}
                />
                <TestQuestionEditer
                    title="Option 4"
                    value={formData.option4}
                    onChange={handleInputChange('option4')}
                />

                <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto gap-4">
                    <div className="w-full md:w-1/4 p-4 flex items-start">
                        <h2 className="text-lg font-semibold text-gray-700">Correct Answer*</h2>
                    </div>
                    <div className="w-full md:w-3/4 flex flex-wrap gap-4 p-4">
                        <div>
                            <input
                                type="radio"
                                id="option1"
                                name="correctAnswer"
                                value="option1"
                                checked={formData.correctAnswer === 'option1'}
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            <label htmlFor="option1" className="text-gray-700">Option 1</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="option2"
                                name="correctAnswer"
                                value="option2"
                                checked={formData.correctAnswer === 'option2'}
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            <label htmlFor="option2" className="text-gray-700">Option 2</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="option3"
                                name="correctAnswer"
                                value="option3"
                                checked={formData.correctAnswer === 'option3'}
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            <label htmlFor="option3" className="text-gray-700">Option 3</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="option4"
                                name="correctAnswer"
                                value="option4"
                                checked={formData.correctAnswer === 'option4'}
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            <label htmlFor="option4" className="text-gray-700">Option 4</label>
                        </div>
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
                        onClick={handleBack}
                        className="border-2 border-[#151587] text-[#151587] font-semibold rounded-lg py-2 px-10 hover:bg-[#151587] hover:text-white transition"
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Objective;