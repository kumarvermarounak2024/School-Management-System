import { BiEditAlt } from "react-icons/bi";
import React, { useState, useEffect } from 'react';
import { FiEye } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineFilePdf, AiTwotonePrinter } from "react-icons/ai";

function OnlineExamList() {
        const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch exams from API
    const fetchExams = async () => {
        try {
            const response = await axios.get(`${apiUrl}/onlineExams/get`);
            console.log('examResponse:', response?.data);
            const examData = Array.isArray(response?.data)
                ? response?.data
                : Array.isArray(response?.data?.data)
                    ? response?.data?.data
                    : [];
            setExams(examData);
            setFilteredExams(examData);
            setError(examData.length ? '' : 'No exams found.');
        } catch (err) {
            console.error('Error fetching exams:', err);
            setError('Failed to fetch exams.');
            setExams([]);
            setFilteredExams([]);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page on search
        if (query) {
            const filtered = exams.filter(
                (exam) =>
                    exam.title?.toLowerCase().includes(query) ||
                    exam.subject?.toLowerCase().includes(query)
            );
            setFilteredExams(filtered);
        } else {
            setFilteredExams(exams);
        }
    };

    // Handle view action
    // const handleView = (id) => {
    //     navigate(`/online-exam/${id}`);
    // };

    // Handle delete action
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this exam?')) return;
        try {
            await axios.delete(`${apiUrl}/onlineExams/delete/${id}`);
            alert('Exam deleted successfully.');
            fetchExams(); // Refresh table
        } catch (err) {
            console.error('Error deleting exam:', err);
            alert('Failed to delete exam.');
        }
    };
    const handleedit = (id) => {
        navigate(`/AddOnlineExam/${id}`)
    }

    // Pagination logic
    const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = filteredExams.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    return (
        <div className="p-4">
            <div className="border-b-2 border-[#151587] mb-10">
                <div className="flex items-center">
                    <img
                        src="./public/image/icon2.png"
                        className="h-6 border-b-2 border-[#151587]"
                        alt="icon"
                    />
                    <h1 className="border-b-2 border-[#151587] px-2 text-lg font-bold text-[#151587]">
                        Online Exam List
                    </h1>
                </div>
            </div>

            {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

            <div className="flex justify-between mb-4">
                <div className="flex justify-start items-center mb-4 space-x-4">
                    <IoCopyOutline className="h-6 w-6 cursor-pointer" title="Copy" />
                    <AiOutlineFilePdf className="h-6 w-6 cursor-pointer" title="Export to PDF" />
                    <AiTwotonePrinter className="h-6 w-6 cursor-pointer" title="Print" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by title or subject..."
                    className="w-full max-w-sm border border-[#C0D5FF] rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#151587]"
                />
            </div>

            <div className="overflow-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                S.No
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Title
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Class
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Subject
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Start Date
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                End Date
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Start Time
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                End Time
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Duration
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Maximum Marks
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Passing Marks
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Exam Type
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Exam Fees
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Negative Mark
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Mark Display
                            </th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="16"
                                    className="border border-gray-400 px-4 py-2 text-center text-gray-600"
                                >
                                    No exams found.
                                </td>
                            </tr>
                        ) : (
                            currentPageData.map((exam, index) => (
                                <tr key={exam._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.title || '-'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.class || '-'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.subject || '-'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.startDate
                                            ? new Date(exam.startDate).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.endDate
                                            ? new Date(exam.endDate).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.startTime || '-'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.endTime || '-'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.duration ? `${exam.duration} min` : '-'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.maximumMarks || '-'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.passingMarks || '-'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.examType || '-'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.examFee ? `$${exam.examFee}` : '-'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.negativeMarkApplicable ? 'Yes' : 'No'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        {exam.markDisplay ? 'Yes' : 'No'}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">
                                        <div className="flex gap-4">
                                            {/* <button
                                                onClick={() => handleView(exam._id)}
                                                title="View Details"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FiEye className="h-5 w-5" />
                                            </button> */}
                                            <button
                                                onClick={() => handleedit(exam._id)}
                                                title="View Details"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <BiEditAlt className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exam._id)}
                                                title="Delete Exam"
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <MdDeleteOutline className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-end px-4 my-8">
                    <div className="flex items-center border-2 border-[#151587] rounded-md">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-[#151587] disabled:opacity-50"
                        >
                            <MdNavigateBefore className="h-5 w-5" />
                        </button>
                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 text-sm ${currentPage === page
                                            ? 'bg-[#151587] text-white'
                                            : 'text-[#151587] hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (
                                (page === currentPage - 2 && currentPage > 3) ||
                                (page === currentPage + 2 && currentPage < totalPages - 2)
                            ) {
                                return (
                                    <span key={page} className="px-3 py-2 text-sm">
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-[#151587] disabled:opacity-50"
                        >
                            <MdNavigateNext className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OnlineExamList;