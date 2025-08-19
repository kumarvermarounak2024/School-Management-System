import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FiSearch, FiPrinter, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';

const mockStudents = [
    {
        id: 1,
        name: 'Sarika Tiwari',
        category: 'Sc',
        registerNo: 'RSM-00057',
        rollNo: '106',
        mobile: '0987654321',
    },
];

// const classOptions = ['class 10', 'class 9', 'class 8'];
// const sectionOptions = ['Section A', 'Section B', 'Section C'];
const templateOptions = ['Marksheet', 'Transfer Certificate', 'Bonafide'];

function GenerateTeacher() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [search, setSearch] = useState('');
    const [students, setStudents] = useState(mockStudents);
    const [selectedRows, setSelectedRows] = useState([]);
    const [classList, setClassList] = useState([]);
    const [sectionList, setSectionList] = useState([]);

    useEffect(() => {
        fetchClasses();
        fetchSections();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await axios.get(`${apiUrl}/class/getAll`);
            console.log(res.data.classes, "classes");
            setClassList(res.data.classes || []);
        } catch (err) {
            console.error("Error fetching classes:", err);
            toast.error("Failed to fetch classes");
        }
    };

    const fetchSections = async () => {
        try {
            const res = await axios.get(`${apiUrl}/section/getAll`);
            console.log(res.data.sections, "sections");
            setSectionList(res.data.sections || []);
        } catch (err) {
            console.error("Error fetching sections:", err);
            toast.error("Failed to fetch sections");
        }
    };

    const handleCheckbox = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.registerNo.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
        s.mobile.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-[#f4f6fb] min-h-screen p-6">
            {/* Top Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <label className="block mb-1 text-sm font-semibold">Role <span className="text-red-500">*</span></label>
                    <select
                        className="w-full border border-[#bfc6e0] rounded p-2 bg-white"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        {classList.map((c) => (
                            <option key={c} value={c?._id}>{c?.Name}</option>
                        ))}
                    </select>
                </div>
               
                <div className="flex-1">
                    <label className="block mb-1 text-sm font-semibold">Template <span className="text-red-500">*</span></label>
                    <select
                        className="w-full border border-[#bfc6e0] rounded p-2 bg-white"
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                        {templateOptions.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-center mb-6">
                <button className="bg-[#232b7a] text-white px-16 py-2 rounded text-lg font-semibold shadow hover:bg-[#1a1f5c] transition">Show</button>
            </div>
            <div className="flex gap-2 justify-end items-center">
                <button className="flex items-center gap-2 px-4 py-2 border border-[#232b7a] rounded bg-white text-[#232b7a] font-semibold"><FiPrinter /> Generate</button>
            </div>
            {/* Students List Tab */}
            <div className="p-4 ">
                <div className="flex items-center border-b border-[#bfc6e0] mb-2">
                    <button className="flex items-center gap-2 px-2 py-1  text-[#232b7a] font-semibold border-b-2 border-[#232b7a] bg-transparent">
                        <span className="text-lg">≡</span> Employee List
                    </button>
                </div>
                <div className="flex flex-col md:flex-row md:items-center mt-4 justify-between mb-2 gap-2">
                    <div className="flex gap-2 items-center">
                        <button className="p-2 rounded border border-[#bfc6e0] bg-[#f4f6fb] text-[#232b7a]" title="Export"><FiFileText /></button>
                        <button className="p-2 rounded border border-[#bfc6e0] bg-[#f4f6fb] text-[#232b7a]" title="Print"><FiPrinter /></button>
                    </div>
                    <div className="flex gap-2 items-center">

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiSearch /></span>
                            <input
                                className="pl-10 pr-2 py-2 border border-[#bfc6e0] rounded bg-white w-64"
                                placeholder="Search Here..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm text-left">
                        <thead className="bg-[#e9eaf6] text-black">
                            <tr>
                                <th className="px-3 py-2 border">SL</th>
                                <th className="px-3 py-2 border"><input type="checkbox" disabled className="accent-[#232b7a]" /></th>
                                <th className="px-3 py-2 border">Employe  Name</th>
                                <th className="px-3 py-2 border">Department</th>
                                <th className="px-3 py-2 border">Designation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? filteredStudents.map((s, idx) => (
                                <tr key={s.id} className="bg-white border-t">
                                    <td className="px-3 py-2 border">{idx + 1}</td>
                                    <td className="px-3 py-2 border text-center">
                                        <input
                                            type="checkbox"
                                            className="accent-[#232b7a]"
                                            checked={selectedRows.includes(s.id)}
                                            onChange={() => handleCheckbox(s.id)}
                                        />
                                    </td>
                                    <td className="px-3 py-2 border">{s.name}</td>
                                    <td className="px-3 py-2 border">{s.category}</td>
                                    <td className="px-3 py-2 border">{s.registerNo}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="px-3 py-2 text-center text-gray-500">No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="flex justify-end mt-4">
                    <button className="px-3 py-1 border rounded bg-[#e9eaf6] text-[#232b7a]">&lt;</button>
                    <span className="mx-2">1</span>
                    <button className="px-3 py-1 border rounded bg-[#e9eaf6] text-[#232b7a]">&gt;</button>
                </div>
            </div>
            {/* Cancel Button */}
            <div className="flex justify-center mt-10">
                <button className="border border-[#232b7a] text-[#232b7a] px-12 py-2 rounded font-semibold text-lg bg-white shadow hover:bg-[#f4f6fb] transition">Cancel</button>
            </div>
        </div>
    );
}

export default GenerateTeacher;
