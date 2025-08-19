import React, { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
// import ReactQuill from 'react-quill';


// Reusable Table component
function CertificateTable({ certificates, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  const filtered = certificates.filter(c =>
    c.certificateName.toLowerCase().includes(search.toLowerCase()) ||
    c.applicableUser.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#f4f6fb] p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <button className="text-xl">📄</button>
          <button className="text-xl">🖨️</button>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-1 w-72"
          placeholder="Search..."
        />
      </div>
      <table className="w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-blue-100">
            <th>SL</th><th>Name</th><th>User</th><th>Layout</th><th>BG</th><th>Created At</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c, i) => (
            <tr key={c._id}>
              <td className="border px-2 py-1">{i + 1}</td>
              <td className="border px-2 py-1">{c.certificateName}</td>
              <td className="border px-2 py-1">{c.applicableUser}</td>
              <td className="border px-2 py-1">{c.pageLayout}</td>
              <td className="border px-2 py-1 text-center">
                {c.background?.url ? (
                  <img src={c.background.url} className="h-8 inline-block" alt="bg" />
                ) : "—"}
              </td>
              <td className="border px-2 py-1">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>
              <td className="border px-2 py-1 text-center space-x-2">
                <button onClick={() => onEdit(c)} className="cursor-pointer">✏️</button>
                <button onClick={() => onDelete(c._id)} className="cursor-pointer text-red-600">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main component with form + table
function CertificateTemplate() {
  const [isFormView, setIsFormView] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [editingCert, setEditingCert] = useState(null);

  const initialForm = {
    certificateName: "", applicableUser: "", pageLayout: "", photoStyle: "Square",
    photoSize: "", top: "", bottom: "", left: "", right: "", content: "", createdAt: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [signatureFile, setSignatureFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);

  // Fetch list
  async function loadList() {
    try {
      const { data } = await axios.get("http://localhost:4100/api/certificates/getall");
      setCertificates(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load certificates");
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  const handleInput = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = setter => e => {
    setter(e.target.files[0] || null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
    if (signatureFile) payload.append("signature", signatureFile);
    if (logoFile) payload.append("logo", logoFile);
    if (backgroundFile) payload.append("background", backgroundFile);

    try {
      const url = editingCert
        ? `http://localhost:4100/api/certificates/update${editingCert._id}`
        : `http://localhost:4100/api/certificates/create`;

      await axios.post(url, payload);
      alert(`Certificate ${editingCert ? "updated" : "created"} successfully`);
      resetForm();
      loadList();
      setIsFormView(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save");
    }
  };

  const handleEdit = cert => {
    setEditingCert(cert);
    setFormData({
      certificateName: cert.certificateName,
      applicableUser: cert.applicableUser,
      pageLayout: cert.pageLayout,
      photoStyle: cert.photoStyle,
      photoSize: cert.photoSize,
      top: cert.layoutSpacing.top,
      bottom: cert.layoutSpacing.bottom,
      left: cert.layoutSpacing.left,
      right: cert.layoutSpacing.right,
      content: cert.content,
      createdAt: cert.createdAt.split("T")[0], // yyyy-mm-dd
    });
    setSignatureFile(null);
    setLogoFile(null);
    setBackgroundFile(null);
    setIsFormView(true);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this certificate?")) return;
    try {
      await axios.delete(`http://localhost:4100/api/certificates/delete${id}`);
      alert("Deleted");
      loadList();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  const resetForm = () => {
    setEditingCert(null);
    setFormData(initialForm);
    setSignatureFile(null);
    setLogoFile(null);
    setBackgroundFile(null);
  };

    return (
        <div className="bg-[#f4f6fb] min-h-screen p-0">
            {/* Tab Bar */}
            <div className="flex items-center gap-2 px-6   border-b border-[#143781]">
                <button
                    onClick={() => setIsFormView(true)}
                    className={`flex items-center gap-2 px-2 py-1 font-semibold text-[#143781] ${isFormView ? 'border-b-2 border-[#143781]' : ''}`}
                >
                    <span className="text-lg">📄</span> Add Certificate
                </button>

                <button
                    onClick={() => setIsFormView(false)}
                    className={`flex items-center gap-2 px-2 py-1 font-semibold text-[#143781] ${!isFormView ? 'border-b-2 border-[#143781]' : ''}`}
                >
                    <span className="text-lg">☰</span> Certificate List
                </button>
            </div>
            {isFormView ? (
                <form className="w-full bg-[#f4f6fb] rounded-xl shadow-md p-6 max-w-full mx-auto mt-6 border border-[#e9eaf6]">
                    {/* Certificate Name */}
                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                        <label className="w-full sm:w-1/4 font-bold text-base">Certificate Name <span className="text-red-500">*</span></label>
                        <div className="w-full sm:w-3/4">
                            <input className="w-full border border-[#143781] rounded focus:ring-2 focus:ring-[#143781] p-2 bg-white" placeholder="" />
                        </div>
                    </div>
                    {/* Applicable User */}
                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                        <label className="w-full sm:w-1/4 font-bold text-base">Applicable User <span className="text-red-500">*</span></label>
                        <div className="w-full sm:w-3/4">
                            <select className="w-full border border-[#143781] rounded focus:ring-2 focus:ring-[#143781] p-2 bg-white">
                                <option value="">Select</option>
                                <option value="Student">Student</option>
                                <option value="Employee">Employee</option>
                            </select>
                        </div>
                    </div>
                    {/* Page Layout */}
                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                        <label className="w-full sm:w-1/4 font-bold text-base">Page Layout <span className="text-red-500">*</span></label>
                        <div className="w-full sm:w-3/4">
                            <select className="w-full border border-[#143781] rounded focus:ring-2 focus:ring-[#143781] p-2 bg-white">
                                <option value="">Select</option>
                                <option value="A4">A4 (Portrait)</option>
                                <option value="A4L">A4 (Landscape)</option>
                            </select>
                        </div>
                    </div>
                    {/* User Photo Style & Photo Size */}
                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                        <label className="w-full sm:w-1/4 font-bold text-base">User Photo Style <span className="text-red-500">*</span></label>
                        <div className="w-full sm:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select className="w-full border border-[#143781] rounded focus:ring-2 focus:ring-[#143781] p-2 bg-white">
                                <option value="Square">Square</option>
                                <option value="Circle">Circle</option>
                            </select>
                            <input className="w-full border border-[#143781] rounded focus:ring-2 focus:ring-[#143781] p-2 bg-white" placeholder="Photo Size (px)" />
                        </div>
                    </div>
                    {/* Layout Spacing */}
                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                        <label className="w-full sm:w-1/4 font-bold text-base">Layout Spacing</label>
                        <div className="w-full sm:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input className="w-full border border-[#143781] rounded focus:ring-2 focus:ring-[#143781] p-2 bg-white" placeholder="Top Space (px)" />
                            <input className="w-full border border-[#143781] rounded focus:ring-2 focus:ring-[#143781] p-2 bg-white" placeholder="Bottom Space (px)" />
                            <input className="w-full border border-[#143781] rounded focus:ring-2 focus:ring-[#143781] p-2 bg-white" placeholder="Right Space (px)" />
                            <input className="w-full border border-[#143781] rounded focus:ring-2 focus:ring-[#143781] p-2 bg-white" placeholder="Left Space (px)" />
                        </div>
                    </div>
                    {/* Signature Image */}
                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                        <label className="w-full sm:w-1/4 font-bold text-base">Signature Image</label>
                        <div className="w-full sm:w-3/4">
                            <label htmlFor="signature-upload" className="w-full h-20 border border-[#143781] rounded flex flex-col items-center justify-center bg-white text-gray-400 cursor-pointer">
                                <FiUploadCloud className="text-2xl mb-1" />
                                <span>{signatureFile ? signatureFile.name : 'Drag and drop a file here or click'}</span>
                                <input
                                    id="signature-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange(setSignatureFile)}
                                />
                            </label>
                        </div>
                    </div>
                    {/* Logo Image */}
                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                        <label className="w-full sm:w-1/4 font-bold text-base">Logo Image</label>
                        <div className="w-full sm:w-3/4">
                            <label htmlFor="logo-upload" className="w-full h-20 border border-[#143781] rounded flex flex-col items-center justify-center bg-white text-gray-400 cursor-pointer">
                                <FiUploadCloud className="text-2xl mb-1" />
                                <span>{logoFile ? logoFile.name : 'Drag and drop a file here or click'}</span>
                                <input
                                    id="logo-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange(setLogoFile)}
                                />
                            </label>
                        </div>
                    </div>
                    {/* Background Image */}
                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                        <label className="w-full sm:w-1/4 font-bold text-base">Background Image</label>
                        <div className="w-full sm:w-3/4">
                            <label htmlFor="background-upload" className="w-full h-20 border border-[#143781] rounded flex flex-col items-center justify-center bg-white text-gray-400 cursor-pointer">
                                <FiUploadCloud className="text-2xl mb-1" />
                                <span>{backgroundFile ? backgroundFile.name : 'Drag and drop a file here or click'}</span>
                                <input
                                    id="background-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange(setBackgroundFile)}
                                />
                            </label>
                        </div>
                    </div>
                    {/* Certificate Content */}
                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                        <label className="w-full sm:w-1/4 font-bold text-base">Certificate Content <span className="text-red-500">*</span></label>
                        {/* <div className="w-full sm:w-3/4">
                            <ReactQuill theme="snow" value={value} onChange={setValue} />;
                        </div> */}

                    </div>
                    {/* Created At */}
                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
                        <label className="w-full sm:w-1/4 font-bold text-base">Created At <span className="text-red-500">*</span></label>
                        <div className="w-full sm:w-3/4">
                            <input className="w-full border border-[#143781] rounded focus:ring-2 focus:ring-[#143781] p-2 bg-white" placeholder="dd/mm/yyyy" />
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button type="submit" className="bg-[#143781] text-white px-12 py-2 rounded font-semibold text-lg shadow hover:bg-[#0f265c] transition">Save</button>
                        <button type="button" className="border border-[#143781] text-[#143781] px-12 py-2 rounded font-semibold text-lg bg-white shadow hover:bg-[#f4f6fb] transition">Cancel</button>
                    </div>
                </form >
            ) : (
                <CertificateTable />
            )
            }
        </div >
    );
}

export default CertificateTemplate;
