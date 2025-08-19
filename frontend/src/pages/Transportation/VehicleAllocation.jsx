import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VehicleAllocation() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [transportRoutes, setTransportRoutes] = useState([]);
    const [stoppages, setStoppages] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!!id);

    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            class: '',
            section: '',
            student: '',
            fatherName: '',
            routeName: '',
            stoppage: '',
            vehicleNumber: '',
            routeFare: '',
        },
    });

    const selectedClass = watch('class');
    const selectedSection = watch('section');

    const getClasses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/class/getAll`);
            setClasses(response?.data?.classes || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to fetch classes'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const getSections = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/section/getAll`);
            setSections(response?.data?.sections || []);
        } catch (error) {
            console.error('Error fetching sections:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to fetch sections'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const getTransportRoute = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/transportRoute/getAll`);
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

    const getStoppage = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/stoppage/getAll`);
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

    const getVehicle = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/vehicleMaster/getAll`);
            setVehicles(response?.data || []);
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

    const fetchStudents = async () => {
        if (!selectedClass || !selectedSection) {
            setStudents([]);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
            console.log('Students API response:', response.data);

            // Filter students based on level_class and section IDs
            const filteredStudents = response?.data?.data?.filter(student =>
                student.level_class?._id === selectedClass &&
                student.section?._id === selectedSection
            ) || [];

            setStudents(filteredStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to fetch students'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const getAllocationData = async (allocationId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/allocationRoute/get/${allocationId}`);
            const data = response?.data;
            if (data) {
                setValue('class', data.class?._id || '');
                setValue('section', data.section?._id || '');
                setValue('student', data.student || ''); // Expecting "firstName lastName"
                setValue('fatherName', data.fatherName || '');
                setValue('routeName', data.routeName?._id || '');
                setValue('stoppage', data.stoppage?._id || '');
                setValue('vehicleNumber', data.vehicleNumber?._id || '');
                setValue('routeFare', data.routeFare || '');
                setIsEditing(true);
            }
        } catch (error) {
            console.error('Error fetching allocation data:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to load allocation data'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const transformedData = {
                class: data.class,
                section: data.section,
                student: data.student,
                fatherName: data.fatherName,
                routeName: data.routeName,
                stoppage: data.stoppage,
                vehicleNumber: data.vehicleNumber,
                routeFare: parseFloat(data.routeFare),
            };

            console.log('Submitting payload:', transformedData);

            let response;
            if (isEditing && id) {
                response = await axios.put(`${apiUrl}/allocationRoute/update/${id}`, transformedData);
                toast.success('Vehicle allocation updated successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            } else {
                response = await axios.post(`${apiUrl}/allocationRoute/create`, transformedData);
                toast.success('Vehicle allocation saved successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
            console.log('Submission response:', response.data);
            reset();

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

    const handleCancel = () => {
        reset();
        toast.info('Form cancelled', {
            position: 'top-right',
            autoClose: 2000,
        });
        navigate('/vehicle-allocations');
    };

    useEffect(() => {
        getClasses();
        getSections();
        getTransportRoute();
        getStoppage();
        getVehicle();
    }, []);

    useEffect(() => {
        if (selectedClass && selectedSection) {
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedClass, selectedSection]);

    useEffect(() => {
        if (id) {
            getAllocationData(id);
        } else {
            setIsEditing(false);
            reset();
        }
    }, [id]);

    return (
        <div className="w-full p-6 bg-gray-50 min-h-screen">
            {loading && (
                <div className="text-center mb-6">
                    <p className="text-gray-600">Loading...</p>
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-6 max-w-full mx-auto bg-white p-6 rounded-lg shadow-md"
            >
                <div className="flex flex-col sm:flex-row w-full gap-6">
                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                        <label htmlFor="class" className="w-full sm:w-1/4 font-medium text-base text-gray-700">
                            Class <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full sm:w-3/4">
                            <select
                                name="class"
                                {...register('class', { required: 'Class is required' })}
                                className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                                disabled={loading}
                            >
                                <option value="">Select a class</option>
                                {classes.map((cls) => (
                                    <option key={cls._id} value={cls._id}>
                                        {cls.Name}
                                    </option>
                                ))}
                            </select>
                            {errors.class && (
                                <p className="text-red-500 text-sm mt-1">{errors.class.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                        <label htmlFor="section" className="w-full sm:w-1/4 font-medium text-base text-gray-700">
                            Section <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full sm:w-3/4">
                            <select
                                name="section"
                                {...register('section', { required: 'Section is required' })}
                                className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                                disabled={loading}
                            >
                                <option value="">Select a section</option>
                                {sections.map((sect) => (
                                    <option key={sect._id} value={sect._id}>
                                        {sect.Name}
                                    </option>
                                ))}
                            </select>
                            {errors.section && (
                                <p className="text-red-500 text-sm mt-1">{errors.section.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="student" className="w-full sm:w-1/4 font-medium text-base text-gray-700">
                        Student Name <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <select
                            name="student"
                            {...register('student', { required: 'Student Name is required' })}
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                            disabled={loading || !selectedClass || !selectedSection}
                        >
                            <option value="">Select a student</option>
                            {students.map((student) => (
                                <option key={student._id} value={student._id}>
                                    {`${student.firstName} ${student.lastName}`}
                                </option>
                            ))}
                        </select>
                        {errors.student && (
                            <p className="text-red-500 text-sm mt-1">{errors.student.message}</p>
                        )}
                        {!selectedClass && (
                            <p className="text-gray-500 text-sm mt-1">Please select a class first</p>
                        )}
                        {selectedClass && !selectedSection && (
                            <p className="text-gray-500 text-sm mt-1">Please select a section</p>
                        )}
                        {selectedClass && selectedSection && students.length === 0 && (
                            <p className="text-gray-500 text-sm mt-1">
                                No students found in {classes.find(c => c._id === selectedClass)?.Name} - {sections.find(s => s._id === selectedSection)?.Name}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="fatherName" className="w-full sm:w-1/4 font-medium text-base text-gray-700">
                        Father Name
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            name="fatherName"
                            {...register('fatherName', {
                                minLength: { value: 2, message: 'Father Name must be at least 2 characters' },
                                maxLength: { value: 100, message: 'Father Name cannot exceed 100 characters' },
                            })}
                            placeholder="Enter father's name (optional)"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                            disabled={loading}
                        />
                        {errors.fatherName && (
                            <p className="text-red-500 text-sm mt-1">{errors.fatherName.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="routeName" className="w-full sm:w-1/4 font-medium text-base text-gray-700">
                        Route Name <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <select
                            name="routeName"
                            {...register('routeName', { required: 'Route is required' })}
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                            disabled={loading}
                        >
                            <option value="">Select a route</option>
                            {transportRoutes.map((route) => (
                                <option key={route._id} value={route._id}>
                                    {route.routeName}
                                </option>
                            ))}
                        </select>
                        {errors.routeName && (
                            <p className="text-red-500 text-sm mt-1">{errors.routeName.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="stoppage" className="w-full sm:w-1/4 font-medium text-base text-gray-700">
                        Stoppage <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <select
                            name="stoppage"
                            {...register('stoppage', { required: 'Stoppage is required' })}
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                            disabled={loading}
                        >
                            <option value="">Select a stoppage</option>
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

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="vehicleNumber" className="w-full sm:w-1/4 font-medium text-base text-gray-700">
                        Vehicle Number <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <select
                            name="vehicleNumber"
                            {...register('vehicleNumber', { required: 'Vehicle Number is required' })}
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                            disabled={loading}
                        >
                            <option value="">Select a vehicle</option>
                            {vehicles.map((vehicle) => (
                                <option key={vehicle._id} value={vehicle._id}>
                                    {vehicle.vehicleNumber}
                                </option>
                            ))}
                        </select>
                        {errors.vehicleNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.vehicleNumber.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="routeFare" className="w-full sm:w-1/4 font-medium text-base text-gray-700">
                        Route Fare <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="number"
                            name="routeFare"
                            {...register('routeFare', {
                                required: 'Route Fare is required',
                                min: { value: 0, message: 'Route Fare cannot be negative' },
                                valueAsNumber: true,
                            })}
                            placeholder="Enter route fare"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                            step="0.01"
                            disabled={loading}
                        />
                        {errors.routeFare && (
                            <p className="text-red-500 text-sm mt-1">{errors.routeFare.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-center w-full gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded text-white font-medium transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#143781] hover:bg-[#0f2a5c]'}`}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className={`px-6 py-2 rounded font-medium text-gray-800 transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        Cancel
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default VehicleAllocation;