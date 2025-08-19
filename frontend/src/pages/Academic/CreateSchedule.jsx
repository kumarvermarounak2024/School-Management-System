import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

const CreateSchedule = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rows, setRows] = useState([
    {
      subject: "",
      teacher: "",
      startTime: "",
      endTime: "",
      classRoom: "",
    },
  ]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, sectionRes, subjectRes, teacherRes] = await Promise.all([
          axios.get(`${apiUrl}/class/getAll`),
          axios.get(`${apiUrl}/section/getAll`),
          axios.get(`${apiUrl}/subject/getAll`),
          axios.get(`${apiUrl}/classTeacher/getTeacher`),
        ]);

        setClasses(classRes.data.classes || []);
        setSections(sectionRes.data.sections || []);
        setSubjects(subjectRes.data.data || []);
        setTeachers(teacherRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        subject: "",
        teacher: "",
        startTime: "",
        endTime: "",
        classRoom: "",
      },
    ]);
  };

  const handleSave = async () => {
    if (!selectedClass || !selectedSection || !selectedDay) {
      alert("Please select class, section and day");
      return;
    }

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.teacher || !r.subject || !r.startTime || !r.endTime || !r.classRoom) {
        alert(`Please fill all required fields in row ${i + 1}`);
        return;
      }
    }

    try {
      for (const row of rows) {
        const payload = {
          level_class: selectedClass,
          section: selectedSection,
          day: selectedDay,
          employeeId: row.teacher,
          subjectId: row.subject,
          startTime: row.startTime,
          endTime: row.endTime,
          class_room: row.classRoom,
        };

        await axios.post(`${apiUrl}/classSchedule/create`, payload);
      }

      alert("Schedule(s) created successfully!");

      setSelectedClass("");
      setSelectedSection("");
      setSelectedDay("");
      setRows([
        {
          subject: "",
          teacher: "",
          startTime: "",
          endTime: "",
          classRoom: "",
        },
      ]);
    } catch (error) {
      console.error("Failed to create schedule:", error);
      alert("Failed to create schedule");
    }
  };

  return (
    <div className="p-4 max-w-full">
      <div className="bg-white p-4 rounded shadow-md max-w-full">
        {/* Responsive grid: 1 col on small screens, 3 cols on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block font-medium mb-1">Class *</label>
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
          <div>
            <label className="block font-medium mb-1">Section *</label>
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
          <div>
            <label className="block font-medium mb-1">Day *</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            >
              <option value="">Select Day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-right mb-4">
          <button
            onClick={addRow}
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
          >
            + Add Row
          </button>
        </div>

        {/* Make table horizontally scrollable on small screens */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm mb-6 min-w-[700px]">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border-b">S.No</th>
                <th className="p-2 border-b">Subject</th>
                <th className="p-2 border-b">Teacher</th>
                <th className="p-2 border-b">Start Time</th>
                <th className="p-2 border-b">End Time</th>
                <th className="p-2 border-b">Class Room</th>
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className="p-2 border-b">{index + 1}</td>
                  <td className="p-2 border-b">
                    <select
                      value={row.subject}
                      onChange={(e) =>
                        handleChange(index, "subject", e.target.value)
                      }
                      className="w-full border p-1 rounded"
                    >
                      <option value="">Select</option>
                      {subjects.map((subj) => (
                        <option key={subj._id} value={subj._id}>
                          {subj.subjectName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 border-b">
                    <select
                      value={row.teacher}
                      onChange={(e) =>
                        handleChange(index, "teacher", e.target.value)
                      }
                      className="w-full border p-1 rounded"
                    >
                      <option value="">Select</option>
                      {teachers.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 border-b">
                    <input
                      type="time"
                      value={row.startTime}
                      onChange={(e) =>
                        handleChange(index, "startTime", e.target.value)
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border-b">
                    <input
                      type="time"
                      value={row.endTime}
                      onChange={(e) =>
                        handleChange(index, "endTime", e.target.value)
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border-b">
                    <input
                      type="text"
                      value={row.classRoom}
                      onChange={(e) =>
                        handleChange(index, "classRoom", e.target.value)
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border-b flex gap-2 justify-center">
                    <button className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center hover:bg-[#1f4a94] transition">
                      <Pencil size={16} />
                    </button>
                    <button
                      className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition"
                      onClick={() => setRows(rows.filter((_, i) => i !== index))}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right">
          <button
            onClick={handleSave}
            className="bg-[#143781] text-white px-6 py-2 rounded hover:bg-[#1f4a94] transition"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSchedule;
