// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Trash2, Printer } from "lucide-react";
// // import { useNavigate } from "react-router-dom";

// // const apiUrl = "http://localhost:4100/api";

// // export default function FeePay() {
// //   const navigate = useNavigate();

// //   const [selectedClass, setSelectedClass] = useState("");
// //   const [selectedSection, setSelectedSection] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [selectedFeeGroup, setSelectedFeeGroup] = useState("");

// //   const [classList, setClassList] = useState([]);
// //   const [sections, setSections] = useState([]);
// //   const [students, setStudents] = useState([]);
// //   const [selectedStudents, setSelectedStudents] = useState([]);
// //   const [studentName, setStudentName] = useState([]);
// //   // const [invoiceMap, setInvoiceMap] = useState([]);
// //   const [showStudentTable, setShowStudentTable] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     fetchClasses();
// //     fetchSections();
// //   }, []);

// //   const fetchClasses = async () => {
// //     try {
// //       const res = await axios.get(`${apiUrl}/class/getAll`);
// //       setClassList(res.data.classes || []);
// //     } catch (err) {
// //       console.error("Error fetching classes:", err);
// //     }
// //   };

// //   const fetchSections = async () => {
// //     try {
// //       const res = await axios.get(`${apiUrl}/section/getAll`);
// //       setSections(res.data.sections || []);
// //     } catch (err) {
// //       console.error("Error fetching sections:", err);
// //     }
// //   };

// //   const fetchStudents = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await axios.get(`${apiUrl}/inventoryList/getAll`);
// //       const filtered = res.data.students?.filter(
// //         (s) =>
// //           s.level_class?._id === selectedClass &&
// //           s.section?._id === selectedSection
// //       ) || [];
// //       setStudents(filtered);
// //       setSelectedStudents([]);
// //       setShowStudentTable(true);
// //       await fetchInvoices();
// //     } catch (err) {
// //       console.error("Error fetching students:", err);
// //       alert("Failed to load students");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchInvoices = async () => {
// //     try {
// //       const res = await axios.get(`${apiUrl}/inventoryList/getAll`);
// //       console.log(res?.data?.data, "jjhjhgfhj");
// //       console.log(res?.data?.data[0]?.student?.firstName, "first name");
// //       console.log(res?.data?.data[0]?.student?.level_class, "level class");
// //       console.log(res?.data?.data[0]?.student?.section, "section");

// //       // Filter the data based on selected class and section
// //       const filteredData = res?.data?.data?.filter((student) => {
// //         const studentClassId = student?.student?.level_class;
// //         const studentSectionId = student?.student?.section;
// //         return studentClassId === selectedClass && studentSectionId === selectedSection;
// //       }) || [];

// //       setStudentName(filteredData);

// //       const map = [];
// //       filteredData.forEach((invoice) => {
// //         const studentId = invoice.student?._id;
// //         if (studentId) {
// //           map[studentId] = invoice;
// //         }
// //       });
// //       // console.log(map?.student?.firstName, "map");
// //       // setInvoiceMap(map);
// //     } catch (err) {
// //       console.error("Failed to fetch invoices", err);
// //     }
// //   };

// //   const handleCheckboxChange = (studentId) => {
// //     setSelectedStudents((prev) =>
// //       prev.includes(studentId)
// //         ? prev.filter((id) => id !== studentId)
// //         : [...prev, studentId]
// //     );
// //   };

// //   const handleGenerate = async () => {
// //     if (selectedStudents.length === 0) {
// //       alert("Please select at least one student");
// //       return;
// //     }
// //     try {
// //       setLoading(true);
// //       const createPromises = await axios.post(`${apiUrl}/inventoryList/create`, {
// //           student: studentId,
// //           feeGroup: selectedFeeGroup,
// //           status: "Unpaid",
// //         }
// //       );
// //       await Promise.all(createPromises);
// //       alert("Invoice created successfully!");
// //       await fetchInvoices(); // Refresh invoice data after creation
// //     } catch (err) {
// //       console.error("Error creating invoice:", err);
// //       alert("Failed to create invoice");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getStatusBadge = (status) => {
// //     return status === "Paid"
// //       ? "text-green-700 border-green-400 bg-green-50"
// //       : "text-yellow-700 border-yellow-400 bg-yellow-50";
// //   };

// //   // Helper function to get class name by ID
// //   const getClassNameById = (classId) => {
// //     const classItem = classList.find(c => c._id === classId);
// //     return classItem ? classItem.Name : "—";
// //   };

// //   // Helper function to get section name by ID
// //   const getSectionNameById = (sectionId) => {
// //     const sectionItem = sections.find(s => s._id === sectionId);
// //     return sectionItem ? sectionItem.Name : "—";
// //   };

// //   return (
// //     <div className="p-6 bg-[#f4f6fd] min-h-screen text-sm">
// //       <div className="flex flex-wrap gap-10 mb-4">
// //         <div className="flex items-center gap-3 w-96">
// //           <label className="w-90 font-medium text-gray-700">
// //             Class <span className="text-red-500">*</span>
// //           </label>
// //           <select
// //             className="border p-2 rounded bg-white flex-1"
// //             value={selectedClass}
// //             onChange={(e) => {
// //               setSelectedClass(e.target.value);
// //               setSelectedSection("");
// //               setShowStudentTable(false);
// //             }}
// //           >
// //             <option value="">Select Class</option>
// //             {classList.map((c) => (
// //               <option key={c._id} value={c._id}>
// //                 {c.Name}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         <div className="flex items-center gap-3 w-96">
// //           <label className="w-50 font-medium text-gray-700">
// //             Section <span className="text-red-500">*</span>
// //           </label>
// //           <select
// //             className="border p-2 rounded bg-white flex-1"
// //             value={selectedSection}
// //             onChange={(e) => {
// //               setSelectedSection(e.target.value);
// //               setShowStudentTable(false);
// //             }}
// //             disabled={!selectedClass}
// //           >
// //             <option value="">Select Section</option>
// //             {sections.map((s) => (
// //               <option key={s._id} value={s._id}>
// //                 {s.Name}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         <div className="flex justify-end mt-5 mb-6">
// //           <button
// //             onClick={fetchStudents}
// //             className={`h-10 bg-blue-900 text-white px-6 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
// //               }`}
// //             disabled={!selectedClass || !selectedSection || loading}
// //           >
// //             {loading ? "Loading..." : "Show"}
// //           </button>
// //         </div>
// //       </div>

// //       {showStudentTable && (
// //         <>
// //           <div className="flex items-center justify-between py-2 border-t border-b mb-3">
// //             <span className="font-semibold">📋 Students List</span>
// //             <button
// //               className="bg-white border px-4 py-1 rounded flex items-center gap-1"
// //               onClick={handleGenerate}
// //               disabled={loading}
// //             >
// //               <Printer className="w-4 h-4" />
// //               Generate
// //             </button>
// //           </div>

// //           <input
// //             type="text"
// //             placeholder="🔍 Search Here..."
// //             className="w-1/3 border p-2 rounded mb-4"
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //           />

// //           <div className="overflow-x-auto bg-white rounded shadow">
// //             <table className="min-w-full table-auto text-left border">
// //               <thead className="bg-indigo-50 text-gray-700">
// //                 <tr>
// //                   <th className="p-2 border">
// //                     <input
// //                       type="checkbox"
// //                       checked={
// //                         selectedStudents.length === students.length &&
// //                         students.length > 0
// //                       }
// //                       onChange={() =>
// //                         setSelectedStudents(
// //                           selectedStudents.length === students.length
// //                             ? []
// //                             : students.map((s) => s._id)
// //                         )
// //                       }
// //                     />
// //                   </th>
// //                   <th className="p-2 border">Student Name</th>
// //                   <th className="p-2 border">Class</th>
// //                   <th className="p-2 border">Section</th>
// //                   <th className="p-2 border">Register No.</th>
// //                   <th className="p-2 border">Roll No.</th>
// //                   <th className="p-2 border">Mobile No.</th>
// //                   <th className="p-2 border">Fees Group</th>
// //                   <th className="p-2 border">Status</th>
// //                   <th className="p-2 border">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {studentName.length > 0 ? (
// //                   studentName.map((student) => (
// //                     <tr key={student._id} className="hover:bg-gray-50">
// //                       <td className="p-2 border">
// //                         <input
// //                           type="checkbox"
// //                           checked={selectedStudents.includes(student.student?._id)}
// //                           onChange={() => handleCheckboxChange(student.student?._id)}
// //                         />
// //                       </td>
// //                       <td className="p-2 border">
// //                         {student?.student?.firstName} {student?.student?.lastName}
// //                       </td>
// //                       <td className="p-2 border">
// //                         {getClassNameById(student?.student?.level_class)}
// //                       </td>
// //                       <td className="p-2 border">
// //                         {getSectionNameById(student?.student?.section)}
// //                       </td>
// //                       <td className="p-2 border">
// //                         {student?.student?.registration_no || "—"}
// //                       </td>
// //                       <td className="p-2 border">
// //                         {student?.student?.roll_no || "—"}
// //                       </td>
// //                       <td className="p-2 border">
// //                         {student?.student?.mobile_no || "—"}
// //                       </td>
// //                       <td className="p-2 border">
// //                         {student?.feeGroup?.feeGroup || "—"}
// //                       </td>
// //                       <td className="p-2 border">
// //                         <span
// //                           className={`px-2 py-1 rounded text-xs border ${getStatusBadge(
// //                             student?.status
// //                           )}`}
// //                         >
// //                           {student?.status || "—"}
// //                         </span>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td colSpan="9" className="p-4 text-center text-gray-500">
// //                       No students found for the selected class and section
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Trash2, Printer } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const apiUrl = "http://localhost:4100/api";

// export default function FeePay() {
//   const navigate = useNavigate();

//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [search, setSearch] = useState("");
//   const [selectedFeeGroup, setSelectedFeeGroup] = useState("");

//   const [classList, setClassList] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [studentName, setStudentName] = useState([]);
//   const [showStudentTable, setShowStudentTable] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchClasses();
//     fetchSections();
//   }, []);

//   const fetchClasses = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/class/getAll`);
//       setClassList(res.data.classes || []);
//     } catch (err) {
//       console.error("Error fetching classes:", err);
//     }
//   };

//   const fetchSections = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/section/getAll`);
//       setSections(res.data.sections || []);
//     } catch (err) {
//       console.error("Error fetching sections:", err);
//     }
//   };

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${apiUrl}/inventoryList/getAll`);
//        console.log(res?.data?.data, "jjhjhgfhj");
//        console.log(res?.data?.data[0]?.student?.firstName, "first name");
//        console.log(res?.data?.data[0]?.student?.level_class, "level class");
//        console.log(res?.data?.data[0]?.student?.section, "section");
//       const filtered = res.data.students?.filter(
//         (s) =>
//           s.level_class?._id === selectedClass &&
//           s.section?._id === selectedSection
//       ) || [];
//       setStudents(filtered);
//       setSelectedStudents([]);
//       setShowStudentTable(true);
//       await fetchInvoices();
//     } catch (err) {
//       console.error("Error fetching students:", err);
//       alert("Failed to load students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchInvoices = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/inventoryList/getAll`);
//       const filteredData = res?.data?.data?.filter((student) => {
//         const studentClassId = student?.student?.level_class;
//         const studentSectionId = student?.student?.section;
//         return studentClassId === selectedClass && studentSectionId === selectedSection;
//       }) || [];

//       setStudentName(filteredData);
//     } catch (err) {
//       console.error("Failed to fetch invoices", err);
//     }
//   };

//   const handleCheckboxChange = (studentId) => {
//     setSelectedStudents((prev) =>
//       prev.includes(studentId)
//         ? prev.filter((id) => id !== studentId)
//         : [...prev, studentId]
//     );
//   };

//   const handleGenerate = async () => {
//     if (selectedStudents.length === 0) {
//       alert("Please select at least one student");
//       return;
//     }
//     try {
//       setLoading(true);
//       const createPromises = await axios.post(`${apiUrl}/inventoryList/create`, {
//           student: studentId,
//           feeGroup: selectedFeeGroup,
//           status: "Unpaid",
//         }
        
//       );
//       console.log("data",createPromises)
//       await Promise.all(createPromises);
//       alert("Invoice created successfully!");
//       await fetchInvoices(); // Refresh invoice data after creation
//     } catch (err) {
//       console.error("Error creating invoice:", err);
//       alert("Failed to create invoice");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     return status === "Paid"
//       ? "text-green-700 border-green-400 bg-green-50"
//       : "text-yellow-700 border-yellow-400 bg-yellow-50";
//   };

//   const getClassNameById = (classId) => {
//     const classItem = classList.find(c => c._id === classId);
//     return classItem ? classItem.Name : "—";
//   };

//   const getSectionNameById = (sectionId) => {
//     const sectionItem = sections.find(s => s._id === sectionId);
//     return sectionItem ? sectionItem.Name : "—";
//   };

// const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${apiUrl}/inventoryList/delete/${id}`);
//       alert("Deleted successfully!");
//       fetchInvoices(); // Refresh data after deletion
//     } catch (err) {
//       console.error("Delete failed:", err);
//       alert("Failed to delete invoice");
//     }
//   };
//   return (
//     <div className="p-6 bg-[#f4f6fd] min-h-screen text-sm">
//       <div className="flex flex-wrap gap-10 mb-4">
//         <div className="flex items-center gap-3 w-96">
//           <label className="w-90 font-medium text-gray-700">
//             Class <span className="text-red-500">*</span>
//           </label>
//           <select
//             className="border p-2 rounded bg-white flex-1"
//             value={selectedClass}
//             onChange={(e) => {
//               setSelectedClass(e.target.value);
//               setSelectedSection("");
//               setShowStudentTable(false);
//             }}
//           >
//             <option value="">Select Class</option>
//             {classList.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.Name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-3 w-96">
//           <label className="w-50 font-medium text-gray-700">
//             Section <span className="text-red-500">*</span>
//           </label>
//           <select
//             className="border p-2 rounded bg-white flex-1"
//             value={selectedSection}
//             onChange={(e) => {
//               setSelectedSection(e.target.value);
//               setShowStudentTable(false);
//             }}
//             disabled={!selectedClass}
//           >
//             <option value="">Select Section</option>
//             {sections.map((s) => (
//               <option key={s._id} value={s._id}>
//                 {s.Name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex justify-end mt-5 mb-6">
//           <button
//             onClick={fetchStudents}
//             className={`h-10 bg-blue-900 text-white px-6 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//             disabled={!selectedClass || !selectedSection || loading}
//           >
//             {loading ? "Loading..." : "Show"}
//           </button>
//         </div>
//       </div>

//       {showStudentTable && (
//         <>
//           <div className="flex items-center justify-between py-2 border-t border-b mb-3">
//             <span className="font-semibold">📋 Students List</span>
//             <button
//               className="bg-white border px-4 py-1 rounded flex items-center gap-1"
//               onClick={handleGenerate}
//               disabled={loading}
//             >
//               <Printer className="w-4 h-4" />
//               Generate
//             </button>
//           </div>

//           <input
//             type="text"
//             placeholder="🔍 Search Here..."
//             className="w-1/3 border p-2 rounded mb-4"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <div className="overflow-x-auto bg-white rounded shadow">
//             <table className="min-w-full table-auto text-left border">
//               <thead className="bg-indigo-50 text-gray-700">
//                 <tr>
//                   <th className="p-2 border">
//                     <input
//                       type="checkbox"
//                       checked={
//                         selectedStudents.length === students.length &&
//                         students.length > 0
//                       }
//                       onChange={() =>
//                         setSelectedStudents(
//                           selectedStudents.length === students.length
//                             ? []
//                             : students.map((s) => s._id)
//                         )
//                       }
//                     />
//                   </th>
//                   <th className="p-2 border">Student Name</th>
//                   <th className="p-2 border">Class</th>
//                   <th className="p-2 border">Section</th>
//                   <th className="p-2 border">Register No.</th>
//                   <th className="p-2 border">Roll No.</th>
//                   <th className="p-2 border">Mobile No.</th>
//                   <th className="p-2 border">Fees Group</th>
//                   <th className="p-2 border">Status</th>
//                   <th className="p-2 border">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {studentName.length > 0 ? (
//                   studentName.map((student) => (
//                     <tr key={student._id} className="hover:bg-gray-50">
//                       <td className="p-2 border">
//                         <input
//                           type="checkbox"
//                           checked={selectedStudents.includes(student.student?._id)}
//                           onChange={() => handleCheckboxChange(student.student?._id)}
//                         />
//                       </td>
//                       <td className="p-2 border">
//                         {student?.student?.firstName} {student?.student?.lastName}
//                       </td>
//                       <td className="p-2 border">
//                         {getClassNameById(student?.student?.level_class)}
//                       </td>
//                       <td className="p-2 border">
//                         {getSectionNameById(student?.student?.section)}
//                       </td>
//                       <td className="p-2 border">
//                         {student?.student?.registration_no || "—"}
//                       </td>
//                       <td className="p-2 border">
//                         {student?.student?.roll_no || "—"}
//                       </td>
//                       <td className="p-2 border">
//                         {student?.student?.mobile_no || "—"}
//                       </td>
//                       <td className="p-2 border">
//                         {student?.feeGroup?.feeGroup || "—"}
//                       </td>
//                       <td className="p-2 border">
//                         <span
//                           className={`px-2 py-1 rounded text-xs border ${getStatusBadge(
//                             student?.status
//                           )}`}
//                         >
//                           {student?.status || "—"}
//                         </span>
//                       </td>
//                       <td className="p-2 border flex gap-2 items-center">
//                         <button
//                           className="text-blue-600  border px-4 py-1 rounded  text-xs"
//                           onClick={() => navigate("/fee-collection")}
//                         >
//                           Collection
//                         </button>
//                         <Trash2
//                          onClick={() => handleDelete(student._id)}
//                         className="w-4 h-4 text-red-600 cursor-pointer" />
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="10" className="p-4 text-center text-gray-500">
//                       No students found for the selected class and section
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

//new code correct
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Trash2, Printer } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const apiUrl = "http://localhost:4100/api";

// export default function FeePay() {
//   const navigate = useNavigate();

//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [search, setSearch] = useState("");
//   const [selectedFeeGroup, setSelectedFeeGroup] = useState("");

//   const [classList, setClassList] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [studentName, setStudentName] = useState([]);
//   const [showStudentTable, setShowStudentTable] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchClasses();
//     fetchSections();
//   }, []);

//   const fetchClasses = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/class/getAll`);
//       setClassList(res.data.classes || []);
//     } catch (err) {
//       console.error("Error fetching classes:", err);
//     }
//   };

//   const fetchSections = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/section/getAll`);
//       setSections(res.data.sections || []);
//     } catch (err) {
//       console.error("Error fetching sections:", err);
//     }
//   };

//   // Fixed: Combined both functions into one and fixed the data handling
//   const fetchStudentsAndInvoices = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${apiUrl}/inventoryList/getAll`);
      
//       console.log(res?.data?.data, "Raw data from API");
      
//       // Filter data based on selected class and section
//       const filteredData = res?.data?.data?.filter((item) => {
//         const studentClassId = item?.student?.level_class;
//         const studentSectionId = item?.student?.section;
//         return studentClassId === selectedClass && studentSectionId === selectedSection;
//       }) || [];

//       console.log("Filtered data:", filteredData);
      
//       // Remove duplicates based on student ID
//       const uniqueStudents = filteredData.filter((item, index, self) =>
//         index === self.findIndex(t => t.student?._id === item.student?._id)
//       );

//       setStudentName(uniqueStudents);
//       setSelectedStudents([]);
//       setShowStudentTable(true);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       alert("Failed to load students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCheckboxChange = (studentId) => {
//     setSelectedStudents((prev) =>
//       prev.includes(studentId)
//         ? prev.filter((id) => id !== studentId)
//         : [...prev, studentId]
//     );
//   };

//   const handleGenerate = async () => {
//     if (selectedStudents.length === 0) {
//       alert("Please select at least one student");
//       return;
//     }
//     try {
//       setLoading(true);
      
//       // Fixed: Create separate requests for each selected student
//       const createPromises = selectedStudents.map(studentId =>
//         axios.post(`${apiUrl}/inventoryList/create`, {
//           student: studentId,
//           feeGroup: selectedFeeGroup,
//           status: "Unpaid",
//         })
//       );
      
//       await Promise.all(createPromises);
//       alert("Invoice created successfully!");
//       await fetchStudentsAndInvoices(); // Refresh data after creation
//     } catch (err) {
//       console.error("Error creating invoice:", err);
//       alert("Failed to create invoice");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     return status === "Paid"
//       ? "text-green-700 border-green-400 bg-green-50"
//       : "text-yellow-700 border-yellow-400 bg-yellow-50";
//   };

//   const getClassNameById = (classId) => {
//     const classItem = classList.find(c => c._id === classId);
//     return classItem ? classItem.Name : "—";
//   };

//   const getSectionNameById = (sectionId) => {
//     const sectionItem = sections.find(s => s._id === sectionId);
//     return sectionItem ? sectionItem.Name : "—";
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${apiUrl}/inventoryList/delete/${id}`);
//       alert("Deleted successfully!");
//       fetchStudentsAndInvoices(); // Refresh data after deletion
//     } catch (err) {
//       console.error("Delete failed:", err);
//       alert("Failed to delete invoice");
//     }
//   };

//   // Filter students based on search
//   const filteredStudents = studentName.filter(student => {
//     const fullName = `${student?.student?.firstName} ${student?.student?.lastName}`.toLowerCase();
//     const regNo = student?.student?.registration_no?.toLowerCase() || "";
//     const rollNo = student?.student?.roll_no?.toLowerCase() || "";
//     const searchTerm = search.toLowerCase();
    
//     return fullName.includes(searchTerm) ||
//            regNo.includes(searchTerm) ||
//            rollNo.includes(searchTerm);
//   });

//   return (
//     <div className="p-6 bg-[#f4f6fd] min-h-screen text-sm">
//       <div className="flex flex-wrap gap-10 mb-4">
//         <div className="flex items-center gap-3 w-96">
//           <label className="w-90 font-medium text-gray-700">
//             Class <span className="text-red-500">*</span>
//           </label>
//           <select
//             className="border p-2 rounded bg-white flex-1"
//             value={selectedClass}
//             onChange={(e) => {
//               setSelectedClass(e.target.value);
//               setSelectedSection("");
//               setShowStudentTable(false);
//             }}
//           >
//             <option value="">Select Class</option>
//             {classList.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.Name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-3 w-96">
//           <label className="w-50 font-medium text-gray-700">
//             Section <span className="text-red-500">*</span>
//           </label>
//           <select
//             className="border p-2 rounded bg-white flex-1"
//             value={selectedSection}
//             onChange={(e) => {
//               setSelectedSection(e.target.value);
//               setShowStudentTable(false);
//             }}
//             disabled={!selectedClass}
//           >
//             <option value="">Select Section</option>
//             {sections.map((s) => (
//               <option key={s._id} value={s._id}>
//                 {s.Name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex justify-end mt-5 mb-6">
//           <button
//             onClick={fetchStudentsAndInvoices}
//             className={`h-10 bg-blue-900 text-white px-6 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//             disabled={!selectedClass || !selectedSection || loading}
//           >
//             {loading ? "Loading..." : "Show"}
//           </button>
//         </div>
//       </div>

//       {showStudentTable && (
//         <>
//           <div className="flex items-center justify-between py-2 border-t border-b mb-3">
//             <span className="font-semibold">📋 Students List</span>
//             <button
//               className="bg-white border px-4 py-1 rounded flex items-center gap-1"
//               onClick={handleGenerate}
//               disabled={loading}
//             >
//               <Printer className="w-4 h-4" />
//               Generate
//             </button>
//           </div>

//           <input
//             type="text"
//             placeholder="🔍 Search Here..."
//             className="w-1/3 border p-2 rounded mb-4"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <div className="overflow-x-auto bg-white rounded shadow">
//             <table className="min-w-full table-auto text-left border">
//               <thead className="bg-indigo-50 text-gray-700">
//                 <tr>
//                   <th className="p-2 border">
//                     <input
//                       type="checkbox"
//                       checked={
//                         selectedStudents.length === filteredStudents.length &&
//                         filteredStudents.length > 0
//                       }
//                       onChange={() =>
//                         setSelectedStudents(
//                           selectedStudents.length === filteredStudents.length
//                             ? []
//                             : filteredStudents.map((s) => s.student?._id)
//                         )
//                       }
//                     />
//                   </th>
//                   <th className="p-2 border">Student Name</th>
//                   <th className="p-2 border">Class</th>
//                   <th className="p-2 border">Section</th>
//                   <th className="p-2 border">Register No.</th>
//                   <th className="p-2 border">Roll No.</th>
//                   <th className="p-2 border">Mobile No.</th>
//                   <th className="p-2 border">Fees Group</th>
//                   <th className="p-2 border">Status</th>
//                   <th className="p-2 border">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredStudents.length > 0 ? (
//                   filteredStudents.map((student) => (
//                     <tr key={student._id} className="hover:bg-gray-50">
//                       <td className="p-2 border">
//                         <input
//                           type="checkbox"
//                           checked={selectedStudents.includes(student.student?._id)}
//                           onChange={() => handleCheckboxChange(student.student?._id)}
//                         />
//                       </td>
//                       <td className="p-2 border">
//                         {student?.student?.firstName} {student?.student?.lastName}
//                       </td>
//                       <td className="p-2 border">
//                         {getClassNameById(student?.student?.level_class)}
//                       </td>
//                       <td className="p-2 border">
//                         {getSectionNameById(student?.student?.section)}
//                       </td>
//                       <td className="p-2 border">
//                         {student?.student?.registration_no || "—"}
//                       </td>
//                       <td className="p-2 border">
//                         {student?.student?.roll_no || "—"}
//                       </td>
//                       <td className="p-2 border">
//                         {student?.student?.mobile_no || "—"}
//                       </td>
//                       <td className="p-2 border">
//                         {student?.feeGroup?.feeGroup || "—"}
//                       </td>
//                       <td className="p-2 border">
//                         <span
//                           className={`px-2 py-1 rounded text-xs border ${getStatusBadge(
//                             student?.status
//                           )}`}
//                         >
//                           {student?.status || "—"}
//                         </span>
//                       </td>
//                       <td className="p-2 border flex gap-2 items-center">
//                         <button
//                           className="text-blue-600 border px-4 py-1 rounded text-xs"
//                           onClick={() => navigate("/fee-collection")}
//                         >
//                           Collection
//                         </button>
//                         <Trash2
//                           onClick={() => handleDelete(student._id)}
//                           className="w-4 h-4 text-red-600 cursor-pointer"
//                         />
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="10" className="p-4 text-center text-gray-500">
//                       No students found for the selected class and section
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Trash2, Printer } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const apiUrl = "http://localhost:4100/api";

// export default function FeePay() {
//   const navigate = useNavigate();

//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [selectedFeeGroup, setSelectedFeeGroup] = useState("");
//   const [search, setSearch] = useState("");

//   const [classList, setClassList] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [feeGroups, setFeeGroups] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [studentName, setStudentName] = useState([]);
//   const [showStudentTable, setShowStudentTable] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchClasses();
//     fetchSections();
//     fetchFeeGroups();
//   }, []);

//   const fetchClasses = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/class/getAll`);
//       setClassList(res.data.classes || []);
//     } catch (err) {
//       console.error("Error fetching classes:", err);
//     }
//   };

//   const fetchSections = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/section/getAll`);
//       setSections(res.data.sections || []);
//     } catch (err) {
//       console.error("Error fetching sections:", err);
//     }
//   };

//   const fetchFeeGroups = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/feeGroup/getAll`);
//       setFeeGroups(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching fee groups:", err);
//     }
//   };

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${apiUrl}/inventoryList/getAll`);
//       const filteredData = res?.data?.data?.filter((student) => {
//         const studentClassId = student?.student?.level_class;
//         const studentSectionId = student?.student?.section;
//         return studentClassId === selectedClass && studentSectionId === selectedSection;
//       }) || [];

//       setStudentName(filteredData);
//       setStudents(filteredData.map((s) => s.student)); // Store students list
//       setSelectedStudents([]);
//       setShowStudentTable(true);
//     } catch (err) {
//       console.error("Error fetching students:", err);
//       alert("Failed to load students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCheckboxChange = (studentId) => {
//     setSelectedStudents((prev) =>
//       prev.includes(studentId)
//         ? prev.filter((id) => id !== studentId)
//         : [...prev, studentId]
//     );
//   };

//   const handleGenerate = async () => {
//     if (selectedStudents.length === 0) {
//       alert("Please select at least one student");
//       return;
//     }

//     if (!selectedFeeGroup) {
//       alert("Please select a Fee Group");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = selectedStudents.map((studentId) => ({
//         student: studentId,
//         feeGroup: selectedFeeGroup,
//         status: "Unpaid",
//       }));

//       const res = await axios.post(`${apiUrl}/inventoryList/create`, payload);
//       console.log("Invoices created:", res.data);

//       alert("Invoices created successfully!");
//       await fetchStudents(); // Refresh data
//     } catch (err) {
//       console.error("Error creating invoices:", err);
//       alert("Failed to create invoices");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     return status === "Paid"
//       ? "text-green-700 border-green-400 bg-green-50"
//       : "text-yellow-700 border-yellow-400 bg-yellow-50";
//   };

//   const getClassNameById = (classId) => {
//     const classItem = classList.find((c) => c._id === classId);
//     return classItem ? classItem.Name : "—";
//   };

//   const getSectionNameById = (sectionId) => {
//     const sectionItem = sections.find((s) => s._id === sectionId);
//     return sectionItem ? sectionItem.Name : "—";
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${apiUrl}/inventoryList/delete/${id}`);
//       alert("Deleted successfully!");
//       fetchStudents();
//     } catch (err) {
//       console.error("Delete failed:", err);
//       alert("Failed to delete invoice");
//     }
//   };

//   return (
//     <div className="p-6 bg-[#f4f6fd] min-h-screen text-sm">
//       <div className="flex flex-wrap gap-10 mb-4">
//         <div className="flex items-center gap-3 w-96">
//           <label className="w-90 font-medium text-gray-700">
//             Class <span className="text-red-500">*</span>
//           </label>
//           <select
//             className="border p-2 rounded bg-white flex-1"
//             value={selectedClass}
//             onChange={(e) => {
//               setSelectedClass(e.target.value);
//               setSelectedSection("");
//               setShowStudentTable(false);
//             }}
//           >
//             <option value="">Select Class</option>
//             {classList.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.Name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-3 w-96">
//           <label className="w-50 font-medium text-gray-700">
//             Section <span className="text-red-500">*</span>
//           </label>
//           <select
//             className="border p-2 rounded bg-white flex-1"
//             value={selectedSection}
//             onChange={(e) => {
//               setSelectedSection(e.target.value);
//               setShowStudentTable(false);
//             }}
//             disabled={!selectedClass}
//           >
//             <option value="">Select Section</option>
//             {sections.map((s) => (
//               <option key={s._id} value={s._id}>
//                 {s.Name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-3 w-96">
//           <label className="w-50 font-medium text-gray-700">
//             Fee Group <span className="text-red-500">*</span>
//           </label>
//           <select
//             className="border p-2 rounded bg-white flex-1"
//             value={selectedFeeGroup}
//             onChange={(e) => setSelectedFeeGroup(e.target.value)}
//           >
//             <option value="">Select Fee Group</option>
//             {feeGroups.map((fg) => (
//               <option key={fg._id} value={fg._id}>
//                 {fg.feeGroup}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex justify-end mt-5 mb-6">
//           <button
//             onClick={fetchStudents}
//             className={`h-10 bg-blue-900 text-white px-6 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//             disabled={!selectedClass || !selectedSection || loading}
//           >
//             {loading ? "Loading..." : "Show"}
//           </button>
//         </div>
//       </div>

//       {showStudentTable && (
//         <>
//           <div className="flex items-center justify-between py-2 border-t border-b mb-3">
//             <span className="font-semibold">📋 Students List</span>
//             <button
//               className="bg-white border px-4 py-1 rounded flex items-center gap-1"
//               onClick={handleGenerate}
//               disabled={loading}
//             >
//               <Printer className="w-4 h-4" />
//               Generate
//             </button>
//           </div>

//           <input
//             type="text"
//             placeholder="🔍 Search Here..."
//             className="w-1/3 border p-2 rounded mb-4"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <div className="overflow-x-auto bg-white rounded shadow">
//             <table className="min-w-full table-auto text-left border">
//               <thead className="bg-indigo-50 text-gray-700">
//                 <tr>
//                   <th className="p-2 border">
//                     <input
//                       type="checkbox"
//                       checked={
//                         selectedStudents.length === students.length &&
//                         students.length > 0
//                       }
//                       onChange={() =>
//                         setSelectedStudents(
//                           selectedStudents.length === students.length
//                             ? []
//                             : students.map((s) => s._id)
//                         )
//                       }
//                     />
//                   </th>
//                   <th className="p-2 border">Student Name</th>
//                   <th className="p-2 border">Class</th>
//                   <th className="p-2 border">Section</th>
//                   <th className="p-2 border">Register No.</th>
//                   <th className="p-2 border">Roll No.</th>
//                   <th className="p-2 border">Mobile No.</th>
//                   <th className="p-2 border">Fees Group</th>
//                   <th className="p-2 border">Status</th>
//                   <th className="p-2 border">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {studentName.length > 0 ? (
//                   studentName.map((student) => (
//                     <tr key={student._id} className="hover:bg-gray-50">
//                       <td className="p-2 border">
//                         <input
//                           type="checkbox"
//                           checked={selectedStudents.includes(student.student?._id)}
//                           onChange={() => handleCheckboxChange(student.student?._id)}
//                         />
//                       </td>
//                       <td className="p-2 border">
//                         {student?.student?.firstName} {student?.student?.lastName}
//                       </td>
//                       <td className="p-2 border">
//                         {getClassNameById(student?.student?.level_class)}
//                       </td>
//                       <td className="p-2 border">
//                         {getSectionNameById(student?.student?.section)}
//                       </td>
//                       <td className="p-2 border">
//                         {student?.student?.registration_no || "—"}
//                       </td>
//                       <td className="p-2 border">
//                         {student?.student?.roll_no || "—"}
//                       </td>
//                       <td className="p-2 border">
//                         {student?.student?.mobile_no || "—"}
//                       </td>
//                       <td className="p-2 border">
//                         {student?.feeGroup?.feeGroup || "—"}
//                       </td>
//                       <td className="p-2 border">
//                         <span
//                           className={`px-2 py-1 rounded text-xs border ${getStatusBadge(
//                             student?.status
//                           )}`}
//                         >
//                           {student?.status || "—"}
//                         </span>
//                       </td>
//                       <td className="p-2 border flex gap-2 items-center">
//                         <button
//                           className="text-blue-600 border px-4 py-1 rounded text-xs"
//                           onClick={() => navigate("/fee-collection")}
//                         >
//                           Collection
//                         </button>
//                         <Trash2
//                           onClick={() => handleDelete(student._id)}
//                           className="w-4 h-4 text-red-600 cursor-pointer"
//                         />
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="10" className="p-4 text-center text-gray-500">
//                       No students found for the selected class and section
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

const apiUrl = "http://localhost:4100/api";

export default function FeePay() {
  const navigate = useNavigate();

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [search, setSearch] = useState("");
  // Hardcoded fee group ID - no need to select
  const defaultFeeGroupId = "685406e1bb0d3f83de8656e7";

  const [classList, setClassList] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentName, setStudentName] = useState([]);
  const [showStudentTable, setShowStudentTable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchSections();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/class/getAll`);
      setClassList(res.data.classes || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get(`${apiUrl}/section/getAll`);
      setSections(res.data.sections || []);
    } catch (err) {
      console.error("Error fetching sections:", err);
    }
  };

  // Fixed: Combined both functions into one and fixed the data handling
  const fetchStudentsAndInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/inventoryList/getAll`);

      console.log(res?.data?.data, "Raw data from API");

      // Filter data based on selected class and section
      const filteredData =
        res?.data?.data?.filter((item) => {
          // Check if student exists and has the required fields
          if (!item?.student) return false;

          const studentClassId = item?.student?.level_class;
          const studentSectionId = item?.student?.section;
          return (
            studentClassId === selectedClass &&
            studentSectionId === selectedSection
          );
        }) || [];

      console.log("Filtered data:", filteredData);

      // Remove duplicates based on student ID
      const uniqueStudents = filteredData.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.student?._id === item.student?._id)
      );

      setStudentName(uniqueStudents);
      setSelectedStudents([]);
      setShowStudentTable(true);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleGenerate = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }

    try {
      setLoading(true);

      // Fixed: Create separate requests for each selected student with hardcoded fee group
      const createPromises = selectedStudents.map((studentId) =>
        axios.post(`${apiUrl}/inventoryList/create`, {
          student: studentId,
          feeGroup: defaultFeeGroupId, // Using hardcoded fee group ID
          status: "Unpaid",
        })
      );

      await Promise.all(createPromises);
      alert("Invoice created successfully!");
      navigate("/fee-collection");
      await fetchStudentsAndInvoices(); // Refresh data after creation
    } catch (err) {
      console.error("Error creating invoice:", err);
      alert(
        "Failed to create invoice: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return status === "Paid"
      ? "text-green-700 border-green-400 bg-green-50"
      : "text-yellow-700 border-yellow-400 bg-yellow-50";
  };

  const getClassNameById = (classId) => {
    const classItem = classList.find((c) => c._id === classId);
    return classItem ? classItem.Name : "—";
  };

  const getSectionNameById = (sectionId) => {
    const sectionItem = sections.find((s) => s._id === sectionId);
    return sectionItem ? sectionItem.Name : "—";
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${apiUrl}/inventoryList/delete/${id}`);
      alert("Deleted successfully!");
      fetchStudentsAndInvoices(); // Refresh data after deletion
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete invoice");
    }
  };

  // Filter students based on search
  const filteredStudents = studentName.filter((student) => {
    const fullName =
      `${student?.student?.firstName} ${student?.student?.lastName}`.toLowerCase();
    const regNo = student?.student?.registration_no?.toLowerCase() || "";
    const rollNo = student?.student?.roll_no?.toLowerCase() || "";
    const searchTerm = search.toLowerCase();

    return (
      fullName.includes(searchTerm) ||
      regNo.includes(searchTerm) ||
      rollNo.includes(searchTerm)
    );
  });

  return (
    <div className="p-6 bg-[#f4f6fd] min-h-screen text-sm">
      <div className="flex flex-wrap gap-10 mb-4">
        <div className="flex items-center gap-3 w-96">
          <label className="w-90 font-medium text-gray-700">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            className="border p-2 rounded bg-white flex-1"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSection("");
              setShowStudentTable(false);
            }}
          >
            <option value="">Select Class</option>
            {classList.map((c) => (
              <option key={c._id} value={c._id}>
                {c.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-96">
          <label className="w-50 font-medium text-gray-700">
            Section <span className="text-red-500">*</span>
          </label>
          <select
            className="border p-2 rounded bg-white flex-1"
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              setShowStudentTable(false);
            }}
            disabled={!selectedClass}
          >
            <option value="">Select Section</option>
            {sections.map((s) => (
              <option key={s._id} value={s._id}>
                {s.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end mt-5 mb-6">
          <button
            onClick={fetchStudentsAndInvoices}
            className={`h-10 bg-blue-900 text-white px-6 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!selectedClass || !selectedSection || loading}
          >
            {loading ? "Loading..." : "Show"}
          </button>
        </div>
      </div>

      {showStudentTable && (
        <>
          <div className="flex items-center justify-between py-2 border-t border-b mb-3">
            <span className="font-semibold">📋 Students List</span>
            <button
              className="bg-white border px-4 py-1 rounded flex items-center gap-1"
              onClick={handleGenerate}
              disabled={loading}
            >
              <Printer className="w-4 h-4" />
              Generate
            </button>
          </div>

          <input
            type="text"
            placeholder="🔍 Search Here..."
            className="w-1/3 border p-2 rounded mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full table-auto text-left border">
              <thead className="bg-indigo-50 text-gray-700">
                <tr>
                  <th className="p-2 border">
                    <input
                      type="checkbox"
                      checked={
                        selectedStudents.length === filteredStudents.length &&
                        filteredStudents.length > 0
                      }
                      onChange={() =>
                        setSelectedStudents(
                          selectedStudents.length === filteredStudents.length
                            ? []
                            : filteredStudents.map((s) => s.student?._id)
                        )
                      }
                    />
                  </th>
                  <th className="p-2 border">Student Name</th>
                  <th className="p-2 border">Class</th>
                  <th className="p-2 border">Section</th>
                  <th className="p-2 border">Register No.</th>
                  <th className="p-2 border">Roll No.</th>
                  <th className="p-2 border">Mobile No.</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="p-2 border">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(
                            student.student?._id
                          )}
                          onChange={() =>
                            handleCheckboxChange(student.student?._id)
                          }
                        />
                      </td>
                      <td className="p-2 border">
                        {student?.student?.firstName}{" "}
                        {student?.student?.lastName}
                      </td>
                      <td className="p-2 border">
                        {getClassNameById(student?.student?.level_class)}
                      </td>
                      <td className="p-2 border">
                        {getSectionNameById(student?.student?.section)}
                      </td>
                      <td className="p-2 border">
                        {student?.student?.registration_no || "—"}
                      </td>
                      <td className="p-2 border">
                        {student?.student?.roll_no || "—"}
                      </td>
                      <td className="p-2 border">
                        {student?.student?.mobile_no || "—"}
                      </td>
                      <td className="p-2 border">
                        <span
                          className={`px-2 py-1 rounded text-xs border ${getStatusBadge(
                            student?.status
                          )}`}
                        >
                          {student?.status || "—"}
                        </span>
                      </td>
                      <td className="p-2 border flex gap-2 items-center">
                        <button
                          className="text-blue-600 border px-4 py-1 rounded text-xs"
                          onClick={() => navigate("/fee-collection")}
                        >
                          Collection
                        </button>
                        <Trash2
                          onClick={() => handleDelete(student._id)}
                          className="w-4 h-4 text-red-600 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No students found for the selected class and section
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}