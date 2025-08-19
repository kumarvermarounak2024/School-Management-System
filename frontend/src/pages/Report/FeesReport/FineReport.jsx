import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

function FineReport() {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [students, setStudents] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedFeeType, setSelectedFeeType] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchClasses();
    fetchSections();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/class/getAll`);
      setClasses(res.data.classes || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
      toast.error("Failed to fetch classes");
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get(`${apiUrl}/section/getAll`);
      setSections(res.data.sections || []);
    } catch (err) {
      console.error("Error fetching sections:", err);
      toast.error("Failed to fetch sections");
    }
  };

  const handleShow = () => {
    if (!selectedClass || !selectedSection || !fromDate || !toDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    fetchStudents();
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
      const filteredStudents = res.data.data.filter((student) => {
        const admissionDate = new Date(student.admissionDate);
        return (
          student.level_class?._id === selectedClass &&
          student.section?._id === selectedSection &&
          admissionDate >= new Date(fromDate) &&
          admissionDate <= new Date(toDate)
        );
      });
      setStudents(filteredStudents);
      if (filteredStudents.length === 0) {
        toast.info("No students found for the selected criteria");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to fetch students");
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchLower) ||
      student.registrationNo?.toLowerCase().includes(searchLower) ||
      student.rollNo?.toString().includes(searchLower) ||
      student.guardianName?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-gray-50 rounded-lg shadow-md p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.Name}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Via<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPayment}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Select Payment mode</option>
              <option value="">Both</option>
              <option value="">Online</option>
              <option value="">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Date <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div> */}
        </div>

        {/* Show Button */}
        <div className="my-6 flex justify-center">
          <button
            onClick={handleShow}
            className="bg-[#143781] text-white px-6 py-2 rounded hover:bg-[#0f2a5f] transition-colors duration-200"
          >
            Show
          </button>
        </div>

        <div className="border-b-2 border-[#143781] mb-6">
          <div>
            <h3 className="text-xl font-semibold text-[#143781]">
              Receipt Report{" "}
            </h3>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex justify-end">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search by name, registration no, roll no, or guardian name..."
              className="w-full p-2 pl-10 border border-[#C0D5FF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  SL
                </th>
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  Student Name
                </th>
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  Registration No.
                </th>
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  Roll No.
                </th>
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  Class
                </th>
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  Collect By
                </th>
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  Payment Via
                </th>
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  Fees Type
                </th>
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  Amount
                </th>
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  Discount
                </th>
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  Fine
                </th>
                <th className="border border-gray-400 px-4 py-2 text-left text-sm font-semibold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="13"
                    className="border border-gray-400 px-4 py-2 text-center text-gray-600"
                  >
                    No data found.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {index + 1}
                    </td>{" "}
                    {/* SL */}
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {item.studentName || "-"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {item.registrationNo || "-"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {item.rollNo || "-"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {item.className || "-"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {item.collectedBy || "-"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {item.paymentVia || "-"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {item.feesType || "-"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {item.amount || "0"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {item.discount || "0"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {item.fine || "0"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-sm">
                      {item.total || "0"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-4 px-4 my-8">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="grid grid-cols-3 items-center w-32 h-12 border-2 border-[#151587] rounded-md">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex justify-center items-center disabled:opacity-50"
            >
              <MdNavigateBefore className="text-2xl text-[#151587]" />
            </button>
            <div className="bg-[#151587] text-white font-semibold flex justify-center items-center h-full text-base">
              {currentPage}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex justify-center items-center disabled:opacity-50"
            >
              <MdNavigateNext className="text-2xl text-[#151587]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FineReport;
