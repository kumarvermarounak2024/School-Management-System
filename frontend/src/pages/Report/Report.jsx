import React, { useState } from 'react'
import AddmissionReport from './AddmissionReport';
import ClassSectionReport from './ClassSectionReport';
import FeesReport from './FeesReport/FeesReport';
import ReceiptReport from './FeesReport/ReceiptReport';
import DueFeesReport from './FeesReport/DueFeesReport';
import FineReport from './FeesReport/FineReport';
import { useNavigate } from 'react-router-dom';
import CashStatement from './FinancialReport/CashStatement';
import LeavesReport from './Human Resources Report/LeavesReport';
import PayrollSummary from './Human Resources Report/PayrollSummary';
import StudentReport from './AttendanceReport.jsx/StudentReport';
import EmployeeReport from './AttendanceReport.jsx/EmployeeReport';
import StudentDailyReport from './AttendanceReport.jsx/StudentDailyReport';
import ExamReport from './AttendanceReport.jsx/ExamReport';
import BookStatement from './FinancialReport/BookStatement';
import TransactionsReport from './FinancialReport/TransactionsReport';
import ReportCard from './Examination Report/ReportCard';
import IncomeReport from './FinancialReport/IncomeReport'
import IncomeExpense from './FinancialReport/IncomeExpense'
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import TabulationSheet from './Examination Report/TabulationSheet';
import ProgressReport from './Examination Report/ProgressReport';
const moduleDescriptions = {
    "Student Report": {
        type: 'submodules',
        submodules: ['Addmission Report', 'class & section report']
    },
    "Fees Report": {
        type: 'submodules',
        submodules: ['Fee Report', 'Receipt Report', 'Due Fees Report', 'Fine report']
    },
    "Financial Report": {
        type: 'submodules',
        submodules: ['Cash Statement', 'Book Statement', 'Income Report', 'Expense Report', 'Transactions Report', 'Income & Expense']
    },

    "Attendance Report": {
        type: 'submodules',
        submodules: ['Student Report', 'Employee Report', 'Student Daily Report', 'Exam Report']
    },
    "HR Report": {
        type: 'submodules',
        submodules: ['Payroll Summary', 'Leves Report']
    },
    "Examination": {
        type: 'submodules',
        submodules: ['Report Card', 'Tabulation Sheet', 'Progress Report']
    },
};

const subModuleComponents = {
    'Addmission Report': <AddmissionReport />,
    'class & section report': <ClassSectionReport />,
    'Fee Report': <FeesReport />,
    'Receipt Report': <ReceiptReport />,
    'Due Fees Report': <DueFeesReport />,
    'Fine report': <FineReport />,
    'Cash Statement': <CashStatement />,
    'Book Statement': <BookStatement />,
    'Income Report': <IncomeReport />,
    'Transactions Report': <TransactionsReport />,
    'Expense Report':<IncomeExpense/>,
    'Leves Report': <LeavesReport />,
    'Payroll Summary': <PayrollSummary />,
    'Student Report': <StudentReport />,
    'Employee Report': <EmployeeReport />,
    'Student Daily Report': <StudentDailyReport />,
    'Exam Report': <ExamReport />,
    'Report Card': <ReportCard />,
    'Tabulation Sheet': <TabulationSheet />,
    'Progress Report': <ProgressReport />,
};

function Report() {
    const [activeModule, setActiveModule] = useState(null);
    const [selectedSubModule, setSelectedSubModule] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const state = location.state;
        if (state?.activeModule && state?.activeSubmodule) {
            setActiveModule(state.activeModule);
            setSelectedSubModule(state.activeSubmodule);
        }
    }, [location.state]);

    const handleModuleClick = (mod) => {
        setActiveModule(mod);
        setSelectedSubModule('');
    };

    const handleSubModuleClick = (sub) => {
        setSelectedSubModule(sub);
    };

    const currentModule = moduleDescriptions[activeModule];

    return (
        <div>
            {/* Main Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                {Object.keys(moduleDescriptions).map((mod) => (
                    <button
                        key={mod}
                        onClick={() => handleModuleClick(mod)}
                        className={`w-full px-4 py-2 text-center rounded font-bold transition duration-200 ${activeModule === mod
                            ? 'bg-[#143781] text-white'
                            : 'bg-[#d5ddff] text-black hover:bg-opacity-80'
                            }`}
                    >
                        {mod}
                    </button>
                ))}
            </div>

            {/* Submodules (Tabs) */}
            {currentModule?.type === 'submodules' && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {currentModule.submodules.map((sub) => (
                        <button
                            key={sub}
                            onClick={() => handleSubModuleClick(sub)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedSubModule === sub
                                ? 'bg-[#143781] text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            )}

            {/* Component Rendering */}
            <div className="rounded-md shadow">
                {currentModule?.type === 'component' && currentModule.component}
                {selectedSubModule && currentModule?.type === 'submodules' && (
                    subModuleComponents[selectedSubModule] || (
                        <p className="text-gray-600">Component not found for this submodule.</p>
                    )
                )}
            </div>
        </div>
    );
}

export default Report
