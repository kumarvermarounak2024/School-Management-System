import React from "react";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const HW_Report = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [homeworkData, setHomeworkData] = useState([]);
  const [studentsAssigned, setStudentsAssigned] = useState([]);
  const [filteredHomeworkList, setFilteredHomeworkList] = useState([]);
  // ✅ Add these
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [classRes, sectionRes, subjectRes] = await Promise.all([
        axios.get(`${apiUrl}/class/getAll`),
        axios.get(`${apiUrl}/section/getAll`),
        axios.get(`${apiUrl}/subject/getAll`),
      ]);
      setClasses(classRes.data.classes || []);
      setSections(sectionRes.data.sections || []);
      setSubjects(subjectRes.data.data || []);
    } catch (err) {
      console.error("Dropdown fetch error:", err);
    }
  };

  const fetchHomeworkReport = async () => {
    if (!selectedClass || !selectedSection) return;

    try {
      const response = await axios.get(
        `${apiUrl}/homework/class/${selectedClass}/section/${selectedSection}`
      );

      setHomeworkData(response.data.homework || []);
      setStudentsAssigned(response.data.studentsAssigned || []);
      setFilteredHomeworkList(
        response.data.homework ?? response.data.studentsAssigned ?? []
      );
    } catch (err) {
      console.error("Failed to fetch homework report:", err);
    }
  };

  useEffect(() => {
    fetchHomeworkReport();
  }, [selectedClass, selectedSection]);

  useEffect(() => {
    const filtered = homeworkData.filter((item) => {
      const matchClass = selectedClass
        ? item.class?._id === selectedClass
        : true;
      const matchSection = selectedSection
        ? item.section?._id === selectedSection
        : true;
      const matchSubject =
        selectedSubjects.length > 0
          ? selectedSubjects.includes(item.subject?._id)
          : true;

      return matchClass && matchSection && matchSubject;
    });

    setFilteredHomeworkList(filtered);
  }, [selectedClass, selectedSection, selectedSubjects, homeworkData]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6 space-y-6">
      {/* Filter Section */}
      <div className="grid grid-cols-1 gap-4 mx-auto p-4 bg-gray-50 rounded">
        {/* Class */}
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">
            Class *
          </label>
          <select
            className="border p-2 rounded w-3/4"
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

        {/* Section */}
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">
            Section *
          </label>
          <select
            className="border p-2 rounded w-3/4"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="">Select Section</option>
            {sections.map((sec) => (
              <option key={sec._id} value={sec._id}>
                {sec.Name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="flex gap-4 items-start">
          <label className="w-1/4 text-sm font-medium text-gray-700 mt-1">
            Subject *
          </label>
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2">
            {subjects.map((subj) => (
              <div key={subj._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`subject-${subj._id}`}
                  value={subj._id}
                  checked={selectedSubjects.includes(subj._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSubjects([...selectedSubjects, subj._id]);
                    } else {
                      setSelectedSubjects(
                        selectedSubjects.filter((id) => id !== subj._id)
                      );
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={`subject-${subj._id}`} className="text-sm">
                  {subj.subjectName}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* First Table Section */}
      <div className="space-y-3">
        {/* Search */}
        <div className="flex justify-end">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search Here..."
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-indigo-100">
              <tr>
                <th className="border p-2">SL</th>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Section</th>
                <th className="border p-2">Date Of Homework</th>
                <th className="border p-2">Date of Submission</th>
                <th className="border p-2">Complete/Incomplete</th>
                <th className="border p-2">Total Students</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {homeworkData.map((hw, index) => (
                <tr key={hw._id} className="bg-white">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{hw.subject?.subjectName}</td>
                  <td className="border p-2">{hw.class?.Name}</td>
                  <td className="border p-2">{hw.section?.Name}</td>
                  <td className="border p-2">
                    {new Date(hw.dateOfHomework).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    {new Date(hw.dateOfSubmission).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    {/* For now assuming 1 completed, 0 incomplete */}
                    {hw.status === "Completed" ? "1/0" : "0/1"}
                  </td>
                  <td className="border p-2">{studentsAssigned.length}</td>
                  <td className="border p-2">
                    <button>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end">
          <button className="border px-3 py-1 rounded mx-1 bg-white shadow text-sm">
            ‹
          </button>
          <button className="border px-3 py-1 rounded mx-1 bg-blue-100 shadow text-sm">
            1
          </button>
          <button className="border px-3 py-1 rounded mx-1 bg-white shadow text-sm">
            ›
          </button>
        </div>
      </div>

      {/* Second Table Section */}
      <div className="space-y-3">
        {/* Search */}
        <div className="flex justify-end">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search Here..."
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-indigo-100">
              <tr>
                <th className="border p-2">SL</th>
                <th className="border p-2">Student</th>
                <th className="border p-2">Register No.</th>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Rank Out Of 5</th>
                <th className="border p-2">Remark</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredHomeworkList) &&
                filteredHomeworkList?.map((student, index) => (
                  <tr key={student._id} className="bg-white">
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">
                      {student?.student?.firstName || ""}{" "}
                      {student?.student?.lastName || ""}
                    </td>
                    <td className="border p-2">{student?.student?.registration_no}</td>
                    <td className="border p-2">
                      {/* If showing for first homework subject only */}
                      {homeworkData[0]?.subject?.subjectName || "-"}
                    </td>
                    <td className="border p-2 text-green-600 font-medium">
                      {/* Hardcoded to Completed for now */}
                      Completed
                    </td>
                    <td className="border p-2">
                      {/* Hardcoded rank */}
                      {homeworkData[0]?.rankOutOfFive || "-"}
                    </td>
                    <td className="border p-2">
                      {homeworkData[0]?.remark || "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center pt-6">
        <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50">
          Back
        </button>
      </div>
    </div>
  );
};

export default HW_Report;
