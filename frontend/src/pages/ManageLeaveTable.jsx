import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Pencil, Trash2 } from "lucide-react";

const ManageLeaveTable = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString("en-GB") : "N/A";
  };

  const calculateDays = (from, to) => {
    if (!from || !to) return "-";
    const start = new Date(from);
    const end = new Date(to);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  };

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/leaveadd/getAll`);
        const data = res.data;

        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map((item, idx) => ({
            id: item._id,
            sl: idx + 1,
            role: item.applicant?.role || "N/A",
            applicant: `${item.applicant?.name || "N/A"} - ${
              item.applicant?.staffId || "N/A"
            }`,
            leaveCategory: item.leaveCategory?.categoryName || "Not Assigned",
            start: formatDate(item.leaveDate?.from),
            end: formatDate(item.leaveDate?.to),
            days: calculateDays(item.leaveDate?.from, item.leaveDate?.to),
            applyDate: formatDate(item.createdAt),
            status: item.status || "Pending",
          }));
          setLeaves(formatted);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Error fetching leave data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  if (isLoading)
    return <div className="p-4 text-center">Loading leave applications...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/leaveadd/delete/${id}`);
      setLeaves(leaves.filter((leave) => leave.id !== id)); // update UI
    } catch (error) {
      console.error("Failed to delete leave application:", error);
    }
  };
  const handleEdit = async (leave) => {
    const newStatus = prompt(
      "Update Status (Pending, Accepted, Rejected):",
      leave.status
    );
    if (newStatus && newStatus !== leave.status) {
      try {
        const res = await axios.put(`${apiUrl}/leaveadd/update/${leave.id}`, {
          status: newStatus,
        });
        // Update UI
        setLeaves(
          leaves.map((l) =>
            l.id === leave.id ? { ...l, status: newStatus } : l
          )
        );
      } catch (error) {
        console.error("Failed to update leave status:", error);
      }
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      {leaves.length > 0 ? (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">SL</th>
              <th className="border px-4 py-2">Roll</th>
              <th className="border px-4 py-2">Applicant</th>
              <th className="border px-4 py-2">Leave Category</th>
              <th className="border px-4 py-2">Date Of Start</th>
              <th className="border px-4 py-2">Date Of End</th>
              <th className="border px-4 py-2">Days</th>
              <th className="border px-4 py-2">Apply Date</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id} className="text-center">
                <td className="border px-4 py-2">{leave.sl}</td>
                <td className="border px-4 py-2">{leave.role}</td>
                <td className="border px-4 py-2">{leave.applicant}</td>
                <td className="border px-4 py-2">{leave.leaveCategory}</td>
                <td className="border px-4 py-2">{leave.start}</td>
                <td className="border px-4 py-2">{leave.end}</td>
                <td className="border px-4 py-2">{leave.days}</td>
                <td className="border px-4 py-2">{leave.applyDate}</td>
                <td className="border px-4 py-2">
                  {leave.status === "Accepted" ? (
                    <button className="bg-green-500 text-white px-2 py-1 rounded">
                      Accepted
                    </button>
                  ) : leave.status === "Rejected" ? (
                    <span className="text-red-500 font-semibold">Rejected</span>
                  ) : (
                    <span className="text-yellow-500 font-semibold">
                      Pending
                    </span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(leave)}
                      className="w-8 h-8 bg-[#143781] text-white rounded-full flex items-center justify-center"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(leave.id)}
                      className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No leave applications found.</p>
      )}
    </div>
  );
};

export default ManageLeaveTable;
