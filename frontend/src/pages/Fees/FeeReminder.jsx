// import { useState } from 'react';
// import { Pencil, Trash2 } from 'lucide-react';

// const FeeReminder = () => {
//   const [activeTab, setActiveTab] = useState('add');
//   const [formData, setFormData] = useState({
//     frequency: '',
//     days: '',
//     message: '',
//     dltTemplateId: '',
//     notifyStudent: false,
//     notifyGuardian: false,
//   });

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const tags = ['{guardian_name}', '{child_name}', '{due_date}', '{due_amount}', '{fees_type}'];

//   return (
//     <div className="p-4 bg-[#f4f6fd] min-h-screen">
//       {/* Tabs */}
//       <div className="flex items-center border-b mb-4">
//         <button
//           onClick={() => setActiveTab('add')}
//           className={`px-4 py-2 font-semibold border-b-2 ${
//             activeTab === 'add'
//               ? 'border-blue-700 text-blue-700'
//               : 'border-transparent text-gray-600'
//           }`}
//         >
//           ✏️ Add Reminder
//         </button>
//         <button
//           onClick={() => setActiveTab('list')}
//           className={`px-4 py-2 font-semibold border-b-2 ${
//             activeTab === 'list'
//               ? 'border-blue-700 text-blue-700'
//               : 'border-transparent text-gray-600'
//           }`}
//         >
//           📋 Reminder List
//         </button>
//       </div>

//       {/* Add Reminder Tab */}
//       {activeTab === 'add' && (
//         <div className="bg-[#f4f6fd] mt-10 space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex items-center gap-4">
//               <label className="w-40 font-semibold">Frequency *</label>
//               <select
//                 name="frequency"
//                 value={formData.frequency}
//                 onChange={handleInputChange}
//                 className="flex-1 border border-gray-400 rounded px-3 py-2"
//               >
//                 <option value="">Select</option>
//                 <option value="Before">Before</option>
//                 <option value="After">After</option>
//               </select>
//             </div>

//             <div className="flex items-center gap-4">
//               <label className="w-40 font-semibold">Days *</label>
//               <select
//                 name="days"
//                 value={formData.days}
//                 onChange={handleInputChange}
//                 className="flex-1 border border-gray-400 rounded px-3 py-2"
//               >
//                 <option value="">Select</option>
//                 {[1, 5, 10, 15].map((day) => (
//                   <option key={day} value={day}>
//                     {day}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="md:col-span-2  mt-5 flex gap-4 items-start">
//               <label className="w-40 font-semibold pt-2">Message</label>
//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleInputChange}
//                 rows={4}
//                 className="flex-1 border border-gray-400 rounded px-3 py-2"
//               />
//             </div>

//             <div className="md:col-span-2 flex items-start mt-5 gap-4">
//               <label className="w-40 font-semibold pt-1">Dynamic Tags</label>
//               <div className="flex flex-wrap gap-2">
//                 {tags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="bg-gray-200 px-3 py-1 rounded-full text-sm"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div className="md:col-span-2 flex items-center mt-5 gap-4">
//               <label className="w-40 font-semibold">DLT Template ID</label>
//               <input
//                 name="dltTemplateId"
//                 value={formData.dltTemplateId}
//                 onChange={handleInputChange}
//                 type="text"
//                 className="flex-1 border border-gray-400 rounded px-3 py-2"
//               />
//             </div>

//             <div className="md:col-span-2 flex items-center gap-10 pl-[10.5rem] mt-2">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name="notifyStudent"
//                   checked={formData.notifyStudent}
//                   onChange={handleInputChange}
//                 />
//                 Student
//               </label>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name="notifyGuardian"
//                   checked={formData.notifyGuardian}
//                   onChange={handleInputChange}
//                 />
//                 Guardian
//               </label>
//             </div>
//           </div>

//           <div className="flex justify-center mt-20 gap-4">
//   <button className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900">
//     Save
//   </button>
//   <button className="border border-blue-800 text-blue-800 px-6 py-2 rounded hover:bg-blue-50">
//     Cancel
//   </button>
// </div>


//         </div>
//       )}

//       {/* Reminder List Tab */}
//       {activeTab === 'list' && (
//         <div className="bg-white p-6 rounded shadow mt-2">
//           <div className="mb-4 flex justify-end">
//             <input
//               type="text"
//               placeholder="🔍 Search Here..."
//               className="w-64 border border-gray-400 rounded px-3 py-2"
//             />
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-left border border-gray-300">
//               <thead>
//                 <tr className="bg-blue-100">
//                   <th className="p-2 border">SL</th>
//                   <th className="p-2 border">Frequency</th>
//                   <th className="p-2 border">Days</th>
//                   <th className="p-2 border">Notify</th>
//                   <th className="p-2 border">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="hover:bg-gray-50">
//                   <td className="p-2 border">1</td>
//                   <td className="p-2 border">Before</td>
//                   <td className="p-2 border">10</td>
//                   <td className="p-2 border">Student, Guardian</td>
//                   <td className="p-2 border flex gap-2">
//                     <button className="text-blue-700 hover:text-blue-900">
//                       <Pencil size={18} />
//                     </button>
//                     <button className="text-red-600 hover:text-red-800">
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           <div className="flex justify-end mt-4">
//             <nav className="flex items-center gap-2">
//               <button className="px-2 py-1 border rounded">‹</button>
//               <span className="px-3 py-1 bg-blue-200 rounded">1</span>
//               <button className="px-2 py-1 border rounded">›</button>
//             </nav>
//           </div>

//           <div className="flex justify-center mt-6">
//             <button className="border border-blue-800 text-blue-800 px-6 py-2 rounded hover:bg-blue-50">
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FeeReminder;


import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

const FeeReminder = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [formData, setFormData] = useState({
    frequency: '',
    days: '',
    message: '',
    dltTemplateId: '',
    notifyStudent: false,
    notifyGuardian: false,
  });
  const [reminders, setReminders] = useState([]);
  const [editId, setEditId] = useState(null);

  const tags = ['{guardian_name}', '{child_name}', '{due_date}', '{due_amount}', '{fees_type}'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const fetchReminders = async () => {
    try {
      const res = await axios.get('http://localhost:4100/api/feeReminder/getAll');
      setReminders(res.data.data || []);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'list') fetchReminders();
  }, [activeTab]);

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      days: [formData.days],
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:4100/api/feeReminder/update/${editId}`, payload);
        setEditId(null);
      } else {
        await axios.post('http://localhost:4100/api/feeReminder/create', payload);
      }

      setFormData({
        frequency: '',
        days: '',
        message: '',
        dltTemplateId: '',
        notifyStudent: false,
        notifyGuardian: false,
      });

      if (activeTab === 'list') fetchReminders();
      alert('Reminder saved successfully');
    } catch (err) {
      console.error('Submit Error:', err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4100/api/feeReminder/getById/${id}`);
      const data = res.data.data;
      setFormData({
        frequency: data.frequency,
        days: data.days[0],
        message: data.message,
        dltTemplateId: data.dltTemplateId,
        notifyStudent: data.notifyStudent,
        notifyGuardian: data.notifyGuardian,
      });
      setEditId(id);
      setActiveTab('add');
    } catch (err) {
      console.error('Edit Fetch Error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4100/api/feeReminder/delete/${id}`);
      fetchReminders();
    } catch (err) {
      console.error('Delete Error:', err);
    }
  };

  return (
    <div className="p-4 bg-[#f4f6fd] min-h-screen">
      {/* Tabs */}
      <div className="flex items-center border-b mb-4">
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 font-semibold border-b-2 ${
            activeTab === 'add'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-gray-600'
          }`}
        >
          ✏️ Add Reminder
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 font-semibold border-b-2 ${
            activeTab === 'list'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-gray-600'
          }`}
        >
          📋 Reminder List
        </button>
      </div>

      {/* Add Reminder Tab */}
      {activeTab === 'add' && (
        <div className="bg-[#f4f6fd] mt-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Frequency */}
            <div className="flex items-center gap-4">
              <label className="w-40 font-semibold">Frequency *</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="flex-1 border border-gray-400 rounded px-3 py-2"
              >
                <option value="">Select</option>
                <option value="Before">Before</option>
                <option value="After">After</option>
              </select>
            </div>

            {/* Days */}
            <div className="flex items-center gap-4">
              <label className="w-40 font-semibold">Days *</label>
              <select
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                className="flex-1 border border-gray-400 rounded px-3 py-2"
              >
                <option value="">Select</option>
                {[1, 5, 10, 15].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="md:col-span-2 mt-5 flex gap-4 items-start">
              <label className="w-40 font-semibold pt-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="flex-1 border border-gray-400 rounded px-3 py-2"
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-2 flex items-start mt-5 gap-4">
              <label className="w-40 font-semibold pt-1">Dynamic Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* DLT Template ID */}
            <div className="md:col-span-2 flex items-center mt-5 gap-4">
              <label className="w-40 font-semibold">DLT Template ID</label>
              <input
                name="dltTemplateId"
                value={formData.dltTemplateId}
                onChange={handleInputChange}
                type="text"
                className="flex-1 border border-gray-400 rounded px-3 py-2"
              />
            </div>

            {/* Notify Checkboxes */}
            <div className="md:col-span-2 flex items-center gap-10 pl-[10.5rem] mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="notifyStudent"
                  checked={formData.notifyStudent}
                  onChange={handleInputChange}
                />
                Student
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="notifyGuardian"
                  checked={formData.notifyGuardian}
                  onChange={handleInputChange}
                />
                Guardian
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-20 gap-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900"
            >
              {editId ? 'Update' : 'Save'}
            </button>
            <button
              onClick={() => {
                setFormData({
                  frequency: '',
                  days: '',
                  message: '',
                  dltTemplateId: '',
                  notifyStudent: false,
                  notifyGuardian: false,
                });
                setEditId(null);
              }}
              className="border border-blue-800 text-blue-800 px-6 py-2 rounded hover:bg-blue-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reminder List Tab */}
      {activeTab === 'list' && (
        <div className="bg-[#f4f6fd] p-6 rounded shadow mt-2">
          <div className="mb-4 flex justify-end">
            <input
              type="text"
              placeholder="🔍 Search Here..."
              className="w-64 border border-gray-400 rounded px-3 py-2"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-300">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2 border">SL</th>
                  <th className="p-2 border">Frequency</th>
                  <th className="p-2 border">Days</th>
                  <th className="p-2 border">Notify</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {reminders.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{item.frequency}</td>
                    <td className="p-2 border">{item.days?.join(', ')}</td>
                    <td className="p-2 border">
                      {item.notifyStudent ? 'Student' : ''}
                      {item.notifyStudent && item.notifyGuardian ? ', ' : ''}
                      {item.notifyGuardian ? 'Guardian' : ''}
                    </td>
                    <td className="p-2 border flex gap-2">
                      <button
                        className="text-blue-700 hover:text-blue-900"
                        onClick={() => handleEdit(item._id)}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setActiveTab('add')}
              className="border border-blue-800 text-blue-800 px-6 py-2 rounded hover:bg-blue-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeReminder;
