import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Utility function to convert 12-hour format to 24-hour format
const convertTo24HourFormat = (time12Hour) => {
    if (!time12Hour) return '';
    try {
        const [time, period] = time12Hour.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
        console.error('Error converting time format:', error);
        return time12Hour; // Fallback to original value if conversion fails
    }
};

function Createstoppage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Initialize react-hook-form
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            stoppage: '',
            stopTiming: '',
            routeFare: ''
        }
    });

    // Handle form submission
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let response;
            if (isEditing && id) {
                // Update existing stoppage
                response = await axios.put(`${apiUrl}/stoppage/update/${id}`, data);
                toast.success('Stoppage updated successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                navigate(`/transportation/${"Stop Page List"}`)
            } else {
                // Create new stoppage
                response = await axios.post(`${apiUrl}/stoppage/create`, data);
                toast.success('Stoppage created successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }

            if (!isEditing) {
                reset();
            }
        } catch (error) {
            console.error('Error saving stoppage:', error?.response?.data || error.message);
            toast.error(`Error: ${error?.response?.data?.message || 'Internal server error'}`, {
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
    };

    const getDataById = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/stoppage/get/${id}`);
            console.log(response?.data?.data, "stoppage data");
            const data = response?.data?.data;

            if (data) {
                setValue('stoppage', data?.stoppage || '');
                // Convert stopTiming to 24-hour format
                setValue('stopTiming', convertTo24HourFormat(data?.stopTiming) || '');
                setValue('routeFare', data?.routeFare || '');
                setIsEditing(true);
            }
        } catch (error) {
            console.log(error, "error while getting stoppage data by id");
            toast.error('Error loading stoppage data', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getDataById(id);
        } else {
            setIsEditing(false);
        }
    }, [id]);

    return (
        <div className="w-full p-4">
            <h2 className="text-2xl font-semibold text-center mb-6">
                {isEditing ? 'Edit Transport Stoppage' : 'Create Transport Stoppage'}
            </h2>

            {loading && (
                <div className="text-center mb-4">
                    <p>Loading...</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center space-y-6">
                {/* Stoppage */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="stoppage" className="w-full sm:w-1/4 font-medium text-base">
                        Stoppage <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="stoppage"
                            {...register('stoppage', {
                                required: 'Stoppage is required',
                                minLength: {
                                    value: 2,
                                    message: 'Stoppage must be at least 2 characters long'
                                }
                            })}
                            placeholder="Enter stoppage name"
                            className="w-full border border-[#C0D5FF] rounded p-2"
                            disabled={loading}
                        />
                        {errors.stoppage && (
                            <p className="text-red-500 text-sm mt-1">{errors.stoppage.message}</p>
                        )}
                    </div>
                </div>

                {/* Stop Timing */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="stopTiming" className="w-full sm:w-1/4 font-medium text-base">
                        Stop Timing <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="time"
                            id="stopTiming"
                            {...register('stopTiming', {
                                required: 'Stop Timing is required'
                            })}
                            className="w-full border border-[#C0D5FF] rounded p-2"
                            disabled={loading}
                        />
                        {errors.stopTiming && (
                            <p className="text-red-500 text-sm mt-1">{errors.stopTiming.message}</p>
                        )}
                    </div>
                </div>

                {/* Route Fare */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="routeFare" className="w-full sm:w-1/4 font-medium text-base">
                        Route Fare <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="routeFare"
                            {...register('routeFare', {
                                required: 'Route Fare is required',
                                min: {
                                    value: 0,
                                    message: 'Route Fare must be a positive number'
                                }
                            })}
                            placeholder="Enter route fare"
                            className="w-full border border-[#C0D5FF] rounded p-2"
                            step="0.01"
                            disabled={loading}
                        />
                        {errors.routeFare && (
                            <p className="text-red-500 text-sm mt-1">{errors.routeFare.message}</p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center w-full gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded text-white transition ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#143781] hover:bg-[#0f2a5c]'
                            }`}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className={`px-6 py-2 rounded transition ${loading
                            ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                            : 'bg-gray-300 hover:bg-gray-400 text-black'
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

export default Createstoppage;