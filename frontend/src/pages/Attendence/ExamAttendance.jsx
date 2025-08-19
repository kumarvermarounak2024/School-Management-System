import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const ExamAttendance = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
const [students, setStudents] = useState([]);

  const [selection, setSelection] = useState({
    examId: "",
  });
const [formData, setFormData] = useState({
  examName: "",
});

const handleShow = async () => {
  if (selection.examId && selectedClass && selectedSection && selectedSubjects.length > 0) {
    try {
      const response = await axios.get(`${apiUrl}/examattendances/filter`, {
        params: {
          examId: selection.examId,
          classId: selectedClass,
          sectionId: selectedSection,
          subjectId: selectedSubjects[0], // you can loop later for multi-subject
        },
      });
      console.log("Fetched Exam Students:", response.data.data);
      setStudents(response.data.data || []);
      setShowTable(true);
    } catch (error) {
      console.error("Failed to fetch exam students:", error);
    }
  } else {
    alert("Please select Exam, Class, Section, and at least one Subject.");
  }
};


  useEffect(() => {
    fetchDropdowns();
    getExams();
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

  const getExams = async () => {
    try {
      const examResponse = await axios.get(`${apiUrl}/examination/getAll`);
      console.log("examResponse:", examResponse?.data);

      // Ensure examData is an array
      const examData = Array.isArray(examResponse?.data)
        ? examResponse?.data
        : Array.isArray(examResponse?.data?.data)
        ? examResponse?.data?.data
        : [];

      if (!examData.length) {
        setError("No exams found.");
        setExams([]);
        return;
      }

      // Map exams to options, handling examList as an object
      const examOptions = examData
        .filter(
          (exam) =>
            exam._id && Array.isArray(exam.examList) && exam.examList.length > 0
        )
        .flatMap((exam) =>
          exam.examList.map((examItem) => ({
            _id: exam._id,
            examName: examItem.examName || "Unnamed Exam",
          }))
        );
      console.log("examOptions:", examOptions);
      setExams(examOptions);
      setError(examOptions.length ? "" : "No valid exams with examList found.");
    } catch (error) {
      console.error("Error fetching class and exam:", error);
      setError("Failed to fetch classes or exams.");
      setExams([]);
    }
  };
 
   // Handle dropdown changes
    const handleDropdownChange = (e) => {
        const { name, value } = e.target;
        if (name === "exam") {
            const selectedExam = exams.find(exam => exam._id === value);
            setSelection(prev => ({ ...prev, examId: value }));
            setFormData(prev => ({ ...prev, examName: selectedExam ? selectedExam.examName : '' }));
        } 
    };

    const handleSave = async () => {
  if (!selection.examId || !selectedClass || !selectedSection || selectedSubjects.length === 0) {
    alert("Please select all filters before saving.");
    return;
  }

  const payload = {
    exam: selection.examId,
    class: selectedClass,
    section: selectedSection,
    subject: selectedSubjects[0], // adjust if multi-subject later
    attendance: students.map((student) => ({
      student: student._id,
      status: student.status || "Absent", // Default if not selected
      remarks: student.remarks || "",
    })),
  };

  try {
    const response = await axios.post(`${apiUrl}/examattendances/save`, payload);
    console.log("Saved Attendance:", response.data);
    alert("Attendance saved successfully!");
  } catch (error) {
    console.error("Error saving attendance:", error);
    alert("Failed to save attendance. Please try again.");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Filters */}
      <div className="bg-gray-100 shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-m font-medium text-gray-700">
            Exam*
          </label>
          <select
            name="exam"
            value={selection.examId}
            onChange={handleDropdownChange}
            className="w-full border border-[#C0D5FF] rounded p-2"
            required
          >
            <option value="">Select Exam</option>
            {exams.map((exam, index) => (
              <option key={exam._id} value={exam._id}>
                {exam?.examName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-m font-medium text-gray-700">
            Class *
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.Name}
              </option>
            ))}
          </select>
        </div>
        {/* className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1" */}

        <div>
          <label className="block text-m font-medium text-gray-700">
            Section *
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          >
            <option value="">Select Section</option>
            {sections.map((sec) => (
              <option key={sec._id} value={sec._id}>
                {sec.Name}
              </option>
            ))}
          </select>
        </div>

        {/* Subjects */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <label className=" font-medium pt-1">Subjects</label>
          <div className="w-full flex gap-5">
            {subjects.map((subj) => (
              <div key={subj._id} className="flex items-center mb-1">
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
                <label htmlFor={`subject-${subj._id}`} className="select-none">
                  {subj.subjectName}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <button 
                      className="bg-[#143781] text-white px-4 py-2 rounded hover:bg-opacity-90"

        onClick={handleShow}>Show</button>
      </div>

      {/* Table */}
      {showTable && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 border">SL</th>
                <th className="px-4 py-2 border">Student Name</th>
                <th className="px-4 py-2 border">Roll no.</th>
                <th className="px-4 py-2 border">Register No.</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Remarks</th>
              </tr>
            </thead>
            <tbody>
  {students.map((student, index) => (
    <tr key={student._id} className="text-center">
      <td className="border px-4 py-2">{index + 1}</td>
<td className="border px-4 py-2">{student.firstName} {student.lastName}</td>
<td className="border px-4 py-2">{student.roll_no}</td>
<td className="border px-4 py-2">{student.registration_no}</td>
      <td className="border px-4 py-2">
        <div className="flex justify-center gap-4">
          <label>
            <input type="radio" name={`status${index}`} className="mr-1" /> Present
          </label>
          <label>
            <input type="radio" name={`status${index}`} className="mr-1" /> Absent
          </label>
          <label>
            <input type="radio" name={`status${index}`} className="mr-1" /> Late
          </label>
          <label>
            <input type="radio" name={`status${index}`} className="mr-1" /> Half Day
          </label>
        </div>
      </td>
      <td className="border px-4 py-2">
        <input
          type="text"
          className="border border-gray-300 rounded-md px-2 py-1"
        />
      </td>
    </tr>
  ))}
</tbody>

          </table>

          <div className="flex justify-center gap-4 mt-6">
<button
  onClick={handleSave}
  className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4"
>
  Save
</button>
            <button variant="outline" className="bg-white text-blue-900 px-4 py-2 rounded hover:bg-blue-600 ml-4">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamAttendance;
