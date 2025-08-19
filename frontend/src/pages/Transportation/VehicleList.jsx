import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { FcNext, FcPrevious } from 'react-icons/fc';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VehicleList() {
    const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
    const navigate = useNavigate()
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 5;

    const getdata = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/vehicleMaster/getAll`);
            console.log('API Response:', response?.data);
            const data = response?.data?.data || response?.data || [];
            console.log('Processed Data:', data);
            setVehicles(data);
            setFilteredVehicles(data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error('Failed to fetch vehicles');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setCurrentPage(1);

        const filtered = vehicles.filter(vehicle =>
            (vehicle.vehicleNumber?.toLowerCase() || '').includes(term) ||
            (vehicle.capacity?.toString() || '').includes(term) ||
            (vehicle.insuranceRenewalDate?.toLowerCase() || '').includes(term) ||
            (vehicle.driverName?.toLowerCase() || '').includes(term) ||
            (vehicle.driverPhoneNumber?.toLowerCase() || '').includes(term) ||
            (vehicle.driverLicenseNumber?.toLowerCase() || '').includes(term)
        );
        setFilteredVehicles(filtered);
    };

    const handleEdit = (id) => {
        navigate(`/createVehicle/${id}`)
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete this vehicle?`)) {
            try {
                await axios.delete(`${apiUrl}/vehicleMaster/delete/${id}`);
                // Update both vehicles and filteredVehicles
                const updatedVehicles = vehicles.filter(vehicle => vehicle._id !== id);
                setVehicles(updatedVehicles);
                setFilteredVehicles(updatedVehicles);
                setCurrentPage(1);
                toast.success('Vehicle deleted successfully');
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                toast.error('Failed to delete vehicle');
            }
        }
    };

    useEffect(() => {
        getdata();
    }, []);

    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="mt-6">
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <>
                    <div className="flex justify-end mb-4">
                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full max-w-xs px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm text-left">
                            <thead className="bg-blue-100 text-black">
                                <tr>
                                    <th className="px-4 py-2 border">SL</th>
                                    <th className="px-4 py-2 border">Vehicle Number</th>
                                    <th className="px-4 py-2 border">Capacity</th>
                                    <th className="px-4 py-2 border">Insurance Renewal Date</th>
                                    <th className="px-4 py-2 border">Driver Name</th>
                                    <th className="px-4 py-2 border">Driver Phone No.</th>
                                    <th className="px-4 py-2 border">Driver License No.</th>
                                    <th className="px-4 py-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentVehicles && currentVehicles.length > 0 ? (
                                    currentVehicles.map((vehicle, idx) => (
                                        <tr key={vehicle._id} className="bg-white border-t">
                                            <td className="px-4 py-2 border">{startIndex + idx + 1}</td>
                                            <td className="px-4 py-2 border">
                                                {vehicle.vehicleNumber || <span className="text-gray-400">[No content]</span>}
                                            </td>
                                            <td className="px-4 py-2 border">{vehicle.capacity || '-'}</td>
                                            <td className="px-4 py-2 border">{vehicle.insuranceRenewalDate || '-'}</td>
                                            <td className="px-4 py-2 border">{vehicle.driverName || '-'}</td>
                                            <td className="px-4 py-2 border">{vehicle.driverPhoneNumber || '-'}</td>
                                            <td className="px-4 py-2 border">{vehicle.driverLicenseNumber || '-'}</td>
                                            <td className="px-4 py-2 border">
                                                <div className="flex gap-3">
                                                    <button
                                                        className="w-6 h-6 bg-[#143781] text-white rounded-full flex items-center justify-center cursor-pointer"
                                                        onClick={() => handleEdit(vehicle._id)}
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer"
                                                        onClick={() => handleDelete(vehicle._id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-2 border text-center">No vehicles available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-md disabled:opacity-50 hover:bg-blue-600"
                        >
                            <FcPrevious />
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage)}
                            className="px-4 py-2 rounded-md bg-blue-500 text-white"
                        >
                            {currentPage}
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-md disabled:opacity-50 hover:bg-blue-600"
                        >
                            <FcNext />
                        </button>
                    </div>
                </>
            )}
            <ToastContainer />
        </div>
    );
}

export default VehicleList;