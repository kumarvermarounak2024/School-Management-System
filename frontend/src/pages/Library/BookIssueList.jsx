import axios from 'axios';
import React, { useState, useMemo, useEffect } from 'react';
import { FcNext, FcPrevious } from 'react-icons/fc';

import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookIssueList = () => {
    // Dummy data for book issues
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    
    const navigate = useNavigate();
    const [issues, setIssues] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const issuesPerPage = 3;

    // Search functionality
 const filteredIssues = useMemo(() => {
  const lowerSearch = searchTerm.toLowerCase();

  return issues.filter(issue => {
    const bookTitle = issue?.bookTitle?.title?.toLowerCase() || '';
    const issuedToName = issue?.issuedTo?.name?.toLowerCase() || '';
    const userName = (
      (issue?.user?.firstName || '') + ' ' + (issue?.user?.lastName || '')
    ).toLowerCase();
    const status = issue?.status?.toLowerCase() || '';

    return (
      bookTitle.includes(lowerSearch) ||
      issuedToName.includes(lowerSearch) ||
      userName.includes(lowerSearch) ||
      status.includes(lowerSearch)
    );
  });
}, [issues, searchTerm]);


    // Pagination
    const totalPages = Math.ceil(filteredIssues.length / issuesPerPage);
    const startIndex = (currentPage - 1) * issuesPerPage;
    const currentIssues = filteredIssues.slice(startIndex, startIndex + issuesPerPage);

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
        console.log(`Edit issue with ID: ${id}`);
        navigate(`/bookIssue/${id}`);
        // Implement edit functionality here
    };

    const handleDelete = async (id) => {
        try {
                const response = await axios.delete(`${apiUrl}/bookIssue/delete/${id}`);
        console.log(response.data.data, "delete book issue");
        
        getBookIssue();
        toast.success("Book issue deleted successfully");
        issues.filter(issue => issue._id !== id); 
        } catch (error) {
            console.log(error)
        }

        // Implement delete functionality here
    };
    useEffect(() => {
        getBookIssue();
    }, []);
    const getBookIssue = async () => {
        const response = await axios.get(`${apiUrl}/bookIssue/getAll`);
        console.log(response.data.data, "all book issue");
        setIssues(response?.data?.data);
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Search Bar */}
            <div className="flex justify-end mb-4">
                <input
                    type="text"
                    placeholder="Search by title, issued by, user, or status..."
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
                            <th className="px-4 py-2 border">Cover</th>
                            <th className="px-4 py-2 border">Issued By</th>
                            <th className="px-4 py-2 border">User Name</th>
                            <th className="px-4 py-2 border">Date of Issue</th>
                            <th className="px-4 py-2 border">Date of Expiry</th>
                            <th className="px-4 py-2 border">Fine</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentIssues.length > 0 ? (
                            currentIssues.map((issue, idx) => (
                                <tr key={issue._id} className="bg-white border-t">
                                    <td className="px-4 py-2 border">{startIndex + idx + 1}</td>
                                    <td className="px-4 py-2 border">
                                        {issue?.bookTitle?.title || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <div>

                                            {issue?.bookTitle?.coverImage ? (
                                                <img src={issue?.bookTitle?.coverImage} alt="Book Cover" className="w-10 h-10 object-cover" />
                                            ) : (
                                                <span className="text-gray-400">[No content]</span>
                                            )}
                                        </div>

                                    </td>
                                  <td className="px-4 py-2 border">
  {issue?.issuedTo?.name || <span className="text-gray-400">[No content]</span>}
</td>

                                  <td className="px-4 py-2 border">
  {(issue?.user?.firstName || "") + " " + (issue?.user?.lastName || "") || (
    <span className="text-gray-400">[No content]</span>
  )}
</td>

                                    <td className="px-4 py-2 border">
                                        {issue?.issueDate || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {issue?.expiryDate || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {issue?.fine ? `$${issue?.fine.toFixed(2)}` : <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {issue?.status || <span className="text-gray-400">[No content]</span>}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <div className="flex gap-3">
                                            <button
                                                className="w-6 h-6 bg-[#143781] text-white rounded-full flex items-center justify-center cursor-pointer"
                                                onClick={() => handleEdit(issue._id)}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer"
                                                onClick={() => handleDelete(issue._id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="px-4 py-2 text-center text-gray-500">
                                    No book issues found.
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

export default BookIssueList;