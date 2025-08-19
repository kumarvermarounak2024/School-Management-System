import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUsers } from "react-icons/fa";
import { FaPrint } from "react-icons/fa6";
import jsPDF from "jspdf";

const StudentIDCardGenerate = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [template, setTemplate] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [classList, setClassList] = useState([]);
  const [sections, setSections] = useState([]);
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");

  // Fetch all initial data
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // Fetch templates
      const templatesRes = await axios.get(`${apiUrl}/idcard/getAll`);
      if (templatesRes.data.success && Array.isArray(templatesRes.data.data)) {
        setTemplateList(templatesRes.data.data);
        if (templatesRes.data.data.length > 0) {
          setTemplate(templatesRes.data.data[0].idCardName);
        }
      }

      // Fetch classes
      const classesRes = await axios.get(`${apiUrl}/class/getAll`);
      setClassList(classesRes.data.classes || []);

      // Fetch sections
      const sectionsRes = await axios.get(`${apiUrl}/section/getAll`);
      setSections(sectionsRes.data.sections || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error loading initial data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleClassChange = (e) => {
    setClassName(e.target.value);
  };

  const handleSectionChange = (e) => {
    setSection(e.target.value);
  };

  // Filter students based on selected class and section
  const filterStudents = async () => {
    if (!className) {
      alert("Please select a class first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
      if (response.data.success) {
        const allStudents = response.data.data || [];

        // Filter students based on selected class and section
        const filtered = allStudents.filter((student) => {
          const classMatch =
            student?.level_class?.Name === className ||
            student?.level_class?.className === className;
          let sectionMatch = true;

          if (section) {
            sectionMatch = student?.section?.Name === section;
          }

          return classMatch && sectionMatch;
        });

        setStudentList(allStudents);
        setFilteredStudents(filtered);
        setSelectedStudents([]); // Reset selected students when filtering
      }
    } catch (error) {
      console.error("Error filtering students:", error);
      alert("Error filtering students");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle student checkbox selection
  const toggleStudentSelection = (regNo) => {
    setSelectedStudents((prev) =>
      prev.includes(regNo)
        ? prev.filter((id) => id !== regNo)
        : [...prev, regNo]
    );
  };

  // Select all filtered students
  const toggleSelectAllStudents = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      const allRegNos = filteredStudents
        .map((student) => student?.registration_no)
        .filter(Boolean);
      setSelectedStudents(allRegNos);
    } else {
      setSelectedStudents([]);
    }
  };

  const loadImageAsBase64 = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const generateIDCardPDF = async (responseData) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [54, 86],
    });

    const { students, template } = responseData.data;

    const bgImg = await loadImageAsBase64(template.backgroundImage);
    const logoImg = await loadImageAsBase64(template.logoImage);

    const getImageType = (base64) => {
      const match = /^data:image\/(png|jpeg|jpg);base64,/.exec(base64);
      return match ? match[1].toUpperCase() : "JPEG";
    };

    const bgType = getImageType(bgImg);
    const logoType = getImageType(logoImg);

    const cardWidth = 86;
    const cardHeight = 54;

    for (let i = 0; i < students.length; i++) {
      const student = students[i];

      // ✅ Add full background image (cover logic)
      const imgProps = doc.getImageProperties(bgImg);
      const imgRatio = imgProps.width / imgProps.height;
      const cardRatio = cardWidth / cardHeight;

      let imgWidth, imgHeight, xOffset, yOffset;

      if (imgRatio > cardRatio) {
        // Fit height, center horizontally
        imgHeight = cardHeight;
        imgWidth = imgHeight * imgRatio;
        xOffset = (cardWidth - imgWidth) / 2;
        yOffset = 0;
      } else {
        // Fit width, center vertically
        imgWidth = cardWidth;
        imgHeight = imgWidth / imgRatio;
        xOffset = 0;
        yOffset = (cardHeight - imgHeight) / 2;
      }

      doc.addImage(bgImg, bgType, 0, 0, 56, 86);

      // Logo
      const logoW = 12;
      const logoH = 12;
      const logoY = 3;
      doc.addImage(logoImg, logoType, 20, logoY, logoW, logoH);

      // Student photo
      const studentPhoto = await loadImageAsBase64(student.photo);
      const photoType = getImageType(studentPhoto);

      const photoW = 20;
      const photoH = 22;
      const photoY = logoY + logoH + 2;
      doc.addImage(studentPhoto, photoType, 16, photoY, photoW, photoH);

      // Student details
      const textStartY = photoY + photoH + 3;
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
   doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(`${student.firstName} ${student.lastName}`, cardWidth / 3, 50, {
        align: "center",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(`Class: ${student.level_class?.Name || "N/A"}`, 16, 55);
      doc.text(`Section: ${student.section?.Name || "N/A"}`, 16, 60);
      doc.text(`Roll No: ${student.roll_no || "N/A"}`, 16, 65);

      if (i < students.length - 1) doc.addPage();
    }

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  };

  const handleGenerateAndPrint = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    if (!template) {
      alert("Please select a template.");
      return;
    }

    setIsLoading(true);
    try {
      const selectedTemplate = templateList.find(
        (t) => t.idCardName === template
      );
      if (!selectedTemplate) throw new Error("Selected template not found");

      const studentsToGenerate = filteredStudents
        .filter((student) => selectedStudents.includes(student.registration_no))
        .map((student) => ({
          studentId: student._id,
          registrationNo: student.registration_no,
          name: `${student.firstName} ${student.lastName}`,
          class: student.level_class?.Name || student.level_class?.className,
          section: student.section?.Name,
          rollNo: student.roll_no,
        }));

      const response = await axios.post(`${apiUrl}/studentIDCard/create`, {
        templateId: selectedTemplate._id,
        templateName: selectedTemplate.idCardName,
        students: studentsToGenerate,
      });
      await generateIDCardPDF(response.data);

      // const blob = new Blob([response.data], { type: 'application/pdf' });
      // const url = URL.createObjectURL(blob);

      // // 👇 Open in new tab and print
      // const newWindow = window.open(url, '_blank');
      // if (newWindow) {
      //   newWindow.onload = () => {
      //     setTimeout(() => {
      //       newWindow.print();
      //     }, 500); // Slight delay ensures PDF loads
      //   };
      // } else {
      //   alert('Please allow popups for this site to enable printing.');
      // }

      // // Optional Cleanup
      // setTimeout(() => {
      //   URL.revokeObjectURL(url);
      // }, 10000);
    } catch (error) {
      console.error("Error printing ID cards:", error);
      alert("Failed to generate or print ID cards");
    } finally {
      setIsLoading(false);
    }
  };

  // Safely render student data
  const renderStudentData = (data) => {
    return data ? String(data) : "-";
  };

  const allSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((student) =>
      selectedStudents.includes(student?.registration_no)
    );

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl shadow-md border ">
      {/* Template Selection */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Class</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={className}
              onChange={handleClassChange}
            >
              <option value="">Select Class</option>
              {classList.map((cls) => (
                <option key={cls._id} value={cls.className || cls.Name}>
                  {cls.className || cls.Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Section</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={section}
              onChange={handleSectionChange}
            >
              <option value="">Select Section</option>
              {sections.map((sec) => (
                <option key={sec._id} value={sec.Name}>
                  {sec.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block font-medium mb-1">Template</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              {templateList.map((temp) => (
                <option key={temp._id} value={temp.idCardName}>
                  {temp.idCardName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={filterStudents}
            className="bg-[#143781] text-white text-lg font-bold px-8 py-2 rounded hover:bg-[#0f2e6c] transition"
          >
            Show
          </button>
        </div>
      </div>

      {/* Student List Table */}
      <div className="border-t-4 border-blue-800 pt-4">
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 mb-2">
          <FaUsers />
          <span className="font-semibold text-lg">Student List</span>
          <span className="ml-auto text-sm text-gray-600">
            Total Students: {filteredStudents.length} | Selected:{" "}
            {selectedStudents.length}
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading students...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-left ">
              <thead className="bg-[#d5ddff] ">
                <tr>
                  <th className="border px-2 py-1">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAllStudents}
                      disabled={filteredStudents.length === 0}
                    />
                  </th>
                  <th className="border px-2 py-1">Sl</th>
                  <th className="border px-2 py-1">Student Name</th>
                  <th className="border px-2 py-1">Class</th>
                  <th className="border px-2 py-1">Section</th>
                  <th className="border px-2 py-1">Register No</th>
                  <th className="border px-2 py-1">Roll No</th>
                  <th className="border px-2 py-1">Mobile No</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={student?._id || index}>
                      <td className="border px-2 py-1 text-center">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(
                            student?.registration_no
                          )}
                          onChange={() =>
                            toggleStudentSelection(student?.registration_no)
                          }
                        />
                      </td>
                      <td className="border px-2 py-1">{index + 1}</td>
                      <td className="border px-2 py-1">
                        {renderStudentData(student?.firstName)}{" "}
                        {renderStudentData(student?.lastName)}
                      </td>
                      <td className="border px-2 py-1">
                        {renderStudentData(student?.level_class?.Name)}
                      </td>
                      <td className="border px-2 py-1">
                        {renderStudentData(student?.section?.Name)}
                      </td>
                      <td className="border px-2 py-1">
                        {renderStudentData(student?.registration_no)}
                      </td>
                      <td className="border px-2 py-1">
                        {renderStudentData(student?.roll_no)}
                      </td>
                      <td className="border px-2 py-1">
                        {renderStudentData(student?.mobile_no)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-gray-500 py-4">
                      No students found. Select class and click "Show" to
                      display students.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Generate Button */}
        {filteredStudents.length > 0 && (
          // <div className="flex justify-center mt-9">
          //   <button
          //     className="bg-[#143781] hover:bg-[#0e2a63] text-white px-4 py-2 rounded flex items-center gap-2"
          //     onClick={handleGenerateIDCards}
          //     disabled={selectedStudents.length === 0 || isLoading}
          //   >
          //     <FaPrint className="text-lg" />
          //     {isLoading ? 'Generating...' : `Generate ID Cards (${selectedStudents.length} selected)`}
          //   </button>
          // </div>
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={handleGenerateAndPrint}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
            >
              <FaPrint />
              Generate & Print
            </button>

            {/* <button
    onClick={handleSaveIDCards}
    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
  >
    Save
  </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentIDCardGenerate;
