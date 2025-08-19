import React, { useState } from 'react';

const accounts = [
    { label: 'SBI', value: 'sbi' },
    { label: 'HDFC', value: 'hdfc' },
    { label: 'ICICI', value: 'icici' },
];

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

const BookStatement = () => {
    const [account, setAccount] = useState(accounts[0].value);
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
        <div style={{ background: '#f4f6fb', minHeight: '100vh', padding: 24 }}>
            <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
                        Account <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                        value={account}
                        onChange={e => setAccount(e.target.value)}
                        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #c0d5ff', fontSize: 16 }}
                    >
                        {accounts.map(acc => (
                            <option key={acc.value} value={acc.value}>{acc.label}</option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
                        Date <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div
                        style={{ position: 'relative' }}
                        onClick={() => setShowDateDropdown(!showDateDropdown)}
                    >
                        <div style={{
                            width: '100%',
                            padding: 10,
                            borderRadius: 8,
                            border: '1px solid #c0d5ff',
                            fontSize: 16,
                            background: '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            {dateRange || 'Select'}
                            <span style={{ marginLeft: 8 }}>▼</span>
                        </div>
                        {showDateDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: 44,
                                left: 0,
                                width: '100%',
                                background: '#fff',
                                border: '1px solid #c0d5ff',
                                borderRadius: 8,
                                zIndex: 10,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                maxHeight: 250,
                                overflowY: 'auto',
                            }}>
                                {dateRanges.map(range => (
                                    <div
                                        key={range}
                                        style={{ padding: 10, cursor: 'pointer', background: dateRange === range ? '#f4f6fb' : '#fff' }}
                                        onClick={() => { setDateRange(range); setShowDateDropdown(false); }}
                                    >
                                        {range}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* From Date and To Date filter */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>From Date</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={e => setFromDate(e.target.value)}
                        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #c0d5ff', fontSize: 16 }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>To Date</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={e => setToDate(e.target.value)}
                        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #c0d5ff', fontSize: 16 }}
                    />
                </div>

            </div>

            <div style={{ margin: '0 auto', maxWidth: 1000, background: '#fff', borderRadius: 8, padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 18 }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #222', padding: 10 }}>Date</th>
                            <th style={{ border: '1px solid #222', padding: 10 }}>Particular</th>
                            <th style={{ border: '1px solid #222', padding: 10 }}>Amount</th>
                            <th style={{ border: '1px solid #222', padding: 10 }}>Date</th>
                            <th style={{ border: '1px solid #222', padding: 10 }}>Particular</th>
                            <th style={{ border: '1px solid #222', padding: 10 }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ height: 180, verticalAlign: 'top' }}>
                            <td style={{ border: '1px solid #222', padding: 10 }}>
                                {filteredLeft.map(row => <div key={row.particular}>{row.date}</div>)}
                            </td>
                            <td style={{ border: '1px solid #222', padding: 10, fontWeight: 600 }}>
                                {filteredLeft.map(row => <div key={row.particular}>{row.particular}</div>)}
                            </td>
                            <td style={{ border: '1px solid #222', padding: 10, fontWeight: 500 }}>
                                {filteredLeft.map(row => <div key={row.particular}>{row.amount.toLocaleString()}</div>)}
                            </td>
                            <td style={{ border: '1px solid #222', padding: 10 }}>
                                {filteredRight.map(row => <div key={row.particular}>{row.date}</div>)}
                            </td>
                            <td style={{ border: '1px solid #222', padding: 10, fontWeight: 600 }}>
                                {filteredRight.map(row => <div key={row.particular}>{row.particular}</div>)}
                            </td>
                            <td style={{ border: '1px solid #222', padding: 10, fontWeight: 500 }}>
                                {filteredRight.map(row => <div key={row.particular}>{row.amount.toLocaleString()}</div>)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #222', padding: 10 }}></td>
                            <td style={{ border: '1px solid #222', padding: 10 }}></td>
                            <td style={{ border: '1px solid #222', padding: 10, fontWeight: 600 }}>{leftTotal.toLocaleString()}</td>
                            <td style={{ border: '1px solid #222', padding: 10 }}></td>
                            <td style={{ border: '1px solid #222', padding: 10 }}></td>
                            <td style={{ border: '1px solid #222', padding: 10, fontWeight: 600 }}>{rightTotal.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <button
                    onClick={() => window.history.back()}
                    style={{ padding: '10px 40px', border: '1px solid #151587', borderRadius: 8, background: '#fff', color: '#151587', fontWeight: 500, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(21,21,135,0.04)' }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default BookStatement;
