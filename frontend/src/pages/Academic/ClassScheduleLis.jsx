import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ClassScheduleList = () => {
  const [activeTab, setActiveTab] = useState("scheduleList");
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [schedules, setSchedules] = useState([]);
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch classes, sections and all schedules on component mount
    fetchClasses();
    fetchSections();
    fetchSchedules(); // get all schedules initially
  }, []);

  useEffect(() => {
    // Fetch schedules when filters change
    fetchSchedules();
  }, [selectedClass, selectedSection]);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/class/getAll`);
      setClasses(res.data.classes || []);
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get(`${apiUrl}/section/getAll`);
      setSections(res.data.sections || []);
    } catch (err) {
      console.error("Failed to load sections", err);
    }
  };

const fetchSchedules = async () => {
  try {
    let url = `${apiUrl}/classSchedule/getAll`;
    const params = [];

    if (selectedClass) params.push(`classId=${selectedClass}`);
    if (selectedSection) params.push(`sectionId=${selectedSection}`);

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    console.log("Selected Class:", selectedClass);
    console.log("Selected Section:", selectedSection);
    console.log("Fetching schedules with URL:", url);

    const res = await axios.get(url);

    if (res.data.success) {
      console.log("Schedules fetched:", res.data.data);
      setSchedules(res.data.data);
    } else {
      setSchedules([]);
    }
  } catch (err) {
    console.error("Error fetching schedules", err);
    setSchedules([]);
  }
};


  // Group schedules by day
  const scheduleByDay = schedules.reduce((acc, schedule) => {
    const day = schedule.day?.toUpperCase() || "UNKNOWN";
    if (!acc[day]) acc[day] = [];
    acc[day].push(schedule);
    return acc;
  }, {});

  const daysOfWeek = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return (
    <div className="py-10">
      <section>
        <div className="bg-white rounded">
          <div className="flex flex-col md:flex-row gap-4 mb-4 justify-left">
           {/* Class Select */}
<div className="flex gap-10 w-1/2">
  <label className="block font-medium mb-1">Class *</label>
  <select
    className="border p-2 rounded w-full"
    value={selectedClass}
    onChange={(e) => {
      console.log("Class selected:", e.target.value);
      setSelectedClass(e.target.value);
    }}
  >
    <option value="">Select Class</option>
    {classes.map((cls) => (
      <option key={cls._id} value={cls._id}>
        {cls.Name}
      </option>
    ))}
  </select>
</div>

{/* Section Select */}
<div className="flex gap-10 w-1/2">
  <label className="block font-medium mb-1">Section *</label>
  <select
    className="border p-2 rounded w-full"
    value={selectedSection}
    onChange={(e) => {
      console.log("Section selected:", e.target.value);
      setSelectedSection(e.target.value);
    }}
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
        </div>
      </section>

      {/* Header Tabs */}
      <div>
        <div className="flex justify-between">
          <button
            onClick={() => setActiveTab("scheduleList")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${
              activeTab === "scheduleList"
                ? "text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]"
                : "text-gray-600 hover:text-[#143781]"
            }`}
          >
            <FaList />
            <span className="font-semibold text-black">Schedule List</span>
          </button>
          {/* Optional print button */}
          <button className="w-[32px]">{/* ...print svg... */}</button>
        </div>
        <hr className="bg-[#151587] border-[0.99px] h-[2px] -mt-0.9" />
      </div>

      {/* Schedule Table */}
      <div className="sm:p-10">
        {schedules.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            {selectedClass || selectedSection
              ? "No schedule found for selected class/section."
              : "Showing all schedules. Select class and section to filter."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-black text-center bg-white">
              <tbody>
                {daysOfWeek.map((day) => (
                  <tr key={day}>
                    <td className="border border-black font-bold p-4 w-1/4">
                      {day}
                    </td>
                    <td className="border border-black p-4 text-center">
                      {scheduleByDay[day] ? (
                        scheduleByDay[day].map((entry, index) => (
                          <div key={index} className="mb-2">
                            <span className="font-bold">
                              {entry.subjectId?.subjectName || "No Subject"}
                            </span>
                            <br />
                            ({entry.startTime} - {entry.endTime})
                            <br />
                            Teacher - {entry.employeeId?.name || "N/A"}
                            <br />
                            Class Room - {entry.class_room || "N/A"}
                          </div>
                        ))
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate(-1)}
            className="border border-blue-500 text-blue-700 font-semibold px-6 py-2 rounded hover:bg-blue-50 w-full max-w-[205px]"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassScheduleList;
