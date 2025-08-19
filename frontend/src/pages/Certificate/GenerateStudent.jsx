// // import axios from 'axios';
// // import React, { useEffect, useState } from 'react';
// // import { FiSearch, FiPrinter, FiFileText } from 'react-icons/fi';
// // import { toast } from 'react-toastify';

// // const mockStudents = [
// //     {
// //         id: 1,
// //         name: 'Sarika Tiwari',
// //         category: 'Sc',
// //         registerNo: 'RSM-00057',
// //         rollNo: '106',
// //         mobile: '0987654321',
// //     },
// // ];

// // // const classOptions = ['class 10', 'class 9', 'class 8'];
// // // const sectionOptions = ['Section A', 'Section B', 'Section C'];
// // const templateOptions = ['Marksheet', 'Transfer Certificate', 'Bonafide'];

// // function GenerateStudent() {
// //     const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
// //     const [selectedClass, setSelectedClass] = useState('');
// //     const [selectedSection, setSelectedSection] = useState('');
// //     const [selectedTemplate, setSelectedTemplate] = useState('');
// //     const [search, setSearch] = useState('');
// //     const [students, setStudents] = useState(mockStudents);
// //     const [selectedRows, setSelectedRows] = useState([]);
// //     const [classList, setClassList] = useState([]);
// //     const [sectionList, setSectionList] = useState([]);

// //     useEffect(() => {
// //         fetchClasses();
// //         fetchSections();
// //     }, []);

// //     const fetchClasses = async () => {
// //         try {
// //             const res = await axios.get(`${apiUrl}/class/getAll`);
// //             console.log(res.data.classes, "classes");
// //             setClassList(res.data.classes || []);
// //         } catch (err) {
// //             console.error("Error fetching classes:", err);
// //             toast.error("Failed to fetch classes");
// //         }
// //     };

// //     const fetchSections = async () => {
// //         try {
// //             const res = await axios.get(`${apiUrl}/section/getAll`);
// //             console.log(res.data.sections, "sections");
// //             setSectionList(res.data.sections || []);
// //         } catch (err) {
// //             console.error("Error fetching sections:", err);
// //             toast.error("Failed to fetch sections");
// //         }
// //     };

// //     const handleCheckbox = (id) => {
// //         setSelectedRows((prev) =>
// //             prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
// //         );
// //     };

// //     const filteredStudents = students.filter((s) =>
// //         s.name.toLowerCase().includes(search.toLowerCase()) ||
// //         s.registerNo.toLowerCase().includes(search.toLowerCase()) ||
// //         s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
// //         s.mobile.toLowerCase().includes(search.toLowerCase())
// //     );

// //     return (
// //         <div className="bg-[#f4f6fb] min-h-screen p-6">
// //             {/* Top Filters */}
// //             <div className="flex flex-col md:flex-row gap-4 mb-6">
// //                 <div className="flex-1">
// //                     <label className="block mb-1 text-sm font-semibold">Class <span className="text-red-500">*</span></label>
// //                     <select
// //                         className="w-full border border-[#bfc6e0] rounded p-2 bg-white"
// //                         value={selectedClass}
// //                         onChange={(e) => setSelectedClass(e.target.value)}
// //                     >
// //                         {classList.map((c) => (
// //                             <option key={c} value={c?._id}>{c?.Name}</option>
// //                         ))}
// //                     </select>
// //                 </div>
// //                 <div className="flex-1">
// //                     <label className="block mb-1 text-sm font-semibold">Section <span className="text-red-500">*</span></label>
// //                     <select
// //                         className="w-full border border-[#bfc6e0] rounded p-2 bg-white"
// //                         value={selectedSection}
// //                         onChange={(e) => setSelectedSection(e.target.value)}
// //                     >
// //                         {sectionList.map((s) => (
// //                             <option key={s} value={s?._id}>{s?.Name}</option>
// //                         ))}
// //                     </select>
// //                 </div>
// //                 <div className="flex-1">
// //                     <label className="block mb-1 text-sm font-semibold">Template <span className="text-red-500">*</span></label>
// //                     <select
// //                         className="w-full border border-[#bfc6e0] rounded p-2 bg-white"
// //                         value={selectedTemplate}
// //                         onChange={(e) => setSelectedTemplate(e.target.value)}
// //                     >
// //                         {templateOptions.map((t) => (
// //                             <option key={t} value={t}>{t}</option>
// //                         ))}
// //                     </select>
// //                 </div>
// //             </div>
// //             <div className="flex justify-center mb-6">
// //                 <button className="bg-[#232b7a] text-white px-16 py-2 rounded text-lg font-semibold shadow hover:bg-[#1a1f5c] transition">Show</button>
// //             </div>
// //             <div className="flex gap-2 justify-end items-center">
// //                 <button className="flex items-center gap-2 px-4 py-2 border border-[#232b7a] rounded bg-white text-[#232b7a] font-semibold"><FiPrinter /> Generate</button>
// //             </div>
// //             {/* Students List Tab */}
// //             <div className="p-4 ">
// //                 <div className="flex items-center border-b border-[#bfc6e0] mb-2">
// //                     <button className="flex items-center gap-2 px-2 py-1  text-[#232b7a] font-semibold border-b-2 border-[#232b7a] bg-transparent">
// //                         <span className="text-lg">≡</span> Students List
// //                     </button>
// //                 </div>
// //                 <div className="flex flex-col md:flex-row md:items-center mt-4 justify-between mb-2 gap-2">
// //                     <div className="flex gap-2 items-center">
// //                         <button className="p-2 rounded border border-[#bfc6e0] bg-[#f4f6fb] text-[#232b7a]" title="Export"><FiFileText /></button>
// //                         <button className="p-2 rounded border border-[#bfc6e0] bg-[#f4f6fb] text-[#232b7a]" title="Print"><FiPrinter /></button>
// //                     </div>
// //                     <div className="flex gap-2 items-center">

// //                         <div className="relative">
// //                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiSearch /></span>
// //                             <input
// //                                 className="pl-10 pr-2 py-2 border border-[#bfc6e0] rounded bg-white w-64"
// //                                 placeholder="Search Here..."
// //                                 value={search}
// //                                 onChange={e => setSearch(e.target.value)}
// //                             />
// //                         </div>
// //                     </div>
// //                 </div>
// //                 {/* Table */}
// //                 <div className="overflow-x-auto">
// //                     <table className="min-w-full border text-sm text-left">
// //                         <thead className="bg-[#e9eaf6] text-black">
// //                             <tr>
// //                                 <th className="px-3 py-2 border">SL</th>
// //                                 <th className="px-3 py-2 border"><input type="checkbox" disabled className="accent-[#232b7a]" /></th>
// //                                 <th className="px-3 py-2 border">Student Name</th>
// //                                 <th className="px-3 py-2 border">Category</th>
// //                                 <th className="px-3 py-2 border">Register No.</th>
// //                                 <th className="px-3 py-2 border">Roll No.</th>
// //                                 <th className="px-3 py-2 border">Mobile No.</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {filteredStudents.length > 0 ? filteredStudents.map((s, idx) => (
// //                                 <tr key={s.id} className="bg-white border-t">
// //                                     <td className="px-3 py-2 border">{idx + 1}</td>
// //                                     <td className="px-3 py-2 border text-center">
// //                                         <input
// //                                             type="checkbox"
// //                                             className="accent-[#232b7a]"
// //                                             checked={selectedRows.includes(s.id)}
// //                                             onChange={() => handleCheckbox(s.id)}
// //                                         />
// //                                     </td>
// //                                     <td className="px-3 py-2 border">{s.name}</td>
// //                                     <td className="px-3 py-2 border">{s.category}</td>
// //                                     <td className="px-3 py-2 border">{s.registerNo}</td>
// //                                     <td className="px-3 py-2 border">{s.rollNo}</td>
// //                                     <td className="px-3 py-2 border">{s.mobile}</td>
// //                                 </tr>
// //                             )) : (
// //                                 <tr>
// //                                     <td colSpan={7} className="px-3 py-2 text-center text-gray-500">No students found.</td>
// //                                 </tr>
// //                             )}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //                 {/* Pagination */}
// //                 <div className="flex justify-end mt-4">
// //                     <button className="px-3 py-1 border rounded bg-[#e9eaf6] text-[#232b7a]">&lt;</button>
// //                     <span className="mx-2">1</span>
// //                     <button className="px-3 py-1 border rounded bg-[#e9eaf6] text-[#232b7a]">&gt;</button>
// //                 </div>
// //             </div>
// //             {/* Cancel Button */}
// //             <div className="flex justify-center mt-10">
// //                 <button className="border border-[#232b7a] text-[#232b7a] px-12 py-2 rounded font-semibold text-lg bg-white shadow hover:bg-[#f4f6fb] transition">Cancel</button>
// //             </div>
// //         </div>
// //     );
// // }

// // export default GenerateStudent;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FiPrinter } from 'react-icons/fi';
// import { toast } from 'react-toastify';

// function GenerateStudent() {
//   const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

//   const [classList, setClassList] = useState([]);
//   const [sectionList, setSectionList] = useState([]);
//   const [templateList, setTemplateList] = useState([]);

//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSection, setSelectedSection] = useState('');
//   const [selectedTemplate, setSelectedTemplate] = useState('');

//   const [students, setStudents] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchInitialData = async () => {
//     setIsLoading(true);
//     try {
//       const [classRes, sectionRes, templateRes] = await Promise.all([
//         axios.get(`${apiUrl}/class/getAll`),
//         axios.get(`${apiUrl}/section/getAll`),
//         axios.get(`${apiUrl}/certificates/getall`)
//       ]);

//       setClassList(classRes.data.classes || []);
//       setSectionList(sectionRes.data.sections || []);
//       if (templateRes.data.success) {
//         setTemplateList(templateRes.data.data || []);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load initial data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   const fetchStudents = async () => {
//     if (!selectedClass) {
//       toast.warn("Please select class");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const res = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
//       const allStudents = res.data.data || [];

//       const filtered = allStudents.filter((student) => {
//         const classMatch = student?.level_class?.Name === selectedClass || student?.level_class?.className === selectedClass;
//         let sectionMatch = true;
//         if (selectedSection) {
//           sectionMatch = student?.section?.Name === selectedSection;
//         }
//         return classMatch && sectionMatch;
//       });

//       setStudents(filtered);
//       setSelectedStudents([]);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       toast.error("Error fetching student data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCheckboxToggle = (regNo) => {
//     setSelectedStudents((prev) =>
//       prev.includes(regNo)
//         ? prev.filter((id) => id !== regNo)
//         : [...prev, regNo]
//     );
//   };

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       const allIds = students.map((s) => s.registration_no);
//       setSelectedStudents(allIds);
//     } else {
//       setSelectedStudents([]);
//     }
//   };

//   const handleGenerate = async () => {
//     if (!selectedTemplate || selectedStudents.length === 0) {
//       toast.warn("Please select a template and at least one student");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const template = templateList.find((t) => t.idCardName === selectedTemplate);

//       const studentsPayload = students
//         .filter((s) => selectedStudents.includes(s.registration_no))
//         .map((s) => ({
//           studentId: s._id,
//           registrationNo: s.registration_no,
//           name: `${s.firstName} ${s.lastName}`,
//           class: s.level_class?.Name || s.level_class?.className,
//           section: s.section?.Name,
//           rollNo: s.roll_no,
//         }));

//       await axios.post(`${apiUrl}/studentIDCard/create`, {
//         templateId: template._id,
//         templateName: template.idCardName,
//         students: studentsPayload
//       });

//       toast.success("ID Cards generated successfully");
//     } catch (error) {
//       console.error("Generate error:", error);
//       toast.error("Failed to generate ID cards");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-[#f4f6fb] min-h-screen p-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block mb-1 font-semibold">Class</label>
//           <select
//             className="w-full border p-2 rounded"
//             value={selectedClass}
//             onChange={(e) => setSelectedClass(e.target.value)}
//           >
//             <option value="">Select Class</option>
//             {classList.map((c) => (
//               <option key={c._id} value={c.className || c.Name}>{c.className || c.Name}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block mb-1 font-semibold">Section</label>
//           <select
//             className="w-full border p-2 rounded"
//             value={selectedSection}
//             onChange={(e) => setSelectedSection(e.target.value)}
//           >
//             <option value="">Select Section</option>
//             {sectionList.map((s) => (
//               <option key={s._id} value={s.Name}>{s.Name}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block mb-1 font-semibold">Template</label>
//           <select
//             className="w-full border p-2 rounded"
//             value={selectedTemplate}
//             onChange={(e) => setSelectedTemplate(e.target.value)}
//           >
//             <option value="">Select Template</option>
//             {templateList.map((t) => (
//               <option key={t._id} value={t.idCardName}>{t.idCardName}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="text-center mb-6">
//         <button
//           onClick={fetchStudents}
//           className="bg-[#143781] hover:bg-[#0f2e6c] text-white px-8 py-2 rounded font-bold"
//         >
//           Show
//         </button>
//       </div>

//       {isLoading ? (
//         <div className="text-center py-8 text-lg text-gray-600">Loading...</div>
//       ) : (
//         <>
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-lg font-semibold">Student List</h2>
//             <div className="text-sm text-gray-700">
//               Total: {students.length} | Selected: {selectedStudents.length}
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full border text-sm">
//               <thead className="bg-[#e0e7ff]">
//                 <tr>
//                   <th className="px-3 py-2 border">
//                     <input
//                       type="checkbox"
//                       checked={
//                         students.length > 0 &&
//                         selectedStudents.length === students.length
//                       }
//                       onChange={handleSelectAll}
//                     />
//                   </th>
//                   <th className="px-3 py-2 border">SL</th>
//                   <th className="px-3 py-2 border">Student Name</th>
//                   <th className="px-3 py-2 border">Class</th>
//                   <th className="px-3 py-2 border">Section</th>
//                   <th className="px-3 py-2 border">Register No</th>
//                   <th className="px-3 py-2 border">Roll No</th>
//                   <th className="px-3 py-2 border">Mobile</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {students.length > 0 ? (
//                   students.map((s, idx) => (
//                     <tr key={s._id}>
//                       <td className="px-3 py-2 border text-center">
//                         <input
//                           type="checkbox"
//                           checked={selectedStudents.includes(s.registration_no)}
//                           onChange={() => handleCheckboxToggle(s.registration_no)}
//                         />
//                       </td>
//                       <td className="px-3 py-2 border">{idx + 1}</td>
//                       <td className="px-3 py-2 border">{s.firstName} {s.lastName}</td>
//                       <td className="px-3 py-2 border">{s.level_class?.Name || s.level_class?.className}</td>
//                       <td className="px-3 py-2 border">{s.section?.Name}</td>
//                       <td className="px-3 py-2 border">{s.registration_no}</td>
//                       <td className="px-3 py-2 border">{s.roll_no}</td>
//                       <td className="px-3 py-2 border">{s.mobile_no}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={8} className="text-center py-4 text-gray-500">
//                       No students found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {students.length > 0 && (
//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={handleGenerate}
//                 className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2"
//               >
//                 <FiPrinter />
//                 Generate ID Cards
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default GenerateStudent;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPrinter } from 'react-icons/fi';
import { toast } from 'react-toastify';

function GenerateStudent() {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [templateList, setTemplateList] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [classRes, sectionRes, templateRes] = await Promise.all([
        axios.get(`${apiUrl}/class/getAll`),
        axios.get(`${apiUrl}/section/getAll`),
        axios.get(`${apiUrl}/certificates/getall`)
      ]);
      setClassList(classRes.data.classes || []);
      setSectionList(sectionRes.data.sections || []);
      setTemplateList(templateRes.data || []);
      // if (templateRes.data.success) {
      // }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load initial data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchStudents = async () => {
    if (!selectedClass) {
      toast.warn("Please select class");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
      const allStudents = res.data.data || [];

      const filtered = allStudents.filter((student) => {
        const classMatch = student?.level_class?.Name === selectedClass || student?.level_class?.className === selectedClass;
        let sectionMatch = true;
        if (selectedSection) {
          sectionMatch = student?.section?.Name === selectedSection;
        }
        return classMatch && sectionMatch;
      });

      setStudents(filtered);
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Error fetching student data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxToggle = (regNo) => {
    setSelectedStudents((prev) =>
      prev.includes(regNo)
        ? prev.filter((id) => id !== regNo)
        : [...prev, regNo]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = students.map((s) => s.registration_no);
      setSelectedStudents(allIds);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || selectedStudents.length === 0) {
      toast.warn("Please select a template and at least one student");
      return;
    }

    setIsLoading(true);
    try {
      const template = templateList.find((t) => t.certificateName === selectedTemplate);

      if (!template) {
        toast.error("Selected template not found");
        return;
      }

      const studentsPayload = students
        .filter((s) => selectedStudents.includes(s.registration_no))
        .map((s) => ({
          studentId: s._id,
          registrationNo: s.registration_no,
          name: `${s.firstName} ${s.lastName}`,
          class: s.level_class?.Name || s.level_class?.className,
          section: s.section?.Name,
          rollNo: s.roll_no,
        }));

      await axios.post(`${apiUrl}/studentIDCard/create`, {
        templateId: template._id,
        templateName: template.certificateName,
        students: studentsPayload
      });
      

      toast.success("ID Cards generated successfully");
    } catch (error) {
      console.error("Generate error:", error);
      toast.error("Failed to generate ID cards");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f4f6fb] min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-semibold">Class</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSection('');
              setStudents([]);
              setSelectedStudents([]);
            }}
          >
            <option value="">Select Class</option>
            {classList.map((c) => (
              <option key={c._id} value={c.className || c.Name}>{c.className || c.Name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Section</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              setStudents([]);
              setSelectedStudents([]);
            }}
            disabled={!selectedClass}
          >
            <option value="">Select Section</option>
            {sectionList.map((s) => (
              <option key={s._id} value={s.Name}>{s.Name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Template</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            // disabled={students.length === 0}
          >
            <option value="">Select Template</option>
            {templateList.map((t) => (
              <option key={t._id} value={t.certificateName}>{t.certificateName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-center mb-6">
        <button
          onClick={fetchStudents}
          className="bg-[#143781] hover:bg-[#0f2e6c] text-white px-8 py-2 rounded font-bold"
        >
          Show
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-lg text-gray-600">Loading...</div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Student List</h2>
            <div className="text-sm text-gray-700">
              Total: {students.length} | Selected: {selectedStudents.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-[#e0e7ff]">
                <tr>
                  <th className="px-3 py-2 border">
                    <input
                      type="checkbox"
                      checked={
                        students.length > 0 &&
                        selectedStudents.length === students.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-2 border">SL</th>
                  <th className="px-3 py-2 border">Student Name</th>
                  <th className="px-3 py-2 border">Class</th>
                  <th className="px-3 py-2 border">Section</th>
                  <th className="px-3 py-2 border">Register No</th>
                  <th className="px-3 py-2 border">Roll No</th>
                  <th className="px-3 py-2 border">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((s, idx) => (
                    <tr key={s._id}>
                      <td className="px-3 py-2 border text-center">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(s.registration_no)}
                          onChange={() => handleCheckboxToggle(s.registration_no)}
                        />
                      </td>
                      <td className="px-3 py-2 border">{idx + 1}</td>
                      <td className="px-3 py-2 border">{s.firstName} {s.lastName}</td>
                      <td className="px-3 py-2 border">{s.level_class?.Name || s.level_class?.className}</td>
                      <td className="px-3 py-2 border">{s.section?.Name}</td>
                      <td className="px-3 py-2 border">{s.registration_no}</td>
                      <td className="px-3 py-2 border">{s.roll_no}</td>
                      <td className="px-3 py-2 border">{s.mobile_no}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {students.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleGenerate}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FiPrinter />
                Generate ID Cards
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default GenerateStudent;
