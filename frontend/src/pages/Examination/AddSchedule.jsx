import { AiTwotonePrinter, AiOutlineFilePdf } from "react-icons/ai";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { IoCopyOutline } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddSchedule() {

    const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [error, setError] = useState('');

    // State to manage form data for submission
    const [formData, setFormData] = useState({
        examName: '',
        className: '',
        schedule: [],
    });

    // State to store IDs for fetching subjects
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
                    Array.isArray(exam.examList) &&
                    exam.examList.length > 0
                )
                .flatMap(exam =>
                    exam.examList.map(examItem => ({
                        _id: exam._id,
                        examName: examItem.examName || 'Unnamed Exam'
                    }))
                );
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

    // Fetch subjects based on classId and examId
    const getSubject = async () => {
        if (!selection.classId || !selection.examId) {
            alert("Please select both a class and an exam first");
            return;
        }

        console.log('examId:', selection.examId);
        console.log('classId:', selection.classId);

        try {
            const response = await axios.get(
                `${apiUrl}/examination/schedule/subjects?classId=${selection.classId}&examId=${selection.examId}`
            );
            console.log('subjectResponse:', response?.data);
            const subjectData = response?.data?.subjects || [];
            const subjectNames = Array.isArray(subjectData)
                ? subjectData.map(subject => subject.subjectName)
                : [];
            setSubjects(subjectNames);

            // Populate schedule table with subjects
            if (subjectNames.length > 0) {
                const newSchedule = subjectNames.map(subject => ({
                    subject,
                    date: "",
                    startingTime: "",
                    endingTime: "",
                    classRoomNo: "",
                    maxMarks: "",
                    passingMarks: ""
                }));
                setFormData(prev => ({
                    ...prev,
                    schedule: newSchedule
                }));
            } else {
                alert("No subjects found for the selected class and exam.");
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
            alert("No subjects found for the selected class and exam.");
        }
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

    // Handle table input changes
    const handleInputChange = (index, field, value) => {
        const updatedSchedule = [...formData.schedule];
        updatedSchedule[index] = {
            ...updatedSchedule[index],
            [field]: value,
        };
        setFormData(prev => ({
            ...prev,
            schedule: updatedSchedule,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Prepare data for submission, including examName from formData
        const submitData = {
            examName: formData.examName,
            className: formData.className,
            schedule: formData.schedule,
        };
        try {
            const response = await axios.post(`${apiUrl}/examination/schedule/create`, submitData);
            alert("Schedule added successfully");
            setFormData({
                examName: '',
                className: '',
                schedule: [],
            });
            setSelection({
                examId: '',
                classId: '',
            });
            setSubjects([]);
        } catch (error) {
            console.error('Error submitting schedule:', error);
            alert("Failed to add schedule.");
        }
    };

    useEffect(() => {
        getClassAndExam();
    }, []);

    return (
        <div className="p-4">
            <div className="border-b-2 border-[#151587] mb-10">
                <div className="flex items-center">
                    <img src="./public/image/icon2.png" className="h-6 border-b-2 border-[#151587]" alt="icon" />
                    <h1 className="border-b-2 border-[#151587] px-2 text-lg font-bold text-[#151587]">
                        Add Schedule
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
                        {exams.map((exam, index) => (
                            <option key={exam._id} value={exam._id}>{exam?.examName}</option>
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

            <div className="flex justify-start items-center mb-4 space-x-4">
                <IoCopyOutline className="h-6 w-6 cursor-pointer" title="Copy" />
                <AiOutlineFilePdf className="h-6 w-6 cursor-pointer" title="Export to PDF" />
                <AiTwotonePrinter className="h-6 w-6 cursor-pointer" title="Print" />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="overflow-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                    Subject <span className="text-red-500">*</span>
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                    Date <span className="text-red-500">*</span>
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                    Starting Time <span className="text-red-500">*</span>
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                    Ending Time <span className="text-red-500">*</span>
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                    Class Room No. <span className="text-red-500">*</span>
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                    Maximum Marks <span className="text-red-500">*</span>
                                </th>
                                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                    Passing Marks <span className="text-red-500">*</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.schedule.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="border border-gray-400 px-4 py-2 text-center text-gray-600">
                                        No schedule entries yet. Click "Show" to fetch subjects.
                                    </td>
                                </tr>
                            ) : (
                                formData.schedule.map((exam, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border border-gray-400 px-4 py-2">
                                            <select
                                                value={exam.subject}
                                                onChange={(e) => handleInputChange(index, 'subject', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-1 text-sm"
                                                required
                                            >
                                                <option value="">Select Subject</option>
                                                {subjects.map((subject, subIndex) => (
                                                    <option key={subIndex} value={subject}>{subject}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <input
                                                type="date"
                                                value={exam.date}
                                                onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-1 text-sm"
                                                min="2025-06-04"
                                                required
                                            />
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <AiOutlineClockCircle className="h-5 w-5" />
                                                <input
                                                    type="time"
                                                    value={exam.startingTime}
                                                    onChange={(e) => handleInputChange(index, 'startingTime', e.target.value)}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm"
                                                    required
                                                />
                                            </div>
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <AiOutlineClockCircle className="h-5 w-5" />
                                                <input
                                                    type="time"
                                                    value={exam.endingTime}
                                                    onChange={(e) => handleInputChange(index, 'endingTime', e.target.value)}
                                                    className="w-full border border-gray-300 rounded p-1 text-sm"
                                                    required
                                                />
                                            </div>
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <input
                                                type="text"
                                                value={exam.classRoomNo}
                                                onChange={(e) => handleInputChange(index, 'classRoomNo', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-1 text-sm"
                                                required
                                            />
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <input
                                                type="number"
                                                value={exam.maxMarks}
                                                onChange={(e) => handleInputChange(index, 'maxMarks', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-1 text-sm"
                                                min="0"
                                                required
                                            />
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <input
                                                type="number"
                                                value={exam.passingMarks}
                                                onChange={(e) => handleInputChange(index, 'passingMarks', e.target.value)}
                                                className="w-full border border-gray-300 rounded p-1 text-sm"
                                                min="0"
                                                required
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end px-4 my-8">
                    <div className="grid grid-cols-3 items-center w-32 h-12 border-2 border-[#151587] rounded-md">
                        <div className="flex justify-center items-center">
                            <MdNavigateBefore className="text-2xl text-[#151587]" />
                        </div>
                        <div className="bg-[#151587] text-white font-semibold flex justify-center items-center h-full text-base">
                            1
                        </div>
                        <div className="flex justify-center items-center">
                            <MdNavigateNext className="text-2xl text-[#151587]" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center mt-12 gap-6">
                    <button
                        type="submit"
                        className="bg-[#151587] text-white font-semibold rounded-lg py-2 px-10 hover:bg-[#0f0f5e] transition"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="border-2 border-[#151587] text-[#151587] font-semibold rounded-lg py-2 px-10 hover:bg-[#151587] hover:text-white transition"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddSchedule;