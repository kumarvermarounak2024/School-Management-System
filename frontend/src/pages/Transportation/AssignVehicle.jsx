import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AssignVehicle() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const [transportRoutes, setTransportRoutes] = useState([]);
    const [stoppages, setStoppages] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!!id);

    // Initialize react-hook-form
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            transportRoute: '',
            stoppage: '',
            vehicle: '',
        },
    });

    // Fetch transport routes
    const getTansporteRoute = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/transportRoute/getAll`);
            console.log(response?.data?.data, "getTansporteRoute");
            setTransportRoutes(response?.data?.data || []);
        } catch (error) {
            console.error('Error fetching transport routes:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to fetch transport routes'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch stoppages
    const getStopPage = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/stoppage/getAll`);
            console.log(response?.data?.data, "getStopPage");
            setStoppages(response?.data?.data || []);
        } catch (error) {
            console.error('Error fetching stoppages:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to fetch stoppages'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch vehicles
    const getVehicle = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/vehicleMaster/getAll`);
            console.log(response?.data, "getVehicle");
            setVehicles(response?.data || []); // Adjusted to match API response structure
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to fetch vehicles'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch data for editing
    const getEditData = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/vehicleAssign/get/${id}`);
            console.log(response?.data?.data, "assign edit data");
            const data = response?.data?.data;
            if (data) {
                // Set form values with IDs
                setValue('transportRoute', data?.transportRoute?._id || '');
                setValue('stoppage', data?.stoppage?._id || '');
                console.log(data?.vehicles[0]?._id, "vehicleid")
                setValue('vehicle', data?.vehicles[0]?._id || '');
                setIsEditing(true);
            }
        } catch (error) {
            console.error('Error fetching edit data:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to fetch assignment data'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let response;
            if (isEditing && id) {
                // Update existing assignment
                response = await axios.put(`${apiUrl}/vehicleAssign/update/${id}`, data);
                toast.success('Vehicle allocation updated successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                navigate(`/transportation/${"Assign List"}`)

            } else {
                // Create new assignment
                response = await axios.post(`${apiUrl}/vehicleAssign/create`, {
                    transportRoute: data.transportRoute,
                    stoppage: data.stoppage,
                    vehicle: data.vehicle,
                });
                toast.success('Vehicle allocation saved successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
            console.log(response, 'response while submitting data');
            reset();
            // Optional: Navigate to list page
            // setTimeout(() => navigate('/vehicleAssignments'), 2000);
        } catch (error) {
            console.error('Error submitting vehicle allocation:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to save vehicle allocation'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle cancel button
    const handleCancel = () => {
        reset();
        toast.info('Form cancelled', {
            position: 'top-right',
            autoClose: 2000,
        });
        // Optional: Navigate back
        // navigate('/vehicleAssignments');
    };

    useEffect(() => {
        getTansporteRoute();
        getStopPage();
        getVehicle();
        if (id) {
            getEditData(id);
        } else {
            setIsEditing(false);
            reset();
        }
    }, [id]);

    return (
        <div className="w-full p-6">
            <h2 className="text-2xl font-semibold text-center mb-6">
                {isEditing ? 'Edit Vehicle Assignment' : 'Assign Vehicle'}
            </h2>

            {loading && (
                <div className="text-center mb-4">
                    <p>Loading...</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center space-y-6 max-w-2xl mx-auto">
                {/* Transport Route */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="transportRoute" className="w-full sm:w-1/4 font-medium text-base">
                        Transport Route <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <select
                            id="transportRoute"
                            {...register('transportRoute', {
                                required: 'Transport Route is required',
                            })}
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            <option value="">Select Transport Route</option>
                            {transportRoutes.map((route) => (
                                <option key={route._id} value={route._id}>
                                    {route.routeName || `${route.startPlace} to ${route.endPlace}`}
                                </option>
                            ))}
                        </select>
                        {errors.transportRoute && (
                            <p className="text-red-500 text-sm mt-1">{errors.transportRoute.message}</p>
                        )}
                    </div>
                </div>

                {/* Stoppage */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="stoppage" className="w-full sm:w-1/4 font-medium text-base">
                        Stoppage <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <select
                            id="stoppage"
                            {...register('stoppage', {
                                required: 'Stoppage is required',
                            })}
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            <option value="">Select Stoppage</option>
                            {stoppages.map((stop) => (
                                <option key={stop._id} value={stop._id}>
                                    {stop.stoppage}
                                </option>
                            ))}
                        </select>
                        {errors.stoppage && (
                            <p className="text-red-500 text-sm mt-1">{errors.stoppage.message}</p>
                        )}
                    </div>
                </div>

                {/* Vehicle */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="vehicle" className="w-full sm:w-1/4 font-medium text-base">
                        Vehicle <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <select
                            id="vehicle"
                            {...register('vehicle', {
                                required: 'Vehicle is required',
                            })}
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            <option value="">Select Vehicle</option>
                            {vehicles.map((vehicle) => (
                                <option key={vehicle._id} value={vehicle._id}>
                                    {vehicle.vehicleNumber}
                                </option>
                            ))}
                        </select>
                        {errors.vehicle && (
                            <p className="text-red-500 text-sm mt-1">{errors.vehicle.message}</p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center w-full gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#143781] hover:bg-[#0f2a5c]'
                            }`}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className={`px-6 py-2 rounded transition ${loading ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-gray-300 hover:bg-gray-400 text-black'
                            }`}
                    >
                        Cancel
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default AssignVehicle;