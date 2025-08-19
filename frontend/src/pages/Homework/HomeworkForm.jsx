import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import axios from "axios";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const HomeworkForm = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [activeTab, setActiveTab] = useState("form");
  const [date, setDate] = useState();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [submissionDate, setSubmissionDate] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [homeworkText, setHomeworkText] = useState("");
  const [file, setFile] = useState(null);
  const [notify, setNotify] = useState(false);
  const [publishLater, setPublishLater] = useState(false);
  const [homeworkList, setHomeworkList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filteredHomeworkList, setFilteredHomeworkList] = useState([]);
  const [studentId, setStudentId] = useState([]);
  const [studentData, setStudentsData] = useState([]);
  // ✅ Add these
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (activeTab === "list") {
      fetchHomeworkList();
    }
  }, [activeTab]);

  const handleTabChange = (tab) => setActiveTab(tab);
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
      const res = await axios.get(`${apiUrl}/homework/getAll`);
      setHomeworkList(res.data.data || []);
      setFilteredHomeworkList(res.data.data || []); // initially sab dikhe
    } catch (err) {
      console.error("Failed to fetch homework list:", err);
    }
  };
  
  // const studentIDfs = studentData?.filter((data) => data?.level_class?._id === selectedClass && data?.section?._id === selectedSection)?.map((data)=>data?._id);

const handleSubmit = async (e) => {
  e.preventDefault();

  const studentIDs = studentData
    ?.filter((data) => data?.level_class?._id === selectedClass && data?.section?._id === selectedSection)
    ?.map((data) => data?._id);

  if (!studentIDs || studentIDs.length === 0) {
    alert("No students found for selected class and section.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("class", selectedClass);
    formData.append("section", selectedSection);
    formData.append("subject", selectedSubjects[0]); // only 1 subject supported by backend
    formData.append("dateOfHomework", date);
    formData.append("dateOfSubmission", submissionDate);
    formData.append("publishLater", publishLater);
    formData.append("scheduleDate", scheduleDate);
    formData.append("homework", homeworkText);
    formData.append("sendNotification", notify);
    formData.append("attachment", file);
    formData.append("students", JSON.stringify(studentIDs));

    const res = await axios.post(`${apiUrl}/homework/create`, formData);

    alert("Homework added for all students.");
  } catch (err) {
    console.error("Error creating homework:", err.response?.data || err.message);
    alert("Error creating homework.");
  }
};


  // DELETE Homework
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this homework?"))
      return;
    try {
      await axios.delete(`${apiUrl}/homework/delete/${id}`);
      toast.success("Homework deleted successfully");
      fetchHomeworkList(); // Refresh list
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete homework.");
    }
  };

  // Populate form for Edit
  const handleEdit = (homework) => {
    setSelectedClass(homework.class?._id || "");
    setSelectedSection(homework.section?._id || "");
    setSelectedSubjects([homework.subject?._id] || []);
    setDate(new Date(homework.dateOfHomework));
    setSubmissionDate(homework.dateOfSubmission);
    setPublishLater(homework.publishLater);
    setScheduleDate(homework.scheduleDate);
    setHomeworkText(homework.homework);
    setNotify(homework.sendNotification);
    setFile(null); // You may handle file differently if needed
    setEditId(homework._id);
    setActiveTab("form");
  };

  // Update Homework
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("class", selectedClass);
    formData.append("section", selectedSection);
    formData.append("subject", selectedSubjects[0]);
    formData.append("dateOfHomework", date);
    formData.append("dateOfSubmission", submissionDate);
    formData.append("publishLater", publishLater);
    formData.append("scheduleDate", scheduleDate);
    formData.append("homework", homeworkText);
    formData.append("sendNotification", notify);
    if (file) formData.append("attachment", file);

    try {
      await axios.put(`${apiUrl}/homework/update/${editId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Homework updated successfully");
      setEditId(null);
      setActiveTab("list");
      fetchHomeworkList();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update homework.");
    }
  };

  useEffect(() => {
    if (activeTab !== "list") return;

    const filtered = homeworkList.filter((item) => {
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
  }, [
    selectedClass,
    selectedSection,
    selectedSubjects,
    homeworkList,
    activeTab,
  ]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHomeworkList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredHomeworkList.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // fetch all student
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
      if (response.status === 200) {
        setStudentsData(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);
 

  return (
    <div className="p-6">
      <div className="flex border-b border-gray-300 mb-4">
        <button
          onClick={() => handleTabChange("form")}
          className={`px-4 py-2 font-medium border-b-2 ${
            activeTab === "form"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-500"
          }`}
        >
          📝 Add Homework
        </button>
        <button
          onClick={() => handleTabChange("list")}
          className={`px-4 py-2 font-medium border-b-2 ${
            activeTab === "list"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-500"
          }`}
        >
          📋 Homework List
        </button>
      </div>

      {activeTab === "form" && (
        <form
          onSubmit={editId ? handleUpdate : handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-700">
                Class *
              </label>
              <select
                className="border p-2 rounded w-1/2"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.Name}
                  </option>
                ))}
              </select>{" "}
            </div>

            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-700">
                Section *
              </label>

              <select
                className="border p-2 rounded w-1/2"
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

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-sm font-medium text-gray-700 mb-2 sm:mb-0 sm:w-1/4">
                Subject *
              </label>
              <div className="flex flex-wrap gap-4 sm:w-3/4">
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

            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-700">
                Date of Homework *
              </label>
              <div className="relative w-1/2">
                <input
                  type="date"
                  value={date ? format(date, "yyyy-MM-dd") : ""}
                  onChange={(e) => setDate(new Date(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-700">
                Date of Submission *
              </label>
              <input
                type="date"
                value={submissionDate}
                onChange={(e) => setSubmissionDate(e.target.value)}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex items-center gap-2 pl-[calc(25%+1rem)]">
              <input
                id="publish"
                type="checkbox"
                checked={publishLater}
                onChange={(e) => setPublishLater(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="publish" className="text-sm text-gray-700">
                Publish Later
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-700">
                Schedule Date *
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex items-start gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-700">
                Homework
              </label>
              <textarea
                rows={6}
                value={homeworkText}
                onChange={(e) => setHomeworkText(e.target.value)}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-700">
                Attachments File *
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex items-center gap-2 pl-[calc(25%+1rem)]">
              <input
                id="notify"
                type="checkbox"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="notify" className="text-sm text-gray-700">
                Send Notification SMS
              </label>
            </div>

            <div className="flex gap-4 mt-4 pl-[calc(25%+1rem)]">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Back
              </button>
            </div>
          </div>
        </form>
      )}

      {activeTab === "list" && (
        <div className="w-full">
          <div className="grid gap-4 mb-4">
            {/* Class */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mb-3">
              <label className="text-sm font-medium text-gray-700 w-full md:w-1/4">
                Class *
              </label>
              <select
                className="border p-2 rounded w-full md:w-1/2"
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
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mb-3">
              <label className="text-sm font-medium text-gray-700 w-full md:w-1/4">
                Section *
              </label>
              <select
                className="border p-2 rounded w-full md:w-1/2"
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

            {/* Subjects */}
            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
              <label className="text-sm font-medium text-gray-700 w-full md:w-1/4">
                Subject *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full">
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
                    <label htmlFor={`subject-${subj._id}`}>
                      {subj.subjectName}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Button */}
            <div>
              <button className="px-4 py-2 mt-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full md:w-auto">
                Show
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-2 border">SL</th>
                  <th className="p-2 border">Subject</th>
                  <th className="p-2 border">Class</th>
                  <th className="p-2 border">Section</th>
                  <th className="p-2 border">Date Of Homework</th>
                  <th className="p-2 border">Date Of Submission</th>
                  <th className="p-2 border">Submission</th>
                  <th className="p-2 border">SMS Notification</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Scheduled At</th>
                  <th className="p-2 border">Created By</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item._id} className="text-center">
                    <td className="p-2 border">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="p-2 border">
                      {item.subject?.subjectName || "N/A"}
                    </td>
                    <td className="p-2 border">{item.class?.Name || "N/A"}</td>
                    <td className="p-2 border">
                      {item.section?.Name || "N/A"}
                    </td>
                    <td className="p-2 border">
                      {item.dateOfHomework
                        ? new Date(item.dateOfHomework).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-2 border">
                      {item.dateOfSubmission
                        ? new Date(item.dateOfSubmission).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-2 border">{item.homework || "N/A"}</td>

                    <td className="p-2 border">
                      {item.smsNotification ? "Yes" : "No"}
                    </td>
                    <td className="p-2 border">{item.status || "Pending"}</td>
                    <td className="p-2 border">
                      {item.scheduledAt
                        ? new Date(item.scheduledAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="p-2 border">
                      {item.createdBy?.name || "N/A"}
                    </td>
                    <td className="p-2 border flex gap-5">
                      {/* Yahan action buttons jaa sakte hain, jaise Edit/Delete */}
                      <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {item.attachmentUrl ? (
                          <a
                            href={item?.attachmentUrl?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye size={16} />{" "}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                      >
                        {" "}
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-4 mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md">
              Back
            </button>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-l ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-1 border-t border-b ${
                    currentPage === number
                      ? "bg-blue-100 font-bold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-r ${
                currentPage === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkForm;
