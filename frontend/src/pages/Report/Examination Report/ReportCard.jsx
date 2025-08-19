import React, { useEffect } from 'react';
import { FaSearch, FaPrint, FaFilePdf, FaEye } from 'react-icons/fa';
import { useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { toast } from "react-toastify";
import axios from 'axios';

const ReportCard = () => {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

       const [date, setDate] = useState('');
       const [exam, setExam]=useState([]);
      const [selectedExam, setSelectedExam]=useState('')
      const [classes, setClasses] = useState([]);
      const [sections, setSections] = useState([]);
      const [selectedClass, setSelectedClass] = useState('');
      const [selectedSection, setSelectedSection] = useState('');
const [students, setStudents] = useState([]);

      const navigate = useNavigate();  


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

    useEffect(() => {
    fetchExamList();
  }, []);

  
const fetchExamList = async () => {
  try {
    const res = await axios.get(`${apiUrl}/examination/getAll`);
    console.log("API Response:", res.data);

    // Flatten examNames from each exam object
    const allExams = res.data.flatMap(item =>
      item.examList?.map(exam => ({
        name: exam.examName,
        id: exam._id // optional, for value use
      })) || []
    );

    setExam(allExams);
  } catch (error) {
    console.log("Error fetching exams:", error);
    toast.error("Failed to fetch exams");
  }
};

const handleShow = async () => {
  if (!selectedClass || !selectedSection || !selectedExam) {
    toast.error("Please select Class, Section, and Exam");
    return;
  }

  try {
    const academicYear = '2024-2025'; // or get dynamically if needed
    const url = `${apiUrl}/getreportCard/report-card?academic_year=${academicYear}&classId=${selectedClass}&sectionId=${selectedSection}&examId=${selectedExam}`;
    const res = await axios.get(url);

    if (res.data.success) {
      setStudents(res.data.data || []);
      toast.success("Report card data loaded");
    } else {
      setStudents([]);
      toast.warning("No data found");
    }
  } catch (error) {
    console.error("Error fetching report card data:", error);
    toast.error("Failed to load report card data");
  }
};



  return (
    <div className="bg-gray-100 min-h-screen p-6 text-sm">
      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-100 p-6 rounded shadow">
        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Academic Year <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            defaultValue="2025-2026"
            className="w-full border px-3 py-2 rounded outline-none"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Exam <span className="text-red-500">*</span>
          </label>
          <select
  className="w-full border px-3 py-2 rounded outline-none"
  value={selectedExam}
  onChange={(e) => setSelectedExam(e.target.value)}
>
  <option value="">Select Exam</option>
  {exam.map((examItem) => (
    <option key={examItem.id} value={examItem.id}>
      {examItem.name}
    </option>
  ))}
</select>

        </div>
        <div>
          <label className="block mb-1 text-gray-700 font-medium">
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
          <label className="block mb-1 text-gray-700 font-medium">
            Section <span className="text-red-500">*</span>
          </label>
                         <select
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                        >
                            <option value="">Select Section</option>
                            {sections.map((section) => (
                                <option key={section._id} value={section._id}>
                                    {section.Name}
                                </option>
                            ))}
                        </select>
        </div>
      </div>

      {/* Show Button */}
      <div className="flex justify-center mt-6">
       <button
  className="bg-[#13148b] text-white px-8 py-2 rounded font-medium hover:bg-[#0f0f78]"
  onClick={handleShow}
>
  Show
</button>

      </div>

      <hr className="my-6 border-t border-gray-300" />

      {/* Top Right Icons and Search */}
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-4">
          <button className="border px-3 py-2 rounded shadow text-sm bg-white"><FaFilePdf /></button>
          <button className="border px-3 py-2 rounded shadow text-sm bg-white"><FaPrint /></button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Here..."
            className="px-4 py-2 rounded border w-64 outline-none"
          />
          <button className="bg-white px-4 py-2 border rounded shadow text-sm">Generate</button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border border-gray-300">
        <table className="min-w-full text-center bg-white">
          <thead className="bg-[#dee3fb] text-sm font-medium">
            <tr>
              <th className="border px-3 py-2">SL</th>
              <th className="border px-3 py-2">Student Name</th>
              <th className="border px-3 py-2">Category</th>
              <th className="border px-3 py-2">Register No.</th>
              <th className="border px-3 py-2">Roll No.</th>
              <th className="border px-3 py-2">Mobile No.</th>
              <th className="border px-3 py-2">Remark</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
  <tr>
    <td colSpan="8" className="border px-3 py-4 text-gray-500">No data available</td>
  </tr>
) : (
  students.map((student, index) => (
    <tr key={student.studentId} className="text-sm">
      <td className="border px-3 py-2">{index + 1}</td>
      <td className="border px-3 py-2 flex justify-center items-center gap-2">
        <input type="checkbox" className="accent-blue-600" />
        {student.name}
      </td>
      <td className="border px-3 py-2">{student.category || '-'}</td>
      <td className="border px-3 py-2">{student.registerNo}</td>
      <td className="border px-3 py-2">{student.rollNo}</td>
      <td className="border px-3 py-2">{student.mobile || '-'}</td>
      <td className="border px-3 py-2">{student.remark || '-'}</td>
      <td className="border px-3 py-2">
        <button 
          onClick={() =>
            navigate(`/viewReportCard/${student.studentId}`, {
              state: {
                fromModule: 'Examination',
                fromSubmodule: 'Report Card'
              }
            })
          }
          className="flex items-center gap-2 border px-4 py-1 rounded hover:bg-gray-100"
        >
          <FaEye /> View Report Card
        </button>
      </td>
    </tr>
  ))
)}

          </tbody>
        </table>
      </div>

      {/* Cancel Button */}
      <div className="flex justify-center mt-6">
        <button className="px-8 py-2 border border-blue-700 text-blue-700 rounded hover:bg-blue-50">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReportCard;
