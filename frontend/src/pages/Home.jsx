import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaUserGraduate,
  FaUser,
  FaChalkboardTeacher,
  FaCogs,
  FaBook,
  FaHome,
  FaUsers,
  FaFileAlt,
  FaBus,
  FaBed,
  FaClipboardList,
  FaBookOpen,
  FaCertificate,
  FaCalendarAlt,
  FaCommentDots,
  FaMoneyCheck,
  FaCalculator,
  FaChartBar,
  FaTools,
  FaAddressCard,
  FaLaptop,
  FaIdCard,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const modules = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaHome />,
    color: "text-green-500",
  },
  {
    name: "Reception",
    path: "/reception",
    icon: <FaAddressCard />,
    color: "text-red-500",
  },
  {
    name: "Admission",
    path: "/admissionform",
    icon: <FaUserGraduate />,
    color: "text-blue-500",
  },
  {
    name: "Student",
    path: "/student",
    icon: <FaUser />,
    color: "text-[#143781]",
  },
  // { name: "Parents", path: "#", icon: <FaUsers />, color: "text-purple-500" },
  {
    name: "Staff",
    path: "/staff",
    icon: <FaChalkboardTeacher />,
    color: "text-pink-500",
  },
  {
    name: "Card Management",
    path: "/cardmanagement",
    icon: <FaIdCard />,
    color: "text-indigo-500",
  },
  {
    name: "Certificate",
    path: "/certificate",
    icon: <FaCertificate />,
    color: "text-teal-500",
  },
  {
    name: "Human Resources",
    path: "/humanresources",
    icon: <FaUser />,
    color: "text-orange-500",
  },
  {
    name: "Academic",
    path: "/academic",
    icon: <FaBookOpen />,
    color: "text-gray-500",
  },
  {
    name: "Book Attachment",
    path: "/create-attachment",
    icon: <FaFileAlt />,
    color: "text-lime-500",
  },
  {
    name: "Homework",
    path: "homework",
    icon: <FaBook />,
    color: "text-cyan-500",
  },
  {
    name: "Examination",
    path: "Examination",
    icon: <FaClipboardList />,
    color: "text-amber-500",
  },
  {
    name: "Online Exam",
    path: "onlineExamHold",
    icon: <FaLaptop />,
    color: "text-fuchsia-500",
  },
  {
    name: "Transportation",
    path: "Transportation",
    icon: <FaBus />,
    color: "text-red-700",
  },
  { name: "Hostel", path: "hostel", icon: <FaBed />, color: "text-teal-700" },
  {
    name: "Attendance",
    path: "attendance",
    icon: <FaClipboardList />,
    color: "text-blue-700",
  },
  {
    name: "Library",
    path: "library",
    icon: <FaBookOpen />,
    color: "text-green-700",
  },
  {
    name: "Events",
    path: "event",
    icon: <FaCalendarAlt />,
    color: "text-orange-700",
  },
  {
    name: "Communication",
    path: "#",
    icon: <FaCommentDots />,
    color: "text-yellow-700",
  },
  {
    name: "Fees",
    path: "fees",
    icon: <FaMoneyCheck />,
    color: "text-purple-700",
  },
  {
    name: "Accounting",
    path: "accounting",
    icon: <FaCalculator />,
    color: "text-indigo-700",
  },
  {
    name: "Reports",
    path: "/report",
    icon: <FaChartBar />,
    color: "text-pink-700",
  },
  { name: "Settings", path: "#", icon: <FaCogs />, color: "text-gray-700" },
];

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Logout function
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   toast.success("Logout successfully!");
  //   setUser(null); // user null set karo takki re-render ho
  //   navigate("/");
  // };

  // On mount: decode token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div className="min-h-screen p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {modules.map((module, index) => (
          <div
            key={index}
            onClick={() => {
              if (module.path !== "#") navigate(module.path);
            }}
            className="flex flex-col items-center justify-center bg-white rounded-xl shadow border border-[#D5DDFF] hover:bg-blue-100 cursor-pointer p-4 min-w-[120px] transition"
          >
            <div className={`text-3xl sm:text-4xl ${module.color} mb-2`}>
              {module.icon}
            </div>
            <div className="text-center text-sm sm:text-base font-medium text-gray-800">
              {module.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
