import React, { useState } from "react";
import ManageAdvanceSalary from "./ManageAdvanceSalary";
import LeaveCategoryForm from "./LeaveCategoryForm";
const LeaveCategory = () => {
  const [activeTab, setActiveTab] = useState("addLeave");

  return (
    <div className="p-6 space-y-6 bg-gray-50 font-sans">
      <div className="flex space-x-6 border-b text-sm font-semibold">
        <div
          className={`pb-1 cursor-pointer ${
            activeTab === "leaveCategoryform" ? "border-b-2 border-blue-700 text-blue-700" : ""
          }`}
          onClick={() => setActiveTab("leaveCategoryform")}
        >
           Leave Category
        </div>
        <div
          className={`pb-1 cursor-pointer ${
            activeTab === "managesalaryadvance" ? "border-b-2 border-blue-700 text-blue-700" : ""
          }`}
          onClick={() => setActiveTab("managesalaryadvance")}
        >
          ☰ Manage Leave
        </div>
        <div
          className={`pb-1 cursor-pointer ${
            activeTab === "addleave" ? "border-b-2 border-blue-700 text-blue-700" : ""
          }`}
          onClick={() => setActiveTab("addleave")}
        >
          ✒ Add Leave
        </div>
      </div>

      {/* Conditional Rendering */}
      {activeTab === "leaveCategoryform" && <LeaveCategoryForm />}
      {activeTab === "managesalaryadvance" && <ManageAdvanceSalary/>}
      {activeTab === "addleave" && <ManageAdvanceSalary/>}
    </div>
  );
};

export default LeaveCategory;
