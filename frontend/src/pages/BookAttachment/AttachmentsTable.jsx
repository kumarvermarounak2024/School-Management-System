import React, { useState, useEffect } from "react";
import { FaPaperclip, FaPlus, FaSearch, FaFilePdf, FaFileExcel, FaFileWord, FaFileArchive } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, Pencil, Trash2 } from 'lucide-react';

const AttachmentsTable = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("attachments");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 10;

  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  // Fetch attachments from API
const fetchAttachments = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${apiUrl}/attachment/getAll`, {
      params: {
    search: submittedSearchTerm,
        page: currentPage,
        limit: itemsPerPage,
      },
    });

    const resData = response.data;

    const fetchedData = Array.isArray(resData.data) ? resData.data : [];

    setAttachments(fetchedData);
    setTotalPages(resData.totalPages || 1);
    setTotalItems(resData.totalCount || fetchedData.length);
  } catch (error) {
    console.error("Error fetching attachments:", error);
    toast.error("Failed to fetch attachments");
    setAttachments([]); // fallback to avoid blank
  } finally {
    setLoading(false);
  }
};



  // Delete attachment
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      try {
await axios.delete(`${apiUrl}/attachment/delete/${id}`);
        toast.success("Attachment deleted successfully");
        fetchAttachments(); // Refresh the list
      } catch (error) {
        console.error("Error deleting attachment:", error);
        toast.error("Failed to delete attachment");
      }
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); 
    // fetchAttachments();
      setSubmittedSearchTerm(searchTerm);

  };
  useEffect(() => {
  fetchAttachments();
}, [currentPage, submittedSearchTerm]);


  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Fetch attachments on component mount and when currentPage or searchTerm changes
// useEffect(() => {
//   fetchAttachments();
// }, [currentPage, submittedSearchTerm]);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "create") {
      navigate("/create-attachment");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className=" mx-auto mt-8 p-4 bg-gray-50 shadow rounded-md">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => handleTabClick("attachments")}
          className={`flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-black relative ${
            activeTab === "attachments" ? "text-black" : ""
          }`}
        >
          <FaPaperclip className="mr-1" />
          Attachments
          {activeTab === "attachments" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-900 rounded-t-md"></span>
          )}
        </button>
        <button
          onClick={() => handleTabClick("create")}
          className={`flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-black relative ${
            activeTab === "create" ? "text-black" : ""
          }`}
        >
          <FaPlus className="mr-1" />
          Create Attachments
          {activeTab === "create" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-md"></span>
          )}
        </button>
      </div>

      {activeTab === "attachments" && (
        <>
          {/* Table Toolbar */}
          <div className="flex justify-between mb-4">
            <div className="flex space-x-2">
              <button className="border px-3 py-1 rounded shadow text-sm hover:bg-gray-100">
                <FaFilePdf className="text-red-500" />
              </button>
              <button className="border px-3 py-1 rounded shadow text-sm hover:bg-gray-100">
                <FaFileExcel className="text-green-600" />
              </button>
              <button className="border px-3 py-1 rounded shadow text-sm hover:bg-gray-100">
                <FaFileWord className="text-blue-500" />
              </button>
              <button className="border px-3 py-1 rounded shadow text-sm hover:bg-gray-100">
                <FaFileArchive className="text-yellow-500" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="flex">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border px-3 py-1 pl-8 rounded text-sm w-48 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-2 top-2 text-gray-400" />
              </div>
              <button 
                type="submit" 
            className="bg-[#143781] text-white px-4 py-2 rounded hover:bg-opacity-90"
              >
                Search
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
           {loading ? (
  <p className="text-center text-gray-500">Loading...</p>
) : attachments.length === 0 ? (
  <p className="text-center text-gray-500">No attachments found.</p>
) : (
 <table className="min-w-full border text-sm text-left">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-2 border">SL</th>
      <th className="p-2 border">Title</th>
      <th className="p-2 border">Type</th>
      <th className="p-2 border">Class</th>
      <th className="p-2 border">Subject</th>
      <th className="p-2 border">Remark</th>
      <th className="p-2 border">Publisher</th>
      <th className="p-2 border">Date</th>
      <th className="p-2 border">Action</th>
    </tr>
  </thead>
  <tbody>
    {attachments.map((item, index) => (
      <tr key={item._id} className="border hover:bg-gray-50">
        <td className="p-2 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
        <td className="p-2 border">{item.title}</td>
        <td className="p-2 border">{item.type || "N/A"}</td>
        <td className="p-2 border">{item.class?.Name || "N/A"}</td>
        <td className="p-2 border">{item.subject?.subjectName || "N/A"}</td>
        <td className="p-2 border">{item.remarks || "N/A"}</td>
        <td className="p-2 border">{item.subject?.subjectAuthor || "N/A"}</td>
        <td className="p-2 border">{formatDate(item.publishDate)}</td>
        <td className="p-2 border space-x-2 flex gap-4">
          <a
            href={item.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
          >
             <Eye size={16} />
          </a>
          {/* <button
            onClick={() => navigate(`/create-attachment/${item._id}`)}
   className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
          >
           <Pencil size={16} />
          </button> */}
          <button
  onClick={() =>
    navigate("/create-attachment", {
      state: { mode: "edit", attachment: item },
    })
  }
  className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
>
  <Pencil size={16} />
</button>

          <button
            onClick={() => handleDelete(item._id)}
   className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
          >
           <Trash2 size={16} />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

)}

          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
             <div className="text-sm text-gray-600">
  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
  {totalItems} entries
</div>

              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === 1
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-500 text-white"
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={`px-3 py-1 rounded text-sm ${
                        currentPage === pageNum
                          ? "bg-yellow-500 text-white"
                          : "bg-yellow-400 hover:bg-yellow-500 text-white"
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-3 py-1">...</span>
                )}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === totalPages
                        ? "bg-yellow-500 text-white"
                        : "bg-yellow-400 hover:bg-yellow-500 text-white"
                    }`}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === totalPages
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-500 text-white"
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttachmentsTable;