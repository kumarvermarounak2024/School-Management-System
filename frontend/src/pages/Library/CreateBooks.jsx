import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateBooks() {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!!id);
    const [imagePreview, setImagePreview] = useState(null);

    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            bookstitle: '',
            bookISBNNO: '',
            author: '',
            edition: '',
            purchaseDate: '',
            category: '',
            publisher: '',
            description: '',
            price: '',
            coverImage: null,
            totalStock: '',

        },
    });

    const coverImage = watch('coverImage');

    const getCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/booksCategory/getAll`);
            console.log('object', response?.data?.data)
            setCategories(response?.data?.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to fetch categories'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const getBookData = async (bookId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/booksRoute/get/${bookId}`);
            const data = response?.data?.data;
            console.log(data, "upcomd usrifn");
            if (data) {
                setValue('bookstitle', data.title || '');
                setValue('bookISBNNO', data.isbn || '');
                setValue('author', data.author || '');
                setValue('edition', data.edition || '');
                setValue('purchaseDate', data.purchaseDate ? data.purchaseDate.split('T')[0] : '');
                setValue('category', data.category?._id || '');
                setValue('publisher', data.publisher || '');
                setValue('description', data.description || '');
                setValue('price', data.price || '');
                setValue('totalStock', data.totalStock || '');
                setImagePreview(data.coverImage || null);
                setIsEditing(true);
            }
        } catch (error) {
            console.error('Error fetching book data:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to fetch book data'}`, {
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
            const formData = new FormData();
            formData.append('bookstitle', data.bookstitle);
            formData.append('bookISBNNO', data.bookISBNNO);
            formData.append('author', data.author);
            formData.append('edition', data.edition);
            formData.append('purchaseDate', data.purchaseDate);
            formData.append('category', data.category);
            formData.append('publisher', data.publisher);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('totalStock', data.totalStock);
            if (data.coverImage && data.coverImage[0]) {
                formData.append('coverImage', data.coverImage[0]);
            }

            let response;
            if (isEditing && id) {
                response = await axios.put(`${apiUrl}/booksRoute/update/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Book updated successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                navigate(`/library/${"Books List"}`)
            } else {
                console.log(formData, "jdjdjdjdj")
                response = await axios.post(`${apiUrl}/booksRoute/create`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Book created successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
            console.log(response, 'response while submitting book');
            reset();
            setImagePreview(null);
        } catch (error) {
            console.error('Error submitting book:', error);
            toast.error(`Error: ${error?.response?.data?.message || 'Failed to save book'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        reset();
        setImagePreview(null);
        toast.info('Form cancelled', {
            position: 'top-right',
            autoClose: 2000,
        });
    };

    useEffect(() => {
        if (coverImage && coverImage[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(coverImage[0]);
        } else if (!isEditing) {
            setImagePreview(null);
        }
    }, [coverImage]);

    useEffect(() => {
        getCategories();
        if (id) {
            getBookData(id);
        } else {
            setIsEditing(false);
            reset();
            setImagePreview(null);
        }
    }, [id]);

    return (
        <div className="w-full p-6">
            {/* <h2 className="text-2xl font-semibold text-center mb-6">
                {isEditing ? 'Edit Book' : 'Create Book'}
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
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="bookstitle" className="w-full sm:w-1/4 font-medium text-base">
                        Book title <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="bookstitle"
                            {...register('bookstitle', {
                                required: 'Book bookstitle is required',
                                minLength: { value: 2, message: 'bookstitle must be at least 2 characters' },
                                maxLength: { value: 100, message: 'bookstitle cannot exceed 100 characters' },
                            })}
                            placeholder="Enter book bookstitle"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        {errors.bookstitle && (
                            <p className="text-red-500 text-sm mt-1">{errors.bookstitle.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="bookISBNNO" className="w-full sm:w-1/4 font-medium text-base">

                        BookISBNNO                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="bookISBNNO"
                            {...register('bookISBNNO', {
                                pattern: {
                                    value: /^(?:\d{10}|\d{13})$/,
                                    message: 'bookISBNNO must be 10 or 13 digits',
                                },
                                maxLength: { value: 13, message: 'bookISBNNO cannot exceed 13 characters' },
                            })}
                            placeholder="Enter bookISBNNO (10 or 13 digits)"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        {errors.bookISBNNO && (
                            <p className="text-red-500 text-sm mt-1">{errors.bookISBNNO.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="author" className="w-full sm:w-1/4 font-medium text-base">
                        Author
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="author"
                            {...register('author', {
                                maxLength: { value: 100, message: 'Author name cannot exceed 100 characters' },
                            })}
                            placeholder="Enter author name"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        {errors.author && (
                            <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="edition" className="w-full sm:w-1/4 font-medium text-base">
                        Edition
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="edition"
                            {...register('edition', {
                                maxLength: { value: 50, message: 'Edition cannot exceed 50 characters' },
                            })}
                            placeholder="Enter edition (e.g., 1st, 2nd)"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        {errors.edition && (
                            <p className="text-red-500 text-sm mt-1">{errors.edition.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="purchaseDate" className="w-full sm:w-1/4 font-medium text-base">
                        Purchase Date <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="date"
                            id="purchaseDate"
                            {...register('purchaseDate', {
                                required: 'Purchase Date is required',
                            })}
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        {errors.purchaseDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.purchaseDate.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="category" className="w-full sm:w-1/4 font-medium text-base">
                        Book category <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <select
                            id="category"
                            {...register('category', {
                                required: 'Book category is required',
                            })}
                            className="w-full max-w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ maxWidth: '100%' }}
                            disabled={loading}
                        >
                            <option value="">Select category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id} >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="publisher" className="w-full sm:w-1/4 font-medium text-base">
                        Publisher <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            id="publisher"
                            {...register('publisher', {
                                required: 'Publisher is required',
                                minLength: { value: 2, message: 'Publisher must be at least 2 characters' },
                                maxLength: { value: 100, message: 'Publisher cannot exceed 100 characters' },
                            })}
                            placeholder="Enter publisher name"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        {errors.publisher && (
                            <p className="text-red-500 text-sm mt-1">{errors.publisher.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="description" className="w-full sm:w-1/4 font-medium text-base">
                        Description
                    </label>
                    <div className="w-full sm:w-3/4">
                        <textarea
                            id="description"
                            {...register('description', {
                                maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' },
                            })}
                            placeholder="Enter book description"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            disabled={loading}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="price" className="w-full sm:w-1/4 font-medium text-base">
                        Price <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="number"
                            id="price"
                            {...register('price', {
                                required: 'Price is required',
                                min: { value: 0, message: 'Price cannot be negative' },
                                valueAsNumber: true,
                            })}
                            placeholder="Enter book price"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.01"
                            disabled={loading}
                        />
                        {errors.price && (
                            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="coverImage" className="w-full sm:w-1/4 font-medium text-base">
                        Cover Image
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="file"
                            id="coverImage"
                            {...register('coverImage', {
                                validate: (files) => {
                                    if (files[0] && !['image/jpeg', 'image/png', 'image/gif'].includes(files[0].type)) {
                                        return 'Only JPEG, PNG, or GIF images are allowed';
                                    }
                                    if (files[0] && files[0].size > 5 * 1024 * 1024) {
                                        return 'Image size cannot exceed 5MB';
                                    }
                                    return true;
                                },
                            })}
                            accept="image/jpeg,image/png,image/gif"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        {errors.coverImage && (
                            <p className="text-red-500 text-sm mt-1">{errors.coverImage.message}</p>
                        )}
                        {imagePreview && (
                            <div className="mt-2">
                                <img src={imagePreview} alt="Cover Preview" className="w-32 h-32 object-cover rounded" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3">
                    <label htmlFor="totalStock" className="w-full sm:w-1/4 font-medium text-base">
                        Total Stock <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="number"
                            id="totalStock"
                            {...register('totalStock', {
                                required: 'Total Stock is required',
                                min: { value: 0, message: 'Stock cannot be negative' },
                                valueAsNumber: true,
                            })}
                            placeholder="Enter total stock"
                            className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        {errors.totalStock && (
                            <p className="text-red-500 text-sm mt-1">{errors.totalStock.message}</p>
                        )}
                    </div>
                </div>

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

export default CreateBooks;