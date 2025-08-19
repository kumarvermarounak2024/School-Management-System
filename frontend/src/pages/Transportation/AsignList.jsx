import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { FcNext, FcPrevious } from 'react-icons/fc';
import { VscGlobe } from 'react-icons/vsc';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AsignList() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const navigate = useNavigate()
    const [assignments, setAssignments] = useState([]);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Handle search input
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page on search

        const filtered = assignments.filter(
            (assignment) =>
                (assignment?.transportRoute?.routeName?.toLowerCase() || '').includes(term) ||
                (assignment?.transportRoute?.startPlace?.toLowerCase() || '').includes(term) ||
                (assignment?.stoppage?.stoppage?.toLowerCase() || '').includes(term) ||
                (assignment?.transportRoute?.stopPlace?.toLowerCase() || '').includes(term) ||
                (assignment?.stoppage?.routeFare?.toString() || '').includes(term) ||
                (assignment?.vehicles[0]?.vehicleNumber?.toLowerCase() || '').includes(term)
        );
        setFilteredAssignments(filtered);
    };

    // Handle edit
    const handleEdit = (id) => {
        navigate(`/assignVehicle/${id}`)
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await axios.delete(`${apiUrl}/vehicleAssign/delete/${id}`);
                // Update both assignments and filteredAssignments
                const updatedAssignments = assignments.filter(assignment => assignment._id !== id);
                setAssignments(updatedAssignments);
                setFilteredAssignments(updatedAssignments);

                toast.success('Assignment deleted successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });

                // Adjust current page if necessary
                if (updatedAssignments.length <= (currentPage - 1) * itemsPerPage && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } catch (error) {
                console.error('Error deleting assignment:', error);
                toast.error('Failed to delete assignment. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAssignments = filteredAssignments.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/vehicleAssign/getAll`)
            console.log(response?.data, "assign list data")
            const data = response?.data?.data || [];
            setAssignments(data);
            setFilteredAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            toast.error('Failed to fetch assignments. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div className="mt-6">
            {/* Search Bar */}
            <div className="flex justify-end mb-4">
                <input
                    type="text"
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full max-w-xs px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm text-left">
                    <thead className="bg-blue-100 text-black">
                        <tr>
                            <th className="px-4 py-2 border">SL</th>
                            <th className="px-4 py-2 border">Route Name</th>
                            <th className="px-4 py-2 border">Start Place</th>
                            <th className="px-4 py-2 border">Stoppage</th>
                            <th className="px-4 py-2 border">Stop Place</th>
                            <th className="px-4 py-2 border">Route Fare</th>
                            <th className="px-4 py-2 border">Vehicle Number</th>
                            <th className="px-4 py-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAssignments.map((assignment, idx) => (
                            <tr key={assignment._id} className="bg-white border-t">
                                <td className="px-4 py-2 border">{startIndex + idx + 1}</td>
                                <td className="px-4 py-2 border">
                                    {assignment?.transportRoute?.routeName}
                                </td>
                                <td className="px-4 py-2 border">{assignment?.transportRoute?.startPlace}</td>
                                <td className="px-4 py-2 border">{assignment?.stoppage?.stoppage}</td>
                                <td className="px-4 py-2 border">{assignment?.transportRoute?.stopPlace}</td>
                                <td className="px-4 py-2 border">{assignment?.stoppage?.routeFare}</td>
                                <td className="px-4 py-2 border">{assignment?.vehicles[0]?.vehicleNumber}</td>
                                <td className="px-4 py-2 border">
                                    <div className="flex gap-3">
                                        <button
                                            className="w-6 h-6 bg-[#143781] text-white rounded-full flex items-center justify-center cursor-pointer"
                                            onClick={() => handleEdit(assignment._id)}
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer"
                                            onClick={() => handleDelete(assignment._id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-4 space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-white rounded-md disabled:bg-white hover:bg-blue-600"
                >
                    <FcPrevious />
                </button>

                <button
                    key={currentPage}
                    onClick={() => handlePageChange(currentPage)}
                    className={`px-4 py-2 rounded-md ${currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                >
                    {currentPage}
                </button>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-white rounded-md disabled:bg-white hover:bg-blue-600"
                >
                    <FcNext />
                </button>
            </div>
        </div>
    );
}

export default AsignList;