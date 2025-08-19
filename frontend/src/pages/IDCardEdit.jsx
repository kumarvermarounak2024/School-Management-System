import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const IDCardEdit = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    idCardName: "",
    applicableUser: "",
    pageLayout: { width: "", height: "" },
    signatureImage: null,
    logoImage: null,
    backgroundImage: null,
  });

  useEffect(() => {
    fetchTemplateById();
  }, [id]);

  const fetchTemplateById = async () => {
    try {
      const res = await axios.get(`${apiUrl}/idcard/get/${id}`);
      if (res.data.success) {
        const data = res.data.data;
        setTemplate(data);
        setFormData({
          idCardName: data.idCardName || "",
          applicableUser: data.applicableUser || "",
          pageLayout: {
            width: data.pageLayout?.width || "",
            height: data.pageLayout?.height || "",
          },
          signatureImage: data.signatureImage || null,
          logoImage: data.logoImage || null,
          backgroundImage: data.backgroundImage || null,
        });
      } else {
        alert("✅ ID card template updated successfully");
      }
    } catch (error) {
      console.error("❌ Failed to fetch template:", error);
      alert("❌ Error fetching ID card template data.");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    const url = typeof image === "string" ? image : image.url;
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `http://localhost:4100/${url}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "width" || name === "height") {
      setFormData((prev) => ({
        ...prev,
        pageLayout: { ...prev.pageLayout, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append("idCardName", formData.idCardName);
      data.append("applicableUser", formData.applicableUser);
      data.append("pageLayoutWidth", formData.pageLayout.width);
      data.append("pageLayoutHeight", formData.pageLayout.height);

      if (formData.signatureImage instanceof File) {
        data.append("signatureImage", formData.signatureImage);
      }
      if (formData.logoImage instanceof File) {
        data.append("logoImage", formData.logoImage);
      }
      if (formData.backgroundImage instanceof File) {
        data.append("backgroundImage", formData.backgroundImage);
      }

      const res = await axios.put(`${apiUrl}/idcard/update/${id}`, data);
     
      if (res?.status === 200) {
        toast.success("✅ Template updated successfully!");
        navigate("/IdCardTemplateList");
      }
    } catch (error) {
      console.error("❌ Error updating template:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading...</div>;
  if (!template)
    return <div className="p-6 text-red-500">No template found.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <h2 className="text-2xl font-bold mb-6 text-[#143781]">
        Edit ID Card Template
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded shadow w-full"
      >
        <div>
          <label className="block font-semibold mb-1" htmlFor="idCardName">
            Template Name
          </label>
          <input
            id="idCardName"
            name="idCardName"
            type="text"
            value={formData.idCardName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="applicableUser">
            Applicable User
          </label>
          <input
            id="applicableUser"
            name="applicableUser"
            type="text"
            value={formData.applicableUser}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="width">
            Page Layout Width
          </label>
          <input
            id="width"
            name="width"
            type="number"
            value={formData.pageLayout.width}
            onChange={handleChange}
            min={0}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="height">
            Page Layout Height
          </label>
          <input
            id="height"
            name="height"
            type="number"
            value={formData.pageLayout.height}
            onChange={handleChange}
            min={0}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Created At</label>
          <input
            type="text"
            value={
              template.createdAt
                ? new Date(template.createdAt).toLocaleDateString()
                : "N/A"
            }
            disabled
            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
          />
        </div>
      </form>

      <div className="mt-8 bg-white p-6 rounded shadow w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {["signatureImage", "logoImage", "backgroundImage"].map((imgKey) => (
          <div key={imgKey}>
            <p className="font-semibold mb-2">
              {imgKey
                .replace("Image", " Image")
                .replace(/^\w/, (c) => c.toUpperCase())}
            </p>
            {getImageUrl(formData[imgKey]) &&
            !(formData[imgKey] instanceof File) ? (
              <img
                src={getImageUrl(formData[imgKey])}
                alt={imgKey}
                className="w-full max-w-xs h-auto mx-auto border rounded shadow mb-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.png";
                }}
              />
            ) : formData[imgKey] instanceof File ? (
              <img
                src={URL.createObjectURL(formData[imgKey])}
                alt={`${imgKey} preview`}
                className="w-full max-w-xs h-auto mx-auto border rounded shadow mb-2"
              />
            ) : (
              <p className="text-gray-500 mb-2">No {imgKey} Uploaded</p>
            )}
            <input
              type="file"
              name={imgKey}
              accept="image/*"
              onChange={handleFileChange}
              className="mx-auto"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2 bg-[#143781] text-white rounded hover:bg-[#0e2a5c] transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Update Template"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/IdCardTemplateList")}
          className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default IDCardEdit;
