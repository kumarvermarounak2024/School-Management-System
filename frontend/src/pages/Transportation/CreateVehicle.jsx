import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateVehicle() {
    const { id } = useParams();
    console.log(id, "upcoming id in create vehicle");
    const navigate = useNavigate();
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            vehicleNumber: '',
            capacity: '',
            insuranceRenewalDate: '',
            driverName: '',
            driverPhoneNumber: '',
            driverLicenseNumber: '',
        },
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        console.log('Form Data:', data);
        setLoading(true);

        try {
            let response;
            if (isEditMode && id) {
                // Update existing vehicle
                response = await axios.put(`${apiUrl}/vehicleMaster/updateVehicleById/${id}`, data);
                reset()
                navigate(`/transportation/${"Vehicle List"}`)

            } else {
                // Create new vehicle
                response = await axios.post(`${apiUrl}/vehicleMaster/create`, data);
                reset()
            }

            console.log(response, "response");
            toast.success(isEditMode ? 'Vehicle updated successfully!' : 'Vehicle created successfully!');

            if (!isEditMode) {
                reset();
            }
        } catch (error) {
            console.error('Error saving vehicle:', error);
            toast.error('Failed to save vehicle. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        reset();
        setIsEditMode(false);
        toast.info('Form reset');
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const getData = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/vehicleMaster/get/${id}`);
            console.log(response?.data, "get all vehicle data");

            const vehicleData = response?.data;
            if (vehicleData) {
                // Set form values with fetched data
                setValue('vehicleNumber', vehicleData.vehicleNumber || '');
                setValue('capacity', vehicleData.capacity || '');
                setValue('insuranceRenewalDate', formatDateForInput(vehicleData.insuranceRenewalDate));
                setValue('driverName', vehicleData.driverName || '');
                setValue('driverPhoneNumber', vehicleData.driverPhoneNumber || '');
                setValue('driverLicenseNumber', vehicleData.driverLicenseNumber || '');

                setIsEditMode(true);
                toast.info('Vehicle data loaded for editing');
            }
        } catch (error) {
            console.log(error, "error while fetching the data");
            toast.error('Failed to load vehicle data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getData(id);
        } else {
            setIsEditMode(false);
        }
    }, [id]);

    return (
        <div className="w-full p-4">
            <h2 className="text-2xl font-semibold text-center mb-6">
                {isEditMode ? 'Edit Vehicle' : 'Create Vehicle'}
            </h2>

            {loading && (
                <div className="text-center mb-4">
                    <p className="text-blue-600">Loading...</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center space-y-6">
                {/* Vehicle Number */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="vehicleNumber" className="w-full sm:w-1/4 font-medium text-base">
                        Vehicle Number <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="vehicleNumber"
                            {...register('vehicleNumber', { required: 'Vehicle Number is required' })}
                            placeholder="Enter vehicle number"
                            className="w-full border border-[#C0D5FF] rounded p-2"
                        />
                        {errors.vehicleNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.vehicleNumber.message}</p>
                        )}
                    </div>
                </div>

                {/* Capacity */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="capacity" className="w-full sm:w-1/4 font-medium text-base">
                        Capacity <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="number"
                            id="capacity"
                            {...register('capacity', {
                                required: 'Capacity is required',
                                min: { value: 1, message: 'Capacity must be at least 1' },
                            })}
                            placeholder="Enter capacity (e.g., number of seats)"
                            className="w-full border border-[#C0D5FF] rounded p-2"
                            min="1"
                        />
                        {errors.capacity && (
                            <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>
                        )}
                    </div>
                </div>

                {/* Insurance Renewal Date */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="insuranceRenewalDate" className="w-full sm:w-1/4 font-medium text-base">
                        Insurance Renewal Date <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="date"
                            id="insuranceRenewalDate"
                            {...register('insuranceRenewalDate', { required: 'Insurance Renewal Date is required' })}
                            className="w-full border border-[#C0D5FF] rounded p-2"
                        />
                        {errors.insuranceRenewalDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.insuranceRenewalDate.message}</p>
                        )}
                    </div>
                </div>

                {/* Driver Name */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="driverName" className="w-full sm:w-1/4 font-medium text-base">
                        Driver Name <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="driverName"
                            {...register('driverName', { required: 'Driver Name is required' })}
                            placeholder="Enter driver name"
                            className="w-full border border-[#C0D5FF] rounded p-2"
                        />
                        {errors.driverName && (
                            <p className="text-red-500 text-sm mt-1">{errors.driverName.message}</p>
                        )}
                    </div>
                </div>

                {/* Driver Phone No */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="driverPhoneNumber" className="w-full sm:w-1/4 font-medium text-base">
                        Driver Phone No. <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="tel"
                            id="driverPhoneNumber"
                            {...register('driverPhoneNumber', {
                                required: 'Driver Phone No. is required',
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: 'Phone number must be 10 digits',
                                },
                            })}
                            placeholder="Enter driver phone number"
                            className="w-full border border-[#C0D5FF] rounded p-2"
                        />
                        {errors.driverPhoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.driverPhoneNumber.message}</p>
                        )}
                    </div>
                </div>

                {/* Driver License No */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="driverLicenseNumber" className="w-full sm:w-1/4 font-medium text-base">
                        Driver License No. <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="driverLicenseNumber"
                            {...register('driverLicenseNumber', {
                                required: 'Driver License No. is required',
                                pattern: {
                                    value: /^[A-Z0-9]{5,20}$/,
                                    message: 'License number must be 5-20 alphanumeric characters',
                                },
                            })}
                            placeholder="Enter driver license number"
                            className="w-full border border-[#C0D5FF] rounded p-2"
                        />
                        {errors.driverLicenseNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.driverLicenseNumber.message}</p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center w-full gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#143781] text-white px-6 py-2 rounded hover:bg-[#0f2a5c] transition disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default CreateVehicle;