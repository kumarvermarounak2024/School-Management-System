import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import './Payment.css';
import { toast } from 'react-toastify';

function Contra() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const [isFormView, setIsFormView] = useState(true);
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [legdersName, setLedgersName] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [attachmentUrl, setAttachmentUrl] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            Date: '',
            contraNo: '',
            fromAccount: '',
            fromAmount: '',
            toAccount: '',
            toAmount: '',
            narration: '',
            attachment: null,
            balanceType: 'Dr.'
        }
    });

    const balanceTypes = ['Dr.', 'Cr.'];

    const getLedger = async () => {
        if (isFormView) {
            const response = await axios.get(`${apiUrl}/ledger/getAll`);
            console.log(response?.data?.data, "response");
            setLedgersName(response?.data?.data)
        }
    }

    useEffect(() => {
        getLedger();
    }, [isFormView])

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            // Only append the required fields
            const requiredFields = {
                Date: data.Date,
                contraNo: data.contraNo,
                fromAccount: data.fromAccount,
                fromAmount: data.fromAmount,
                toAccount: data.toAccount,
                toAmount: data.toAmount,
                narration: data.narration
            };

            // Append only the required fields to FormData
            Object.entries(requiredFields).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });

            // Only append attachment if it exists
            if (data.attachment) {
                formData.append('Attachment', data.attachment);
            }

            let response;
            if (isEditing) {
                response = await axios.put(`${apiUrl}/contraRoute/upDate/${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setIsFormView(false)
            } else {
                response = await axios.post(`${apiUrl}/contraRoute/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            if (response.data) {
                getContraList();
                reset();
                setSelectedFile(null);
                setIsEditing(false);
                setEditingId(null);
                toast.success(isEditing ? 'Contra upDated successfully!' : 'Contra created successfully!');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(`Error ${isEditing ? 'updating' : 'creating'} contra. Please try again.`);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${apiUrl}/contraRoute/delete/${id}`);
            if (response.data) {
                getContraList(); // Refresh the list after deletion
                toast.success('Contra deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting contra:', error);
            toast.error('Error deleting contra. Please try again.');
        }
    };

    const getContraById = async (id) => {
        try {
            const response = await axios.get(`${apiUrl}/contraRoute/get/${id}`);
            const data = response?.data?.data;
            console.log(data, "data");
            if (data) {
                setIsEditing(true);
                setEditingId(id);

                if (data) {
                    setValue('fromAccount', data?.fromAccount?._id);
                    setValue('toAccount', data?.toAccount?._id);
                    let formattedDate = data?.Date ? new Date(data.Date).toISOString().split('T')[0] : '';
                    setValue('Date', formattedDate);
                    setValue('contraNo', data?.contraNo);
                    setValue('fromAmount', data?.fromAmount);
                    setValue('toAmount', data?.toAmount);
                    setValue('narration', data?.narration);
                    setValue('attachment', data?.attachment);
                    setValue('balanceType', data?.balanceType);
                    if (typeof data?.attachment === 'string' && data.attachment.startsWith('http')) {
                        setAttachmentUrl(data.attachment);
                        setSelectedFile(null);
                    } else {
                        setAttachmentUrl(null);
                    }
                }

                setIsFormView(true);
            }
        } catch (error) {
            console.error('Error fetching contra:', error);
            toast.error('Failed to fetch contra details');
        }
    };

    const handleEdit = (contra) => {
        getContraById(contra._id);
    };

    const handleCancel = () => {
        reset();
        setSelectedFile(null);
        setIsEditing(false);
        setEditingId(null);
    };

    const getContraList = async () => {
        try {
            const response = await axios.get(`${apiUrl}/contraRoute/getAll`);
            console.log(response?.data?.data, "response contra list");
            setPayments(response?.data?.data);
        } catch (error) {
            console.log(error, "error");
        }
    };

    useEffect(() => {
        if (!isFormView) {
            getContraList();
        }
    }, [isFormView]);

    // Filter and pagination logic
    const filteredPayments = payments.filter(payment =>
        (payment?.contraNo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (payment?.fromAccount?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (payment?.toAccount?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            setAttachmentUrl(null);
            setValue('attachment', file, { shouldValiDate: true });
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setAttachmentUrl(null);
            setValue('attachment', file, { shouldValiDate: true });
        }
    };
    const formatDate = (DateString) => {
        if (!DateString) return '-';
        const date = new Date(DateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen p-6">
            {/* Tab Buttons */}
            <div className="flex justify-start mb-4 border-b-2 border-b-[#151587]">
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsFormView(true)}
                        className={`px-4 py-2 font-bold ${isFormView
                            ? 'border-b-2 border-b-[#151587] text-[#151587]'
                            : 'text-[#151587]'
                            }`}
                    >
                        Create Payment
                    </button>
                    <button
                        onClick={() => setIsFormView(false)}
                        className={`px-4 py-2 font-bold ${!isFormView
                            ? 'border-b-2 border-b-[#151587] text-[#151587]'
                            : 'text-[#151587]'
                            }`}
                    >
                        Payment List
                    </button>
                </div>
            </div>

            {isFormView ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                                    <label className="w-full sm:w-1/4 font-bold text-base">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="w-full sm:w-3/4">
                                        <input
                                            type="Date"
                                            {...register("Date", { required: "Date is required" })}
                                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.Date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Date.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                                    <label className="w-full sm:w-1/4 font-bold text-base">
                                        Contra Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="w-full sm:w-3/4">
                                        <input
                                            type="text"
                                            {...register("contraNo", { required: "Payment number is required" })}
                                            placeholder="Enter payment number"
                                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.contraNo && (
                                            <p className="text-red-500 text-sm mt-1">{errors.contraNo.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                                    <label className="w-full sm:w-1/4 font-bold text-base">
                                        From Account <span className="text-red-500">*</span>
                                    </label>
                                    <div className="w-full sm:w-3/4 flex flex-col sm:flex-row gap-2">
                                        <select
                                            {...register("balanceType", { required: "Balance type is required" })}
                                            className="w-full sm:w-1/4 border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Type</option>
                                            {balanceTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            {...register("fromAccount", { required: "From Account is required" })}
                                            className="w-full sm:w-3/4 border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Account</option>
                                            {legdersName.map((ledger) => (
                                                <option key={ledger._id} value={ledger._id}>
                                                    {ledger.ledgerName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.fromAccount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.fromAccount.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                                    <label className="w-full sm:w-1/4 font-bold text-base">
                                        from Amount <span className="text-red-500">*</span>
                                    </label>
                                    <div className="w-full sm:w-3/4">
                                        <input
                                            type="number"
                                            {...register("fromAmount", { required: "fromAmount is required" })}
                                            placeholder="Enter fromAmount"
                                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.fromAmount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.fromAmount.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                                    <label className="w-full sm:w-1/4 font-bold text-base">
                                        To Account <span className="text-red-500">*</span>
                                    </label>
                                    <div className="w-full sm:w-3/4 flex flex-col sm:flex-row gap-2">
                                        <select
                                            {...register("balanceType", { required: "Balance type is required" })}
                                            className="w-full sm:w-1/4 border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Type</option>
                                            {balanceTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            {...register("toAccount", { required: "To Account is required" })}
                                            className="w-full sm:w-3/4 border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Account</option>
                                            {legdersName.map((ledger) => (
                                                <option key={ledger._id} value={ledger._id}>
                                                    {ledger.ledgerName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.toAccount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.toAccount.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                                    <label className="w-full sm:w-1/4 font-bold text-base">
                                        To Amount <span className="text-red-500">*</span>
                                    </label>
                                    <div className="w-full sm:w-3/4">
                                        <input
                                            type="number"
                                            {...register("toAmount", { required: "toAmount is required" })}
                                            placeholder="Enter toAmount"
                                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.toAmount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.fromAmount.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                                    <label className="w-full sm:w-1/4 font-bold text-base">
                                        Narration <span className="text-red-500">*</span>
                                    </label>
                                    <div className="w-full sm:w-3/4">
                                        <textarea
                                            {...register("narration", { required: "Narration is required" })}
                                            placeholder="Enter narration"
                                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="1"
                                        />
                                        {errors.narration && (
                                            <p className="text-red-500 text-sm mt-1">{errors.narration.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                                    <label className="w-full sm:w-1/4 font-bold text-base">
                                        Attachment
                                    </label>
                                    <div className="w-full sm:w-3/4">
                                        <div
                                            className={`border  rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-[#C0D5FF] bg-blue-50' : 'border-[#C0D5FF]'}`}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setIsDragging(true);
                                            }}
                                            onDragLeave={(e) => {
                                                e.preventDefault();
                                                setIsDragging(false);
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setIsDragging(false);
                                                const file = e.dataTransfer.files[0];
                                                if (file) {
                                                    setSelectedFile(file);
                                                    setAttachmentUrl(null);
                                                    setValue('attachment', file, { shouldValiDate: true });
                                                }
                                            }}
                                            onClick={() => document.getElementById('fileInput').click()}
                                        >
                                            <input
                                                type="file"
                                                id="fileInput"
                                                {...register("attachment")}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setSelectedFile(file);
                                                        setAttachmentUrl(null);
                                                        setValue('attachment', file, { shouldValiDate: true });
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            {selectedFile ? (
                                                <div className="text-sm text-gray-600">
                                                    <p>Selected file: {selectedFile.name}</p>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedFile(null);
                                                            setAttachmentUrl(null);
                                                            setValue('attachment', null);
                                                        }}
                                                        className="mt-2 text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : attachmentUrl ? (
                                                <div className="flex flex-col items-center">
                                                    <img src={attachmentUrl} alt="attachment" className="w-24 h-24 object-cover mb-2 border" />
                                                    <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs mb-2">View Full Image</a>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setAttachmentUrl(null);
                                                            setValue('attachment', null);
                                                        }}
                                                        className="text-red-500 hover:text-red-700 text-xs"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-gray-600 mb-2">Drag and drop a file here, or click to select</p>
                                                    <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center gap-4">
                            <button
                                type="submit"
                                className="bg-[#151587] text-white px-6 py-2 rounded-md hover:bg-[#1a1a9e] focus:outline-none focus:ring-2 focus:ring-[#151587] focus:ring-offset-2"
                            >
                                Submit
                            </button>
                            <button
                                type="submit"
                                className="border border-[#151587] text-[#151587] px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#151587] focus:ring-offset-2"
                            >
                                cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    {/* Search Bar */}
                    <div className="flex justify-end mb-4">
                        <input
                            type="text"
                            placeholder="Search by payment number, fromAccount, or expense..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#151587]"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm text-left">
                            <thead className="bg-blue-100 text-black">
                                <tr>
                                    <th className="px-4 py-2 border">SL</th>
                                    <th className="px-4 py-2 border">Date</th>
                                    <th className="px-4 py-2 border">Contra Number</th>
                                    <th className="px-4 py-2 border">from Account</th>
                                    <th className="px-4 py-2 border">fromAmount</th>
                                    <th className="px-4 py-2 border">To Account</th>
                                    <th className="px-4 py-2 border">fromAmount</th>

                                    <th className="px-4 py-2 border">Narration</th>
                                    <th className="px-4 py-2 border">Attachment</th>
                                    <th className="px-4 py-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPayments.length > 0 ? (
                                    currentPayments.map((payment, idx) => (
                                        <tr key={payment.id} className="bg-white border-t">
                                            <td className="px-4 py-2 border">{startIndex + idx + 1}</td>
                                            <td className="px-4 py-2 border">{formatDate(payment?.Date) || '-'}</td>
                                            <td className="px-4 py-2 border">{payment?.contraNo || '-'}</td>
                                            <td className="px-4 py-2 border">{payment?.fromAccount?.ledgerName || '-'}</td>
                                            <td className="px-4 py-2 border">{payment?.fromAmount || '-'}</td>
                                            <td className="px-4 py-2 border">{payment?.toAccount?.LedgerName || '-'}</td>
                                            <td className="px-4 py-2 border">{payment?.toAmount || '-'}</td>
                                            <td className="px-4 py-2 border">{payment.narration || '-'}</td>
                                            <td className="px-4 py-2 border">
                                                {payment.attachment ? (
                                                    <div className="text-sm">
                                                        <img src={payment?.attachment} alt="attachment" className='w-10 h-10' />
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <div className="flex gap-3">
                                                    <button
                                                        className="w-6 h-6 bg-[#143781] text-white rounded-full flex items-center justify-center cursor-pointer"
                                                        onClick={() => handleEdit(payment)}
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer"
                                                        onClick={() => handleDelete(payment?._id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-2 text-center text-gray-500">
                                            No payments found.
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
            )}
        </div>
    );
}

export default Contra;
