import axios from 'axios';
import { FaPlus, FaList } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const SubjectAssign = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [activeTab, setActiveTab] = useState('assign');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [assignedList, setAssignedList] = useState([]);

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDropdowns();
    fetchAssigned();
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
      console.error('Dropdown fetch error:', err);
    }
  };

  const fetchAssigned = async () => {
    try {
      const res = await axios.get(`${apiUrl}/assignedSubject/getAll`);
      setAssignedList(res.data.data || []);
    } catch (err) {
      console.error('Fetch assigned subjects error:', err);
    }
  };

  const handleAssign = async () => {
    if (!selectedClass || !selectedSection || selectedSubjects.length === 0) {
      alert('Please select all fields');
      return;
    }

    const payload = {
      classId: selectedClass,
      sectionId: selectedSection,
      subjects: selectedSubjects,
    };

    try {
      if (editId) {
        await axios.put(`${apiUrl}/assignedSubject/update/${editId}`, payload);
        alert('Assignment updated successfully');
      } else {
        await axios.post(`${apiUrl}/assignedSubject/create`, payload);
        alert('Subjects assigned successfully');
      }

      setSelectedClass('');
      setSelectedSection('');
      setSelectedSubjects([]);
      setEditId(null);
      fetchAssigned();
    } catch (err) {
      console.error('Assignment error:', err);
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await axios.delete(`${apiUrl}/assignedSubject/delete/${id}`);
      fetchAssigned();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (item) => {
    setSelectedClass(item.classId._id);
    setSelectedSection(item.sectionId._id);
    setSelectedSubjects(item.subjects.map(s => s._id));
    setEditId(item._id);
    setActiveTab('assign');
  };

  return (
    <div className="px-2 sm:px-6 md:px-10 py-4  mx-auto">
      {/* Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap space-x-0 sm:space-x-4 border-b mb-6">
        <button
          onClick={() => {
            setActiveTab('assign');
            setEditId(null);
            setSelectedClass('');
            setSelectedSection('');
            setSelectedSubjects([]);
          }}
          className={`flex items-center gap-2 px-4 py-2 font-semibold relative whitespace-nowrap ${
            activeTab === 'assign'
              ? 'text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]'
              : 'text-gray-600 hover:text-[#143781]'
          }`}
        >
          <FaPlus /> {editId ? 'Edit Assignment' : 'Assign Subject'}
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold relative whitespace-nowrap ${
            activeTab === 'list'
              ? 'text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]'
              : 'text-gray-600 hover:text-[#143781]'
          }`}
        >
          <FaList /> Assigned List
        </button>
      </div>

      {/* Assign Form */}
      {activeTab === 'assign' && (
     <div className="bg-gray-50 p-4 rounded shadow-md mx-auto space-y-6">
  {/* Class */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
    <label className="sm:w-32 font-medium">Class</label>
    <select
      value={selectedClass}
      onChange={(e) => setSelectedClass(e.target.value)}
      className="w-full sm:w-48 border border-gray-300 px-3 py-2 rounded"
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
  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
    <label className="sm:w-32 font-medium">Section</label>
    <select
      value={selectedSection}
      onChange={(e) => setSelectedSection(e.target.value)}
      className="w-full sm:w-48 border border-gray-300 px-3 py-2 rounded"
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
    <label className="sm:w-32 font-medium pt-1">Subjects</label>
    <div className="w-full sm:w-[60%] border border-gray-300 rounded px-3 py-2 max-h-40 overflow-y-auto">
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
                setSelectedSubjects(selectedSubjects.filter(id => id !== subj._id));
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



          <button
            onClick={handleAssign}
            className="bg-[#143781] text-white px-4 py-2 rounded hover:bg-opacity-90 block w-full sm:w-auto"
          >
            {editId ? 'Update Assignment' : 'Assign'}
          </button>
        </div>
      )}

      {/* Assigned List */}
      {activeTab === 'list' && (
        <div className="bg-white p-4 rounded shadow-md overflow-x-auto max-w-full">
          {assignedList.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No assigned subjects found.</p>
          ) : (
            <table className="w-full border border-gray-300 text-sm min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border-b">Class</th>
                  <th className="p-2 border-b">Section</th>
                  <th className="p-2 border-b">Subjects</th>
                  <th className="p-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedList.map((item) => (
                  <tr key={item._id} className="odd:bg-white even:bg-gray-50">
                    <td className="p-2 border-b">{item.classId?.Name}</td>
                    <td className="p-2 border-b">{item.sectionId?.Name}</td>
                    <td className="p-2 border-b whitespace-normal">
                      {item.subjects?.map((s) => s.subjectName).join(', ')}
                    </td>
                    <td className="p-2 border-b flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectAssign;
