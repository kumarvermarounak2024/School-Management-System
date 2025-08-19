

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExamSetup = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  // Form fields
  const [examName, setExamName] = useState('');
  const [term, setTerm] = useState('');
  const [examType, setExamType] = useState('');
  const [remark, setRemark] = useState('');
  const [search, setSearch] = useState('');
  const [termsList, setTermsList] = useState([]);

  // Data list
  const [examList, setExamList] = useState([]);

  // For edit mode
  const [editingId, setEditingId] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  // Fetch exam list on component mount
  useEffect(() => {
    fetchExamList();
  }, []);

  
const fetchExamList = async () => {
    try {
      const res = await axios.get(`${apiUrl}/examination/getAll`);
      console.log("API Response:", res.data);
      
      // Extract all exams that have examList property
      // const allExams = res.data
      //   .filter(item => item.examList) // Only items with examList
      //   .map(item => ({
      //     ...item.examList,
      //     _id: item._id // Include the document ID
      //   }));
      const allExams = res.data.flatMap(item =>
  item.examList.map(exam => ({
    ...exam,
    parentId: item._id
  }))
);
      
      setExamList(allExams);

      // Extract unique terms from two possible sources:
      // 1. From examTerms array (first document)
      // 2. From examList.term values
      const termsFromExamTerms = res.data[0]?.examTerms?.map(t => t.name) || [];
      const termsFromExams = allExams.map(exam => exam.term).filter(Boolean);
      
     //     // Get unique term names
      const allTerms = res.data[0]?.examTerms
      console.log(res.data[0]?.examTerms, "res.data[0]?.examTerms")
      console.log(res.data[0], "res.data[0]")
      // .map(item => item.examTerms?.name)
      // .filter(name => name);

      // const uniqueTerms = [...new Set(allTerms)];
      console.log(allTerms, "allTerms")
      setTermsList(allTerms);
    } catch (error) {
      toast.error('Failed to fetch exams');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!examName || !term || !examType) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      examList: {
        examName,
        term,
        examType,
        remark
      }
    };

    try {
      if (editingId) {
        // Update existing exam
        await axios.put(`${apiUrl}/examination/update/${editingId}`, payload);
        toast.success('Exam updated successfully');
      } else {
        // Create new exam
        await axios.post(`${apiUrl}/examination/create`, payload);
        toast.success('Exam created successfully');
      }
      setExamName('');
      setTerm('');
      setExamType('');
      setRemark('');
      setEditingId(null);
      fetchExamList();
    } catch (error) {
      toast.error('Failed to save exam');
      console.error(error);
    }
  };

const handleEdit = (id, parentId) => {
  const exam = examList.find(item => item._id === id || item.id === id);
  if (exam) {
    setExamName(exam.examName || '');
    setTerm(exam.term || '');
    setExamType(exam.examType || '');
    setRemark(exam.remark || '');
    setEditingId(parentId || exam._id); // Use parentId for updates
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleDelete = async (id, parentId) => {
  if (!window.confirm('Are you sure you want to delete this exam?')) return;

  try {
    await axios.delete(`${apiUrl}/examination/delete/${parentId || id}`);
    toast.success('Exam deleted successfully');
    fetchExamList();
  } catch (error) {
    toast.error('Failed to delete exam');
    console.error(error);
  }
};

  // Filter exam list by search
  const filteredExams = examList.filter((item) => {
    const s = search.toLowerCase();
    return (
      (item.examName?.toLowerCase().includes(s)) ||
      (item.term?.toLowerCase().includes(s)) ||
      (item.examType?.toLowerCase().includes(s)) ||
      (item.remark?.toLowerCase().includes(s))
    );
  });

    // Calculate pagination - moved after filteredExams is defined
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExams.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return ( 
    <div className="p-6 text-sm md:text-base bg-gray-50">
      <div className="flex gap-4 border-b pb-2 mb-4 text-blue-900 font-semibold">
        <span>📝 {editingId ? 'Edit Exam' : 'Create Exam'}</span>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded shadow p-6  mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">
              Exam Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Name Here"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">
              Term<span className="text-red-500">*</span>
            </label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="">Select</option>
              {termsList.map((termName, index) => (
                <option key={index} value={termName.name}>
                  {termName.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold">
              Exam Type<span className="text-red-500">*</span>
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="">Select</option>
              <option value="Objective">Objective</option>
              <option value="Subjective">Subjective</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold">Remark</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            type="submit"
            className="bg-blue-900 text-white px-8 py-2 rounded hover:bg-blue-800"
          >
            {editingId ? 'Update' : 'Save'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setExamName('');
                setTerm('');
                setExamType('');
                setRemark('');
                setEditingId(null);
              }}
              className="bg-gray-400 text-white px-8 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Exam List Table */}
      <div className="border-b pb-2 mb-4 text-blue-900 font-semibold">📋 Exam List</div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button className="border px-2 py-1 rounded text-sm">🗎</button>
          <button className="border px-2 py-1 rounded text-sm">🖨</button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Here..."
            className="border px-4 py-2 rounded pl-10"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="border px-4 py-2">SL</th>
              <th className="border px-4 py-2">Exam Name</th>
              <th className="border px-4 py-2">Exam Type</th>
              <th className="border px-4 py-2">Term</th>
              <th className="border px-4 py-2">Remark</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length ? (
              currentItems.map((item, index) => (
                <tr key={item._id || item.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.examName || '-'}</td>
                  <td className="border px-4 py-2">{item.examType || '-'}</td>
                  <td className="border px-4 py-2">{item.term || '-'}</td>
                  <td className="border px-4 py-2">{item.remark || '-'}</td>
                  <td className="border flex gap-6 px-4 py-2 space-x-2 text-center">
      <button
        onClick={() => handleEdit(item._id || item.id, item.parentId)}
        className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={() => handleDelete(item._id || item.id, item.parentId)}
        className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
      >
        <Trash2 size={16} />
      </button>
    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No exams found.<br />
                  <span className="text-sm">Try clearing the search filter.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6">
        <button 
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded-l ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        >
          ‹
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-1 border-t border-b ${currentPage === number ? 'bg-blue-100 font-bold' : 'hover:bg-gray-100'}`}
          >
            {number}
          </button>
        ))}
        
        <button 
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded-r ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        >
          ›
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ExamSetup;