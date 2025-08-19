import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { FcPrevious, FcNext } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function BookCategoryList() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const [allCategories, setAllCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const itemsPerPage = 5;

    // Fetch categories
    const getData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${apiUrl}/booksCategory/getAll`);
            console.log('API response:', response.data);
            const categories = response?.data?.data || [];
            setAllCategories(categories);
            setFilteredCategories(categories); // Initialize filteredCategories
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError(error.response?.data?.message || 'Failed to fetch categories');
            toast.error(error.response?.data?.message || 'Failed to fetch categories', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle search input
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setCurrentPage(1);

        const filtered = allCategories.filter((category) =>
            category.name?.toLowerCase().includes(term)
        );
        setFilteredCategories(filtered);
    };

    // Handle edit
    const handleEdit = (id) => {
        navigate(`/addBookname/${id}`);
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete category ${id}?`)) {
            try {
                await axios.delete(`${apiUrl}/booksCategory/delete/${id}`);
                const updatedAllCategories = allCategories.filter((category) => category._id !== id);
                const updatedFilteredCategories = filteredCategories.filter((category) => category._id !== id);
                setAllCategories(updatedAllCategories);
                setFilteredCategories(updatedFilteredCategories);

                // Adjust pagination
                const totalPages = Math.ceil(updatedFilteredCategories.length / itemsPerPage);
                if (currentPage > totalPages && totalPages > 0) {
                    setCurrentPage(totalPages);
                } else if (updatedFilteredCategories.length === 0) {
                    setCurrentPage(1);
                }

                toast.success('Category deleted successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error(error.response?.data?.message || 'Failed to delete category', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const indexOfFirstRoute = (currentPage - 1) * itemsPerPage;
    const currentCategories = filteredCategories.slice(
        indexOfFirstRoute,
        indexOfFirstRoute + itemsPerPage
    );

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="mt-6">
            {/* Search Bar */}
            <div className="mb-4 flex justify-end">
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
            </div>

            {/* Loading and Error States */}
            {loading && (
                <div className="text-center py-4">
                    <p className="text-gray-600">Loading categories...</p>
                </div>
            )}
            {error && (
                <div className="text-center py-4">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {/* Table */}
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm text-left">
                        <thead className="bg-blue-100 text-black">
                            <tr>
                                <th className="px-4 py-2 border">SL</th>
                                <th className="px-4 py-2 border">Category Name</th>
                                <th className="px-4 py-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCategories.length > 0 ? (
                                currentCategories.map((category, idx) => (
                                    <tr key={category._id} className="bg-white border-t">
                                        <td className="px-4 py-2 border">{indexOfFirstRoute + idx + 1}</td>
                                        <td className="px-4 py-2 border">
                                            {category.name || <span className="text-gray-400">[No content]</span>}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <div className="flex gap-3">
                                                <Pencil
                                                    className="text-gray-600 hover:text-green-600 cursor-pointer"
                                                    size={18}
                                                    onClick={() => handleEdit(category._id)}
                                                />
                                                <Trash2
                                                    className="text-gray-600 hover:text-red-600 cursor-pointer"
                                                    size={18}
                                                    onClick={() => handleDelete(category._id)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!loading && !error && filteredCategories.length > 0 && (
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className="px-4 py-2 rounded-md disabled:opacity-50 hover:bg-blue-600"
                    >
                        <FcPrevious />
                    </button>
                    <button
                        key={currentPage}
                        onClick={() => handlePageChange(currentPage)}
                        className="px-4 py-2 rounded-md bg-blue-500 text-white"
                    >
                        {currentPage}
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className="px-4 py-2 rounded-md disabled:opacity-50 hover:bg-blue-600"
                    >
                        <FcNext />
                    </button>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

export default BookCategoryList;