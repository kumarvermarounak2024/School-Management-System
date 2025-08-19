import axios from "axios";
import React, { useEffect, useState } from "react";
import {FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TeacherSchedule = () => {
  const navigate = useNavigate()
  const  apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL
  const [activeTab, setActiveTab] = useState("schedulteList");
  const [teacherScheduleData, setteacherScheduleData] = useState();
  const [teachers, setTeachers] = useState([]);
const [selectedTeacher, setSelectedTeacher] = useState("");

useEffect(()=>{
fetchTeacherSchedule()
fetchTeacher()
},[])

// fetch setteacherSchedule
const fetchTeacherSchedule = async ()=>{
  try {
    const response = await axios.get(`${apiUrl}/classSchedule/getAll`)
    console.log("response",response.data.data)
    setteacherScheduleData(response.data.data)
  } catch (error) {
    console.log(error)
    
  }
}
const fetchTeacher=async()=>{
  try {
    const res=await axios.get(`${apiUrl}/classTeacher/getTeacher`)
    console.log("res teacher", res)
    setTeachers(res.data.data || []);
  } catch (error) {

    console.log(error)
  }

}

 // Schedule group by day
const filteredSchedules = selectedTeacher
  ? (teacherScheduleData || []).filter(s => s.employeeId?._id === selectedTeacher)
  : teacherScheduleData || [];

const scheduleByDay = filteredSchedules.reduce((acc, schedule) => {
  const day = schedule.day?.toUpperCase();
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
    <>
     
     <div className="py-10">
      {/* Teacher schedule */}
      <section>
        <div className="bg-white rounded">
          <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center">
            <div className="w-full md:w-1/2">
              <label className="block font-medium mb-1">
                Teacher <span className="text-red-600">*</span>
              </label>
           <select
  value={selectedTeacher}
  onChange={(e) => setSelectedTeacher(e.target.value)}
  className="w-full border p-1"
>
  <option value="">Select</option>
  {teachers.map((t) => (
    <option key={t._id} value={t._id}>
      {t.name}
    </option>
  ))}
</select>

            </div>
          </div>
          {/* filter button */}
          <div className="flex justify-end my-10">
            <button className="flex items-center gap-2 border border-blue-300 px-4 py-2 rounded-md bg-white hover:bg-blue-50 transition w-[137px]">
              {/* SVG Icon yahan paste karein */}
              <svg
                width="16"
                height="18"
                viewBox="0 0 16 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1H15L10 7.5V17L6 13V7.5L1 1Z"
                  fill="black"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span className="font-semibold text-black">Filter</span>
            </button>
          </div>
        </div>
      </section>
      {/* schedulte list  */}
      <div>
        <div className="flex justify-between">
          {/* schedule icon */}
          <button
            onClick={() => setActiveTab("schedulteList")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${
              activeTab === "schedulteList"
                ? "text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]"
                : "text-gray-600 hover:text-[#143781]"
            }`}
          >
            <FaList />

            <span className="font-semibold text-black">Schedule List</span>
          </button>
          {/* print svg Icon */}
          <button className="w-[32px]">
            <svg
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1" y="1" width="32" height="32" fill="white" />
              <rect
                x="0.5"
                y="0.5"
                width="33"
                height="33"
                stroke="#080808"
                stroke-opacity="0.2"
              />
              <path
                d="M11.667 29C10.9337 29 10.3061 28.7391 9.78433 28.2173C9.26255 27.6956 9.00121 27.0676 9.00033 26.3333V23.6667H6.33366C5.60033 23.6667 4.97277 23.4058 4.45099 22.884C3.92921 22.3622 3.66788 21.7342 3.66699 21V15.6667C3.66699 14.5333 4.05588 13.5836 4.83366 12.8173C5.61144 12.0511 6.55588 11.6676 7.66699 11.6667H26.3337C27.467 11.6667 28.4172 12.0502 29.1843 12.8173C29.9514 13.5844 30.3345 14.5342 30.3337 15.6667V21C30.3337 21.7333 30.0728 22.3613 29.551 22.884C29.0292 23.4067 28.4012 23.6676 27.667 23.6667H25.0003V26.3333C25.0003 27.0667 24.7394 27.6947 24.2177 28.2173C23.6959 28.74 23.0679 29.0009 22.3337 29H11.667ZM25.0003 10.3333H9.00033V7.66667C9.00033 6.93333 9.26166 6.30578 9.78433 5.784C10.307 5.26222 10.9345 5.00089 11.667 5H22.3337C23.067 5 23.695 5.26133 24.2177 5.784C24.7403 6.30667 25.0012 6.93422 25.0003 7.66667V10.3333ZM25.0003 17.6667C25.3781 17.6667 25.695 17.5387 25.951 17.2827C26.207 17.0267 26.3345 16.7102 26.3337 16.3333C26.3328 15.9564 26.2048 15.64 25.9497 15.384C25.6945 15.128 25.3781 15 25.0003 15C24.6225 15 24.3061 15.128 24.051 15.384C23.7959 15.64 23.6679 15.9564 23.667 16.3333C23.6661 16.7102 23.7941 17.0271 24.051 17.284C24.3079 17.5409 24.6243 17.6684 25.0003 17.6667ZM11.667 26.3333H22.3337V21H11.667V26.3333Z"
                fill="#080808"
                fill-opacity="0.7"
              />
            </svg>
          </button>
        </div>
        <hr className="bg-[#151587] border-[0.99px] h-[2px] -mt-0.9" />
      </div>
      {/* Schedule list table */}
      <div className="sm:p-10">
        {/* Table */}
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
                              {entry.subjectId?.subjectName}
                            </span>
                            <br />
                            ({entry.startTime} - {entry.endTime})
                            <br />
                            Teacher - {entry.employeeId?.name}
                            <br />
                            Class Room - {entry.class_room}
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

        {/* Back Button */}
        <div className="flex justify-center mt-10">
          <button onClick={()=>navigate(-1)} className="border border-blue-500 text-blue-700 font-semibold px-6 py-2 rounded hover:bg-blue-50 w-full max-w-[205px]">
            Back
          </button>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-6 sm:mt-2 md:-mt-16 md:-mr-10 ">
          <button className="px-2 py-2 border rounded bg-white">
            <svg
              width="5"
              height="10"
              viewBox="0 0 5 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 0L0 5L5 10V0Z" fill="black" />
            </svg>
          </button>
          <span className="px-4 py-1 bg-[#d8ddfd] rounded text-blue-900 font-semibold">
            1
          </span>
          <button className="px-2 py-2 border rounded bg-white">
            <svg
              width="5"
              height="10"
              viewBox="0 0 5 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 10L5 5L0 0V10Z" fill="black" />
            </svg>
          </button>
        </div>
      </div>

     </div>
    </>
  );
};

export default TeacherSchedule;
