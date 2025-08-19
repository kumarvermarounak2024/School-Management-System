import { MdDeleteOutline, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { FiEye, FiSearch } from "react-icons/fi";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineFilePdf, AiTwotonePrinter } from "react-icons/ai";
import { Eye, Pencil, Trash2 } from 'lucide-react';

function ScheduleList() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

    const navigate = useNavigate();
    const [examData, setExamData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [classes, setClasses] = useState([]);
    const itemPerPage = 5;

    // Generate class options from 1st to 12th
    const classOptions = async () => {
        const classResponse = await axios.get(`${apiUrl}/class/getAll`);
        console.log('classResponse:', classResponse?.data?.classes);
        const dataclass = classResponse?.data?.classes || [];
        setClasses(dataclass)
    }

    // Apply class filter and search query
    const getFilteredData = () => {
        let data = examData;
        // Apply class filter
        if (selectedClass) {
            data = data.filter(exam => exam?.Name === selectedClass);
        }
        // Apply search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            data = data.filter(exam =>
                exam?.examName?.toLowerCase().includes(query) ||
                exam?.className?.toLowerCase().includes(query)
            );
        }
        return data;
    };


    
    // Update filtered data when class or search changes
    useEffect(() => {
        const filtered = getFilteredData();
        classOptions();
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    }, [selectedClass, searchQuery, examData]);

    // Calculate pagination for filtered data
    const totalData = filteredData.length;
    const totalPages = Math.ceil(totalData / itemPerPage);
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = Math.min(startIndex + itemPerPage, totalData);
    const currentPageData = filteredData.slice(startIndex, endIndex);

    const getData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/examination/schedule/getAll`);
            console.log(response?.data?.data, "response");
            setExamData(response?.data?.data);
        } catch (error) {
            console.error(error, "Error fetching data");
        }
    };


    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                await axios.delete(`${apiUrl}/examination/schedule/delete/${id}`);
                getData(); // refresh
            } catch (err) {
                console.error("Failed to delete", err);
            }
        }
    };

    const handleShow = () => {
        if (!selectedClass) {
            alert('Please select a class first');
            return;
        }
        const filtered = examData.filter(exam => exam?.className === selectedClass);
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page
    };

    const handleClassChange = (e) => {
        console.log(e.target.value, "djdjdj")
        setSelectedClass(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleView = (id) => {
        console.log(id, "View ID");
        navigate(`/Examination/scheduleDetails/${id}`);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleBack = () => {
        navigate(-1); // Navigate to previous page
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-center mb-8">
                <div className="space-y-3 w-full max-w-md">
                    <label className="block font-bold text-base">
                        Class <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={selectedClass}
                        onChange={handleClassChange}
                        className="w-full border border-[#C0D5FF] rounded p-2"
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls, index) => (
                            <option key={cls?._id} value={cls?.Name}>{cls?.Name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-center mb-12">
                <button
                    type="button"
                    onClick={handleShow}
                    className="bg-[#151587] text-white font-semibold rounded-lg py-2 px-10 hover:bg-[#0f0f5e] transition"
                >
                    Show
                </button>
            </div>

            <div className="border-b-2 border-[#151587] mb-10">
                <div className="flex items-center">
                    <img src="./public/image/icon2.png" className="h-6 border-b-2 border-[#151587]" alt="icon" />
                    <h1 className="border-b-2 border-[#151587] px-2 text-lg font-bold text-[#151587]">
                        Schedule List
                    </h1>
                </div>
            </div>


            <div className="flex justify-between mb-4">
                <div className="flex justify-center items-center mx-4 space-x-3">
                    <IoCopyOutline className="h-[20px] w-[30px]" /><AiOutlineFilePdf className="h-[20px] w-[30px]" /><AiTwotonePrinter className="h-[20px] w-[30px]" />
                </div>
                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by exam or class..."
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#151587]"
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                </div>
            </div>

            <div className="overflow-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">S.No.</th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">Exam Name</th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">Class</th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageData.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="border border-gray-400 px-4 py-2 text-center text-gray-600">
                                    No schedules found.
                                </td>
                            </tr>
                        ) : (
                            currentPageData.map((exam, index) => (
                                <tr key={exam?._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-400 px-4 py-2 text-sm">{startIndex + index + 1}</td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">{exam?.examName}</td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">{exam?.className}</td>
                                    <td className="border border-gray-400 px-4 py-2">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleView(exam._id)}
                                                title="View Details"
    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                                            >
     <Eye size={16} />
                                            </button>
                                            <button
                                                title="Delete Schedule"
                                            onClick={() => handleDelete(exam._id)}

   className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
 >
   <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end px-4 my-8">
                <div className="grid grid-cols-3 items-center w-32 h-12 border-2 border-[#151587] rounded-md">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="flex justify-center items-center disabled:opacity-50"
                    >
                        <MdNavigateBefore className="text-2xl text-[#151587]" />
                    </button>
                    <div className="bg-[#151587] text-white font-semibold flex justify-center items-center h-full text-base">
                        {currentPage}
                    </div>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="flex justify-center items-center disabled:opacity-50"
                    >
                        <MdNavigateNext className="text-2xl text-[#151587]" />
                    </button>
                </div>
            </div>

            <div className="flex justify-center gap-6 mt-12">
                <button
                    type="button"
                    onClick={handleBack}
                    className="border-2 border-[#151587] text-[#151587] font-semibold rounded-lg py-2 px-10 hover:bg-[#151587] hover:text-white transition"
                >
                    Back
                </button>
            </div>
        </div>
    );
}

export default ScheduleList;