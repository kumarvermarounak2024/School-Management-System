import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaList, FaTrash } from 'react-icons/fa';
import {  Pencil, Trash2 } from 'lucide-react';

const Teacher = () => {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [activeTab, setActiveTab] = useState('assign');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
const [editingId, setEditingId] = useState(null);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  const [assignedList, setAssignedList] = useState([]);

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchAssignedList();
  }, []);

  useEffect(() => {
    if (selectedClass) fetchSections();
  }, [selectedClass]);

  const fetchClasses = async () => {
    const res = await axios.get(`${apiUrl}/class/getAll`);
    setClasses(res.data.classes || []);
  };

  const fetchSections = async () => {
    const res = await axios.get(`${apiUrl}/section/getAll`);
    setSections(res.data.sections || []);
  };

const fetchTeachers = async () => {
  try {
    const res = await axios.get(`${apiUrl}/classTeacher/getTeacher`);
    setTeachers(res.data.data || []);
  } catch (error) {
    console.error("Error fetching teacher data:", error);
  }
};


  // const fetchTeachers = async () => {
  //   try {
  //     const res = await axios.get('${apiUrl}/classTeacher/getTeacher');
  //     console.log("teacher", res.data);
  //     setTeachers(res.data.data || []);
  //   } catch (error) {
  //     console.error("Error fetching teacher data:", error);
  //   }
  // };

  const fetchAssignedList = async () => {
    try {
      const res = await axios.get(`${apiUrl}/classTeacher/getAll`);
      setAssignedList(res.data.data || []);
    } catch (err) {
      console.error("Error fetching assigned list:", err);
    }
  };

  const handleEdit = (entry) => {
  setSelectedClass(entry.level_class?._id || '');
  setSelectedSection(entry.section?._id || '');
  setSelectedTeacher(entry.class_teacher?._id || '');
  setEditingId(entry._id);
  setActiveTab('assign');
};


 const handleAssign = async () => {
  if (!selectedClass || !selectedSection || !selectedTeacher) {
    alert('Please select all fields.');
    return;
  }

  try {
    if (editingId) {
      // Update mode
      await axios.put(`${apiUrl}/classTeacher/update/${editingId}`, {
        classId: selectedClass,
        sectionId: selectedSection,
        teacherId: selectedTeacher,
      });
      alert('Class Teacher Updated Successfully');
    } else {
      // Create mode
      await axios.post(`${apiUrl}/classTeacher/create`, {
        classId: selectedClass,
        sectionId: selectedSection,
        teacherId: selectedTeacher,
      });
      alert('Class Teacher Assigned Successfully');
    }

    // Reset state after submission
    setSelectedClass('');
    setSelectedSection('');
    setSelectedTeacher('');
    setEditingId(null);
    fetchAssignedList();
  } catch (err) {
    alert('Error saving class teacher assignment');
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await axios.delete(`${apiUrl}/classTeacher/delete/${id}`);
      fetchAssignedList();
    } catch (err) {
      alert("Error deleting assignment");
    }
  };

  return (
    <div className="p-4">
      {/* Tabs */}
     <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 border-b mb-4">
  <button
    onClick={() => setActiveTab('assign')}
    className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${
      activeTab === 'assign'
        ? 'text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]'
        : 'text-gray-600 hover:text-[#143781]'
    }`}
  >
    <FaPlus /> Assign Class Teacher
  </button>
  <button
    onClick={() => setActiveTab('list')}
    className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${
      activeTab === 'list'
        ? 'text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]'
        : 'text-gray-600 hover:text-[#143781]'
    }`}
  >
    <FaList /> Class Teacher List
  </button>
</div>


      {/* Assign Tab */}
      {activeTab === 'assign' && (
        <div className="bg-white p-4 rounded shadow max-w-xl">
          <div className="mb-4">
            <label className="block font-medium mb-1">Class *</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Section *</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClass}
            >
              <option value="">Select</option>
              {sections.map((sec) => (
                <option key={sec._id} value={sec._id}>
                  {sec.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Class Teacher *</label>
            <select
  className="w-full border border-gray-300 px-3 py-2 rounded"
  value={selectedTeacher}
  onChange={(e) => setSelectedTeacher(e.target.value)}
>
  <option value="">Select</option>
  {teachers.map((teacher) => (
    <option key={teacher._id} value={teacher._id}>
      {teacher.name}
    </option>
  ))}
</select>

          </div>

         <button
  onClick={handleAssign}
  className="bg-[#143781] text-white px-4 py-2 rounded hover:bg-opacity-90"
>
  {editingId ? 'Update' : 'Assign'}
</button>

        </div>
      )}

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="bg-white p-4 rounded shadow">
          {assignedList.length === 0 ? (
            <p className="text-gray-500">No assignments available.</p>
          ) : (
         <div className="overflow-x-auto">
  <table className="min-w-full border border-gray-300 text-sm">
    <thead className="bg-gray-100 text-left">
      <tr>
        <th className="p-3 border-b">#</th>
        <th className="p-3 border-b">Class Teacher</th>
        <th className="p-3 border-b">Class</th>
        <th className="p-3 border-b">Section</th>
        <th className="p-3 border-b text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      {assignedList.map((entry, idx) => (
        <tr key={entry._id} className="hover:bg-gray-50">
          <td className="p-3 border-b">{idx + 1}</td>
          <td className="p-3 border-b">{entry.class_teacher?.name || 'N/A'}</td>
          <td className="p-3 border-b">{entry.level_class?.Name || 'N/A'}</td>
          <td className="p-3 border-b">{entry.section?.Name || 'N/A'}</td>
          <td className="p-3 border-b text-center flex gap-2">
            
<button
   className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
  onClick={() => handleEdit(entry)}
  title="Edit"
>
  <Pencil size={16} />
</button>

            <button
              className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center"
              onClick={() => handleDelete(entry._id)}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


          )}
        </div>
      )}
    </div>
  );
};

export default Teacher;
