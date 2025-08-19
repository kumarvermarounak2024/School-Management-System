import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

function ClassSectionReport() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchClasses();
        fetchSections();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await axios.get(`${apiUrl}/class/getAll`);
            setClasses(res.data.classes || []);
        } catch (err) {
            console.error("Error fetching classes:", err);
            toast.error("Failed to fetch classes");
        }
    };

    const fetchSections = async () => {
        try {
            const res = await axios.get(`${apiUrl}/section/getAll`);
            setSections(res.data.sections || []);
        } catch (err) {
            console.error("Error fetching sections:", err);
            toast.error("Failed to fetch sections");
        }
    };

    const handleShow = () => {
        if (!selectedClass || !selectedSection || !fromDate || !toDate) {
            toast.error("Please fill in all required fields");
            return;
        }
        fetchReportData();
        console.log(selectedClass, "selectedClass");
        console.log(selectedSection, "selectedSection");
        console.log(fromDate, "fromDate");
        console.log(toDate, "toDate");
    };

    const fetchReportData = async () => {
        try {
            console.log(selectedClass, "selectedClass");
            console.log(selectedSection, "selectedSection");
            console.log(fromDate, "fromDate");
            console.log(toDate, "toDate");
            const res = await axios.get(`${apiUrl}/reports/Admission/filter`);
            console.log(res.data.data, "res.data.data");

            // Get the selected class and section names for comparison
            const selectedClassName = classes.find(c => c._id === selectedClass)?.Name;
            const selectedSectionName = sections.find(s => s._id === selectedSection)?.Name;

            const filteredStudents = res.data.data.filter(student => {
                const admissionDate = new Date(student.admissionDate);
                return (
                    student.class === selectedClassName &&
                    student.section === selectedSectionName &&
                    admissionDate >= new Date(fromDate) &&
                    admissionDate <= new Date(toDate)
                );
            });

            // Group students by class and section
            const groupedData = filteredStudents.reduce((acc, student) => {
                const key = `${student.class}-${student.section}`;
                if (!acc[key]) {
                    acc[key] = {
                        className: student.class,
                        sectionName: student.section,
                        totalStudents: 0
                    };
                }
                acc[key].totalStudents++;
                return acc;
            }, {});

            // const reportDataArray = Object.values(groupedData);
            // setReportData(reportDataArray);

            // if (reportDataArray.length === 0) {
            //     toast.info("No data found for the selected criteria");
            // }
        } catch (err) {
            console.error("Error fetching report data:", err);
            toast.error("Failed to fetch report data");
        }
    };

    // Filter report data based on search term
    const filteredData = reportData.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
            item.className?.toLowerCase().includes(searchLower) ||
            item.sectionName?.toLowerCase().includes(searchLower)
        );
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="p-4  min-h-screen">
            <div className='grid grid-cols-4 gap-4'>
                <div className=" mb-8">
                    <div className="space-y-3 w-full max-w-md">
                        <label className="block font-bold text-base">
                            Class <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full border border-[#C0D5FF] rounded p-2"
                        >
                            <option value="">Select Class</option>
                            {classes.map((cls) => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.Name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="space-y-3 w-full max-w-md">
                        <label className="block font-bold text-base">
                            Section <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="w-full border border-[#C0D5FF] rounded p-2"
                        >
                            <option value="">Select Section</option>
                            {sections.map((section) => (
                                <option key={section._id} value={section._id}>
                                    {section.Name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className=" mb-8">
                    <div className="space-y-3 w-full max-w-md">
                        <label className="block font-bold text-base">
                            From Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full border border-[#C0D5FF] rounded p-2"
                        />
                    </div>
                </div>

                <div className="mb-12">
                    <div className="space-y-3 w-full max-w-md">
                        <label className="block font-bold text-base">
                            To Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full border border-[#C0D5FF] rounded p-2"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-12">
                <button
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
                        Report List
                    </h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex justify-end">
                <div className="relative w-96">
                    <input
                        type="text"
                        placeholder="Search by class or section..."
                        className="w-full p-2 pl-10 border border-[#C0D5FF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">S.No.</th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">Class</th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">Section</th>
                            <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">Total Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="border border-gray-400 px-4 py-2 text-center text-gray-600">
                                    No data found.
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border border-gray-400 px-4 py-2 text-sm">{indexOfFirstItem + index + 1}</td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">{item.className}</td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">{item.sectionName}</td>
                                    <td className="border border-gray-400 px-4 py-2 text-sm">{item.totalStudents}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end px-4 my-8">
                <div className="grid grid-cols-3 items-center w-32 h-12 border-2 border-[#151587] rounded-md">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex justify-center items-center disabled:opacity-50"
                    >
                        <MdNavigateBefore className="text-2xl text-[#151587]" />
                    </button>
                    <div className="bg-[#151587] text-white font-semibold flex justify-center items-center h-full text-base">
                        {currentPage}
                    </div>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex justify-center items-center disabled:opacity-50"
                    >
                        <MdNavigateNext className="text-2xl text-[#151587]" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ClassSectionReport;
