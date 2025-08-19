import React from 'react'

function Receipt$PaymentAccount() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ border: '1px solid #bfc6e0', margin: 20, padding: 20, borderRadius: 8, background: '#fafbff' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <h1 style={{ fontWeight: 'bold', fontSize: 32, margin: 0 }}>School Name</h1>
                <div style={{ marginTop: 10, fontSize: 16 }}>
                    Receipt & Payment Account for the year ended (31/3/2025)
                </div>
            </div>
            <div style={{ background: '#fff', padding: 20, borderRadius: 4, border: '1px solid #222' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #222', padding: 8, fontWeight: 'bold', textAlign: 'left' }}>Receipt</th>
                            <th style={{ border: '1px solid #222', padding: 8, fontWeight: 'bold', textAlign: 'center' }}>Amount</th>
                            <th style={{ border: '1px solid #222', padding: 8, fontWeight: 'bold', textAlign: 'left' }}>Payment</th>
                            <th style={{ border: '1px solid #222', padding: 8, fontWeight: 'bold', textAlign: 'center' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid #222', padding: 8, verticalAlign: 'top' }}>
                                To Balance B/d<br />
                                Cash<br />
                                Bank<br />
                                School Fees
                            </td>
                            <td style={{ border: '1px solid #222', padding: 8, verticalAlign: 'top', textAlign: 'center' }}>
                                50000<br />
                                50000<br />
                                70000
                            </td>
                            <td style={{ border: '1px solid #222', padding: 8, verticalAlign: 'top' }}>
                                Salary<br />
                                Electricity<br />
                                Annual function<br />
                                Mis. Expense
                                <div style={{ marginTop: 24 }}>
                                    <b>To Balance B/d</b><br />
                                    Cash<br />
                                    Bank
                                </div>
                            </td>
                            <td style={{ border: '1px solid #222', padding: 8, verticalAlign: 'top', textAlign: 'center' }}>
                                50000<br />
                                50000<br />
                                70000<br />
                                5000
                                <div style={{ marginTop: 24 }}>
                                    75000<br />
                                    75000
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #222', padding: 8 }}></td>
                            <td style={{ border: '1px solid #222', padding: 8, textAlign: 'center' }}>170000</td>
                            <td style={{ border: '1px solid #222', padding: 8 }}></td>
                            <td style={{ border: '1px solid #222', padding: 8, textAlign: 'center' }}>170000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 32 }}>
                <button onClick={() => window.history.back()} style={{ padding: '8px 32px', border: '1px solid #bfc6e0', borderRadius: 6, background: '#fff', color: '#2d3a5b', fontWeight: 'bold', cursor: 'pointer' }}>
                    Cancel
                </button>
                <button onClick={handlePrint} style={{ padding: '8px 32px', border: '1px solid #bfc6e0', borderRadius: 6, background: '#fff', color: '#2d3a5b', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span role="img" aria-label="print">🖨️</span> Print
                </button>
            </div>
        </div>
    )
}

export default Receipt$PaymentAccount
