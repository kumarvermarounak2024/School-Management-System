import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { FcNext, FcPrevious } from 'react-icons/fc';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function AllocationList() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Handle search input
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page on search

        const filteredAssignments = assignments.filter(
            (assignment) =>
                assignment.student.toLowerCase().includes(term) ||
                assignment.fatherName.toLowerCase().includes(term) ||
                assignment.routeName.toLowerCase().includes(term) ||
                assignment.stopPage.toLowerCase().includes(term) ||
                assignment.vehicleNumber.toLowerCase().includes(term) ||
                assignment.routeFare.toLowerCase().includes(term)
        );
        setAssignments(filteredAssignments);
    };

    // Handle edit (placeholder)
    const handleEdit = (id) => {
        navigate(`/VehicleAllocation/${id}`)
    };

    // Handle delete
    const handleDelete = async (id) => {
        console.log(id, "delte idid")
        if (window.confirm(`Are you sure you want to delete assignment ${id}?`))
            try {
                const response = await
                    axios.delete(`${apiUrl}/allocationRoute/delete/${id}`); const
                        updatedAssignments = assignments.filter((assignment) =>
                            assignment._id !== id);
                setAssignments(updatedAssignments);
                if (updatedAssignments.length <= (currentPage - 1) * itemsPerPage && currentPage >
                    1) {
                    setCurrentPage(currentPage - 1);
                }
            } catch (error) {
                console.log(error, "eror while getting allocation list data")
            }

        // Adjust current page if necessary


    };

    // Pagination logic
    const totalPages = Math.ceil(assignments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAssignments = assignments.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/allocationRoute/getAll`)
            console.log(response?.data, "getingn data")
            setAssignments(response?.data)

        } catch (error) {
            console.log(error, "eror while getting allocation list data")
        }
    }
    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="mt-6 px-4">
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
                            <th className="px-4 py-2 border">Student Name</th>
                            <th className="px-4 py-2 border">Father Name</th>
                            <th className="px-4 py-2 border">Route Name</th>
                            <th className="px-4 py-2 border">Stop Page</th>
                            <th className="px-4 py-2 border">Vehicle Number</th>
                            <th className="px-4 py-2 border">Route Fare</th>
                            <th className="px-4 py-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAssignments.map((assignment, idx) => (
                            <tr key={assignment._id} className="bg-white border-t">
                                <td className="px-4 py-2 border">{startIndex + idx + 1}</td>
                                <td className="px-4 py-2 border">
                                    {typeof assignment.student === 'object' && assignment.student !== null
                                        ? `${assignment.student?.firstName || ''} ${assignment.student?.lastName || ''}`.trim() || <span className="text-gray-400">[No content]</span>
                                        : assignment.student || <span className="text-gray-400">[No content]</span>}
                                </td>
                                <td className="px-4 py-2 border">
                                    {assignment.fatherName || <span className="text-gray-400">[No content]</span>}
                                </td>
                                <td className="px-4 py-2 border">
                                    {typeof assignment.routeName === 'object' && assignment.routeName !== null
                                        ? assignment.routeName?.routeName || <span className="text-gray-400">[No content]</span>
                                        : assignment.route || <span className="text-gray-400">[No content]</span>}
                                </td>
                                <td className="px-4 py-2 border">
                                    {typeof assignment.stoppage === 'object' && assignment.stoppage !== null
                                        ? assignment.stoppage?.stoppage || <span className="text-gray-400">[No content]</span>
                                        : assignment.stoppage || <span className="text-gray-400">[No content]</span>}
                                </td>
                                <td className="px-4 py-2 border">
                                    {typeof assignment.vehicleNumber === 'object' && assignment.vehicleNumber !== null
                                        ? assignment.vehicleNumber?.vehicleNumber || <span className="text-gray-400">[No content]</span>
                                        : assignment.vehicleNumber || <span className="text-gray-400">[No content]</span>}
                                </td>
                                <td className="px-4 py-2 border">
                                    {assignment.routeFare || <span className="text-gray-400">[No content]</span>}
                                </td>
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
                    className="px-4 py-2  text-white rounded-md disabled:bg-white "
                >
                    <FcPrevious />
                </button>

                <button
                    key={currentPage}
                    onClick={() => handlePageChange(currentPage)}
                    className={`px-4 py-2 rounded-md ${currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'
                        }`}
                >
                    {currentPage}
                </button>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2  text-white rounded-md disabled:bg-white "
                >

                    <FcNext />
                </button>
            </div>
        </div>
    );
}

export default AllocationList;