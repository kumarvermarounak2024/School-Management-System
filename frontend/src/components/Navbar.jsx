import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [receptionOpen, setReceptionOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);

  const receptionTimeout = useRef(null);
  const staffTimeout = useRef(null);

  const handleReceptionEnter = () => {
    clearTimeout(receptionTimeout.current);
    setReceptionOpen(true);
  };

  const handleReceptionLeave = () => {
    receptionTimeout.current = setTimeout(() => setReceptionOpen(false), 200);
  };

  const handleStaffEnter = () => {
    clearTimeout(staffTimeout.current);
    setStaffOpen(true);
  };

  const handleStaffLeave = () => {
    staffTimeout.current = setTimeout(() => setStaffOpen(false), 200);
  };

  return (
    <div className="bg-[#f4b274] text-gray-700 shadow-md">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 px-6 pb-3">
        <Link to="/dashboard" className="hover:text-[#FF8719] font-semibold">Dashboard</Link>

        {/* Reception */}
        <div
          className="relative"
          onMouseEnter={handleReceptionEnter}
          onMouseLeave={handleReceptionLeave}
        >
          <button className="hover:text-[#FF8719] font-semibold">Reception</button>
          {receptionOpen && (
            <div className="absolute bg-white mt-2 rounded shadow w-48 z-50">
              <Link to="/admissionenquiry" className="block px-4 py-2 hover:bg-[#FF8719] hover:text-white">Admission Enquiry</Link>
              <Link to="/postalrecord" className="block px-4 py-2 hover:bg-[#FF8719] hover:text-white">Postal Record</Link>
              <Link to="/complaints" className="block px-4 py-2 hover:bg-[#FF8719] hover:text-white">Complaints</Link>
              <Link to="/visitor" className="block px-4 py-2 hover:bg-[#FF8719] hover:text-white">Visitor</Link>
            </div>
          )}
        </div>

        {/* Staff */}
        <div
          className="relative"
          onMouseEnter={handleStaffEnter}
          onMouseLeave={handleStaffLeave}
        >
          <button className="hover:text-[#FF8719] font-semibold">Staff</button>
          {staffOpen && (
            <div className="absolute bg-white mt-2 rounded shadow w-52 z-50">
              <Link to="/addstaffform" className="block px-4 py-2 hover:bg-[#FF8719] hover:text-white">Add Staff Form</Link>
              <Link to="/adddepartment" className="block px-4 py-2 hover:bg-[#FF8719] hover:text-white">Add Department</Link>
              <Link to="/adddesignation" className="block px-4 py-2 hover:bg-[#FF8719] hover:text-white">Add Designation</Link>
              <Link to="/csvimport" className="block px-4 py-2 hover:bg-[#FF8719] hover:text-white">CsvImport</Link>
              <Link to="/configuration" className="block px-4 py-2 hover:bg-[#FF8719] hover:text-white">Configurations</Link>
            </div>
          )}
        </div>

        {/* Other Links */}
        <Link to="/admissionform" className="hover:text-[#FF8719] font-semibold">Admission</Link>
        <Link to="/studentlist" className="hover:text-[#FF8719] font-semibold">Student</Link>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          {/* Reception */}
          <div>
            <button
              onClick={() => setReceptionOpen(!receptionOpen)}
              className="font-semibold hover:text-[#FF8719] w-full text-left"
            >
              Reception
            </button>
            {receptionOpen && (
              <div className="pl-4 mt-1 space-y-1">
                <Link to="/admissionenquiry" className="block hover:text-[#FF8719]">Admission Enquiry</Link>
                <Link to="/postalrecord" className="block hover:text-[#FF8719]">Postal Record</Link>
                <Link to="/complaints" className="block hover:text-[#FF8719]">Complaints</Link>
                <Link to="/visitor" className="block hover:text-[#FF8719]">Visitor</Link>
              </div>
            )}
          </div>

          {/* Staff */}
          <div>
            <button
              onClick={() => setStaffOpen(!staffOpen)}
              className="font-semibold hover:text-[#FF8719] w-full text-left"
            >
              Staff
            </button>
            {staffOpen && (
              <div className="pl-4 mt-1 space-y-1">
                <Link to="/addstaffform" className="block hover:text-[#FF8719]">Add Staff Form</Link>
                <Link to="/adddepartment" className="block hover:text-[#FF8719]">Add Department</Link>
                <Link to="/adddesignation" className="block hover:text-[#FF8719]">Add Designation</Link>
                <Link to="/stafflist" className="block hover:text-[#FF8719]">StaffList</Link>
              </div>
            )}
          </div>

          {/* Other Links */}
          <Link to="/admissionform" className="block font-semibold hover:text-[#FF8719]">Admission</Link>
          <Link to="/studentlist" className="block font-semibold hover:text-[#FF8719]">Student</Link>
          <Link to="/csvimport" className="block hover:text-[#FF8719]">CsvImport</Link>
          <Link to="/configuration" className="block hover:text-[#FF8719]">Configurations</Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
