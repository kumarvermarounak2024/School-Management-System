import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AddCategory() {
    const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

    const [formData, setFormData] = useState({
        Category_name: '', // Changed from 'title' to match backend schema
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]); // For storing existing categories

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.Category_name) {
            setError('Please enter a category name.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${apiUrl}/hostel/category/create`, formData);
            if (response.data.message === "Category created successfully") {
                alert(`Category "${formData.Category_name}" created successfully!`);
                setFormData({ Category_name: '' }); // Reset form
                // fetchCategories(); // Refresh the list
            } else {
                setError(response.data.message || 'Failed to create category');
            }
        } catch (err) {
            console.error('Error creating category:', err);
            setError(err.response?.data?.message || 'Something went wrong while creating the category.');
        } finally {
            setLoading(false);
        }
    };

    // Handle cancel action
    const handleCancel = () => {
        setFormData({ Category_name: '' }); // Reset form
        setError(null); // Clear any errors
    };

    // // Handle cancel action
    // const handleCancel = () => {
    //     setFormData({ title: '' }); // Reset form
    //     setError(null); // Clear any errors
    // };

    // const getClasses = async () => {
    //     try {
    //         const response = await axios.get(`${apiUrl}`);
    //         setClasses(response.data);
    //     } catch (error) {
    //         console.error('Error fetching classes:', error);
    //     }
    // };

    // const getSection = async () => {
    //     try {
    //         const response = await axios.get(`${apiUrl}`);
    //         setSection(response.data);
    //     } catch (error) {
    //         console.error('Error fetching sections:', error);
    //     }
    // };

    // const getStudentName = async () => {
    //     try {
    //         const response = await axios.get(`${apiUrl}`);
    //         setStudentName(response.data);
    //     } catch (error) {
    //         console.error('Error fetching student names:', error);
    //     }
    // };

    // const getHostleName = async () => {
    //     try {
    //         const response = await axios.get(`${apiUrl}`);
    //         setHostelsName(response.data);
    //     } catch (error) {
    //         console.error('Error fetching hostel names:', error);
    //     }
    // };

    // const getRoomNumber = async () => {
    //     try {
    //         const response = await axios.get(`${apiUrl}`);
    //         setRoomNumber(response.data);
    //     } catch (error) {
    //         console.error('Error fetching room numbers:', error);
    //     }
    // };

    // const getCategoty = async () => {
    //     try {
    //         const response = await axios.get(`${apiUrl}`);
    //         setCategory(response.data);
    //     } catch (error) {
    //         console.error('Error fetching categories:', error);
    //     }
    // };

    // useEffect(() => {

    //     getClasses()
    //     getSection()
    //     getStudentName();
    //     getHostleName();
    //     getRoomNumber()
    //     getCategoty()
    // }, [])

    return (
        <div className="p-6">
            <div className="flex flex-col justify-center items-center space-y-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Add New Hostel Category</h2>
                <div className="flex w-full max-w-4xl">
                    <label className="w-1/4 font-medium text-base">
                        Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="Category_name" // Changed to match backend schema
                        value={formData.Category_name}
                        onChange={handleInputChange}
                        placeholder="Enter category name"
                        className="w-3/4 border border-[#C0D5FF] rounded p-2"
                        required
                    />
                </div>

                {error && (
                    <div className="w-full max-w-4xl text-red-500 text-center">
                        {error}
                    </div>
                )}

                <div className="flex justify-center w-full max-w-4xl space-x-4">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-6 py-2 bg-[#151587] text-white font-normal rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1a1a9e]'}`}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className={`px-6 py-2 bg-gray-300 text-gray-800 font-normal rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCategory;
