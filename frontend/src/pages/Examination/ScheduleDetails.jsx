import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoReorderThreeSharp } from 'react-icons/io5';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';

function ScheduleDetails() {
        const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

    const { id } = useParams();
    const navigate = useNavigate();
    const [examData, setExamData] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log(id, "kkkkkklklk");

    const getData = async () => {
        console.log("Fetching data...");

        try {
            const response = await axios.get(`${apiUrl}/examination/schedule/getAll`);
            console.log(response?.data?.data, "response");
            setExamData(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    // Filter examData whenever it changes and set the filtered data into the data state
    useEffect(() => {
        if (examData.length > 0 && id) {
            const filteredData = examData.filter((exam) => exam._id === id);
            console.log("Filtered Data:", filteredData);
            setData(filteredData);
        }
    }, [examData, id]);

    // Format date to a readable string (e.g., "June 04, 2025")
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        });
    };

    return (
        <div>
            <div className="border-b border-[#151587] my-10">
                <div className="flex items-center">
                    <IoReorderThreeSharp className="h-6 w-6 text-[#151587] mr-2" />
                    <h1 className="border-b-2 border-[#151587] px-1 text-base font-bold text-[#151587]">
                        Schedule Details
                    </h1>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="w-[95vw] bg-white border border-[#151587] flex flex-col justify-center items-center">
                    <div className="my-10">
                        {/* Dynamically display examName and className */}
                        {data.length > 0 ? (
                            <>
                                <h1 className="font-bold text-xl text-black">
                                    Exam: {data[0]?.examName || "N/A"}
                                </h1>
                                <h3 className="font-medium flex justify-center items-center text-lg text-black">
                                    Class: {data[0]?.className || "N/A"}
                                </h3>
                            </>
                        ) : (
                            <>
                                <h1 className="font-bold text-xl text-black">Exam: Loading...</h1>
                                <h3 className="font-medium text-lg text-black">Class: Loading...</h3>
                            </>
                        )}
                    </div>
                    <div className="p-4 overflow-auto w-[90vw]">
                        {loading ? (
                            <div className="text-center">Loading...</div>
                        ) : (
                            <>
                                <table className="w-full border border-gray-300 overflow-auto">
                                    <thead>
                                        <tr className="bg-blue-100">
                                            <th className="border border-black px-4 py-2 text-left">
                                                Subject <span className="text-red-500">*</span>
                                            </th>
                                            <th className="border border-black px-4 py-2 text-left">
                                                Date <span className="text-red-500">*</span>
                                            </th>
                                            <th className="border border-black px-4 py-2 text-left">
                                                Starting Time <span className="text-red-500">*</span>
                                            </th>
                                            <th className="border border-black px-4 py-2 text-left">
                                                Ending Time <span className="text-red-500">*</span>
                                            </th>
                                            <th className="border border-black px-4 py-2 text-left">
                                                Class Room No. <span className="text-red-500">*</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length === 0 || !data[0]?.schedule || data[0].schedule.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="border border-black px-4 py-2 text-center">
                                                    No data available
                                                </td>
                                            </tr>
                                        ) : (
                                            data[0].schedule.map((scheduleItem, index) => (
                                                <tr key={index} className="hover:bg-gray-100">
                                                    <td className="border border-black px-4 py-2">
                                                        {scheduleItem.subject || "N/A"}
                                                    </td>
                                                    <td className="border border-black px-4 py-2">
                                                        {scheduleItem.date ? formatDate(scheduleItem.date) : "N/A"}
                                                    </td>
                                                    <td className="border border-black px-4 py-2">
                                                        {scheduleItem.startingTime || "N/A"}
                                                    </td>
                                                    <td className="border border-black px-4 py-2">
                                                        {scheduleItem.endingTime || "N/A"}
                                                    </td>
                                                    <td className="border border-black px-4 py-2">
                                                        {scheduleItem.classRoomNo || "N/A"}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                <div className="flex justify-end px-4 sm:px-6 md:px-9 my-8">
                                    <div className="grid grid-cols-3 items-center w-28 sm:w-32 md:w-36 h-10 sm:h-12 border-2 border-[#151587] rounded-md">
                                        <div className="flex justify-center items-center">
                                            <MdNavigateBefore className="text-xl sm:text-2xl" />
                                        </div>
                                        <div className="bg-[#151587] text-white font-semibold flex justify-center items-center h-full w-full text-sm sm:text-base">
                                            1
                                        </div>
                                        <div className="flex justify-center items-center">
                                            <MdNavigateNext className="text-xl sm:text-2xl" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center items-center mt-12 gap-6">
                                    <button
                                        type="button"
                                        className="p-2 px-10 text-[#151587] border border-[#151587] font-semibold rounded-lg"
                                        onClick={() => navigate('/Examination')}
                                    >
                                        Back
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScheduleDetails;