import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function IdCardTemplateList() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

   const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${apiUrl}/idcard/getAll`);
      if (response.data.success) {
        setTemplates(response.data.data);
      } else {
        console.error('Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await axios.delete(`${apiUrl}/idcard/delete/${id}`);
      setTemplates((prev) => prev.filter((template) => template._id !== id));
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  const filteredTemplates = templates.filter((item) => {
    const name = item.idCardName?.toLowerCase() || '';
    const user = item.applicableUser?.toLowerCase() || '';
    const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString().toLowerCase() : '';

    const query = searchTerm.toLowerCase();

    return (
      name.includes(query) ||
      user.includes(query) ||
      date.includes(query)
    );
  });

  // Helper to get correct image URL
  const getImageUrl = (backgroundImage) => {
    if (!backgroundImage) return null;

    // If backgroundImage is already a full URL, return as is
    if (
      backgroundImage.startsWith('http://') ||
      backgroundImage.startsWith('https://')
    ) {
      return backgroundImage;
    }

    // Otherwise prepend localhost with uploads folder or base path
    // Adjust 'uploads' if your images are stored in different folder
    return `http://localhost:4100/${backgroundImage}`;
  };

  return (
    <div className="p-6 bg-gray-50  ">
      <div className="px-4 py-2 flex flex-col md:flex-row md:justify-between md:items-center gap-2 border-b bg-white shadow">
  <div className="flex gap-2">
    <button className="w-8 h-8 bg-gray-200 border rounded" />
    <button className="w-8 h-8 bg-gray-200 border rounded" />
    <button className="w-8 h-8 bg-gray-200 border rounded" />
    <button className="w-8 h-8 bg-gray-200 border rounded" />
  </div>
  <input
    type="text"
    placeholder="Search by name, user, or date..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border border-gray-300 px-3 py-1 rounded-md text-sm w-full md:w-auto"
  />
</div>


      <div className="overflow-x-auto mt-4">
        <table className=" border-t w-full border-gray-300 text-sm bg-white shadow">
          <thead className="bg-[#d5ddff]">
            <tr>
              <th className="border px-3 py-2 text-left">Sl</th>
              <th className="border px-3 py-2 text-left">Background Image</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Applicable User</th>
              <th className="border px-3 py-2 text-left">Page Layout (W x H)</th>
              <th className="border px-3 py-2 text-left">Created At</th>
              <th className="border px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4">Loading...</td>
              </tr>
            ) : filteredTemplates.length > 0 ? (
              filteredTemplates.map((item, index) => {
                const imageUrl = getImageUrl(item.backgroundImage);
                // Debug log for image url
                // console.log('Image URL:', imageUrl);

                return (
                  <tr key={item._id || index} className="bg-white hover:bg-gray-50">
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Background"
                          className="w-12 h-12 object-cover border rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.png'; // add your placeholder image path here
                          }}
                        />
                      ) : (
                        <span className="text-gray-400 italic">No Image</span>
                      )}
                    </td>
                    <td className="border px-3 py-2 capitalize">{item.idCardName || 'N/A'}</td>
                    <td className="border px-3 py-2">{item.applicableUser || 'N/A'}</td>
                    <td className="border px-3 py-2">
                      {item.pageLayout ? `${item.pageLayout.width} x ${item.pageLayout.height}` : 'N/A'}
                    </td>
                    <td className="border px-3 py-2">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="border px-3 py-2">
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => navigate(`/idcardview/${item._id}`)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/idcardedit/${item._id}`)}
                          className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteTemplate(item._id)}
                          className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">No templates found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
