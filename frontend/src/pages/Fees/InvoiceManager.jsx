import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InvoiceManager = () => {
  const [search, setSearch] = useState('');
  const [fees, setFees] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [formData, setFormData] = useState({
    feeType: '',
    date: '',
    amount: '',
    discount: '',
    paymentMethod: '',
    account: '',
    remark: '',
    guardianConfirmationSMS: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('collect');
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const fetchFeeTypes = async () => {
    try {
      const res = await axios.get('http://localhost:4100/api/feetype/getall');
      setFeeTypes(res.data.map(item => item.feeType));
    } catch (err) {
      console.error('Failed to fetch fee types', err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get('http://localhost:4100/api/feeInvoice/getAll');
      const transformedData = res.data.map(item => ({
        ...item,
        status: item.invoice?.status || 'Unpaid',
        invoiceNumber: item.invoice?.invoiceNo || `#${item._id.slice(-4).toUpperCase()}`,
        fine: item.invoice?.fine || 0,
        paid: item.invoice?.paid || 0,
        balance: item.invoice?.balance || 0
      }));
      setFees(transformedData || []);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
    }
  };

  useEffect(() => {
    fetchFeeTypes();
    if (activeTab === 'invoice') {
      fetchInvoices();
    }
  }, [activeTab]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        discount: Number(formData.discount),
        invoice: {
          status: 'Paid', 
          total: Number(formData.amount),
          discount: Number(formData.discount),
          paid: Number(formData.amount) - Number(formData.discount || 0),
          balance: 0,
          guardianConfirmationSMS: formData.guardianConfirmationSMS
        }
      };
      
      // Create the fee invoice with Paid status
      const response = await axios.post('http://localhost:4100/api/feeInvoice/create', payload);
      
      alert('Fee collected successfully!');
      
      // Reset form
      setFormData({
        feeType: '',
        date: '',
        amount: '',
        discount: '',
        paymentMethod: '',
        account: '',
        remark: '',
        guardianConfirmationSMS: false,
      });
      
      // Refresh invoice data if we're on the invoice tab
      if (activeTab === 'invoice') {
        fetchInvoices();
      }
      
    } catch (err) {
      console.error(err);
      alert('Failed to collect fee: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Function to update invoice status
  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      await axios.put(`http://localhost:4100/api/feeInvoice/updateStatus/${invoiceId}`, {
        status: newStatus
      });
      
      // Update local state to reflect the change immediately
      setFees(prevFees => 
        prevFees.map(fee => 
          fee._id === invoiceId 
            ? { ...fee, status: newStatus }
            : fee
        )
      );
      
      alert(`Invoice status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update invoice status:', err);
      alert('Failed to update invoice status: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredFees = Array.isArray(fees)
    ? fees.filter(fee =>
        fee.feeType?.toLowerCase().includes(search.toLowerCase()) ||
        fee.account?.toLowerCase().includes(search.toLowerCase()) ||
        fee.studentName?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFees = filteredFees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFees.length / itemsPerPage);

  return (
    <div className="p-4 w-full bg-[#f4f6fd]">
      {/* Tabs */}
      <div className="flex border-b border-blue-200 mb-6">
        <button
          onClick={() => setActiveTab('collect')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'collect'
              ? 'text-blue-700 border-b-2 border-blue-700'
              : 'text-gray-600'
          }`}
        >
          Collect Fees
        </button>
        <button
          onClick={() => setActiveTab('invoice')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'invoice'
              ? 'text-blue-700 border-b-2 border-blue-700'
              : 'text-gray-600'
          }`}
        >
          Invoice
        </button>
      </div>

      {/* Collect Fees Form */}
      {activeTab === 'collect' && (
        <div className="space-y-4">
          {/* Fee Type */}
          <div className="flex items-center gap-4 w-full md:w-2/3">
            <label className="w-40 font-medium text-gray-700">Fees Type Name*</label>
            <select
              name="feeType"
              className="flex-1 p-2 border rounded"
              value={formData.feeType}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select</option>
              {feeTypes.map((t, idx) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Other Fields */}
          {[
            { label: 'Date*', name: 'date', type: 'date' },
            { label: 'Amount*', name: 'amount', type: 'number' },
            { label: 'Discount', name: 'discount', type: 'number' },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex items-center gap-4 w-full md:w-2/3">
              <label className="w-40 font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="flex-1 p-2 border rounded"
                required={label.includes('*')}
                disabled={loading}
              />
            </div>
          ))}

          {/* Payment Method */}
          <div className="flex items-center gap-4 w-full md:w-2/3">
            <label className="w-40 font-medium text-gray-700">Payment Method*</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="flex-1 p-2 border rounded"
              required
              disabled={loading}
            >
              <option value="">Select</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Online">Online</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Account */}
          <div className="flex items-center gap-4 w-full md:w-2/3">
            <label className="w-40 font-medium text-gray-700">Account*</label>
            <input
              type="text"
              name="account"
              value={formData.account}
              onChange={handleChange}
              className="flex-1 p-2 border rounded"
              required
              disabled={loading}
            />
          </div>

          {/* Remark */}
          <div className="flex items-start gap-4 w-full md:w-2/3">
            <label className="w-40 font-medium text-gray-700 mt-2">Remark</label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              className="flex-1 p-2 border rounded"
              rows="3"
              disabled={loading}
            />
          </div>

          {/* SMS Confirmation */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="guardianConfirmationSMS"
              checked={formData.guardianConfirmationSMS}
              onChange={handleChange}
              disabled={loading}
            />
            <label>Guardian Confirmation SMS</label>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-2 rounded text-white ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-900 hover:bg-blue-800'
              }`}
            >
              {loading ? 'Processing...' : 'Pay'}
            </button>
            <button
              onClick={() =>
                setFormData({
                  feeType: '',
                  date: '',
                  amount: '',
                  discount: '',
                  paymentMethod: '',
                  account: '',
                  remark: '',
                  guardianConfirmationSMS: false,
                })
              }
              disabled={loading}
              className="border border-blue-900 text-blue-900 px-4 py-2 rounded hover:bg-blue-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Invoice Section */}
      {activeTab === 'invoice' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search by fee type or account"
                className="w-full pl-10 pr-4 py-2 border rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded shadow p-4">
            <h3 className="font-bold mb-4">Invoice List</h3>
            <div className="overflow-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Invoice No.</th>
                    <th className="border px-4 py-2">Fee Type</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Amount</th>
                    <th className="border px-4 py-2">Account</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFees.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="border px-4 py-8 text-center text-gray-500">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    currentFees.map((fee, index) => (
                      <tr key={fee._id || index}>
                        <td className="border px-4 py-2 text-center">{fee.invoiceNumber}</td>
                        <td className="border px-4 py-2">{fee.feeType || 'N/A'}</td>
                        <td className="border px-4 py-2">
                          {fee.date ? new Date(fee.date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="border px-4 py-2 text-right">₹{fee.amount?.toFixed(2) || '0.00'}</td>
                        <td className="border px-4 py-2">{fee.account || 'N/A'}</td>
                        <td className="border px-4 py-2 text-center">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              fee.status === 'Paid'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            {fee.status}
                          </span>
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            onClick={() => navigate(`/invoice/${fee._id}`)}
                            className="text-blue-600 hover:text-blue-800 mr-2"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? 'bg-blue-900 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManager;