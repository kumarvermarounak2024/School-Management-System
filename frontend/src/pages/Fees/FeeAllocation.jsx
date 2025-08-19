import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaPrint } from 'react-icons/fa';
import { AiFillFilePdf } from 'react-icons/ai';

const apiUrl = "http://localhost:4100/api";

const FeeAllocation = () => {
  const [classList, setClassList] = useState([]);
  const [sections, setSections] = useState([]);
  const [feeGroups, setFeeGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedFeeGroup, setSelectedFeeGroup] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchClasses();
    fetchSections();
    fetchFeeGroups();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/class/getAll`);
      setClassList(res.data.classes || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get(`${apiUrl}/section/getAll`);
      setSections(res.data.sections || []);
    } catch (err) {
      console.error("Error fetching sections:", err);
    }
  };

  const fetchFeeGroups = async () => {
    try {
      const res = await axios.get(`${apiUrl}/feegroup/getall`);
      setFeeGroups(res.data || []);
    } catch (err) {
      console.error('Failed to fetch fee groups', err);
    }
  };

  const fetchStudents = async () => {
    if (!selectedClass || !selectedSection) return;

    try {
      const res = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
      const allStudents = res.data.data || [];

      const filtered = allStudents.filter(
        (s) =>
          s.level_class?._id === selectedClass &&
          s.section?._id === selectedSection
      );

      setStudents(filtered);
      setSelectedStudents([]);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSave = async () => {
    if (!selectedFeeGroup || selectedStudents.length === 0) {
      alert("Please select a fee group and at least one student.");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/feeAllocation/create`, {
        students: selectedStudents,
        feeGroup: selectedFeeGroup,
      });

      alert("Fees allocation successful!");
      console.log("Saved allocation:", res.data);
      window.location.reload(); // Refresh the page
    } catch (err) {
      console.error("Error saving allocation:", err);
      alert("Failed to allocate fees.");
    }
  };

  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-4 w-full bg-[#f4f6fd]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-m font-medium">Class *</label>
          <select className="w-full p-2 border rounded" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classList.map((cls) => (
              <option key={cls._id} value={cls._id}>{cls.Name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-m font-medium">Section *</label>
          <select className="w-full p-2 border rounded" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
            <option value="">Select Section</option>
            {sections.map((sec) => (
              <option key={sec._id} value={sec._id}>{sec.Name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={fetchStudents} className="w-full bg-blue-900 text-white px-4 py-2 rounded mt-2">Show</button>
        </div>
      </div>

      {students.length > 0 ? (
        <>
          <div className="mb-4">
            <label className="block text-m font-medium">Fee Group *</label>
            <select className="w-full p-2 border rounded" value={selectedFeeGroup} onChange={(e) => setSelectedFeeGroup(e.target.value)}>
              <option value="">Select Fee Group</option>
              {feeGroups.map((fg) => (
                <option key={fg._id} value={fg._id}>{fg.feeGroup}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-2 py-1 border rounded"><AiFillFilePdf /> PDF</button>
              <button className="flex items-center gap-1 px-2 py-1 border rounded"><FaPrint /> Print</button>
            </div>
            <div className="flex items-center gap-2">
              <FaSearch />
              <input
                type="text"
                placeholder="Search Here..."
                className="border p-2 rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full border text-m text-center">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-2 py-2"><input type="checkbox" onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStudents(filteredStudents.map(s => s._id));
                  } else {
                    setSelectedStudents([]);
                  }
                }} /></th>
                <th className="border px-2">SL</th>
                <th className="border px-2">Student Name</th>
                <th className="border px-2">Register No.</th>
                <th className="border px-2">Roll No.</th>
                <th className="border px-2">Gender</th>
                <th className="border px-2">Mobile No.</th>
                <th className="border px-2">Email ID</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, index) => (
                <tr key={student._id}>
                  <td className="border px-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleCheckboxChange(student._id)}
                    />
                  </td>
                  <td className="border px-2">{startIndex + index + 1}</td>
                  <td className="border px-2">{student.firstName} {student.lastName}</td>
                  <td className="border px-2">{student.registration_no}</td>
                  <td className="border px-2">{student.roll_no}</td>
                  <td className="border px-2">{student.gender}</td>
                  <td className="border px-2">{student.mobile_no}</td>
                  <td className="border px-2">{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end items-center gap-2 mt-4">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="px-2 py-1 border rounded">{'<'}</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-900 text-white' : 'border'}`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} className="px-2 py-1 border rounded">{'>'}</button>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button onClick={handleSave} className="bg-blue-900 text-white px-6 py-2 rounded">Save</button>
            <button onClick={() => setSelectedStudents([])} className="border border-blue-900 text-blue-900 px-6 py-2 rounded">Cancel</button>
          </div>
        </>
      ) : (
        <div className="text-center mt-10 text-gray-600 font-medium">
          No students found for selected class and section.
        </div>
      )}
    </div>
  );
};

export default FeeAllocation;