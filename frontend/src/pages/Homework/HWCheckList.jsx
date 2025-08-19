import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";

const HWCheckList = () => {
  const apiUrl =
    import.meta.env?.VITE_REACT_APP_BASE_URL || "http://localhost:4100";
  const [studentList, setStudentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [editedHomework, setEditedHomework] = useState({});
  // ✅ Add these
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
 
  useEffect(() => {
    fetchDropdowns();
    fetchHomeworkList();
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

  const fetchHomeworkList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/homework/getAll`);
      setHomeworkList(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch homework list:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldBlur = async (homeworkId, fieldName, newValue) => {
    try {
      if (newValue === undefined || newValue === null) return;

      const payload = { [fieldName]: newValue };

      await axios.patch(
        `${apiUrl}/homework/update/home-work-status/${homeworkId}`,
        payload
      );
      fetchHomeworkList(); // Refresh list
      setEditedHomework({});
      console.log("Updated:", homeworkId, payload);
    } catch (err) {
      console.error("Error updating homework field:", err);
    }
  };


  const handleBack = () => {
    alert("Back functionality not implemented. Add navigation logic here.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 gap-4 mx-auto p-4 bg-gray-50 rounded my-5">
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
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search by student name"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {loading && <div className="text-center mb-4">Loading...</div>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300">
          <thead className="bg-blue-100">
            <tr className="text-left">
              <th className="p-2 border">SL</th>
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Register No.</th>
              <th className="p-2 border">Roll No.</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Section</th>
              <th className="p-2 border">Subjects</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Assignment</th>
              <th className="p-2 border">Rank (out of 5)</th>
              <th className="p-2 border">Remark</th>
            </tr>
          </thead>
          <tbody>
            {" "}
           
            {homeworkList?.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan="11"
                  className="p-2 border text-center text-gray-600"
                >
                  No students found.
                </td>
              </tr>
            ) : (
              homeworkList
                ?.filter((data) => {
                  if (searchTerm === "all") {
                    return true;
                  }

                  const studentName =
                    (data.student?.firstName || "") +
                    " " +
                    (data.student?.lastName || "");

                  return studentName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                })
                ?.filter((data)=>{
                  if(!selectedSection){
                    return true
                  }
                  return (data?.section?._id === selectedSection)
                })?.filter((data)=>{
                  if(!selectedClass){
                    return true
                  }
                  return (data?.class?._id === selectedClass)
                })?.filter((data)=>{
                  if(!selectedSubjects.length >0){
                    return true
                  }
                  return (selectedSubjects?.includes(data?.subject?._id))
                })?.map((item, index) => (
                  <tr className="bg-white" key={item._id}>
                    <td className="p-2 border text-center">{index + 1}</td>
                    <td className="p-2 border">
                      {item?.student?.firstName} {item?.student?.lastName}
                    </td>
                    <td className="p-2 border">
                      {item?.student?.registration_no}
                    </td>
                    <td className="p-2 border">{item?.student?.roll_no}</td>
                    <td className="p-2 border">{item.class?.Name || "-"}</td>
                    <td className="p-2 border">{item.section?.Name || "-"}</td>
                    <td className="p-2 border">{item?.subject?.subjectName}</td>
                    <td className="p-2 border">
                      <select
                        value={
                          editedHomework[item._id]?.status ||
                          item.status ||
                          "incomplete" // ✅ FIXED
                        }
                        onChange={(e) => {
                          const newVal = e.target.value;
                          setEditedHomework((prev) => ({
                            ...prev,
                            [item._id]: {
                              ...prev[item._id],
                              status: newVal,
                            },
                          }));
                          handleFieldBlur(item._id, "status", newVal);
                        }}
                        className="border rounded p-1"
                      >
                        <option value="completed">Complete</option>
                        <option value="incomplete">Incomplete</option>{" "}
                        {/* ✅ FIXED */}
                      </select>
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={
                          editedHomework[item._id]?.assignment ??
                          item.assignment ??
                          ""
                        }
                        onChange={(e) =>
                          setEditedHomework((prev) => ({
                            ...prev,
                            [item._id]: {
                              ...prev[item._id],
                              assignment: e.target.value,
                            },
                          }))
                        }
                        onBlur={(e) =>
                          handleFieldBlur(
                            item._id,
                            "assignment",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                        placeholder="Assignment"
                      />
                    </td>
                    <td className="p-2 border">
                      <select
                        value={
                          editedHomework[item._id]?.rankOutOfFive ||
                          item.rankOutOfFive ||
                          "1"
                        }
                        onChange={(e) => {
                          const newVal = Number(e.target.value);
                          setEditedHomework((prev) => ({
                            ...prev,
                            [item._id]: {
                              ...prev[item._id],
                              rankOutOfFive: newVal,
                            },
                          }));
                          handleFieldBlur(item._id, "rankOutOfFive", newVal);
                        }}
                        className="border rounded p-1"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={
                          editedHomework[item._id]?.remark ?? item.remark ?? ""
                        }
                        onChange={(e) =>
                          setEditedHomework((prev) => ({
                            ...prev,
                            [item._id]: {
                              ...prev[item._id],
                              remark: e.target.value,
                            },
                          }))
                        }
                        onBlur={(e) =>
                          handleFieldBlur(item._id, "remark", e.target.value)
                        }
                        className="border rounded px-2 py-1 w-full"
                        placeholder="Remark"
                      />
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        {/* <button
          className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800"
          onClick={handleSave}
        >
          Save
        </button> */}
        <button
          className="border border-blue-900 text-blue-900 px-6 py-2 rounded-md hover:bg-blue-50"
          onClick={handleBack}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default HWCheckList;
