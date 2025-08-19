import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
  const IDCardView = () => {
      const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

   const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplateById();
  }, [id]);

  const fetchTemplateById = async () => {
    try {
      const res = await axios.get(`${apiUrl}/idcard/get/${id}`);
      if (res.data.success) {
        setTemplate(res.data.data);
      } else {
        alert("❌ Failed to load ID card template.");
      }
    } catch (error) {
      console.error("❌ Failed to fetch template:", error);
      alert("❌ Error fetching ID card template data.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to build image URL (same as list)
  const getImageUrl = (image) => {
    if (!image) return null;
    // If image is object with url string
    const url = typeof image === 'string' ? image : image.url;
    if (!url) return null;

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Adjust the base URL/path according to your backend static files location
    return `http://localhost:4100/${url}`;
  };

  if (loading) return <div className="p-6 text-lg">Loading...</div>;
  if (!template) return <div className="p-6 text-red-500">No template found.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <h2 className="text-2xl font-bold mb-6 text-[#143781]">View ID Card Template</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded shadow w-full">
        {/* Template Name */}
        <div>
          <label className="block font-semibold mb-1">Template Name</label>
          <input
            type="text"
            value={template.idCardName || ""}
            disabled
            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Applicable User */}
        <div>
          <label className="block font-semibold mb-1">Applicable User</label>
          <input
            type="text"
            value={template.applicableUser || ""}
            disabled
            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Page Layout */}
        <div>
          <label className="block font-semibold mb-1">Page Layout (W x H)</label>
          <input
            type="text"
            value={
              template.pageLayout
                ? `${template.pageLayout.width} x ${template.pageLayout.height}`
                : "N/A"
            }
            disabled
            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Created At */}
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
      </div>

      {/* Image Section */}
      <div className="mt-8 bg-white p-6 rounded shadow w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {/* Signature Image */}
        {getImageUrl(template.signatureImage) ? (
          <div>
            <p className="font-semibold mb-2">Signature Image</p>
            <img
              src={getImageUrl(template.signatureImage)}
              alt="Signature"
              className="w-full max-w-xs h-auto mx-auto border rounded shadow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.png"; // your placeholder image path
              }}
            />
          </div>
        ) : (
          <div>
            <p className="font-semibold mb-2 text-gray-500">No Signature Image</p>
          </div>
        )}

        {/* Logo Image */}
        {getImageUrl(template.logoImage) ? (
          <div>
            <p className="font-semibold mb-2">Logo Image</p>
            <img
              src={getImageUrl(template.logoImage)}
              alt="Logo"
              className="w-full max-w-xs h-auto mx-auto border rounded shadow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.png";
              }}
            />
          </div>
        ) : (
          <div>
            <p className="font-semibold mb-2 text-gray-500">No Logo Image</p>
          </div>
        )}

        {/* Background Image */}
        {getImageUrl(template.backgroundImage) ? (
          <div>
            <p className="font-semibold mb-2">Background Image</p>
            <img
              src={getImageUrl(template.backgroundImage)}
              alt="Background"
              className="w-full max-w-xs h-auto mx-auto border rounded shadow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.png";
              }}
            />
          </div>
        ) : (
          <div>
            <p className="font-semibold mb-2 text-gray-500">No Background Image</p>
          </div>
        )}
      </div>

      {/* Back to List Button */}
      <div className="mt-6">
        <Link
          to="/IdCardTemplateList"
          className="inline-block bg-[#143781] text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default IDCardView;
