import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

function CreateRoute() {
    const { id } = useParams()

    console.log(id, "upconing id ")

    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        routeName: '',
        startPlace: '',
        stopPlace: '',
        remark: '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.routeName) newErrors.routeName = 'Route Name is required';
        if (!formData.startPlace) newErrors.startPlace = 'Start Place is required';
        if (!formData.stopPlace) newErrors.stopPlace = 'Stop Place is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validate();

        if (Object.keys(formErrors).length === 0) {
            try {
                if (id) {
                    const response = await axios.put(`${apiUrl}/transportRoute/updateTransportRoute/${id}`, formData);
                    toast.success('Route Update successfully!');

                    resetForm();
                    navigate(`/transportation/${"Route List"}`)

                } else {


                    const response = await axios.post(`${apiUrl}/transportRoute/create`, formData);
                    if (response.status === 200 || response.status === 201) {
                        toast.success('Route created successfully!');
                        resetForm();
                        // onRouteCreated(response.data); // Notify parent component
                        // onClose(); // Close the modal
                    }
                }
            } catch (error) {
                console.error('Error creating route:', error.response?.data || error);
                toast.error('Failed to create route. Please try again.');
            }
        } else {
            setErrors(formErrors);
        }
    };

    const resetForm = () => {
        setFormData({

            routeName: '',
            startPlace: '',
            stopPlace: '',
            remark: '',
        });
        setErrors({});
    };

    const handleCancel = () => {
        resetForm();
        onClose(); // Close the modal
    };

    const getEditdata = async (id) => {
        try {

            const response = await axios.get(`${apiUrl}/transportRoute/get/${id}`)
            console.log(response?.data, "jdjdj")
            setFormData({

                routeName: response?.data?.data?.routeName || '',
                startPlace: response?.data?.data?.startPlace || '',
                stopPlace: response?.data?.data?.stopPlace || '',
                remark: response?.data?.data?.remark || '',
            });

        } catch (error) {
            console.log(error, "error while fetchin the data ")

        }

    };

    useEffect(() => {
        if (id) {
            getEditdata(id);
        }

    }, [])

    return (
        <div className="w-full p-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Create Transport Route</h2>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center space-y-6">


                {/* Route Name */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="routeName" className="w-full sm:w-1/4 font-medium text-base">
                        Route Name <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="routeName"
                            name="routeName"
                            value={formData.routeName}
                            onChange={handleInputChange}
                            placeholder="Enter route name"
                            className="w-full border border-[#C0D5FF] rounded p-2"
                            required
                        />
                        {errors.routeName && (
                            <p className="text-red-500 text-sm mt-1">{errors.routeName}</p>
                        )}
                    </div>
                </div>

                {/* Start Place */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="startPlace" className="w-full sm:w-1/4 font-medium text-base">
                        Start Place <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="startPlace"
                            name="startPlace"
                            value={formData.startPlace}
                            onChange={handleInputChange}
                            placeholder="Enter start place"
                            className="w-full border border-[#C0D5FF] rounded p-2"
                            required
                        />
                        {errors.startPlace && (
                            <p className="text-red-500 text-sm mt-1">{errors.startPlace}</p>
                        )}
                    </div>
                </div>

                {/* Stop Place */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="stopPlace" className="w-full sm:w-1/4 font-medium text-base">
                        Stop Place <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="stopPlace"
                            name="stopPlace"
                            value={formData.stopPlace}
                            onChange={handleInputChange}
                            placeholder="Enter stop place"
                            className="w-full border border-[#C0D5FF] rounded p-2"
                            required
                        />
                        {errors.stopPlace && (
                            <p className="text-red-500 text-sm mt-1">{errors.stopPlace}</p>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="description" className="w-full sm:w-1/4 font-medium text-base">
                        Remark
                    </label>
                    <div className="w-full sm:w-3/4">
                        <textarea
                            id="remark"
                            name="remark"
                            value={formData.remark}
                            onChange={handleInputChange}
                            placeholder="Enter route description..."
                            className="w-full h-[100px] p-2 resize-none border border-[#C0D5FF] rounded"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center w-full gap-4">
                    <button
                        type="submit"
                        className="bg-[#143781] text-white px-6 py-2 rounded hover:bg-[#0f2a5c] transition"
                    >
                        {id ? "Update" : "Save"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
            {/* <ToastContainer /> */}
        </div>
    );
}

export default CreateRoute;