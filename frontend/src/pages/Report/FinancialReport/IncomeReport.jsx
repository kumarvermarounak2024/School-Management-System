import React, { useState } from 'react';
const dateRanges = [
    'Today',
    'Yesterday',
    'Last 7 Days',
    'Last 30 Days',
    'This Month',
    'Last Month',
    'This Year',
    'Last Year',
    'Custom Range',
];

// Add mock date fields for demonstration
const leftData = [
    { date: '2024-07-01', particular: 'To Balance B/d', amount: 10000 },
    { date: '2024-07-05', particular: 'To Fees Receipt', amount: 7000 },
];
const rightData = [
    { date: '2024-07-02', particular: 'To Balance B/d', amount: 5000 },
    { date: '2024-07-10', particular: 'To Fees Receipt', amount: 12000 },
];

const incomeData = [
    {
        date: '',
        particular: 'Fees Collection',
        voucherType: '',
        voucherNo: '',
        amountDebit: '',
        amountCredit: 15000
    },
    {
        date: '',
        particular: 'All Type Of Income',
        voucherType: '',
        voucherNo: '',
        amountDebit: '',
        amountCredit: 8000
    }
];

const totalCredit = incomeData.reduce((sum, row) => sum + (row.amountCredit || 0), 0);

function IncomeReport() {

    const [dateRange, setDateRange] = useState('');
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredLeft, setFilteredLeft] = useState(leftData);
    const [filteredRight, setFilteredRight] = useState(rightData);

    const filterData = () => {
        if (fromDate && toDate) {
            setFilteredLeft(leftData.filter(row => row.date >= fromDate && row.date <= toDate));
            setFilteredRight(rightData.filter(row => row.date >= fromDate && row.date <= toDate));
        } else {
            setFilteredLeft(leftData);
            setFilteredRight(rightData);
        }
    };

    const leftTotal = filteredLeft.reduce((sum, row) => sum + row.amount, 0);
    const rightTotal = filteredRight.reduce((sum, row) => sum + row.amount, 0);

    return (
        <div className="bg-[#f4f6fb] min-h-screen p-6">
            <div className="mx-auto max-w-5xl bg-white rounded-lg p-4">
                <table className="w-full border-collapse text-lg">
                    <thead>
                        <tr>
                            <th className="border border-gray-800 p-2">Date</th>
                            <th className="border border-gray-800 p-2">Particular</th>
                            <th className="border border-gray-800 p-2">Voucher Type</th>
                            <th className="border border-gray-800 p-2">Voucher No.</th>
                            <th className="border border-gray-800 p-2">Amount Debit</th>
                            <th className="border border-gray-800 p-2">Amount Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incomeData.map((row, idx) => (
                            <tr key={idx}>
                                <td className="border border-gray-800 p-2">{row.date}</td>
                                <td className="border border-gray-800 p-2 font-semibold">{row.particular}</td>
                                <td className="border border-gray-800 p-2">{row.voucherType}</td>
                                <td className="border border-gray-800 p-2">{row.voucherNo}</td>
                                <td className="border border-gray-800 p-2 font-medium">{row.amountDebit ? row.amountDebit.toLocaleString() : ''}</td>
                                <td className="border border-gray-800 p-2 font-medium">{row.amountCredit ? row.amountCredit.toLocaleString() : ''}</td>
                            </tr>
                        ))}
                        <tr>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2 font-semibold">{totalCredit.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default IncomeReport
