import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import { FcPrevious, FcNext } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RouteList() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const [routes, setRoutes] = useState([]);
    const [filteredRoutes, setFilteredRoutes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/transportRoute/getAll`);
            console.log(response?.data?.data, "routes");
            const data = response?.data?.data || [];
            setRoutes(data);
            setFilteredRoutes(data);
        } catch (error) {
            console.error('Error fetching routes:', error);
            toast.error('Failed to fetch routes');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setCurrentPage(1);

        const filtered = routes.filter(route =>
            (route.startPlace?.toLowerCase() || '').includes(term) ||
            (route.stopPlace?.toLowerCase() || '').includes(term) ||
            (route.remark?.toLowerCase() || '').includes(term)
        );
        setFilteredRoutes(filtered);
    };

    const handleEdit = async (id) => {
        console.log(id, "edit id");
        navigate(`/createRoute/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this route?')) {
            try {
                await axios.delete(`${apiUrl}/transportRoute/delete/${id}`);
                // Update both routes and filteredRoutes
                const updatedRoutes = routes.filter(route => route._id !== id);
                setRoutes(updatedRoutes);
                setFilteredRoutes(updatedRoutes);
                setCurrentPage(1);
                toast.success('Route deleted successfully');
            } catch (error) {
                console.error('Error deleting route:', error);
                toast.error('Failed to delete route');
            }
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil((filteredRoutes.length) / itemsPerPage);
    const indexOfLastRoute = currentPage * itemsPerPage;
    const indexOfFirstRoute = indexOfLastRoute - itemsPerPage;
    const currentRoutes = filteredRoutes.slice(indexOfFirstRoute, indexOfLastRoute);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="mt-6">
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <>
                    <div className="mb-4 flex justify-end">
                        <input
                            type="text"
                            placeholder="Search routes..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm text-left">
                            <thead className="bg-blue-100 text-black">
                                <tr>
                                    <th className="px-4 py-2 border">SL</th>
                                    <th className="px-4 py-2 border">Start Place</th>
                                    <th className="px-4 py-2 border">Stop Place</th>
                                    <th className="px-4 py-2 border">Remark</th>
                                    <th className="px-4 py-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRoutes.length > 0 ? (
                                    currentRoutes.map((route, idx) => (
                                        <tr key={route._id} className="bg-white border-t">
                                            <td className="px-4 py-2 border">{indexOfFirstRoute + idx + 1}</td>
                                            <td className="px-4 py-2 border">
                                                {route.startPlace || <span className="text-gray-400">[No content]</span>}
                                            </td>
                                            <td className="px-4 py-2 border">{route.stopPlace}</td>
                                            <td className="px-4 py-2 border">{route.remark}</td>
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
                                        <td colSpan="5" className="px-4 py-2 border text-center">No routes available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-md disabled:opacity-50 hover:bg-blue-600"                        >
                            <FcPrevious />
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage)}
                            className="px-4 py-2 rounded-md bg-blue-500 text-white"
                        >
                            {currentPage}
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-md disabled:opacity-50 hover:bg-blue-600"                        >
                            <FcNext />
                        </button>
                    </div>
                </>
            )}
            <ToastContainer />
        </div>
    );
}

export default RouteList;