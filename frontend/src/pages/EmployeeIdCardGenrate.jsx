import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
const EmployeeIdCardGenerate = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [role, setRole] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [template, setTemplate] = useState("");
  const [templateList, setTemplateList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(`${apiUrl}/idcard/getAll`);
        if (res.data.success && Array.isArray(res.data.data)) {
          setTemplateList(res.data.data);
          if (res.data.data.length > 0) {
            setTemplate(res.data.data[0].idCardName);
          }
        } else {
          alert("❌ Failed to fetch templates.");
        }
      } catch (err) {
        console.error("Error fetching templates:", err);
        alert("❌ Error fetching templates.");
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${apiUrl}/staff/get`);
        if (res.data && Array.isArray(res.data.employees)) {
          // Extract role from each employee and filter unique roles
          const rolesSet = new Set(
            res.data.employees.map((emp) => emp.role).filter((role) => role)
          );

          const uniqueRoles = Array.from(rolesSet);
          setRoleList(uniqueRoles);
        } else {
          alert("❌ No employees data found.");
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        alert("❌ Error fetching roles.");
      }
    };

    fetchTemplates();
    fetchRoles();
  }, []);

  const handleShow = async () => {
    if (!role) {
      alert("⚠️ Please select a role first.");
      return;
    }

    try {
      const res = await axios.get(`${apiUrl}/staff/get`);
      console.log("this is table data ", res.data);

      const employees = res.data.employees || [];

      // Filter employees by selected role
      const filtered = employees.filter((emp) => emp.role === role);

      if (filtered.length > 0) {
        setEmployeeList(filtered);
        setFilteredEmployees(filtered);
        setSelectedEmployees([]);
      } else {
        alert(`❌ No employees found with role: ${role}`);
        setFilteredEmployees([]);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      alert("❌ API error while fetching employees");
    }
  };

  const handleEmployeeSelect = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
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

    const { employees, template } = responseData.data;

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

    for (let i = 0; i < employees.length; i++) {
      const staff = employees[i];

      // ✅ Add full background image (cover logic)
      const imgProps = doc.getImageProperties(bgImg);
      const imgRatio = imgProps.width / imgProps.height;
      const cardRatio = cardWidth / cardHeight;

      let imgWidth, imgHeight;

      if (imgRatio > cardRatio) {
        // Fit height, center horizontally
        imgHeight = cardHeight;
        imgWidth = imgHeight * imgRatio;
      } else {
        // Fit width, center vertically
        imgWidth = cardWidth;
        imgHeight = imgWidth / imgRatio;
      }

      doc.addImage(bgImg, bgType, 0, 0, 56, 86);

      // Logo
      const logoW = 12;
      const logoH = 12;
      const logoY = 3;
      doc.addImage(logoImg, logoType, 20, logoY, logoW, logoH);

      // Staff photo
      const staffPhoto = await loadImageAsBase64(staff.profilePicture);
      const photoType = getImageType(staffPhoto);

      const photoW = 20;
      const photoH = 22;
      const photoY = logoY + logoH + 2;
      doc.addImage(staffPhoto, photoType, 16, photoY, photoW, photoH);

      // staff details
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(`${staff.name}`, cardWidth / 4, 50, {
        align: "center",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);


      doc.text(`ID: ${staff.staffId || "N/A"}`, 14, 55);

      doc.text(`Position: ${staff.role || "N/A"}`, 14, 60);
      if (i < employees.length - 1) doc.addPage();
    }

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  };

  const handleGenerate = async () => {
    if (!role || !template) {
      alert("⚠️ Please select both role and template.");
      return;
    }
    if (selectedEmployees.length === 0) {
      alert("⚠️ Please select at least one employee.");
      return;
    }

    const selectedTemplate = templateList.find(
      (t) => t.idCardName === template
    );
    if (!selectedTemplate) {
      alert("❌ Selected template not found.");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/employeeIDCard/create`, {
        role: role,
        templateId: selectedTemplate._id,
        employeeIds: selectedEmployees,
      });

      if (res.data.success) {
        alert("✅ ID card generated successfully!");
        // setSelectedEmployees([]);
        generateIDCardPDF(res.data);
        console.log(res, "res.data.generatedData ");
      } else {
        alert("❌ Something went wrong while generating ID card.");
      }
    } catch (err) {
      console.error("Error generating ID card:", err);
      alert("❌ Failed to generate ID card.");
    }
  };

  const safeText = (text) => (text ? text : "N/A");

  return (
    <div className=" w-full p-6 bg-gray-50 rounded-xl shadow-md border ">
      {/* Selection Section */}
      <div className="mb-6 p-4 rounded-lg ">
        <h2 className="font-semibold text-lg mb-4 ">Select Options</h2>
        <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1 ">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-400 rounded px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select</option>
              {roleList.map((roleName, idx) => (
                <option key={idx} value={roleName}>
                  {roleName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">
              Template <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-400 rounded px-3 py-2"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              <option value="">Select</option>
              {templateList.map((tpl) => (
                <option key={tpl._id} value={tpl.idCardName}>
                  {tpl.idCardName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={handleShow}
            className="bg-[#143781] text-white text-lg font-bold px-8 py-2 rounded hover:bg-[#0f2e6c] transition"
          >
            Show
          </button>
        </div>
      </div>

      {/* Employee Table Section */}
      <div className="border rounded-lg border-[#143781] p-4">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="text-xl">👥</span> Employee ID Card List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">Sl</th>
                <th className="border px-2 py-1">Select</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Mobile</th>
                <th className="border px-2 py-1">Role</th>
                <th className="border px-2 py-1">Department</th>
                <th className="border px-2 py-1">Designation</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, i) => (
                  <tr key={emp._id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1 text-center">{i + 1}</td>
                    <td className="border px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp._id)}
                        onChange={() => handleEmployeeSelect(emp._id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="border px-2 py-1">{safeText(emp.name)}</td>
                    <td className="border px-2 py-1">{safeText(emp.mobile)}</td>
                    <td className="border px-2 py-1">{safeText(emp.role)}</td>
                    <td className="border px-2 py-1">
                      {safeText(emp.department?.name)}
                    </td>
                    <td className="border px-2 py-1">
                      {safeText(emp.designation?.name)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="border px-2 py-2 text-center text-gray-500"
                  >
                    No employee data found. Select a role and click "Show" to
                    load employees.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Generate Button */}
        {filteredEmployees.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {selectedEmployees.length} employee(s) selected
            </div>
            <button
              onClick={handleGenerate}
              disabled={selectedEmployees.length === 0}
              className={`px-6 py-2 rounded transition ${
                selectedEmployees.length === 0
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#143781] text-white hover:bg-[#0f2e6c]"
              }`}
            >
              Generate ID Cards
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeIdCardGenerate;
