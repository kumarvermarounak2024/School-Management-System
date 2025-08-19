import axios from 'axios';
import React, { useState, useEffect } from 'react';
import TestQuestionEditer from './TestQuestionEditer';
import AddQuestion from './AddQuestion';

function Questions() {
        const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

    const [classes, setClasses] = useState([]);
    const [exams, setExams] = useState([]);
    const [error, setError] = useState('');
    const [showParagraph, setShowParagraph] = useState(false);

    // State to manage form data for submission
    const [formData, setFormData] = useState({
        examName: '',
        className: '',
        questions: {},
    });

    // State to store IDs for fetching data
    const [selection, setSelection] = useState({
        examId: '',
        classId: '',
    });

    // Fetch classes and exams
    const getClassAndExam = async () => {
        try {
            // Fetch classes
            const classResponse = await axios.get(`${apiUrl}/class/getAll`);
            console.log('classResponse:', classResponse?.data?.classes);
            const dataclass = classResponse?.data?.classes || [];
            setClasses(dataclass);

            // Fetch exams
            const examResponse = await axios.get(`${apiUrl}/examination/getAll`);
            console.log('examResponse:', examResponse?.data);

            // Ensure examData is an array
            const examData = Array.isArray(examResponse?.data)
                ? examResponse?.data
                : Array.isArray(examResponse?.data?.data)
                    ? examResponse?.data?.data
                    : [];

            if (!examData.length) {
                setError('No exams found.');
                setExams([]);
                return;
            }

            // Map exams to options, handling examList as an object
            const examOptions = examData
                .filter(exam =>
                    exam._id &&
                    exam.examList &&
                    typeof exam.examList === 'object' &&
                    exam.examList.examName
                )
                .map(exam => ({
                    _id: exam._id,
                    examName: exam.examList.examName || 'Unnamed Exam'
                }));

            console.log('examOptions:', examOptions);
            setExams(examOptions);
            setError(examOptions.length ? '' : 'No valid exams with examList found.');
        } catch (error) {
            console.error('Error fetching class and exam:', error);
            setError('Failed to fetch classes or exams.');
            setExams([]);
            setClasses([]);
        }
    };

    // Handle "Show" button click
    const getSubject = () => {
        if (!selection.classId || !selection.examId) {
            alert("Please select both a class and an exam first");
            return;
        }
        setShowParagraph(true); // Show paragraph when "Show" is clicked
    };

    // Handle dropdown changes
    const handleDropdownChange = (e) => {
        const { name, value } = e.target;
        if (name === "exam") {
            const selectedExam = exams.find(exam => exam._id === value);
            setSelection(prev => ({ ...prev, examId: value }));
            setFormData(prev => ({ ...prev, examName: selectedExam ? selectedExam.examName : '' }));
        } else if (name === "class") {
            const selectedClass = classes.find(cls => cls._id === value);
            setSelection(prev => ({ ...prev, classId: value }));
            setFormData(prev => ({ ...prev, className: selectedClass ? selectedClass.Name : '' }));
        }
    };

    // Fetch classes and exams on component mount
    useEffect(() => {
        getClassAndExam();
    }, []);

    return (
        <div className="p-4">
            <div className="border-b-2 border-[#151587] mb-10">
                <div className="flex items-center">
                    <img src="./public/image/icon2.png" className="h-6 border-b-2 border-[#151587]" alt="icon" />
                    <h1 className="border-b-2 border-[#151587] px-2 text-lg font-bold text-[#151587]">
                        Add Questions
                    </h1>
                </div>
            </div>

            {error && (
                <div className="mb-4 text-red-600 text-center">{error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                    <label className="block font-medium text-base">
                        Exam Name <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="exam"
                        value={selection.examId}
                        onChange={handleDropdownChange}
                        className="w-full border border-[#C0D5FF] rounded p-2"
                        required
                    >
                        <option value="">Select Exam</option>
                        {exams.map((exam) => (
                            <option key={exam._id} value={exam._id}>{exam.examName}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="block font-medium text-base">
                        Class <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="class"
                        value={selection.classId}
                        onChange={handleDropdownChange}
                        className="w-full border border-[#C0D5FF] rounded p-2"
                        required
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>{cls.Name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-center mb-12">
                <button
                    type="button"
                    className="bg-[#151587] text-white font-semibold rounded-lg py-2 px-10 hover:bg-[#0f0f5e] transition"
                    onClick={getSubject}
                >
                    Show
                </button>
            </div>

            {showParagraph && (

                <div>
                    <AddQuestion></AddQuestion>
                </div>


            )}
        </div>
    );
}

export default Questions;