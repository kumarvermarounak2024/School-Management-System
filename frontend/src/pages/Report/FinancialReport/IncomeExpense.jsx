import React, { useState } from 'react';

function IncomeExpense() {
    // State for all input fields (indexed by row and column)
    const [fields, setFields] = useState({
        // Expenditure side
        exp1: '', exp1_amt: '',
        exp1_add: '', exp1_add_amt: '',
        exp1_less: '', exp1_less_amt: '',
        exp2: '', exp2_amt: '',
        exp2_less: '', exp2_less_amt: '',
        exp3: '', exp3_amt: '',
        exp3_add: '', exp3_add_amt: '',
        exp3_less: '', exp3_less_amt: '',
        exp4: '', exp4_amt: '',
        exp5: '', exp5_amt: '',
        exp6: '', exp6_amt: '',
        exp7_less: '', exp7_less_amt: '',
        surplus: '',
        // Income side
        inc1: '', inc1_amt: '',
        inc1_add: '', inc1_add_amt: '',
        inc1_adv: '', inc1_adv_amt: '',
        inc1_less: '', inc1_less_amt: '',
        inc1_adv_end: '', inc1_adv_end_amt: '',
        inc2: '', inc2_amt: '',
        inc2_add: '', inc2_add_amt: '',
        inc2_adv: '', inc2_adv_amt: '',
        inc2_less: '', inc2_less_amt: '',
        inc2_adv_end: '', inc2_adv_end_amt: '',
        inc3: '', inc3_amt: '',
        inc4: '', inc4_amt: '',
        inc5: '', inc5_amt: '',
        inc6: '', inc6_amt: '',
        deficit: '',
    });

    const handleChange = (e) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-[#f4f6fb] min-h-screen p-6">
            <div className="mx-auto max-w-6xl bg-white rounded-lg p-4">
                <table className="w-full border-2 border-gray-800 text-base">
                    <thead>
                        <tr>
                            <th colSpan={2} className="border border-gray-800 border-b-2 p-2 bg-blue-200 font-bold text-lg">Expenditures</th>
                            <th className="border border-gray-800 border-b-2 border-l-2 border-r-2 border-gray-800 p-2 bg-blue-200 font-bold text-lg">Amount</th>
                            <th colSpan={2} className="border border-gray-800 border-b-2 p-2 bg-blue-200 font-bold text-lg">Incomes</th>
                            <th className="border border-gray-800 border-b-2 border-l-2 border-r-2 border-gray-800 p-2 bg-blue-200 font-bold text-lg">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Group 1 */}
                        <tr>
                            <td className="border border-gray-800 p-2">To <input name="exp1" value={fields.exp1} onChange={handleChange} className="border-b-2 w-32" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="exp1_amt" value={fields.exp1_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                            <td className="border border-gray-800 p-2">By <input name="inc1" value={fields.inc1} onChange={handleChange} className="border-b-2 w-32" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc1_amt" value={fields.inc1_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2">Add: Outstanding at the end</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="exp1_add_amt" value={fields.exp1_add_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                            <td className="border border-gray-800 p-2">Add: Outstanding at the end</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc1_add_amt" value={fields.inc1_add_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2">Less: Outstanding in the beginning</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="exp1_less_amt" value={fields.exp1_less_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                            <td className="border border-gray-800 p-2">Advance in the beginning</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc1_adv_amt" value={fields.inc1_adv_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"></td>
                            <td className="border border-gray-800 p-2">Less: Outstanding in the beginning</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc1_less_amt" value={fields.inc1_less_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"></td>
                            <td className="border border-gray-800 p-2">Advance at the end</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc1_adv_end_amt" value={fields.inc1_adv_end_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        {/* Group separator */}
                        <tr>
                            <td className="border border-gray-800 p-0" colSpan={2}></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 border-b-2 p-0"></td>
                            <td className="border border-gray-800 p-0" colSpan={2}></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 border-b-2 p-0"></td>
                        </tr>
                        {/* Group 2 */}
                        <tr>
                            <td className="border border-gray-800 p-2">To <input name="exp2" value={fields.exp2} onChange={handleChange} className="border-b-2 w-32" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="exp2_amt" value={fields.exp2_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                            <td className="border border-gray-800 p-2">By <input name="inc2" value={fields.inc2} onChange={handleChange} className="border-b-2 w-32" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc2_amt" value={fields.inc2_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2">Less: Advance Insurance at end</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="exp2_less_amt" value={fields.exp2_less_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                            <td className="border border-gray-800 p-2">Add: Outstanding at the end</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc2_add_amt" value={fields.inc2_add_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"></td>
                            <td className="border border-gray-800 p-2">Advance in the beginning</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc2_adv_amt" value={fields.inc2_adv_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"></td>
                            <td className="border border-gray-800 p-2">Less: Outstanding in the beginning</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc2_less_amt" value={fields.inc2_less_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"></td>
                            <td className="border border-gray-800 p-2">Advance at the end</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc2_adv_end_amt" value={fields.inc2_adv_end_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        {/* Group separator */}
                        <tr>
                            <td className="border border-gray-800 p-0" colSpan={2}></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 border-b-2 p-0"></td>
                            <td className="border border-gray-800 p-0" colSpan={2}></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 border-b-2 p-0"></td>
                        </tr>
                        {/* Group 3 */}
                        <tr>
                            <td className="border border-gray-800 p-2">To <input name="exp3" value={fields.exp3} onChange={handleChange} className="border-b-2 w-32" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="exp3_amt" value={fields.exp3_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2">Add: Outstanding at the end</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="exp3_add_amt" value={fields.exp3_add_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2">Less: Outstanding in the beginning</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="exp3_less_amt" value={fields.exp3_less_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"></td>
                        </tr>
                        {/* Group separator */}
                        <tr>
                            <td className="border border-gray-800 p-0" colSpan={2}></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 border-b-2 p-0"></td>
                            <td className="border border-gray-800 p-0" colSpan={2}></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 border-b-2 p-0"></td>
                        </tr>
                        {/* Group 4 (last group) */}
                        <tr>
                            <td className="border border-gray-800 p-2">To <input name="exp4" value={fields.exp4} onChange={handleChange} className="border-b-2 w-32" /> A/c</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="exp4_amt" value={fields.exp4_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                            <td className="border border-gray-800 p-2">By <input name="inc3" value={fields.inc3} onChange={handleChange} className="border-b-2 w-32" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc3_amt" value={fields.inc3_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2">To <input name="exp5" value={fields.exp5} onChange={handleChange} className="border-b-2 w-32" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="exp5_amt" value={fields.exp5_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                            <td className="border border-gray-800 p-2">By <input name="inc4" value={fields.inc4} onChange={handleChange} className="border-b-2 w-32" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc4_amt" value={fields.inc4_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2">To <input name="exp6" value={fields.exp6} onChange={handleChange} className="border-b-2 w-32" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="exp6_amt" value={fields.exp6_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                            <td className="border border-gray-800 p-2">By <input name="inc5" value={fields.inc5} onChange={handleChange} className="border-b-2 w-32" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc5_amt" value={fields.inc5_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-800 p-2">Less: Outstanding in the beginning</td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="exp7_less_amt" value={fields.exp7_less_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                            <td className="border border-gray-800 p-2">By <input name="inc6" value={fields.inc6} onChange={handleChange} className="border-b-2 w-32" /></td>
                            <td className="border border-gray-800 p-2"></td>
                            <td className="border border-gray-800 border-l-2 border-r-2 p-2"><input name="inc6_amt" value={fields.inc6_amt} onChange={handleChange} className="border-b-2 w-20" /></td>
                        </tr>
                        {/* Last row: Surplus/Deficit */}
                        <tr>
                            <td colSpan={2} className="border border-gray-800 border-t-2 border-b-2 p-2 font-bold bg-blue-200">To Surplus (Balance Figure)</td>
                            <td className="border border-gray-800 border-t-2 border-b-2 border-l-2 border-r-2 p-2 font-bold bg-blue-200"><input name="surplus" value={fields.surplus} onChange={handleChange} className="border-b-2 w-20 font-bold" /></td>
                            <td colSpan={2} className="border border-gray-800 border-t-2 border-b-2 p-2 font-bold bg-blue-200 text-center">By Deficit (Balance Figure)</td>
                            <td className="border border-gray-800 border-t-2 border-b-2 border-l-2 border-r-2 p-2 font-bold bg-blue-200"><input name="deficit" value={fields.deficit} onChange={handleChange} className="border-b-2 w-20 font-bold" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default IncomeExpense;