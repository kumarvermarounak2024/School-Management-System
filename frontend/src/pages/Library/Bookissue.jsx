import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BookIssue = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      bookCategory: "",
      bookTitle: "",
      issuedBy: "",
      class: "",
      userName: "",
      issueDate: "",
      expiryDate: "",
      fine: "",
      status: "",
    },
  });

  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const status = ["Issued", "Pending", "Rejected"];
  const [studentName, setStudentName] = useState([]);
    const [staffList, setStaffList] = useState([]);
  
  const selectedClass = watch("class"); // watch class field changes

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const transformedData = {
        bookCategory: data.bookCategory,
        bookTitle: data.bookTitle,
        issuedTo: data.issuedBy,
        class: data.class,
        user: data.userName,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        fine: data.fine,
        status: data.status,
      };

      let response;
      if (isEditing) {
        response = await axios.put(
          `${apiUrl}/bookIssue/update/${id}`,
          transformedData
        );
        toast.success("Book issue updated successfully!");
      } else {
        response = await axios.post(
          `${apiUrl}/bookIssue/create`,
          transformedData
        );
        toast.success("Book issue created successfully!");
      }

      reset();
      navigate("/book-issues");
    } catch (error) {
      console.error("Error submitting book issue:", error);
      toast.error(error.response?.data?.message || "Failed to save book issue");
    } finally {
      setLoading(false);
    }
  };
// staff 

  const getAllStaff = async () => {
    try {
      const res = await axios.get(`${apiUrl}/staff/get`);
      console.log("staff response:", res.data);

      const employees = res.data.employees || [];
      const librarianStaff=employees.filter((emp)=> emp.role && emp.role.trim().toLowerCase() === "librarian")
      setStaffList(librarianStaff);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);


  // Form submission handler
  // Fetch students filtered by selected class
  const getStudentName = async (classId) => {
    if (!classId) {
      setStudentName([]);
      return;
    }
    try {
      const response = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
      const filteredStudents = response?.data?.data?.filter(
        (student) => student.level_class?._id === classId
      );
      console.log("Filtered Students →", filteredStudents);

      setStudentName(filteredStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudentName([]);
    }
  };

  // Trigger fetch when class changes
  useEffect(() => {
    getStudentName(selectedClass);
  }, [selectedClass]);

  const getBookCategory = async () => {
    const response = await axios.get(`${apiUrl}/booksCategory/getAll`);
    console.log(response.data.data);
    setCategories(response?.data?.data);
  };

  const getBookTitle = async () => {
    const response = await axios.get(`${apiUrl}/booksRoute/getAll`);
    console.log(response.data.data);
    setTitle(response?.data?.data);
  };

  const getClasses = async () => {
    const response = await axios.get(`${apiUrl}/class/getAll`);
    console.log(response?.data?.classes, "classes");
    setClasses(response?.data?.classes);
  };

  const getBookIssueById = async (id) => {
    const response = await axios.get(`${apiUrl}/bookIssue/getById/${id}`);
    console.log(response.data.data, "book issue by id");
    const data = response?.data?.data;
    if (data) {
      setIsEditing(true);
      setValue("bookCategory", data?.bookCategory?._id);
      setValue("bookTitle", data?.bookTitle?._id);
      setValue("issuedBy", data?.issuedTo);
      setValue("class", data?.class?._id);
      setValue("userName", data?.user);
      // Format the dates to YYYY-MM-DD format for the date input
      const issueDate = new Date(data?.issueDate).toISOString().split("T")[0];
      const expiryDate = new Date(data?.expiryDate).toISOString().split("T")[0];
      setValue("issueDate", issueDate);
      setValue("expiryDate", expiryDate);
      setValue("fine", data?.fine);
      setValue("status", data?.status);
    }
  };

  useEffect(() => {
    getBookCategory();
    getBookTitle();
    getClasses();
    if (id) {
      getBookIssueById(id);
    }
  }, []);

  return (
    <div className=" bg-gray-100 min-h-screen">
      {/* <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Book Issue Form</h2> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        {/* Book Category */}
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
          <label
            htmlFor="bookCategory"
            className="w-full sm:w-1/4 font-bold text-base"
          >
            Book Category <span className="text-red-500">*</span>
          </label>
          <div className="w-full sm:w-3/4">
            <select
              id="bookCategory"
              {...register("bookCategory", {
                required: "Book Category is required",
              })}
              className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category?._id} value={category?._id}>
                  {category?.name}
                </option>
              ))}
            </select>
            {errors.bookCategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bookCategory.message}
              </p>
            )}
          </div>
        </div>

        {/* Book Title */}
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
          <label
            htmlFor="bookTitle"
            className="w-full sm:w-1/4 font-bold text-base"
          >
            Book Title <span className="text-red-500">*</span>
          </label>
          <div className="w-full sm:w-3/4">
            <select
              id="bookTitle"
              {...register("bookTitle", { required: "Book Title is required" })}
              className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a book</option>
              {title.map((book) => (
                <option key={book?._id} value={book?._id}>
                  {book?.title}
                </option>
              ))}
            </select>
            {errors.bookTitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bookTitle.message}
              </p>
            )}
          </div>
        </div>

        {/* Book Issued By */}
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
          <label
            htmlFor="issuedBy"
            className="w-full sm:w-1/4 font-bold text-base"
          >
            Book Issued By <span className="text-red-500">*</span>
          </label>
          <div className="w-full sm:w-3/4">
<select
  {...register("issuedBy", { required: true })}
  className="w-full border p-2 rounded"
>
  <option value="">Select Librarian</option>
  {staffList.map((librarian) => (
    <option key={librarian._id} value={librarian._id}>
      {librarian.name}
    </option>
  ))}
</select>

{errors.issuedBy && (
  <p className="text-red-500 text-sm mt-1">
    {errors.issuedBy.message}
  </p>
)}

          </div>
        </div>

        {/* Class */}
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
          <label
            htmlFor="class"
            className="w-full sm:w-1/4 font-bold text-base"
          >
            Class <span className="text-red-500">*</span>
          </label>
          <div className="w-full sm:w-3/4">
            <select
              id="class"
              {...register("class", { required: "Class is required" })}
              className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a class</option>
              {classes.map((cls, index) => (
                <option key={cls?._id} value={cls?._id}>
                  {cls?.Name}
                </option>
              ))}
            </select>
            {errors.class && (
              <p className="text-red-500 text-sm mt-1">
                {errors.class.message}
              </p>
            )}
          </div>
        </div>

        {/* User Name */}
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
          <label
            htmlFor="userName"
            className="w-full sm:w-1/4 font-bold text-base"
          >
            User Name <span className="text-red-500">*</span>
          </label>
          <div className="w-full sm:w-3/4">
            <select
              id="userName"
              {...register("userName", { required: true })}
              className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Student</option>
              {studentName.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.firstName} {student.lastName}{" "}
                </option>
              ))}
            </select>

            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.userName.message}
              </p>
            )}
          </div>
        </div>

        {/* Date of Issue */}
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
          <label
            htmlFor="issueDate"
            className="w-full sm:w-1/4 font-bold text-base"
          >
            Date of Issue <span className="text-red-500">*</span>
          </label>
          <div className="w-full sm:w-3/4">
            <input
              type="date"
              id="issueDate"
              {...register("issueDate", {
                required: "Date of Issue is required",
              })}
              className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.issueDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.issueDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Date of Expiry */}
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
          <label
            htmlFor="expiryDate"
            className="w-full sm:w-1/4 font-bold text-base"
          >
            Date of Expiry <span className="text-red-500">*</span>
          </label>
          <div className="w-full sm:w-3/4">
            <input
              type="date"
              id="expiryDate"
              {...register("expiryDate", {
                required: "Date of Expiry is required",
              })}
              className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.expiryDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.expiryDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Fine */}
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
          <label htmlFor="fine" className="w-full sm:w-1/4 font-bold text-base">
            Fine
          </label>
          <div className="w-full sm:w-3/4">
            <input
              type="number"
              id="fine"
              step="0.01"
              {...register("fine")}
              placeholder="Enter fine amount (optional)"
              className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 mb-4">
          <label
            htmlFor="status"
            className="w-full sm:w-1/4 font-bold text-base"
          >
            Status
          </label>
          <div className="w-full sm:w-3/4">
            <select
              id="status"
              {...register("status")}
              className="w-full border border-[#C0D5FF] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status</option>
              {status.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit and Reset Buttons */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-10 py-2 bg-[#151587] text-white font-bold rounded-md  flex items-center gap-2"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="ml-4 px-10 py-2 bg-gray-200 font-bold text-gray-700 rounded-md border border-[#151587] flex items-center gap-2"
          >
            Cencel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookIssue;
