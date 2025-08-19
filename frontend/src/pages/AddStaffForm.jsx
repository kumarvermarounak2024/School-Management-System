import React, { useState, useEffect } from "react";
import axios from "axios";

const AddStaffForm = () => {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    religion: "",
    bloodGroup: "",
    dob: "",
    mobile: "",
    email: "",
    presentAddress: "",
    permanentAddress: "",
    profilePicture: null,

    role: "",
    joiningDate: "",
    department: "",
    designation: "",
    qualification: "",
    experienceDetails: "",
    totalExperience: "",

    username: "",
    password: "",

    socialLinks: {
      facebook: "",
      twitter: "",
      linkedin: "",
    },

    bankDetails: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      bankBranch: "",
      bankAddress: "",
    },

    documents: [], // [{title, documentType, document_file, remarks, createdAt}]
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    // Fetch departments and designations from backend
    axios.get(`${apiUrl}/department/get`)
      .then((res) => setDepartments(res.data))
      // console.log("department",res.data)
      .catch((err) => console.error("Error fetching departments:", err));

    axios.get(`${apiUrl}/designation/get`)
      .then((res) => setDesignations(res.data))
      .catch((err) => console.error("Error fetching designations:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else if (name.startsWith("bankDetails.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        bankDetails: { ...prev.bankDetails, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: e.target.files[0] || null,
    }));
  };

  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        { title: "", documentType: "", document_file: null, remarks: "", createdAt: new Date().toISOString() },
      ],
    }));
  };

  const updateDocument = (index, key, value) => {
    const updatedDocs = [...formData.documents];
    updatedDocs[index][key] = value;
    setFormData((prev) => ({
      ...prev,
      documents: updatedDocs,
    }));
  };

  const removeDocument = (index) => {
    const updatedDocs = [...formData.documents];
    updatedDocs.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      documents: updatedDocs,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const data = new FormData();

  //     // Append all main form data
  //     Object.entries(formData).forEach(([key, value]) => {
  //       if (key === "documents") {
  //         // Append each document's fields properly with indices
  //         value.forEach((doc, i) => {
  //           data.append(`documents[${i}][title]`, doc.title);
  //           data.append(`documents[${i}][documentType]`, doc.documentType);
  //           if (doc.document_file) {
  //             data.append(`documents[${i}][document_file]`, doc.document_file); // file
  //           }
  //           data.append(`documents[${i}][remarks]`, doc.remarks);
  //           data.append(`documents[${i}][createdAt]`, doc.createdAt);
  //         });
  //       } else if (key === "socialLinks" || key === "bankDetails") {
  //         // Append nested objects as field[key]
  //         Object.entries(value).forEach(([subKey, subVal]) => {
  //           data.append(`${key}[${subKey}]`, subVal);
  //         });
  //       } else if (key === "profilePicture") {
  //         if (value) data.append("profilePicture", value);
  //       } else {
  //         data.append(key, value);
  //       }
  //     });

  //     // POST to backend with multipart/form-data headers set automatically by axios
  //     await axios.post("http://localhost:4100/api/staff/create", data, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     alert("Staff created successfully!");
  //     // Optional: reset form or redirect user here

  //   } catch (error) {
  //     console.error("Error creating staff", error);
  //     alert("Failed to create staff");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();

    // Append all main form data (non-file fields)
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "documents" || key === "profilePicture") {
        // Skip these - handle separately
        return;
      } else if (key === "socialLinks") {
        // Flatten social links - send as individual fields
        data.append("facebook", value.facebook || "");
        data.append("twitter", value.twitter || "");
        data.append("linkedin", value.linkedin || "");
        data.append("instagram", value.instagram || ""); // Add if needed
      } else if (key === "bankDetails") {
        // Flatten bank details - send as individual fields
        data.append("bankName", value.bankName || "");
        data.append("accountHolderName", value.accountHolderName || "");
        data.append("accountNumber", value.accountNumber || "");
        data.append("ifscCode", value.ifscCode || "");
        data.append("bankBranch", value.bankBranch || "");
        data.append("bankAddress", value.bankAddress || "");
      } else {
        data.append(key, value || "");
      }
    });

    // Add profile picture if exists
    if (formData.profilePicture) {
      data.append("profilePicture", formData.profilePicture);
    }

    // Handle documents - CORRECTED VERSION
    const documentMeta = [];
    formData.documents.forEach((doc, index) => {
      // CORRECT: Append each file to 'documents' field (not documents[i][document_file])
      if (doc.document_file) {
        data.append("documents", doc.document_file);
      }
      
      // Collect metadata for each document
      documentMeta.push({
        title: doc.title || "",
        documentType: doc.documentType || "",
        remarks: doc.remarks || "",
        createdAt: doc.createdAt || new Date().toISOString()
      });
    });

    // Add document metadata as JSON string
    if (documentMeta.length > 0) {
      data.append("documentMeta", JSON.stringify(documentMeta));
    }

    // Debug: Log what we're sending
    console.log("Form data being sent:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    // POST to backend
    const response = await axios.post(`${apiUrl}/staff/create`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Staff created successfully!");
    console.log("Success:", response.data);
    
    // Optional: reset form
    // setFormData({ ... initial state ... });

  } catch (error) {
    console.error("Error creating staff:", error);
    const errorMessage = error.response?.data?.message || error.message || "Unknown error";
    alert("Failed to create staff: " + errorMessage);
  }
};

  const renderInput = (label, name, type = "text", value = undefined) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value !== undefined ? value : formData[name] || ""}
        onChange={handleChange}
        className="border border-gray-400 rounded p-2"
      />
    </div>
  );

 const renderSelect = (label, name, options = [], value = undefined) => (
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value !== undefined ? value : formData[name] || ""}
      onChange={handleChange}
      className="border border-gray-400 rounded p-2"
    >
      <option value="">Select {label}</option>
      {Array.isArray(options) &&
        options.map((opt) => (
          <option key={opt._id || opt} value={opt._id || opt}>
            {opt.name || opt}
          </option>
        ))}
    </select>
  </div>
);


  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-50 shadow rounded-lg space-y-8">
      {/* Academic Details */}
      <section>
        <h3 className="text-lg font-bold text-[#143781] mb-4 flex items-center">🏢 Academic Details</h3>
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderSelect("Role", "role", ["Admin", "Teacher", "Accountant", "Librarian", "Receptionist"])}
          {renderInput("Joining Date", "joiningDate", "date")}
          {renderSelect("Department", "department", departments)}
          {renderSelect("Designation", "designation", designations)}
          {renderInput("Qualification", "qualification")}
          {renderInput("Experience Details", "experienceDetails")}
          {renderInput("Total Experience", "totalExperience")}
        </div>
      </section>

      {/* Employee Details */}
      <section>
        <h3 className="text-lg font-semibold text-[#143781] mb-4 flex items-center">👤 Employee Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {renderInput("Full Name", "name")}
          {renderSelect("Gender", "gender", ["Male", "Female", "Other"])}
          {renderInput("Religion", "religion")}
          {renderSelect("Blood Group", "bloodGroup", ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])}
          {renderInput("Date of Birth", "dob", "date")}
          {renderInput("Mobile Number", "mobile")}
          {renderInput("Email", "email")}
          {renderInput("Present Address", "presentAddress")}
          {renderInput("Permanent Address", "permanentAddress")}
        </div>
      </section>

      {/* Login Details */}
      <section>
        <h3 className="text-lg font-semibold text-[#143781] mb-4 flex items-center">🔐 Login Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Profile Picture</label>
            <input type="file" onChange={handleFileChange} className="border border-gray-400 rounded p-2" />
          </div>
          {renderInput("Username", "username")}
          {renderInput("Password", "password", "password")}
        </div>
      </section>

      {/* Social Links */}
      <section>
        <h3 className="text-lg font-semibold text-[#143781] mb-4 flex items-center">🌐 Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInput("Facebook", "socialLinks.facebook", "text", formData.socialLinks.facebook)}
          {renderInput("Twitter", "socialLinks.twitter", "text", formData.socialLinks.twitter)}
          {renderInput("LinkedIn", "socialLinks.linkedin", "text", formData.socialLinks.linkedin)}
        </div>
      </section>

      {/* Bank Details */}
      <section>
        <h3 className="text-lg font-semibold text-[#143781] mb-4 flex items-center">🏦 Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInput("Bank Name", "bankDetails.bankName", "text", formData.bankDetails.bankName)}
          {renderInput("Account Holder Name", "bankDetails.accountHolderName", "text", formData.bankDetails.accountHolderName)}
          {renderInput("Bank Branch", "bankDetails.bankBranch", "text", formData.bankDetails.bankBranch)}
          {renderInput("Bank Address", "bankDetails.bankAddress", "text", formData.bankDetails.bankAddress)}
          {renderInput("IFSC Code", "bankDetails.ifscCode", "text", formData.bankDetails.ifscCode)}
          {renderInput("Account Number", "bankDetails.accountNumber", "text", formData.bankDetails.accountNumber)}
        </div>
      </section>

      {/* Documents */}
      <section className="w-full">
  <h3 className="text-lg font-semibold text-[#143781] mb-4 flex items-center">
    📄 Document Details
  </h3>

  {/* Scrollable table container for small screens */}
  <div className="overflow-x-auto w-full">
    <table className="min-w-full table-auto border-collapse border">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2 min-w-[60px] text-left">SN</th>
          <th className="border p-2 min-w-[150px] text-left">Title</th>
          <th className="border p-2 min-w-[120px] text-left">Type</th>
          <th className="border p-2 min-w-[180px] text-left">File</th>
          <th className="border p-2 min-w-[200px] text-left">Remarks</th>
          <th className="border p-2 min-w-[150px] text-left">Created At</th>
          <th className="border p-2 min-w-[100px] text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {formData.documents.map((doc, index) => (
          <tr key={index}>
            <td className="border p-2 text-center">{index + 1}</td>
            <td className="border p-2">
              <input
                type="text"
                value={doc.title}
                onChange={(e) => updateDocument(index, "title", e.target.value)}
                className="w-full border rounded p-1"
              />
            </td>
            <td className="border p-2">
              <select
                value={doc.documentType}
                onChange={(e) => updateDocument(index, "documentType", e.target.value)}
                className="w-full border rounded p-1"
              >
                <option value="">Select Type</option>
                <option value="Aadhar Card">Aadhar Card</option>
                <option value="Pan Card">Pan Card</option>
                <option value="Passport">Passport</option>
                <option value="Voter Id">Voter Id</option>
                <option value="Driving License">Driving License</option>
                <option value="Other">Other</option>
              </select>
            </td>
            <td className="border p-2">
              <input
                type="file"
                onChange={(e) => updateDocument(index, "document_file", e.target.files[0])}
                className="w-full"
              />
              {doc.document_file && typeof doc.document_file === "string" && (
                <a
                  href={doc.document_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline block mt-1"
                >
                  View
                </a>
              )}
            </td>
            <td className="border p-2">
              <input
                type="text"
                value={doc.remarks}
                onChange={(e) => updateDocument(index, "remarks", e.target.value)}
                className="w-full border rounded p-1"
              />
            </td>
            <td className="border p-2">{new Date(doc.createdAt).toLocaleDateString()}</td>
            <td className="border p-2 text-center">
              <button
                type="button"
                onClick={() => removeDocument(index)}
                className="text-red-600 font-semibold"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <button
    type="button"
    onClick={addDocument}
    className="bg-[#010d27] text-white px-6 py-2 rounded mt-4"
  >
    Add Document
  </button>
</section>


      {/* Submit */}
      <div className="flex justify-center">
        <button
          type="submit"
className="bg-[#143781] text-white px-6 py-2 rounded mt-4"        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddStaffForm;
