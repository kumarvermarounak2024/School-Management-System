import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { FcPrevious, FcNext } from 'react-icons/fc';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StopPageList() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const [allRoutes, setAllRoutes] = useState([]); // Original data
    const [filteredRoutes, setFilteredRoutes] = useState([]); // Filtered data for display
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Number of routes per page

    // Fetch data
    const getdata = async () => {
        try {
            const response = await axios.get(`${apiUrl}/stoppage/getAll`);
            console.log(response?.data?.data, 'getstopdata');
            const data = response?.data?.data || [];
            setAllRoutes(data);
            setFilteredRoutes(data); // Initialize filteredRoutes with all data
        } catch (error) {
            console.error('Error fetching stoppage data:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to fetch stoppages'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    // Handle search input
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page on search

        // Filter allRoutes based on search term
        const filtered = allRoutes.filter((route) =>
            (route.stoppage?.toLowerCase().includes(term) || '') ||
            (route.stopTiming?.toLowerCase().includes(term) || '') ||
            (route.routeFare?.toString().toLowerCase().includes(term) || '')
        );
        setFilteredRoutes(filtered);
    };

    // Handle edit
    const handleEdit = (id) => {
        navigate(`/createStopPage/${id}`);
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this stoppage?')) {
            try {
                await axios.delete(`${apiUrl}/stoppage/delete/${id}`);
                // Update both allRoutes and filteredRoutes
                setAllRoutes(allRoutes.filter((route) => route._id !== id));
                setFilteredRoutes(filteredRoutes.filter((route) => route._id !== id));
                setCurrentPage(1); // Reset to first page after deletion
                toast.success('Stoppage deleted successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            } catch (error) {
                console.error('Error deleting stoppage:', error);
                toast.error(`Error: ${error?.response?.data?.message || 'Failed to delete stoppage'}`, {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
    const indexOfLastRoute = currentPage * itemsPerPage;
    const indexOfFirstRoute = indexOfLastRoute - itemsPerPage;
    const currentRoutes = filteredRoutes.slice(indexOfFirstRoute, indexOfLastRoute);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    useEffect(() => {
        getdata();
    }, []);

    return (
        <div className="mt-6">
            {/* Search Bar */}
            <div className="mb-4 flex justify-end">
                <input
                    type="text"
                    placeholder="Search stoppages..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm text-left">
                    <thead className="bg-blue-100 text-black">
                        <tr>
                            <th className="px-4 py-2 border">SL</th>
                            <th className="px-4 py-2 border">Stoppage</th>
                            <th className="px-4 py-2 border">Stop Timing</th>
                            <th className="px-4 py-2 border">Route Fare</th>
                            <th className="px-4 py-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRoutes.length > 0 ? (
                            currentRoutes.map((route, idx) => (
                                <tr key={route._id} className="bg-white border-t">
                                    <td className="px-4 py-2 border">{indexOfFirstRoute + idx + 1}</td>
                                    <td className="px-4 py-2 border">
                                        {route.stoppage || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">{route.stopTiming}</td>
                                    <td className="px-4 py-2 border">{route.routeFare}</td>
                                    <td className="px-4 py-2 border">
                                        <div className="flex gap-3">
                                            <button
                                                className="w-6 h-6 bg-[#143781] text-white rounded-full flex items-center justify-center cursor-pointer"
                                                onClick={() => handleEdit(route._id)}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer"
                                                onClick={() => handleDelete(route._id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                                    No stoppages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-4 space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md disabled:opacity-50"
                >
                    <FcPrevious />
                </button>
                <button
                    className="px-4 py-2 rounded-md bg-blue-500 text-white"
                >
                    {currentPage}
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md disabled:opacity-50"
                >
                    <FcNext />
                </button>
            </div>

            <ToastContainer />
        </div>
    );
}

export default StopPageList;