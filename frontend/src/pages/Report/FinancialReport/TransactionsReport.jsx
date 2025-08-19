import React from 'react';

function TransactionsReport() {
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
                        <tr>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4">
                <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 border border-blue-500 rounded-lg bg-white text-blue-500 font-semibold text-lg cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default TransactionsReport
