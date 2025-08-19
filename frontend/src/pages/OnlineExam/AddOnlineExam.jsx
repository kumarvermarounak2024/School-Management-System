
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IoReorderThreeSharp } from 'react-icons/io5';
import { HiPencilSquare } from 'react-icons/hi2';

const subject = [
    "English",
    "Mathematics",
    "Science",
    "Social Studies",
    "Hindi",
    "Environmental Studies",
    "History",
    "Geography",
    "Civics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Physical Education",
    "Art and Craft",
    "Music",
    "Economics",
    "Accountancy",
    "Business Studies",
    "Informatics Practices",
    "Political Science",
    "Sociology",
    "Psychology"
];

function AddOnlineExam() {
        const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

    const navigate = useNavigate();
    const { id } = useParams();

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        class: '',
        subject: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        duration: '',
        maximumMarks: '',
        passingMarks: '',
        examType: '',
        examFee: '',
        negativeMarking: false,
        showResultImmediately: false,
    });

    // Class options
    const classOptions = Array.from({ length: 12 }, (_, i) => {
        const num = i + 1;
        let suffix = 'th';
        if (num === 1) suffix = 'st';
        else if (num === 2) suffix = 'nd';
        else if (num === 3) suffix = 'rd';
        return `${num}${suffix}`;
    });

    // Fetch exam data if id exists
    useEffect(() => {
        if (id) {
            const fetchExamData = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/onlineExams/get/${id}`);
                    console.log(response, "Fetched exam data");
                    // Format ISO dates to YYYY-MM-DD for input fields
                    const formattedData = {
                        ...response.data,
                        startDate: response.data.startDate ? response.data.startDate.split('T')[0] : '',
                        endDate: response.data.endDate ? response.data.endDate.split('T')[0] : '',
                    };
                    setFormData(formattedData);
                } catch (error) {
                    console.error('Error fetching exam data:', error);
                    alert('Failed to fetch exam data.');
                }
            };
            fetchExamData();
        }
    }, [id]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle toggle changes
    const handleToggleChange = (field) => {
        setFormData(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare data for submission (convert dates to ISO format if required by API)
            const submitData = {
                ...formData,
                startDate: formData.startDate ? `${formData.startDate}T00:00:00.000Z` : '',
                endDate: formData.endDate ? `${formData.endDate}T00:00:00.000Z` : '',
            };

            if (id) {
                // Update existing exam
                await axios.put(`${apiUrl}/onlineExams/update/${id}`, submitData);
                alert('Online exam updated successfully!');
                navigate('/onlineexamlist');
            } else {
                // Create new exam
                await axios.post(`${apiUrl}/onlineExams/create`, submitData);
                alert('Online exam created successfully!');
                setFormData({
                    title: '',
                    class: '',
                    subject: '',
                    startDate: '',
                    endDate: '',
                    startTime: '',
                    endTime: '',
                    duration: '',
                    maximumMarks: '',
                    passingMarks: '',
                    examType: '',
                    examFee: '',
                    negativeMarking: false,
                    showResultImmediately: false,
                });
            }
        } catch (error) {
            console.error('Error saving online exam:', error);
            alert(`Failed to ${id ? 'update' : 'create'} online exam.`);
        }
    };

    return (
        <div className="p-4">
            <div className="border-b-2 border-[#151587] mb-10">
                <div className="flex items-center">
                    <HiPencilSquare className="h-6 w-6 text-[#151587] mr-2" />

                    <h1 className="border-b-2 border-[#151587] px-2 text-lg font-bold text-[#151587]">
                        {id ? 'Edit Online Exam' : 'Add Online Exam'}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col justify-center items-center space-y-6">
                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter exam title"
                            className="w-3/4 border border-[#C0D5FF] rounded p-2"
                            required
                        />
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            Class <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="class"
                            value={formData.class}
                            onChange={handleInputChange}
                            className="w-3/4 border border-[#C0D5FF] rounded p-2"
                            required
                        >
                            <option value="">Select Class</option>
                            {classOptions.map((cls, index) => (
                                <option key={index} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            Subject <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-3/4 border border-[#C0D5FF] rounded p-2"
                            required
                        >
                            <option value="">Select Subject</option>
                            {subject.map((sub, index) => (
                                <option key={index} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            placeholder="Select start date"
                            className="w-3/4 border border-[#C0D5FF] rounded p-2"
                            min="2025-06-04"
                            required
                        />
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            End Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            placeholder="Select end date"
                            className="w-3/4 border border-[#C0D5FF] rounded p-2"
                            min="2025-06-04"
                            required
                        />
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            Start Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleInputChange}
                            placeholder="Select start time"
                            className="w-3/4 border border-[#C0D5FF] rounded p-2"
                            required
                        />
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            End Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleInputChange}
                            placeholder="Select end time"
                            className="w-3/4 border border-[#C0D5FF] rounded p-2"
                            required
                        />
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            Duration (min) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            placeholder="Enter duration in minutes"
                            className="w-3/4 border border-[#C0D5FF] rounded p-2"
                            min="1"
                            required
                        />
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            Maximum Marks <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="maximumMarks"
                            value={formData.maximumMarks}
                            onChange={handleInputChange}
                            placeholder="Enter maximum marks"
                            className="w-3/4 border border-[#C0D5FF] rounded p-2"
                            min="1"
                            required
                        />
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            Passing Marks <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="passingMarks"
                            value={formData.passingMarks}
                            onChange={handleInputChange}
                            placeholder="Enter passing marks"
                            className="w-3/4 border border-[#C0D5FF] rounded p-2"
                            min="0"
                            required
                        />
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            Exam Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="examType"
                            value={formData.examType}
                            onChange={handleInputChange}
                            className="w-3/4 border border-[#C0D5FF] rounded p-2"
                            required
                        >
                            <option value="">Select Exam Type</option>
                            <option value="Paid">Paid</option>
                            <option value="Free">Free</option>
                        </select>
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            Exam Fee <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="examFee"
                            value={formData.examFee}
                            onChange={handleInputChange}
                            placeholder="Enter exam fee"
                            className="w-3/4 border border-[#C0D5FF] rounded p-2"
                            min="0"
                            required
                        />
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            Negative Marking
                        </label>
                        <div className="w-3/4 flex items-center">
                            <button
                                type="button"
                                onClick={() => handleToggleChange('negativeMarking')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${formData.negativeMarking ? 'bg-[#151587]' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${formData.negativeMarking ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <span className="ml-3 text-sm">
                                {formData.negativeMarking ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>

                    <div className="flex w-full max-w-4xl">
                        <label className="w-1/4 font-medium text-base">
                            Show Result Immediately
                        </label>
                        <div className="w-3/4 flex items-center">
                            <button
                                type="button"
                                onClick={() => handleToggleChange('showResultImmediately')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${formData.showResultImmediately ? 'bg-[#151587]' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${formData.showResultImmediately ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <span className="ml-3 text-sm">
                                {formData.showResultImmediately ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center mt-12 gap-6">
                    <button
                        type="submit"
                        className="bg-[#151587] text-white font-semibold rounded-lg py-2 px-10 hover:bg-[#0f0f5e] transition"
                    >
                        {id ? 'Update' : 'Submit'}
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

export default AddOnlineExam;