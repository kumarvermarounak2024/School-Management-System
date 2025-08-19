import React, { useState } from 'react';
import axios from 'axios';

const IDCardTemplate = () => {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

   const [formData, setFormData] = useState({
    idCardName: "",                
    applicableUser: "",            
    pageLayoutWidth: "600",        
    pageLayoutHeight: "800",       
    userPhotoStyle: "",      
    userPhotoSize: "100",      
    topSpace: "",                   
    bottomSpace: "",               
    leftSpace: "",                 
    rightSpace: "",                
    Certificate_Content: "",       
    signatureImage: "",          
    logoImage: "",               
    backgroundImage: "",         
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadData = new FormData();
      uploadData.append('idCardName', formData.idCardName);
      uploadData.append('applicableUser', formData.applicableUser);
      uploadData.append('pageLayoutWidth', formData.pageLayoutWidth);
      uploadData.append('pageLayoutHeight', formData.pageLayoutHeight);
      uploadData.append('userPhotoStyle', formData.userPhotoStyle);
      uploadData.append('userPhotoSize', formData.userPhotoSize);
      uploadData.append('topSpace', formData.topSpace);
      uploadData.append('bottomSpace', formData.bottomSpace);
      uploadData.append('leftSpace', formData.leftSpace);
      uploadData.append('rightSpace', formData.rightSpace);
      uploadData.append('Certificate_Content', formData.Certificate_Content);
      if (formData.signatureImage) uploadData.append('signatureImage', formData.signatureImage);
      if (formData.logoImage) uploadData.append('logoImage', formData.logoImage);
      if (formData.backgroundImage) uploadData.append('backgroundImage', formData.backgroundImage);

      const response = await axios.post(`${apiUrl}/idcard/create`, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("ID Card Template saved successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error saving ID Card Template:", error,);
      alert("Failed to save. Please check your input and try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
{/* <nav className="text-lg text-gray-600 mb-4">
  <ol className="list-reset flex items-center space-x-2">
    <li>
      <a href="/" className="text-gray-700 font-semibold hover:underline">Card Management</a>
    </li>
    <li>
      <span className="mx-1">{'>'}</span>
    </li>
    <li className="text-gray-700 font-semibold">ID Card Template</li>
  </ol>
</nav> */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ID Card Name and Applicable User */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Id Card Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="idCardName"
              value={formData.idCardName}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Applicable User<span className="text-red-500">*</span></label>
            <select
              name="applicableUser"
              value={formData.applicableUser}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded px-3 py-2"
            >
              <option value="">Select</option>
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
        </div>

        {/* Page Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Page Layout<span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <input
                type="number"
                name="pageLayoutWidth"
                value={formData.pageLayoutWidth}
                onChange={handleChange}
                placeholder="Width (px)"
                className="w-full border border-gray-400 rounded px-3 py-2"
              />
              <input
                type="number"
                name="pageLayoutHeight"
                value={formData.pageLayoutHeight}
                onChange={handleChange}
                placeholder="Height (px)"
                className="w-full border border-gray-400 rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Photo Style & Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">User Photo Style<span className="text-red-500">*</span></label>
            <select
              name="userPhotoStyle"
              value={formData.userPhotoStyle}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded px-3 py-2"
            ><option value="">Select</option>
              <option value="square">Square</option>
              <option value="circle">Circle</option>
              <option value="rectangle">Rectangle</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Photo Size (e.g., 100x100)<span className="text-red-500">*</span></label>
            <input
              type="number"
              name="userPhotoSize"
              value={formData.userPhotoSize}
              onChange={handleChange}
              placeholder='Please enter photo size eg.100'
              className="w-full border border-gray-400 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Layout Spacing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input
            type="number"
            name="topSpace"
            value={formData.topSpace}
            onChange={handleChange}
            placeholder="Top Space (px)"
            className="w-full border border-gray-400 rounded px-3 py-2"
          />
          <input
            type="number"
            name="bottomSpace"
            value={formData.bottomSpace}
            onChange={handleChange}
            placeholder="Bottom Space (px)"
            className="w-full border border-gray-400 rounded px-3 py-2"
          />
          <input
            type="number"
            name="rightSpace"
            value={formData.rightSpace}
            onChange={handleChange}
            placeholder="Right Space (px)"
            className="w-full border border-gray-400 rounded px-3 py-2"
          />
          <input
            type="number"
            name="leftSpace"
            value={formData.leftSpace}
            onChange={handleChange}
            placeholder="Left Space (px)"
            className="w-full border border-gray-400 rounded px-3 py-2"
          />
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Signature Image</label>
            <input
              type="file"
              name="signatureImage"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Logo Image</label>
            <input
              type="file"
              name="logoImage"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Background Image</label>
            <input
              type="file"
              name="backgroundImage"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
        </div>

        {/* Certificate Content */}
        <div>
          <label className="block font-medium mb-1">Certificate Content<span className="text-red-500">*</span></label>
          <textarea
            name="Certificate_Content"
            value={formData.Certificate_Content}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded px-3 py-2 h-40"
            placeholder="Enter certificate content here..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-center">
          <button type="submit" className="bg-[#143781] text-white px-6 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  );
};

export default IDCardTemplate;
