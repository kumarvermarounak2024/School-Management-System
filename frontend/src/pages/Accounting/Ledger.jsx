import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';

const Ledger = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('form'); // 'list' or ''
  const [ledgers, setLedgers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      ledgerName: '',
      groupName: '',
      type: '',
      openingBalance: '',
      accounting: 'Dr.'
    }
  });

  const types = ['Expense', 'Income', 'Assets', 'Liabilities'];
  const balanceOptions = ['1', '2', '3'];
  const accountings = ['Dr.', 'Cr.'];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response;
      if (isEditing) {
        console.log(data, "data");
        response = await axios.put(`${apiUrl}/ledger/update/${id}`, data);
        toast.success('Ledger updated successfully!');
        setActiveTab('list');
      } else {
        console.log(data, "data");
        response = await axios.post(`${apiUrl}/ledger/create`, data);
        toast.success('Ledger created successfully!');
      }
      reset();

    } catch (error) {
      console.error('Error submitting ledger:', error);
      toast.error(error.response?.data?.message || 'Failed to save ledger');
    } finally {
      setLoading(false);
    }
  };

  const getLedgerById = async (id) => {
    try {

      const response = await axios.get(`${apiUrl}/ledger/get/${id}`);
      const data = response?.data?.data;
      if (data) {
        setIsEditing(true);
        setValue('ledgerName', data?.ledgerName);
        setValue('groupName', data?.groupName);
        setValue('type', data?.type);
        setValue('openingBalance', data?.openingBalance);
        setValue('accounting', data?.accounting || 'Dr.');
      }
    } catch (error) {
      console.error('Error fetching ledger:', error);
      toast.error('Failed to fetch ledger details');
    }
  };

  const getLedgers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/ledger/getAll`);
      console.log(response?.data?.data, "response");
      setLedgers(response?.data?.data || []);
    } catch (error) {
      console.error('Error fetching ledgers:', error);
      toast.error('Failed to fetch ledgers');
    }
  };

  useEffect(() => {

    if (activeTab === 'list') {
      getLedgers();
    }
  }, [activeTab]);

  // Filter and pagination logic
  const filteredLedgers = ledgers.filter(ledger =>
    (ledger?.ledgerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (ledger?.groupName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (ledger?.type?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLedgers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLedgers = filteredLedgers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/ledger/delete/${id}`);
      toast.success('Ledger deleted successfully');
      getLedgers();
    } catch (error) {
      console.error('Error deleting ledger:', error);
      toast.error('Failed to delete ledger');
    }
  };

  const handleEdit = (id) => {
    setId(id);
    setActiveTab('form');
    getLedgerById(id);

  };

  return (
    <div className=" min-h-screen p-6">
      {/* Tab Buttons */}
      <div className="flex justify-start mb-4  border-b-2 border-b-[#151587]">
        <div className="flex gap-4 ">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 font-bold ${activeTab === 'form'
              ? ' border-b-2 border-b-[#151587] text-[#151587]'
              : 'text-[#151587]'
              }`}
          >
            Create Ledger
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 font-bold  ${activeTab === 'list'
              ? ' border-b-2 border-b-[#151587] text-[#151587]'
              : 'text-[#151587]'
              }`}
          >
            Ledger List
          </button>

        </div>
      </div>

      {activeTab === 'list' ? (
        <>
          {/* Search Bar */}
          <div className="flex justify-end mb-4">
            <input
              type="text"
              placeholder="Search by ledger name, group, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-left">
              <thead className="bg-blue-100 text-black">
                <tr>
                  <th className="px-4 py-2 border">SL</th>
                  <th className="px-4 py-2 border">Ledger Name</th>
                  <th className="px-4 py-2 border">Group Name</th>
                  <th className="px-4 py-2 border">type</th>
                  <th className="px-4 py-2 border">Opening Balance</th>
                  <th className="px-4 py-2 border">Balance type</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentLedgers.length > 0 ? (
                  currentLedgers.map((ledger, idx) => (
                    <tr key={ledger._id} className="bg-white border-t">
                      <td className="px-4 py-2 border">{startIndex + idx + 1}</td>
                      <td className="px-4 py-2 border">{ledger?.ledgerName || '-'}</td>
                      <td className="px-4 py-2 border">{ledger?.groupName || '-'}</td>
                      <td className="px-4 py-2 border">{ledger?.type || '-'}</td>
                      <td className="px-4 py-2 border">{ledger?.openingBalance || '-'}</td>
                      <td className="px-4 py-2 border">{ledger?.accounting || '-'}</td>
                      <td className="px-4 py-2 border">
                        <div className="flex gap-3">
                          <button
                            className="w-6 h-6 bg-[#143781] text-white rounded-full flex items-center justify-center cursor-pointer"
                            onClick={() => handleEdit(ledger._id)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer"
                            onClick={() => handleDelete(ledger._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                      No ledgers found.
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
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-md ${currentPage === i + 1
                    ? 'bg-[#151587] text-white'
                    : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md disabled:opacity-50 hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-full mx-auto bg-white p-6 "
        >
          {/* Ledger Name */}
          <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
            <label htmlFor="ledgerName" className="w-full sm:w-1/4 font-bold text-base">
              Ledger Name <span className="text-red-500">*</span>
            </label>
            <div className="w-full sm:w-3/4">
              <input
                type="text"
                id="ledgerName"
                {...register('ledgerName', { required: 'Ledger Name is required' })}
                placeholder="Enter ledger name"
                className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.ledgerName && (
                <p className="text-red-500 text-sm mt-1">{errors.ledgerName.message}</p>
              )}
            </div>
          </div>

          {/* Group Name */}
          <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
            <label htmlFor="groupName" className="w-full sm:w-1/4 font-bold text-base">
              Group Name <span className="text-red-500">*</span>
            </label>
            <div className="w-full sm:w-3/4">
              <input
                type="text"
                id="groupName"
                {...register('groupName', { required: 'Group Name is required' })}
                placeholder="Enter group name"
                className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.groupName && (
                <p className="text-red-500 text-sm mt-1">{errors.groupName.message}</p>
              )}
            </div>
          </div>

          {/* type */}
          <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
            <label htmlFor="type" className="w-full sm:w-1/4 font-bold text-base">
              type <span className="text-red-500">*</span>
            </label>
            <div className="w-full sm:w-3/4">
              <select
                id="type"
                {...register('type', { required: 'type is required' })}
                className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>
          </div>

          {/* Opening Balance */}
          <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
            <label htmlFor="openingBalance" className="w-full sm:w-1/4 font-bold text-base">
              Opening Balance <span className="text-red-500">*</span>
            </label>
            <div className="w-full flex gap-3 sm:w-3/4">
              <select
                id="openingBalance"
                {...register('openingBalance', { required: 'Opening Balance is required' })}
                className="w-2/3 border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select opening balance</option>
                {balanceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                id="accounting"
                {...register('accounting')}
                className="w-1/3 border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {accountings.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.openingBalance && (
                <p className="text-red-500 text-sm mt-1">{errors.openingBalance.message}</p>
              )}
            </div>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-2 bg-[#151587] text-white font-bold rounded-md flex items-center gap-2"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="ml-4 px-10 py-2 bg-gray-200 font-bold text-gray-700 rounded-md border border-[#151587] flex items-center gap-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Ledger;