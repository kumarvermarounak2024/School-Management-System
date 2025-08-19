import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Pencil } from 'lucide-react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

function CategoryList() {
    const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');

    // Fetch data on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${apiUrl}/hostel/category/getAll`);
            setCategories(response.data.data || []);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    // Filtered & paginated data
    const filteredData = categories.filter((category) =>
        (category?.Category_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPageData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleEdit = (id, name) => {
        setEditId(id);
        setEditName(name);
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`${apiUrl}/hostel/category/update/${editId}`, { Category_name: editName });
            setEditId(null);
            setEditName('');
            fetchCategories(); // refresh data
        } catch (err) {
            console.error("Failed to update category", err);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                await axios.delete(`${apiUrl}/hostel/category/delete/${id}`);
                fetchCategories(); // refresh
            } catch (err) {
                console.error("Failed to delete", err);
            }
        }
    };

    return (
        <div className="p-6">
            {/* Search */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by category..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border px-4 py-2 rounded w-[30vw]"
                />
            </div>

            {/* Table */}
            {categories.length === 0 ? (
                <p>No categories found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-black bg-white">
                        <thead className="bg-[#D5DDFF] text-left">
                            <tr>
                                <th className="border px-4 py-2">S.No</th>
                                <th className="border px-4 py-2">Category</th>
                                <th className="border px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((category, index) => (
                                <tr key={category._id}>
                                    <td className="p-3 border border-gray-200 text-center">
                                        {indexOfFirstItem + index + 1}
                                    </td>
                                    <td className="p-3 border border-gray-200">
                                        {editId === category._id ? (
                                            <input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="border px-2 py-1 rounded"
                                            />
                                        ) : (
                                            category.Category_name
                                        )}
                                    </td>
                                    <td className="border border-black px-4 py-2 text-sm">
                                        <div className="flex gap-4">
                                            {editId === category._id ? (
                                                <button
                                                    onClick={handleEditSubmit}
                                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleEdit(category._id, category.Category_name)}
                                                    title="Edit Category"
                                                    className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                title="Delete Category"
                                                className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
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
            )}

            {/* Pagination */}
            {filteredData.length > itemsPerPage && (
                <div className="flex justify-end px-4 my-8">
                    <div className="grid grid-cols-3 items-center w-32 h-12 border-2 border-[#151587] rounded-md">
                        <button 
                            onClick={handlePreviousPage} 
                            disabled={currentPage === 1}
                            className="flex justify-center items-center"
                        >
                            <MdNavigateBefore className="text-2xl text-[#343438]" />
                        </button>
                        <div className="bg-[#151587] text-white font-semibold flex justify-center items-center h-full text-base">
                            {currentPage}
                        </div>
                        <button 
                            onClick={handleNextPage} 
                            disabled={currentPage === totalPages}
                            className="flex justify-center items-center"
                        >
                            <MdNavigateNext className="text-2xl text-[#151587]" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryList;