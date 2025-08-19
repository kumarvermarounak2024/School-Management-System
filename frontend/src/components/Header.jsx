import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, CalendarDays, MessageSquare, Layers, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Header = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const [user, setUser] = useState(null);
  const [session, setSession] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false); // Modal state
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    setSession(`${currentYear}–${nextYear}`);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout successfully!");
    setUser(null);
    navigate("/login");
  };

 
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${apiUrl}/event/getAll`);
      // Map API response to Calendar format
      const formattedEvents = res.data.map((event) => ({
        title: event.title,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        allDay: true, // optional: if your calendar uses allDay
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };
  useEffect(() => {
  fetchEvents();
}, []);


  return (
    <>
      <div className="w-full bg-[#143781] text-white px-4 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="text-sm font-semibold leading-tight">
              <div>Demo Public School</div>
              <div className="text-xs">Affilated to ICSE</div>
            </div>
            <div className="ml-auto md:ml-4 text-sm font-semibold">
              Session: {session}
            </div>
          </div>

          {/* Search Box */}
          <div className="w-full md:flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search student name / Id / staff name / Id"
              className="w-full px-4 py-2 bg-gray-100 text-sm rounded outline-none text-black"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <button
              title="Shortcut"
              // onClick={() => navigate("/shortcut")}
            >
              <Layers className="w-5 h-5" />
            </button>
            <button
              title="Notifications"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="w-5 h-5" />
            </button>
            <button title="Messages" onClick={() => navigate("/messages")}>
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              title="Academic Calendar"
              // onClick={() => navigate("/calendar")}
              onClick={() => setCalendarOpen(true)}
            >
              <CalendarDays className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div
              className="flex items-center gap-2 cursor-pointer relative"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                  title={user?.fullName}
                />
              ) : (
                <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold">
                  👤
                </div>
              )}
              <span className="font-semibold text-sm truncate max-w-[100px]">
                ▼
              </span>

              {profileOpen && (
                <div className="absolute right-0 top-full z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black/5">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}

      {calendarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white shadow rounded-lg w-full max-w-3xl p-4 relative overflow-y-auto">
            <button
              onClick={() => setCalendarOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Academic Calendar</h2>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="month" // 👈 Start with month view
              views={["month", "week", "day", "agenda"]} // 👈 Only allow month view
              style={{
                height: 400,
                margin: "20px auto",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
