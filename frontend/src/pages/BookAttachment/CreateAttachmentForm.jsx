import React, { useState, useEffect } from "react";
import { FaPaperclip, FaPlus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CreateAttachmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const editMode = location.state?.mode === "edit";
  const existingData = location.state?.attachment;

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    class: "",
    subject: "",
    publishDate: "",
    remarks: "",
    file: null, // this is the actual file to upload
    availableForAll: false,
    notAccordingSubject: false,
  });

  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");

  // Load classes and subjects
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${apiUrl}/class/getAll`);
        setClassList(res.data.classes || []);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };

    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${apiUrl}/subject/getAll`);
        setSubjectList(res.data.data || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };

    fetchClasses();
    fetchSubjects();
  }, [apiUrl]);

  // If edit mode, preload form data
  useEffect(() => {
    if (editMode && existingData) {
      setFormData({
        title: existingData.title || "",
        type: existingData.type || "",
        class: existingData.class?._id || "",
        subject: existingData.subject?._id || "",
        publishDate: existingData.publishDate?.split("T")[0] || "",
        remarks: existingData.remarks || "",
        file: null, // reset file; user can upload new if desired
        availableForAll: existingData.availableForAll || false,
        notAccordingSubject: existingData.notAccordingSubject || false,
      });
    }
  }, [editMode, existingData]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "attachments") {
      navigate("/attachment-table");
    }
  };

  // Handle form input changes
 const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;

  if (type === "file") {
    setFormData((prev) => ({
      ...prev,
      file: files[0] || null,
    }));
  } else if (type === "checkbox") {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = new FormData();
      submissionData.append("title", formData.title);
      submissionData.append("type", formData.type);
      submissionData.append("remarks", formData.remarks);
      submissionData.append("publishDate", formData.publishDate);
      submissionData.append("availableForAll", formData.availableForAll);
      submissionData.append("notAccordingSubject", formData.notAccordingSubject);

      if (!formData.availableForAll) {
        submissionData.append("class", formData.class);
      }

      if (!formData.notAccordingSubject) {
        submissionData.append("subject", formData.subject);
      }

      // Attach the file only if a new one is selected (or on create)
      if (formData.file) {
  submissionData.append("attachment", formData.file); // ✅ Correct name
}
 else if (!editMode) {
        alert("Attachment file is required.");
        setLoading(false);
        return;
      }

      if (editMode) {
        // PUT update request with FormData
        await axios.put(`${apiUrl}/attachment/update/${existingData._id}`, submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // POST create request
        await axios.post(`${apiUrl}/attachment/create`, submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert(`Attachment ${editMode ? "updated" : "created"} successfully!`);
      navigate("/attachment-table");
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 bg-gray-50 shadow rounded mt-8 max-w-4xl">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => handleTabClick("attachments")}
          className={`flex items-center px-4 py-2 text-sm font-medium text-blue-900 hover:text-black transition relative ${
            activeTab === "attachments" ? "text-black" : ""
          }`}
        >
          <FaPaperclip className="mr-1" />
          Attachments
          {activeTab === "attachments" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-900 rounded-t-md"></span>
          )}
        </button>
        <button
          onClick={() => handleTabClick("create")}
          className={`flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition relative ${
            activeTab === "create" ? "text-black" : ""
          }`}
        >
          <FaPlus className="mr-1" />
          {editMode ? "Edit Attachment" : "Create Attachment"}
          {activeTab === "create" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gray-900 rounded-t-md"></span>
          )}
        </button>
      </div>

      {activeTab === "create" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="flex items-center gap-4">
            <label className="w-1/3 text-sm font-semibold">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-2/3 border px-3 py-2 rounded focus:outline-none focus:ring"
              required
            />
          </div>

          {/* Type */}
          <div className="flex items-center gap-4">
            <label className="w-1/3 text-sm font-semibold">Type *</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-2/3 border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Available for All */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availableForAll"
              checked={formData.availableForAll}
              onChange={handleChange}
              id="availableForAll"
            />
            <label htmlFor="availableForAll" className="text-sm cursor-pointer">
              Available For All Classes
            </label>
          </div>

          {/* Class */}
          <div className="flex items-center gap-4">
            <label className="w-1/3 text-sm font-semibold">Class *</label>
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="w-2/3 border px-3 py-2 rounded"
              required={!formData.availableForAll}
              disabled={formData.availableForAll}
            >
              <option value="">Select Class</option>
              {classList.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.Name}
                </option>
              ))}
            </select>
          </div>

          {/* Not According Subject */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="notAccordingSubject"
              checked={formData.notAccordingSubject}
              onChange={handleChange}
              id="notAccordingSubject"
            />
            <label htmlFor="notAccordingSubject" className="text-sm cursor-pointer">
              Not According Subject
            </label>
          </div>

          {/* Subject */}
          <div className="flex items-center gap-4">
            <label className="w-1/3 text-sm font-semibold">Subject *</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-2/3 border px-3 py-2 rounded"
              required={!formData.notAccordingSubject}
              disabled={formData.notAccordingSubject}
            >
              <option value="">Select Subject</option>
              {subjectList.map((subj) => (
                <option key={subj._id} value={subj._id}>
                  {subj.subjectName}
                </option>
              ))}
            </select>
          </div>

          {/* Publish Date */}
          <div className="flex items-center gap-4">
            <label className="w-1/3 text-sm font-semibold">Publish Date *</label>
            <input
              type="date"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
              className="w-2/3 border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Remarks */}
          <div className="flex items-start gap-4">
            <label className="w-1/3 text-sm font-semibold pt-2">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-2/3 border px-3 py-2 rounded"
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div className="flex items-center gap-4">
            <label className="w-1/3 text-sm font-semibold">Attachment File *</label>
            <input
  type="file"
  name="attachment" // ✅ optional fix (not necessary but cleaner)
  accept="*/*"
  onChange={handleChange}
  className="w-2/3"
  required={!editMode}
/>

          </div>

          {/* Show current file link if in edit mode */}
          {editMode && existingData?.attachmentUrl && (
            <div className="flex items-center gap-4">
              <label className="w-1/3 text-sm font-semibold">Current File</label>
              <a
                href={existingData.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="w-2/3 text-blue-600 underline"
              >
                View Current Attachment
              </a>
            </div>
          )}

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-[#143781] text-white px-8 py-2 rounded hover:bg-opacity-90"
              disabled={loading}
            >
              {loading ? "Saving..." : editMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateAttachmentForm;
