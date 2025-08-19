import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddBookname() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const { id } = useParams(); // Get ID from URL for editing
    console.log(id, "upcoming id")
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Initialize react-hook-form
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            name: '',
        },
    });

    // Fetch name data for editing
    const getnameById = async (nameId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/booksCategory/get/${nameId}`);
            const data = response?.data?.data;
            console.log(data, "djdjdjdj")
            if (data) {
                setValue('name', data.name || '');
                setIsEditing(true);
            }
        } catch (error) {
            console.error('Error fetching name:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to fetch name'}`, {
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
                // Update existing name
                response = await axios.put(`${apiUrl}/booksCategory/update/${id}`, data);
                toast.success('name updated successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                navigate(`/library/${"Book Category List"}`)
            } else {
                // Create new name
                console.log(data, "category name")
                response = await axios.post(`${apiUrl}/booksCategory/create`, data);
                toast.success('name created successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
            reset(); // Reset form after successful submission
            // Optional: Navigate to a list page after success
            // setTimeout(() => navigate('/bookCategories'), 2000);
        } catch (error) {
            console.error('Error saving name:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to save name'}`, {
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
        // navigate('/bookCategories');
    };

    // Fetch data if editing
    useEffect(() => {
        if (id) {
            getnameById(id);
        } else {
            setIsEditing(false);
            reset(); // Ensure form is reset for new name
        }
    }, [id]);

    return (
        <div className="w-full p-6">
            {/* <h2 className="text-2xl font-semibold text-center mb-6">
                {isEditing ? 'Edit Book name' : 'Add Book name'}
            </h2> */}

            {loading && (
                <div className="text-center mb-4">
                    <p>Loading...</p>
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-center items-center space-y-6 max-w-full mx-auto"
            >
                {/* Books name */}
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="name" className="w-full sm:w-1/4 font-bold text-base">
                        Categoty Name  <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="name"
                            {...register('name', {
                                required: 'Books name is required',
                                minLength: {
                                    value: 2,
                                    message: 'name name must be at least 2 characters long',
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'name name cannot exceed 50 characters',
                                },
                            })}
                            placeholder="Enter book name (e.g., Fiction)"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center w-full gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-10 py-2 rounded text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#151587] hover:bg-[#0f2a5c]'
                            }`}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className={`px-10 py-2 rounded transition ${loading ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-gray-300 hover:bg-gray-400 text-black'
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

export default AddBookname;
