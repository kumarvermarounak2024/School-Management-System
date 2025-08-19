import React, { useState, useMemo, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FcNext, FcPrevious } from 'react-icons/fc';

const BookList = () => {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    // Dummy data

    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 3;

    // Search functionality
    const filteredBooks = useMemo(() => {
        return books.filter(book =>
            (book?.bookstitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (book?.bookCategory?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
    }, [books, searchTerm]);

    // Pagination
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const currentBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleEdit = (id) => {
        navigate(`/createBooks/${id}`);
        // Implement edit functionality here
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${apiUrl}/booksRoute/delete/${id}`);
            toast.success('Book deleted successfully');
            // Remove the deleted book from the state immediately
            setBooks(prevBooks => prevBooks.filter(book => book._id !== id));


        } catch (error) {
            console.error('Error deleting book:', error);
            toast.error('Error deleting book');
        }
    };

    const getBooks = async () => {
        try {
            const response = await axios.get(`${apiUrl}/booksRoute/getAll`);
            // Ensure we're setting an array, even if empty
            console.log(response?.data?.data, "upcomd saa");
            const booksData = response?.data?.data;

            setBooks(booksData);
        } catch (error) {
            console.error('Error fetching books:', error);
            setBooks([]); // Set empty array on error
        }
    };

    useEffect(() => {
        getBooks();
    }, []);
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Search Bar */}
            <div className="flex justify-end mb-4">
                <input
                    type="text"
                    placeholder="Search by title, ISBN, or category..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="p-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm text-left">
                    <thead className="bg-blue-100 text-black">
                        <tr>
                            <th className="px-4 py-2 border">SL</th>
                            <th className="px-4 py-2 border">Book Title</th>
                            <th className="px-4 py-2 border">Covering</th>
                            <th className="px-4 py-2 border">Edition</th>
                            <th className="px-4 py-2 border">ISBN Number</th>
                            <th className="px-4 py-2 border">Category</th>
                            <th className="px-4 py-2 border">Description</th>
                            <th className="px-4 py-2 border">Purchase Date</th>
                            <th className="px-4 py-2 border">Price</th>
                            <th className="px-4 py-2 border">Total Stock</th>
                            <th className="px-4 py-2 border">Issued Copy</th>
                            <th className="px-4 py-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBooks.length > 0 ? (
                            currentBooks.map((book, idx) => (
                                <tr key={book._id} className="bg-white border-t">
                                    <td className="px-4 py-2 border">{startIndex + idx + 1}</td>
                                    <td className="px-4 py-2 border">
                                        {book?.title || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <img src={book?.coverImage} alt="Book Cover" className="w-10 h-10" />
                                        {/* {book?.cover || <span className="text-gray-400">[No content]</span>} */}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {book?.edition || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {book?.isbn || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {book?.category?.name || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {book?.description || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {book?.purchaseDate || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {book?.price ? `$${book.price.toFixed(2)}` : <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {book?.totalStock || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {book?.issued || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <div className="flex gap-3">
                                            <button
                                                className="w-6 h-6 bg-[#143781] text-white rounded-full flex items-center justify-center cursor-pointer"
                                                onClick={() => handleEdit(book._id)}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer"
                                                onClick={() => handleDelete(book._id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="px-4 py-2 text-center text-gray-500">
                                    No books found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-4">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-md disabled:opacity-50 hover:bg-blue-600"
                    >
                        <FcPrevious />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className="px-4 py-2 rounded-md bg-blue-500 text-white"
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-md disabled:opacity-50 hover:bg-blue-600"
                    >
                        <FcNext />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookList;