import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MarksEntry = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [exams, setExams] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDropdowns();
    fetchExams();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [classRes, sectionRes] = await Promise.all([
        axios.get(`${apiUrl}/class/getAll`),
        axios.get(`${apiUrl}/section/getAll`)
      ]);
      setClasses(classRes.data.classes || []);
      setSections(sectionRes.data.sections || []);
    } catch (err) {
      console.error('Dropdown fetch error:', err);
    }
  };

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${apiUrl}/examination/getAll`);
      const data = res.data;
      console.log("fetch Exams",data)
      const extracted = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setExams(extracted);
    } catch (error) {
      console.error('Exam fetch error:', error);
    }
  };
const handleShow = async () => {
  if (!selectedClass || !selectedSection) {
    toast.warn("Please select both Class and Section first.");
    return;
  }

  try {
    const res = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
    const students = res.data?.data || [];
console.log("studen" ,res);

    const filteredStudents = students.filter(
      (student) =>
        student.level_class?._id === selectedClass &&
        student.section?._id === selectedSection
    );
console.log("filterd students",filteredStudents)
    const formatted = filteredStudents.map((student) => ({
      _id: null,
      studentName: `${student.firstName || ""} ${student.lastName || ""}`,
      category: student.category || "",
      registrationNo: student.registration_no || "",
      rollNo: student.roll_no || "",
      isAbsent: false,
      maximumMarks: 0,
      obtainedMarks: 0,
      admissionId: student._id,
    }));

    setMarksData(formatted);
  } catch (err) {
    console.error("Error fetching students:", err);
    toast.error("Failed to load student data");
  }
};



const handleSave = async () => {
  if (!selectedExam) {
    toast.warn("Please select an exam.");
    return;
  }

  setLoading(true);
for (let student of marksData) {
  const payload = {
    exam: selectedExam,
    class: selectedClass,
    section: selectedSection,
    Admission: student.admissionId,
    isAbsent: student.isAbsent,
    maximumMarks: Number(student.maximumMarks) || 0,
    obtainedMarks: Number(student.obtainedMarks) || 0,
  };

  try {
    if (student._id) {
      console.log("Updating mark:", payload);
      await axios.put(`${apiUrl}/marks/update/${student._id}`, payload);
    } else {
      console.log("Creating mark:", payload);
      await axios.post(`${apiUrl}/marks/create`, payload);
    }
  } catch (err) {
    console.error("Failed for:", student.studentName, err);
    toast.error(`Failed for ${student.studentName}`);
  }
}

}



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Exam *</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select</option>
            {exams.map((exam) => (
 <option key={exam._id} value={exam._id}>
  {exam.examList?.[0]?.examName || "Unnamed"}
</option>

))}

          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Class *</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
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
          <label className="block text-sm font-medium text-gray-700">Section *</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select Section</option>
            {sections.map((sec) => (
              <option key={sec._id} value={sec._id}>
                {sec.Name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show Button */}
      <div className="text-center mb-6">
        <button
          onClick={handleShow}
          className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-2 rounded"
        >
          Show
        </button>
      </div>

      {/* Marks Table */}
      <div className="bg-white p-4 shadow rounded-md mb-6">
        <div className="text-blue-800 font-semibold border-b pb-2 mb-4">📝 Marks Entries</div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="border p-2">SL</th>
                <th className="border p-2">Student Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Register No.</th>
                <th className="border p-2">Roll No.</th>
                <th className="border p-2">Is Absent</th>
                <th className="border p-2">Maximum Marks</th>
                <th className="border p-2">Obtained Marks</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((student, index) => (
                <tr key={index}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{student.studentName}</td>
                  <td className="border p-2">{student.category}</td>
                  <td className="border p-2">{student.registrationNo}</td>
                  <td className="border p-2">{student.rollNo}</td>
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={student.isAbsent}
                      onChange={() => {
                        const updated = [...marksData];
                        updated[index].isAbsent = !updated[index].isAbsent;
                        setMarksData(updated);
                      }}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={student.maximumMarks}
                      className="w-20 border p-1"
                      onChange={(e) => {
                        const updated = [...marksData];
                        updated[index].maximumMarks = e.target.value;
                        setMarksData(updated);
                      }}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={student.obtainedMarks}
                      className="w-20 border p-1"
                      onChange={(e) => {
                        const updated = [...marksData];
                        updated[index].obtainedMarks = e.target.value;
                        setMarksData(updated);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button className="border border-blue-800 text-blue-800 px-6 py-2 rounded hover:bg-blue-50">
          Back
        </button>
      </div>
    </div>
  );
};

export default MarksEntry;
