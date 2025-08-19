import React from 'react';

const expenseData = [
    {
        date: '',
        particular: 'Salary',
        voucherType: '',
        voucherNo: '',
        amountDebit: 10000,
        amountCredit: ''
    },
    {
        date: '',
        particular: 'All Type Of Payment',
        voucherType: '',
        voucherNo: '',
        amountDebit: 12000,
        amountCredit: ''
    }
];

const totalDebit = expenseData.reduce((sum, row) => sum + (row.amountDebit || 0), 0);

function ExpenseReport() {
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
                        {expenseData.map((row, idx) => (
                            <tr key={idx}>
                                <td className="border border-gray-800 p-2">{row.date}</td>
                                <td className="border border-gray-800 p-2 font-semibold">{row.particular}</td>
                                <td className="border border-gray-800 p-2">{row.voucherType}</td>
                                <td className="border border-gray-800 p-2">{row.voucherNo}</td>
                                <td className="border border-gray-800 p-2 font-medium">{row.amountDebit ? row.amountDebit.toLocaleString() : ''}</td>
                                <td className="border border-gray-800 p-2">{row.amountCredit}</td>
                            </tr>
                        ))}
                        <tr>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2 font-semibold">{totalDebit.toLocaleString()}</td>
                            <td className="border border-gray-800 p-2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ExpenseReport;