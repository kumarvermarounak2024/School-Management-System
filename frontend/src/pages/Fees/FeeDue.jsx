// // // import { useEffect, useState } from "react";
// // // import axios from "axios";
// // // import { Printer, Eye, Pencil, Trash2, FileText, FileSpreadsheet, Download } from "lucide-react";

// // // const apiUrl = "http://localhost:4100/api";

// // // export default function FeeDue() {
// // //   const [selectedClass, setSelectedClass] = useState("");
// // //   const [selectedSection, setSelectedSection] = useState("");
// // //   const [selectedFeeType, setSelectedFeeType] = useState("");
// // //   const [search, setSearch] = useState("");
// // //   const [dueStudents, setDueStudents] = useState([]);
// // //   const [classList, setClassList] = useState([]);
// // //   const [sections, setSections] = useState([]);
// // //   const [feeTypes, setFeeTypes] = useState([]);
// // //   const [filteredStudents, setFilteredStudents] = useState([]);

// // //   useEffect(() => {
// // //     fetchFeeTypes();
// // //     fetchClasses();
// // //     fetchSections();
// // //     fetchDueFees();
// // //   }, []);

// // //   useEffect(() => {
// // //     filterStudents();
// // //   }, [selectedClass, selectedSection, selectedFeeType, dueStudents]);

// // //   const fetchFeeTypes = async () => {
// // //     try {
// // //       const res = await axios.get(`${apiUrl}/feetype/getall`);
// // //       setFeeTypes(res.data);
// // //     } catch (err) {
// // //       console.error("Failed to fetch fee types", err);
// // //     }
// // //   };

// // //   const fetchClasses = async () => {
// // //     try {
// // //       const res = await axios.get(`${apiUrl}/class/getAll`);
// // //       setClassList(res.data.classes || []);
// // //     } catch (err) {
// // //       console.error("Error fetching classes:", err);
// // //     }
// // //   };

// // //   const fetchSections = async () => {
// // //     try {
// // //       const res = await axios.get(`${apiUrl}/section/getAll`);
// // //       setSections(res.data.sections || []);
// // //     } catch (err) {
// // //       console.error("Error fetching sections:", err);
// // //     }
// // //   };

// // //   const fetchDueFees = async () => {
// // //     try {
// // //       const res = await axios.get(`${apiUrl}/dueFee/getAll`);
// // //       setDueStudents(res.data || []);
// // //     } catch (err) {
// // //       console.error("Error fetching due fees:", err);
// // //     }
// // //   };

// // //   const fetchStudents = async () => {
// // //     if (!selectedClass || !selectedSection) return;

// // //     try {
// // //       const res = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
// // //       const allStudents = res.data.data || [];

// // //       const filtered = allStudents.filter(
// // //         (s) =>
// // //           s.level_class?._id === selectedClass &&
// // //           s.section?._id === selectedSection
// // //       );

// // //       setStudents(filtered);
// // //       setSelectedStudents([]);
// // //     } catch (err) {
// // //       console.error("Error fetching students:", err);
// // //     }
// // //   };
// // //   const filterStudents = () => {
// // //     let filtered = dueStudents;

// // //     if (selectedClass) {
// // //       filtered = filtered.filter(
// // //         (student) => student.student?.className === selectedClass
// // //       );
// // //     }

// // //     if (selectedSection) {
// // //       filtered = filtered.filter(
// // //         (student) => student.student?.sectionName === selectedSection
// // //       );
// // //     }

// // //     if (selectedFeeType) {
// // //       filtered = filtered.filter(
// // //         (student) => student.feeType?.feeTypeName === selectedFeeType
// // //       );
// // //     }

// // //     setFilteredStudents(filtered);
// // //   };

// // //   const handleDelete = async (id) => {
// // //     try {
// // //       await axios.delete(`${apiUrl}/dueFee/delete/${id}`);
// // //       fetchDueFees(); // refresh
// // //     } catch (err) {
// // //       console.error("Delete error", err);
// // //     }
// // //   };

// // //   const handleEdit = (student) => {
// // //     console.log("Edit clicked for:", student);
// // //     // Implement edit logic or modal
// // //   };

// // //   const handleView = (student) => {
// // //     console.log("View clicked for:", student);
// // //     // Implement view logic or modal
// // //   };

// // //   const handlePrint = () => {
// // //     window.print();
// // //   };

// // //   const handleExportPDF = () => {
// // //     console.log("Export to PDF");
// // //     // Implement PDF export
// // //   };

// // //   const handleExportExcel = () => {
// // //     console.log("Export to Excel");
// // //     // Implement Excel export
// // //   };

// // //   const handleGenerate = () => {
// // //     console.log("Generate clicked");
// // //     // Implement generate logic
// // //   };

// // //   return (
// // //     <div className="p-6 bg-[#f4f6fd] min-h-screen text-sm">
// // //       {/* Filters */}
// // //       <div className="flex flex-wrap gap-4 mb-4">
// // //         <div className="flex flex-col w-80">
// // //           <label className="font-medium text-gray-700 mb-1">Class *</label>
// // //           <select
// // //             className="border p-2 rounded bg-white"
// // //             value={selectedClass}
// // //             onChange={(e) => setSelectedClass(e.target.value)}
// // //           >
// // //             <option value="">Select Class</option>
// // //             {classList.map((cls) => (
// // //               <option key={cls._id} value={cls.Name}>
// // //                 {cls.Name}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>
// // //          <div className="flex flex-col w-80">
// // //           <label className="font-medium text-gray-700 mb-1">Section *</label>
// // //           <select
// // //             className="border p-2 rounded bg-white"
// // //             value={selectedSection}
// // //             onChange={(e) => setSelectedSection(e.target.value)}
// // //           >
// // //             <option value="">Select Section</option>
// // //             {sections.map((sec) => (
// // //               <option key={sec._id} value={sec.Name}>
// // //                 {sec.Name}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>
// // //         <div className="flex flex-col w-80">
// // //           <label className="font-medium text-gray-700 mb-1">Fees Type *</label>
// // //           <select
// // //             className="border p-2 rounded bg-white"
// // //             value={selectedFeeType}
// // //             onChange={(e) => setSelectedFeeType(e.target.value)}
// // //           >
// // //             <option value="">Select Fee Type</option>
// // //             {feeTypes.map((ft) => (
// // //               <option key={ft._id} value={ft.feeTypeName}>
// // //                 {ft.feeTypeName}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>
// // //       </div>

// // //       <div className="text-center m-5">
// // //         <button
// // //           onClick={fetchDueFees}
// // //           className="h-10 mt-6 bg-blue-900 text-white px-6 rounded"
// // //         >
// // //           Show
// // //         </button>
// // //       </div>

// // //       {/* Invoice List Header */}
// // //       <div className="flex items-center justify-between py-2 border-t border-b mb-3">
// // //         <span className="font-semibold">📋 Due Invoice List</span>
// // //         <div className="flex items-center gap-3">
// // //           <button 
// // //             onClick={handlePrint}
// // //             className="border px-2 py-1 bg-white rounded"
// // //             title="Print"
// // //           >
// // //             <Printer className="w-4 h-4" />
// // //           </button>
// // //           <button 
// // //             onClick={handleExportPDF}
// // //             className="border px-2 py-1 bg-white rounded"
// // //             title="Export PDF"
// // //           >
// // //             <FileText className="w-4 h-4" />
// // //           </button>
// // //           <button 
// // //             onClick={handleExportExcel}
// // //             className="border px-2 py-1 bg-white rounded"
// // //             title="Export Excel"
// // //           >
// // //             <FileSpreadsheet className="w-4 h-4" />
// // //           </button>
// // //           <button 
// // //             onClick={handleGenerate}
// // //             className="bg-white border px-4 py-1 rounded flex items-center gap-1"
// // //           >
// // //             <Download className="w-4 h-4" />
// // //             Generate
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Search Bar */}
// // //       <div className="mb-4">
// // //         <input
// // //           type="text"
// // //           placeholder="🔍 Search Here..."
// // //           className="w-1/3 border p-2 rounded"
// // //           value={search}
// // //           onChange={(e) => setSearch(e.target.value)}
// // //         />
// // //       </div>

// // //       {/* Table */}
// // //       <div className="overflow-x-auto bg-white rounded shadow">
// // //         <table className="min-w-full table-auto text-left border">
// // //           <thead className="bg-indigo-50 text-gray-700">
// // //             <tr>
// // //               <th className="p-2 border">
// // //                 <input type="checkbox" />
// // //               </th>
// // //               <th className="p-2 border">Student Name</th>
// // //               <th className="p-2 border">Class</th>
// // //               <th className="p-2 border">Section</th>
// // //               <th className="p-2 border">Register No.</th>
// // //               <th className="p-2 border">Roll No.</th>
// // //               <th className="p-2 border">Mobile No.</th>
// // //               <th className="p-2 border">Fees Group</th>
// // //               <th className="p-2 border">Due Date</th>
// // //               <th className="p-2 border">Amount</th>
// // //               <th className="p-2 border">Paid</th>
// // //               <th className="p-2 border">Discount</th>
// // //               <th className="p-2 border">Fine</th>
// // //               <th className="p-2 border">Balance</th>
// // //               <th className="p-2 border">Action</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {filteredStudents
// // //               .filter((s) =>
// // //                 s.student?.firstName
// // //                   ?.toLowerCase()
// // //                   .includes(search.toLowerCase())
// // //               )
// // //               .map((s, idx) => (
// // //                 <tr key={idx} className="hover:bg-gray-50">
// // //                   <td className="p-2 border">
// // //                     <input type="checkbox" />
// // //                   </td>
// // //                   <td className="p-2 border">{s.student?.firstName || '-'}</td>
// // //                   <td className="p-2 border">{s.student?.className || '-'}</td>
// // //                   <td className="p-2 border">{s.student?.sectionName || '-'}</td>
// // //                   <td className="p-2 border">{s.student?.registration_no || '-'}</td>
// // //                   <td className="p-2 border">{s.student?.roll_no || '-'}</td>
// // //                   <td className="p-2 border">{s.student?.mobile_no || '-'}</td>
// // //                   <td className="p-2 border">{s.feeGroup?.feeGroupName || '-'}</td>
// // //                   <td className="p-2 border">{s.dueDate?.slice(0, 10) || '-'}</td>
// // //                   <td className="p-2 border">{s.amount || '0'}</td>
// // //                   <td className="p-2 border">{s.paid || '0'}</td>
// // //                   <td className="p-2 border">{s.discount || '0'}</td>
// // //                   <td className="p-2 border">{s.fine || '0'}</td>
// // //                   <td className="p-2 border">{s.balance || '0'}</td>
// // //                   <td className="p-2 border flex gap-2">
// // //                     <button
// // //                       onClick={() => handleView(s)}
// // //                       className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
// // //                       title="View"
// // //                     >
// // //                       <Eye size={16} />
// // //                     </button>
// // //                     <button
// // //                       onClick={() => handleEdit(s)}
// // //                       className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center hover:bg-[#1a4aad]"
// // //                       title="Edit"
// // //                     >
// // //                       <Pencil size={16} />
// // //                     </button>
// // //                     <button
// // //                       onClick={() => handleDelete(s._id)}
// // //                       className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
// // //                       title="Delete"
// // //                     >
// // //                       <Trash2 size={16} />
// // //                     </button>
// // //                   </td>
// // //                 </tr>
// // //               ))}
// // //           </tbody>
// // //         </table>
// // //       </div>

// // //       {/* Pagination Placeholder */}
// // //       <div className="flex justify-end mt-4">
// // //         <div className="flex items-center gap-2">
// // //           <button className="px-2 py-1 border rounded bg-white hover:bg-gray-100">
// // //             &lt;
// // //           </button>
// // //           <span className="px-3">1</span>
// // //           <button className="px-2 py-1 border rounded bg-white hover:bg-gray-100">
// // //             &gt;
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Cancel Button */}
// // //       <div className="flex justify-center mt-6">
// // //         <button className="border border-blue-900 text-blue-900 px-6 py-2 rounded hover:bg-blue-50">
// // //           Cancel
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   Printer, Eye, Pencil, Trash2,
// //   FileText, FileSpreadsheet, Download,
// // } from "lucide-react";

// // const apiUrl = "http://localhost:4100/api";

// // export default function FeeDue() {
// //   const [selectedClass, setSelectedClass] = useState("");
// //   const [selectedSection, setSelectedSection] = useState("");
// //   const [selectedFeeType, setSelectedFeeType] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [allStudents, setAllStudents] = useState([]);
// //   const [classList, setClassList] = useState([]);
// //   const [sections, setSections] = useState([]);
// //   const [feeTypes, setFeeTypes] = useState([]);
// //   const [selectedStudents, setSelectedStudents] = useState([]);

// //   useEffect(() => {
// //     fetchFeeTypes();
// //     fetchClasses();
// //     fetchSections();
// //   }, []);

// //   const fetchFeeTypes = async () => {
// //     try {
// //       const res = await axios.get(`${apiUrl}/feetype/getall`);
// //       setFeeTypes(res.data || []);
// //     } catch (err) {
// //       console.error("Failed to fetch fee types", err);
// //     }
// //   };

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

// //   const fetchDueFees = async () => {
// //     if (!selectedClass || !selectedSection) {
// //       alert("Please select both class and section before showing students.");
// //       return;
// //     }

// //     try {
// //       const res = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
// //       const filtered = (res.data || []).filter((item) =>
// //         item.level_class?.Name === selectedClass &&
// //         item.section?.Name === selectedSection
// //       );

// //       const formatted = filtered.map((item) => ({
// //         _id: item._id,
// //         firstName: item.firstName,
// //         className: item.level_class?.Name || "",
// //         sectionName: item.section?.Name || "",
// //         registration_no: item.registration_no || "",
// //         roll_no: item.roll_no || "",
// //         mobile_no: item.mobile_no || "",
// //         feeGroupName: "Not Assigned",
// //         dueDate: "-",
// //         amount: 0,
// //         paid: 0,
// //         discount: 0,
// //         fine: 0,
// //         balance: 0,
// //       }));
// //       setAllStudents(formatted);
// //     } catch (err) {
// //       console.error("Error fetching due fees:", err);
// //     }
// //   };

// //   const filteredStudents = allStudents.filter((s) => {
// //     return s.firstName.toLowerCase().includes(search.toLowerCase());
// //   });

// //   const handleDelete = async (id) => {
// //     try {
// //       await axios.delete(`${apiUrl}/dueFee/delete/${id}`);
// //       fetchDueFees();
// //     } catch (err) {
// //       console.error("Delete error", err);
// //     }
// //   };

// //   const handleGenerate = async () => {
// //     if (!selectedFeeType || selectedStudents.length === 0) {
// //       alert("Please select Fee Type and at least one student.");
// //       return;
// //     }

// //     try {
// //       const payload = {
// //         studentIds: selectedStudents,
// //         feeTypeName: selectedFeeType,
// //       };

// //       const res = await axios.post(`${apiUrl}/dueFee/generate`, payload);
// //       if (res.data.success) {
// //         alert("✅ Fee generated successfully!");
// //         setSelectedStudents([]);
// //         fetchDueFees();
// //       } else {
// //         alert("❌ Failed to generate fee.");
// //       }
// //     } catch (err) {
// //       console.error("Error generating fee:", err);
// //       alert("❌ Failed to generate fee.");
// //     }
// //   };

// //   return (
// //     <div className="p-6 bg-[#f4f6fd] min-h-screen text-sm">
// //       {/* Filters */}
// //       <div className="flex flex-wrap gap-4 mb-4">
// //         <select className="border p-2 rounded w-80" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
// //           <option value="">Select Class</option>
// //           {classList.map(cls => <option key={cls._id} value={cls.Name}>{cls.Name}</option>)}
// //         </select>

// //         <select className="border p-2 rounded w-80" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
// //           <option value="">Select Section</option>
// //           {sections.map(sec => <option key={sec._id} value={sec.Name}>{sec.Name}</option>)}
// //         </select>

// //         <select className="border p-2 rounded w-80" value={selectedFeeType} onChange={(e) => setSelectedFeeType(e.target.value)}>
// //           <option value="">Select Fee Type</option>
// //           {feeTypes.map(ft => <option key={ft._id} value={ft.feeTypeName}>{ft.feeTypeName}</option>)}
// //         </select>
// //       </div>

// //       <div className="text-center">
// //         <button onClick={fetchDueFees} className="bg-blue-900 text-white px-6 py-2 rounded mt-2">Show</button>
// //       </div>

// //       {/* Action Buttons */}
// //       <div className="flex items-center justify-between py-3 mt-6 border-b">
// //         <span className="font-semibold text-lg">📋 Due Invoice List</span>
// //         <div className="flex gap-2">
// //           <button onClick={() => window.print()} className="btn"><Printer size={16} /></button>
// //           <button className="btn"><FileText size={16} /></button>
// //           <button className="btn"><FileSpreadsheet size={16} /></button>
// //           <button onClick={handleGenerate} className="btn text-green-700"><Download size={16} /> Generate</button>
// //         </div>
// //       </div>

// //       {/* Search */}
// //       <input
// //         type="text"
// //         placeholder="🔍 Search Here..."
// //         value={search}
// //         onChange={(e) => setSearch(e.target.value)}
// //         className="w-1/3 border p-2 my-4 rounded"
// //       />

// //       {/* Table */}
// //       <div className="overflow-x-auto bg-white rounded shadow">
// //         <table className="min-w-full border">
// //           <thead className="bg-indigo-50 text-gray-700">
// //             <tr>
// //               <th className="p-2 border"><input type="checkbox" /></th>
// //               <th className="p-2 border">Name</th>
// //               <th className="p-2 border">Class</th>
// //               <th className="p-2 border">Section</th>
// //               <th className="p-2 border">Reg. No</th>
// //               <th className="p-2 border">Roll No</th>
// //               <th className="p-2 border">Mobile</th>
// //               <th className="p-2 border">Fee Group</th>
// //               <th className="p-2 border">Due Date</th>
// //               <th className="p-2 border">Amount</th>
// //               <th className="p-2 border">Paid</th>
// //               <th className="p-2 border">Discount</th>
// //               <th className="p-2 border">Fine</th>
// //               <th className="p-2 border">Balance</th>
// //               <th className="p-2 border">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredStudents.map((s) => (
// //               <tr key={s._id} className="hover:bg-gray-100">
// //                 <td className="p-2 border">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedStudents.includes(s._id)}
// //                     onChange={() => {
// //                       setSelectedStudents((prev) =>
// //                         prev.includes(s._id)
// //                           ? prev.filter(id => id !== s._id)
// //                           : [...prev, s._id]
// //                       );
// //                     }}
// //                   />
// //                 </td>
// //                 <td className="p-2 border">{s.firstName}</td>
// //                 <td className="p-2 border">{s.className}</td>
// //                 <td className="p-2 border">{s.sectionName}</td>
// //                 <td className="p-2 border">{s.registration_no}</td>
// //                 <td className="p-2 border">{s.roll_no}</td>
// //                 <td className="p-2 border">{s.mobile_no}</td>
// //                 <td className="p-2 border">{s.feeGroupName}</td>
// //                 <td className="p-2 border">{s.dueDate}</td>
// //                 <td className="p-2 border">{s.amount}</td>
// //                 <td className="p-2 border">{s.paid}</td>
// //                 <td className="p-2 border">{s.discount}</td>
// //                 <td className="p-2 border">{s.fine}</td>
// //                 <td className="p-2 border">{s.balance}</td>
// //                 <td className="p-2 border flex gap-2">
// //                   <button onClick={() => alert("View")} className="btn"><Eye size={16} /></button>
// //                   <button onClick={() => alert("Edit")} className="btn text-blue-700"><Pencil size={16} /></button>
// //                   <button onClick={() => handleDelete(s._id)} className="btn text-red-700"><Trash2 size={16} /></button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaSearch, FaPrint, FaFilePdf, FaFileExcel } from 'react-icons/fa';
// import { AiFillEye, AiFillEdit, AiFillDelete } from 'react-icons/ai';

// const apiUrl = "http://localhost:4100/api";

// const FeeDue = () => {
//   const [classList, setClassList] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [feeTypes, setFeeTypes] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSection, setSelectedSection] = useState('');
//   const [selectedFeeType, setSelectedFeeType] = useState('');
//   const [search, setSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedStudents, setSelectedStudents] = useState([]);

//   const itemsPerPage = 5;

//   useEffect(() => {
//     fetchClasses();
//     fetchSections();
//     fetchFeeTypes();
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

//   const fetchFeeTypes = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/feetype/getall`);
//       setFeeTypes(res.data || []);
//     } catch (err) {
//       console.error('Failed to fetch fee types', err);
//     }
//   };

//   const fetchDueStudents = async () => {
//     if (!selectedClass || !selectedSection) return;

//     try {
//       const res = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
//       const allStudents = res.data.data || [];

//       const filtered = allStudents.filter(
//         (s) =>
//           s.level_class?._id === selectedClass &&
//           s.section?._id === selectedSection
//       );

//       // Fetch fee due information for each student
//       const studentsWithDueInfo = await Promise.all(
//         filtered.map(async (student) => {
//           try {
//             const dueRes = await axios.get(`${apiUrl}/dueFee/student/${student._id}`);
//             const dueData = dueRes.data || {};
            
//             return {
//               ...student,
//               feeGroupName: dueData.feeGroup || "Not Assigned",
//               dueDate: dueData.dueDate || "-",
//               amount: dueData.amount || 0,
//               paid: dueData.paid || 0,
//               discount: dueData.discount || 0,
//               fine: dueData.fine || 0,
//               balance: dueData.balance || 0,
//             };
//           } catch (err) {
//             console.error(`Error fetching due info for student ${student._id}:`, err);
//             return {
//               ...student,
//               feeGroupName: "Not Assigned",
//               dueDate: "-",
//               amount: 0,
//               paid: 0,
//               discount: 0,
//               fine: 0,
//               balance: 0,
//             };
//           }
//         })
//       );

//       setStudents(studentsWithDueInfo);
//       setSelectedStudents([]);
//     } catch (err) {
//       console.error("Error fetching students with due fees:", err);
//     }
//   };

//   const handleCheckboxChange = (studentId) => {
//     setSelectedStudents((prev) =>
//       prev.includes(studentId)
//         ? prev.filter((id) => id !== studentId)
//         : [...prev, studentId]
//     );
//   };

//   const handleGenerateDue = async () => {
//     if (!selectedFeeType || selectedStudents.length === 0) {
//       alert("Please select a fee type and at least one student.");
//       return;
//     }

//     try {
//       const res = await axios.post(`${apiUrl}/dueFee/generate`, {
//         studentIds: selectedStudents,
//         feeTypeName: selectedFeeType,
//       });

//       if (res.data.success) {
//         alert("Due fees generated successfully!");
//         fetchDueStudents();
//       } else {
//         alert("Failed to generate due fees: " + (res.data.message || "Unknown error"));
//       }
//     } catch (err) {
//       console.error("Error generating due fees:", err);
//       alert("Failed to generate due fees.");
//     }
//   };

//   const handleDeleteDue = async (studentId) => {
//     if (window.confirm("Are you sure you want to delete this fee due?")) {
//       try {
//         await axios.delete(`${apiUrl}/dueFee/delete/${studentId}`);
//         fetchDueStudents();
//       } catch (err) {
//         console.error("Error deleting fee due:", err);
//         alert("Failed to delete fee due.");
//       }
//     }
//   };

//   const filteredStudents = students.filter((s) =>
//     `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

//   return (
//     <div className="p-4 w-full bg-[#f4f6fd]">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-m font-medium">Class *</label>
//           <select 
//             className="w-full p-2 border rounded" 
//             value={selectedClass} 
//             onChange={(e) => setSelectedClass(e.target.value)}
//           >
//             <option value="">Select Class</option>
//             {classList.map((cls) => (
//               <option key={cls._id} value={cls._id}>{cls.Name}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-m font-medium">Section *</label>
//           <select 
//             className="w-full p-2 border rounded" 
//             value={selectedSection} 
//             onChange={(e) => setSelectedSection(e.target.value)}
//           >
//             <option value="">Select Section</option>
//             {sections.map((sec) => (
//               <option key={sec._id} value={sec._id}>{sec.Name}</option>
//             ))}
//           </select>
//         </div>
//         <div className="flex items-end">
//           <button 
//             onClick={fetchDueStudents} 
//             className="w-full bg-blue-900 text-white px-4 py-2 rounded mt-2"
//           >
//             Show
//           </button>
//         </div>
//       </div>

//       {students.length > 0 ? (
//         <>
//           <div className="mb-4">
//             <label className="block text-m font-medium">Fee Type *</label>
//             <select 
//               className="w-full p-2 border rounded" 
//               value={selectedFeeType} 
//               onChange={(e) => setSelectedFeeType(e.target.value)}
//             >
//               <option value="">Select Fee Type</option>
//               {feeTypes.map((ft) => (
//                 <option key={ft._id} value={ft.feeTypeName}>{ft.feeTypeName}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex justify-between items-center mb-4">
//             <div className="flex gap-2">
//               <button className="flex items-center gap-1 px-2 py-1 border rounded">
//                 <FaFilePdf /> PDF
//               </button>
//               <button className="flex items-center gap-1 px-2 py-1 border rounded">
//                 <FaFileExcel /> Excel
//               </button>
//               <button className="flex items-center gap-1 px-2 py-1 border rounded">
//                 <FaPrint /> Print
//               </button>
//             </div>
//             <div className="flex items-center gap-2">
//               <FaSearch />
//               <input
//                 type="text"
//                 placeholder="Search Here..."
//                 className="border p-2 rounded"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//           </div>

//           <table className="w-full border text-m text-center">
//             <thead className="bg-blue-100">
//               <tr>
//                 <th className="border px-2 py-2">
//                   <input 
//                     type="checkbox" 
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setSelectedStudents(filteredStudents.map(s => s._id));
//                       } else {
//                         setSelectedStudents([]);
//                       }
//                     }} 
//                   />
//                 </th>
//                 <th className="border px-2">SL</th>
//                 <th className="border px-2">Student Name</th>
//                 <th className="border px-2">Register No.</th>
//                 <th className="border px-2">Roll No.</th>
//                 <th className="border px-2">Fee Group</th>
//                 <th className="border px-2">Due Date</th>
//                 <th className="border px-2">Amount</th>
//                 <th className="border px-2">Paid</th>
//                 <th className="border px-2">Discount</th>
//                 <th className="border px-2">Fine</th>
//                 <th className="border px-2">Balance</th>
//                 <th className="border px-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedStudents.map((student, index) => (
//                 <tr key={student._id}>
//                   <td className="border px-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedStudents.includes(student._id)}
//                       onChange={() => handleCheckboxChange(student._id)}
//                     />
//                   </td>
//                   <td className="border px-2">{startIndex + index + 1}</td>
//                   <td className="border px-2">{student.firstName} {student.lastName}</td>
//                   <td className="border px-2">{student.registration_no}</td>
//                   <td className="border px-2">{student.roll_no}</td>
//                   <td className="border px-2">{student.feeGroupName}</td>
//                   <td className="border px-2">{student.dueDate}</td>
//                   <td className="border px-2">{student.amount}</td>
//                   <td className="border px-2">{student.paid}</td>
//                   <td className="border px-2">{student.discount}</td>
//                   <td className="border px-2">{student.fine}</td>
//                   <td className="border px-2">{student.balance}</td>
//                   <td className="border px-2 flex justify-center gap-2">
//                     <button 
//                       className="text-blue-600 hover:text-blue-800"
//                       onClick={() => alert(`View details for ${student.firstName}`)}
//                     >
//                       <AiFillEye size={18} />
//                     </button>
//                     <button 
//                       className="text-green-600 hover:text-green-800"
//                       onClick={() => alert(`Edit due for ${student.firstName}`)}
//                     >
//                       <AiFillEdit size={18} />
//                     </button>
//                     <button 
//                       className="text-red-600 hover:text-red-800"
//                       onClick={() => handleDeleteDue(student._id)}
//                     >
//                       <AiFillDelete size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="flex justify-end items-center gap-2 mt-4">
//             <button 
//               onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} 
//               disabled={currentPage === 1}
//               className="px-2 py-1 border rounded disabled:opacity-50"
//             >
//               {'<'}
//             </button>
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-900 text-white' : 'border'}`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button 
//               onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} 
//               disabled={currentPage === totalPages}
//               className="px-2 py-1 border rounded disabled:opacity-50"
//             >
//               {'>'}
//             </button>
//           </div>

//           <div className="flex justify-center gap-4 mt-6">
//             <button 
//               onClick={handleGenerateDue} 
//               className="bg-blue-900 text-white px-6 py-2 rounded"
//             >
//               Generate Due
//             </button>
//             <button 
//               onClick={() => setSelectedStudents([])} 
//               className="border border-blue-900 text-blue-900 px-6 py-2 rounded"
//             >
//               Clear Selection
//             </button>
//           </div>
//         </>
//       ) : (
//         <div className="text-center mt-10 text-gray-600 font-medium">
//           {selectedClass && selectedSection ? 
//             "No students with due fees found for selected class and section." : 
//             "Please select a class and section to view fee dues."}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FeeDue;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaPrint, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { AiFillEye, AiFillEdit, AiFillDelete } from "react-icons/ai";

const apiUrl = "http://localhost:4100/api";

const FeeDue = () => {
  const [classList, setClassList] = useState([]);
  const [sections, setSections] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [feeGroups, setFeeGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedFeeType, setSelectedFeeType] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchClasses();
    fetchSections();
    fetchFeeTypes();
    fetchFeeGroups();
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

  const fetchFeeTypes = async () => {
    try {
      const res = await axios.get(`${apiUrl}/feetype/getall`);
      setFeeTypes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch fee types", err);
    }
  };

  const fetchFeeGroups = async () => {
    try {
      const res = await axios.get(`${apiUrl}/feeGroup/getAll`);
      setFeeGroups(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch fee groups", err);
    }
  };

  const getFeeGroupNameById = (feeGroupId) => {
    const feeGroup = feeGroups.find((fg) => fg._id === feeGroupId);
    return feeGroup ? feeGroup.name : "Not Assigned";
  };

  const fetchDueStudents = async () => {
    if (!selectedClass || !selectedSection) return;

    try {
      // First, get all students from the selected class and section
      const studentsRes = await axios.get(
        `${apiUrl}/admissions/getAllAdmissions`
      );
      console.log("student", studentsRes);
      const allStudents = studentsRes.data.data || [];

      const filteredStudents = allStudents.filter(
        (s) =>
          s.level_class?._id === selectedClass &&
          s.section?._id === selectedSection
      );

      // Then, get all due fees to match with students
      const dueFeesRes = await axios.get(`${apiUrl}/dueFee/getAll`);
      console.log("due", dueFeesRes);

      const allDueFees = dueFeesRes.data.data || [];

      // Combine student data with their due fee information
      const studentsWithDueInfo = filteredStudents.map((student) => {
        // Find due fees for this student
        const studentDueFees = allDueFees.filter(
          (due) => due.student?._id === student._id
        );

        if (studentDueFees.length > 0) {
          // If student has due fees, use the latest one or combine them
          const latestDue = studentDueFees[0]; // You might want to sort by date
          return {
            ...student,
            feeType: latestDue.feeType || null,
            feeGroup: latestDue.feeGroup || null,
            feeGroupName: getFeeGroupNameById(latestDue.feeGroup),
            dueDate: latestDue.dueDate
              ? new Date(latestDue.dueDate).toLocaleDateString()
              : "-",
            amount: latestDue.amount || 0,
            paid: latestDue.paid || 0,
            discount: latestDue.discount || 0,
            fine: latestDue.fine || 0,
            balance:
              (latestDue.amount || 0) -
              (latestDue.paid || 0) -
              (latestDue.discount || 0) +
              (latestDue.fine || 0),
            hasDueFee: true,
          };
        } else {
          // Student has no due fees assigned - show fee group data anyway
          return {
            ...student,
            feeType: null,
            feeGroup: student.feeGroup || null, // Get from student data if available
            feeGroupName: getFeeGroupNameById(student.feeGroup),
            dueDate: "-",
            amount: 0,
            paid: 0,
            discount: 0,
            fine: 0,
            balance: 0,
            hasDueFee: false,
          };
        }
      });

      setStudents(studentsWithDueInfo);
      setSelectedStudents([]);
    } catch (err) {
      console.error("Error fetching students with due fees:", err);
      alert("Error fetching student data. Please try again.");
    }
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleGenerateDue = async () => {
    if (!selectedFeeType || selectedStudents.length === 0) {
      alert("Please select a fee type and at least one student.");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/dueFee/create`, {
        studentIds: selectedStudents,
        feeType: selectedFeeType, // Using feeType for creation
      });

      if (res.data.success !== false) {
        alert("Due fees generated successfully!");
        fetchDueStudents(); // Refresh the data
      } else {
        alert(
          "Failed to generate due fees: " +
            (res.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error generating due fees:", err);
      alert(
        "Failed to generate due fees. Please check the console for details."
      );
    }
  };

  const handleDeleteDue = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this fee due?")) {
      try {
        await axios.delete(`${apiUrl}/dueFee/delete/${studentId}`);
        alert("Fee due deleted successfully!");
        fetchDueStudents(); // Refresh the data
      } catch (err) {
        console.error("Error deleting fee due:", err);
        alert("Failed to delete fee due.");
      }
    }
  };

  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );
  console.log("filtered", filteredStudents);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  console.log("paginate", paginatedStudents);

  return (
    <div className="p-4 w-full bg-[#f4f6fd]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-m font-medium">Class *</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classList.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.Name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-m font-medium">Section *</label>
          <select
            className="w-full p-2 border rounded"
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
        <div className="flex items-end">
          <button
            onClick={fetchDueStudents}
            className="w-full bg-blue-900 text-white px-4 py-2 rounded mt-2"
          >
            Show
          </button>
        </div>
      </div>

      {students.length > 0 ? (
        <>
          <div className="mb-4">
            <label className="block text-m font-medium">Fee Type *</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedFeeType}
              onChange={(e) => setSelectedFeeType(e.target.value)}
            >
              <option value="">Select Fee Type</option>
              {feeTypes.map((ft) => (
                <option key={ft._id} value={ft._id}>
                  {ft.feeType}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-2 py-1 border rounded">
                <FaFilePdf /> PDF
              </button>
              <button className="flex items-center gap-1 px-2 py-1 border rounded">
                <FaFileExcel /> Excel
              </button>
              <button className="flex items-center gap-1 px-2 py-1 border rounded">
                <FaPrint /> Print
              </button>
            </div>
            <div className="flex items-center gap-2">
              <FaSearch />
              <input
                type="text"
                placeholder="Search Here..."
                className="border p-2 rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full border text-m text-center">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-2 py-2">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents(filteredStudents.map((s) => s._id));
                      } else {
                        setSelectedStudents([]);
                      }
                    }}
                  />
                </th>
                <th className="border px-2">Student Name</th>
                <th className="border px-2">Register No.</th>
                <th className="border px-2">Roll No.</th>
                <th className="border px-2">Mobile No.</th>
                <th className="border px-2">Fee Group</th>
                <th className="border px-2">Due Date</th>
                <th className="border px-2">Amount</th>
                <th className="border px-2">Paid</th>
                <th className="border px-2">Discount</th>
                <th className="border px-2">Balance</th>
                <th className="border px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, index) => (
                <tr
                  key={student._id}
                  className={!student.hasDueFee ? "bg-gray-50" : ""}
                >
                  <td className="border px-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleCheckboxChange(student._id)}
                    />
                  </td>
                  <td className="border px-2">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="border px-2">{student.registration_no}</td>
                  <td className="border px-2">{student.roll_no}</td>
                  <td className="border px-2">{student.mobile_no || "-"}</td>
                  <td className="border px-2">
                    <span
                      className={
                        !student.hasDueFee ? "text-gray-500 italic" : ""
                      }
                    >
                      {student.feeGroupName || "-"}
                    </span>
                  </td>
                  <td className="border px-2">{student.dueDate}</td>
                  <td className="border px-2">₹{student.amount}</td>
                  <td className="border px-2">₹{student.paid}</td>
                  <td className="border px-2">₹{student.discount}</td>
                  <td className="border px-2">
                    <span
                      className={
                        student.balance > 0
                          ? "text-red-600 font-semibold"
                          : "text-green-600"
                      }
                    >
                      ₹{student.balance}
                    </span>
                  </td>
                  <td className="border px-2">
                    <div className="flex justify-center gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() =>
                          alert(
                            `View details for ${student.firstName} ${student.lastName}`
                          )
                        }
                        title="View Details"
                      >
                        <AiFillEye size={18} />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() =>
                          alert(
                            `Edit due for ${student.firstName} ${student.lastName}`
                          )
                        }
                        title="Edit Due"
                      >
                        <AiFillEdit size={18} />
                      </button>
                      {student.hasDueFee && (
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteDue(student._id)}
                          title="Delete Due"
                        >
                          <AiFillDelete size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {"<"}
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-blue-900 text-white" : "border"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              {">"}
            </button>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleGenerateDue}
              className="bg-blue-900 text-white px-6 py-2 rounded"
              disabled={selectedStudents.length === 0}
            >
              Generate Due
            </button>
            <button
              onClick={() => setSelectedStudents([])}
              className="border border-blue-900 text-blue-900 px-6 py-2 rounded"
            >
              Clear Selection
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-10 text-gray-600 font-medium">
          {selectedClass && selectedSection
            ? "No students found for selected class and section."
            : "Please select a class and section to view students."}
        </div>
      )}
    </div>
  );
};

export default FeeDue;