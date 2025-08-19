import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ProgressBarLoader from "./ProgressBarLoader";
const AdmissionForm = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const [progressStatus, setProgressStatus] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [sectionData, setSectionData] = useState();
  // student photo state
  const [photoStd, setPhotoPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/1393/1393992.png"
  );
  // guadian photo state
  const [guardian_photos, setGuardianphotoPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/921/921347.png"
  );
  const [academic_year, setAcademicYear] = useState("");
  // const [registration_no, setRegistrationNo] = useState("RSM-00030");
  const [admission_date, setAdmissionDate] = useState("");
  const [level_class, setLevel_Class] = useState("");
  const [section, setSection] = useState("");
  const [category, setCategory] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [motherTongue, setMotherTongue] = useState("");
  const [religion, setReligion] = useState("");
  const [caste, setCaste] = useState("");
  const [mobile_no, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [email_guardian, setGuardianEmail] = useState("");
  const [guardian_city, setCity] = useState("");
  const [present_address, setPresentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [guardianusername, setGuardianUserName] = useState("");
  const [guardianpassword, setGuardianPassword] = useState("");
  const [guardianconfirmPassword, setGuardianConfirmPassword] = useState("");
  const [guardian_name, setGuardianName] = useState("");
  const [relation, setRelation] = useState("");
  const [mother_name, setMotherName] = useState("");
  const [father_name, setFatherName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [income, setIncome] = useState("");
  const [education, setEducation] = useState("");
  const [mobile_no_guardian, setAlternateMobileNo] = useState("");
  const [guardian_state, setState] = useState("");
  const [guardian_address, setAddress] = useState("");
  const [transport_route, setTransportRoute] = useState("");
  const [Vehicle_number, setVehicleNo] = useState(""); // auto-filled based on route

  const [hostel_name, setHostelName] = useState("");
  const [room_name, setRoomName] = useState(""); // auto-filled based on hostel

  const [school_name, setPreviousSchoolName] = useState("");
  const [qualifications, setPreviousQualification] = useState("");
  const [remarks, setRemarks] = useState("");
  const [photo, setStudentPhoto] = useState(null);
  const [guardian_photo, setGuardianPhoto] = useState(null);

  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");

  const [hostelRooms, setHostelRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");

  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [vehicleNumbers, setVehicleNumbers] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  // <select
  //   className="border p-2 rounded w-full"
  //   value={selectedVehicleId}
  //   onChange={(e) => setSelectedVehicleId(e.target.value)}
  // >
  //   <option value="">Select Vehicle Number</option>
  //   {vehicleNumbers.map((veh) => (
  //     <option key={veh.id} value={veh.id}>
  //       {veh.number}
  //     </option>
  //   ))}
  // </select>;

  // const fetchTransportRoutes = async () => {
  //   try {
  //     const res = await axios.get(`${apiUrl}/transportRoute/getAll`); // <-- replace with correct API endpoint
  //     const routeNames = res.data.data.map(route => route.routeName);
  //     const uniqueRoutes = [...new Set(routeNames)]; // removes duplicates
  //     setRoutes(uniqueRoutes);
  //   } catch (error) {
  //     console.error("Error fetching transport routes:", error);
  //   }
  // };
  const fetchTransportRoutes = async () => {
    try {
      const res = await axios.get(`${apiUrl}/transportRoute/getAll`);
      // Store full route objects
      setRoutes(res.data.data); // keep array of objects with _id and routeName
    } catch (error) {
      console.error("Error fetching transport routes:", error);
    }
  };

  useEffect(() => {
    fetchTransportRoutes();
  }, []);

  useEffect(() => {
    getVehicaledata();
  }, []);

  const getVehicaledata = async () => {
    try {
      const response = await axios.get(`${apiUrl}/vehicleMaster/getAll`);
      const data = response?.data || []; // ✅ API me data directly array hai

      console.log("API Response:", response); // <-- Add this

      const vehicleNums = data.map((vehicle) => ({
        id: vehicle._id,
        number: vehicle.vehicleNumber,
      }));

      console.log("Mapped vehicles:", vehicleNums);

      setVehicleNumbers(vehicleNums);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicles");
    }
  };

  const fetchHostelRoom = async () => {
    try {
      const res = await axios.get(`${apiUrl}/hostel/room/getAll`);

    // console.log("room console",res)
      // Pura room object store karo for value-label pair
      const rooms = res.data.data.map((room) => ({
        id: room._id,
        name: room?.roomName,
        hostelID:room?.hostelmasterId?._id
      }));

      setHostelRooms(rooms);
    } catch (error) {
      console.error("Error fetching hostel data", error);
    }
  };

  useEffect(() => {
    fetchHostelRoom();
  }, []);

  // const fetchHostelName = async () => {
  //     try {
  //       const res = await axios.get(`${apiUrl}/hostel/getAll`);
  //       setHostelData(res.data.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const fetchHostels = async () => {
    try {
      const res = await axios.get(`${apiUrl}/hostel/getAll`);
      const hostelData = res.data?.data || [];
      setHostels(hostelData); // full objects with _id and hostelName
    } catch (error) {
      toast.error("Failed to fetch hostels");
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  // call the fetch staff, class, section funtion
  useEffect(() => {
    fetchStaffData();
    fetchClassData();
    fetchSectionData();
  }, []);

  // fetch all staff roles
  const fetchStaffData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/staff/get`);
      if (response?.status === 200) {
        setStaffData(response?.data?.employees);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //  set the unique role

  // fetch all class data
  const fetchClassData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/class/getAll`);
      if (response?.status === 200) {
        setClassData(response?.data?.classes);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // fetch all Section data
  const fetchSectionData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/section/getAll`);
      if (response?.status === 200) {
        setSectionData(response?.data?.sections);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // handle student photo
  const handlePhotoChange = (e) => {
    const file = e?.target?.files[0];
    setStudentPhoto(file);
    if (file && file?.type?.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // handle guadian photo
  const handleGuardianPhotoChange = (e) => {
    const file = e.target.files[0];
    setGuardianPhoto(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGuardianphotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // save the data from server then click on save
  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const formData = new FormData();

    // 📸 Image fields
    formData.append("photo", photo);
    formData.append("guardian_photo", guardian_photo);
    formData.append("academic_year", academic_year);
    // formData.append("registration_no", registration_no);
    formData.append("admission_date", admission_date);
    formData.append("level_class", level_class);
    formData.append("section", section);
    formData.append("category", category);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("gender", gender);
    formData.append("bloodGroup", bloodGroup);
    formData.append("date_of_birth", date_of_birth);
    formData.append("motherTongue", motherTongue);
    formData.append("religion", religion);
    formData.append("caste", caste);
    formData.append("mobile_no", mobile_no);
    formData.append("mobile_no_guardian", mobile_no_guardian);
    formData.append("email", email);
    formData.append("email_guardian", email_guardian);
    formData.append("guardian_city", guardian_city);
    formData.append("guardian_state", guardian_state);
    formData.append("guardian_address", guardian_address);
    formData.append("present_address", present_address);
    formData.append("permanentAddress", permanentAddress);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("guardianusername", guardianusername);
    formData.append("guardianpassword", guardianpassword);
    formData.append("guardianconfirmPassword", guardianconfirmPassword);
    formData.append("guardian_name", guardian_name);
    formData.append("relation", relation);
    formData.append("mother_name", mother_name);
    formData.append("father_name", father_name);
    formData.append("occupation", occupation);
    formData.append("income", income);
    formData.append("education", education);

    // 🏫 School & hostel info
    formData.append("school_name", school_name);
    formData.append("qualifications", qualifications);
    formData.append("remarks", remarks);
    formData.append("hostel_name", selectedHostel || null);
    formData.append("room_name", selectedRoom || null);
    formData.append("transport_route", selectedRoute || null);
    formData.append("Vehicle_number", selectedVehicleId || null);

    try {
      setProgressStatus(true);
      const response = await axios.post(
        `${apiUrl}/admissions/createAdmission`,
        formData
      );
      if (response?.status === 201) {
        toast.success("admission successfully");
      }
      console.log(response, "response");
    } catch (error) {
      console.log(error);
      toast.error("admission not created!");
    } finally {
      // ✅ Stop loader after success/failure
      setProgressStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="w-full bg-gray-50">
        {/* Academic Details */}
        <div className=" shadow rounded p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#2152AC] flex items-center mb-4">
            <span className="mr-2">🏫</span> Academic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Academic Year */}
            <div>
              <label className="block font-medium mb-1">Academic Year *</label>
              <select
                className="border rounded w-full p-2"
                onChange={(event) => setAcademicYear(event.target.value)}
              >
                <option value="">Select Academic Year</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
              </select>
            </div>

            {/* Register No */}
            {/* <div>
              <label className="block font-medium mb-1">Register No *</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                value={registration_no}
                onChange={(event) => setRegistrationNo(event.target.value)}
                readOnly
              />
            </div> */}

            {/* Admission Date */}
            <div>
              <label className="block font-medium mb-1">Admission Date *</label>
              <input
                type="date"
                className="border rounded w-full p-2"
                onChange={(event) => setAdmissionDate(event.target.value)}
              />
            </div>

            {/* Class */}
            <div>
              <label className="block font-medium mb-1">Class *</label>
              <select
                className="border rounded w-full p-2"
                onChange={(event) => setLevel_Class(event.target.value)}
              >
                <option value="">Select Class</option>
                {classData?.map((data, index) => (
                  <option key={index} value={data?._id}>
                    {data?.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block font-medium mb-1">Section *</label>
              <select
                className="border rounded w-full p-2"
                onChange={(event) => setSection(event.target.value)}
              >
                <option>Select Section</option>
                {sectionData?.map((section, index) => (
                  <option key={index + 1} value={section?._id}>
                    {section?.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium mb-1">Category *</label>
              <select
                className="border rounded w-full p-2"
                onChange={(event) => setCategory(event.target.value)}
                defaultValue=""
              >
                <option value="">Select Category</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
                <option value="General">General</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student Details */}
        <div className=" shadow rounded p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#2152AC] flex items-center mb-4">
            <span className="mr-2">👨‍🏫</span> Student Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First Name */}
            <div>
              <label className="block font-medium mb-1">First Name *</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter your first name..."
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block font-medium mb-1">Last Name *</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter your last name..."
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block font-medium mb-1">Gender</label>
              <select
                className="border rounded w-full p-2"
                onChange={(event) => setGender(event.target.value)}
                defaultValue=""
              >
                <option value="">Please select your Gender</option>
                <option value={"male"}>Male</option>
                <option value={"female"}>Female</option>
                <option value={"other"}>Other</option>
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block font-medium mb-1">Blood Group</label>
              <select
                className="border rounded w-full p-2"
                onChange={(event) => setBloodGroup(event.target.value)}
                defaultValue=""
              >
                <option>Select</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>

            {/* Date Of Birth */}
            <div>
              <label className="block font-medium mb-1">Date Of Birth</label>
              <input
                type="date"
                className="border rounded w-full p-2"
                onChange={(event) => setDateOfBirth(event.target.value)}
              />
            </div>

            {/* Mother Tongue */}
            <div>
              <label className="block font-medium mb-1">Mother Tongue</label>
              <input
                list="motherTongues"
                className="border rounded w-full p-2"
                name="motherTongue"
                value={motherTongue}
                onChange={(event) => setMotherTongue(event.target.value)}
                placeholder="Please enter mother tongue..."
              />
              <datalist id="motherTongues">
                <option value="Hindi" />
                <option value="English" />
                <option value="Gujarati" />
                <option value="Bengali" />
                <option value="Sanskrit" />
              </datalist>
            </div>

            {/* Religion */}
            <div>
              <label className="block font-medium mb-1">Religion</label>
              <input
                type="text"
                name="religion"
                list="religionList"
                placeholder="Please enter your religion..."
                className="border rounded w-full p-2"
                value={religion}
                onChange={(event) => setReligion(event.target.value)}
              />
              <datalist id="religionList">
                <option value="Hindu" />
                <option value="Muslim" />
                <option value="Christian" />
                <option value="Sikh" />
                <option value="Buddhist" />
                <option value="Jain" />
                <option value="Other" />
              </datalist>
            </div>

            {/* Caste */}
            <div>
              <label className="block font-medium mb-1">Caste</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter your caste..."
                onChange={(event) => setCaste(event.target.value)}
              />
            </div>

            {/* Mobile No */}
            <div>
              <label className="block font-medium mb-1">Mobile No</label>
              <input
                type="number"
                className="border rounded w-full p-2"
                placeholder="Please enter your mobile no..."
                onChange={(event) => setMobileNo(event.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                className="border rounded w-full p-2"
                placeholder="Please enter your email..."
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            {/* City */}
            <div>
              <label className="block font-medium mb-1">City</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter your city..."
                onChange={(event) => setCity(event.target.value)}
              />
            </div>

            {/* Present Address */}
            <div className="md:col-span-1">
              <label className="block font-medium mb-1">Present Address</label>
              <textarea
                className="border rounded w-full p-2 resize-none"
                rows="3"
                placeholder="Write here!..."
                onChange={(event) => setPresentAddress(event.target.value)}
              ></textarea>
            </div>

            {/* Permanent Address */}
            <div className="md:col-span-1">
              <label className="block font-medium mb-1">
                Permanent Address
              </label>
              <textarea
                className="border rounded w-full p-2 resize-none"
                rows="3"
                placeholder="Write here!.."
                onChange={(event) => setPermanentAddress(event.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Profile Picture */}
        <div className=" shadow p-6 mb-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-200 flex items-center justify-center overflow-hidden rounded-full group">
              <img
                src={photoStd}
                alt="Profile"
                className="object-cover w-full h-full"
              />

              {/* Hidden Input & Label Overlay */}
              <label className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-300 text-white text-sm">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  name="photoStd"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">Profile Picture</p>
          </div>

          {/* Login Details */}
          <h2 className="text-lg font-semibold text-[#2152AC] flex items-center mb-4">
            <span className="mr-2">🔒</span> Login Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block font-medium mb-1">Username *</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="eg.user123..."
                onChange={(event) => setUserName(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Password *</label>
              <input
                type="password"
                placeholder="Please enter your password..."
                className="border rounded w-full p-2"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                placeholder="Please enter your confirm password..."
                className="border rounded w-full p-2"
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
          </div>

          {/* Guardian Details */}
          <h2 className="text-lg font-semibold text-[#2152AC] flex items-center mb-4">
            <span className="mr-2">🧑‍🤝‍🧑</span> Guardian Details
          </h2>

          {/* <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Guardian Already Exist
            </label>
          </div> */}





          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block font-medium mb-1">Name *</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter guardian name..."
                onChange={(event) => setGuardianName(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Relation *</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter your relation..."
                onChange={(event) => setRelation(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Father Name</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter your father name..."
                onChange={(event) => setFatherName(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Mother Name</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter your mother name..."
                value={mother_name}
                onChange={(event) => setMotherName(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Occupation *</label>
              <input
                type="text"
                placeholder="Please enter your occupation..."
                className="border rounded w-full p-2"
                onChange={(event) => setOccupation(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Income *</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter your income..."
                onChange={(event) => setIncome(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Education *</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter your education..."
                onChange={(event) => setEducation(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Guardian Mobile No *
              </label>
              <input
                type="number"
                className="border rounded w-full p-2"
                placeholder="Please enter guardian mobile no..."
                onChange={(event) => setAlternateMobileNo(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Guardian Email *</label>
              <input
                type="email"
                value={email_guardian}
                className="border rounded w-full p-2"
                placeholder="Please enter your guardian email"
                onChange={(event) => setGuardianEmail(event.target.value)}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block font-medium mb-1">City</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter your city..."
                onChange={(event) => setCity(event.target.value)}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block font-medium mb-1">State</label>
              <input
                type="text"
                value={guardian_state}
                className="border rounded w-full p-2"
                placeholder="Please enter your state..."
                onChange={(event) => setState(event.target.value)}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block font-medium mb-1">Address</label>
              <textarea
                className="border rounded w-full p-2 resize-none"
                rows="3"
                placeholder="Write here!..."
                onChange={(event) => setAddress(event.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
{/* login credential of guardian */}
           {/* Login Details */}
          <h2 className="text-lg font-semibold text-[#2152AC] flex items-center mb-4">
            <span className="mr-2">🔒</span>Guardian Login Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block font-medium mb-1">Username *</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="eg.user123..."
                onChange={(event) =>setGuardianUserName(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Password *</label>
              <input
                type="password"
                placeholder="Please enter your password..."
                className="border rounded w-full p-2"
                onChange={(event) => setGuardianPassword(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                placeholder="Please enter your confirm password..."
                className="border rounded w-full p-2"
                onChange={(event) => setGuardianConfirmPassword(event.target.value)}
              />
            </div>
          </div>
        {/* Guardian Profile Picture */}
        <div className=" shadow p-6 mb-8">
          <div className="flex flex-col items-center mb-8">
            {/* handleGuardianPhotoChange */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-200 flex items-center justify-center overflow-hidden rounded-full group">
              <img
                src={guardian_photos}
                alt="Profile guardian_photos"
                className="object-cover w-full h-full"
              />

              {/* Hidden Input & Label Overlay */}
              <label className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-300 text-white text-sm">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  name="guardian_photos"
                  onChange={handleGuardianPhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Guardian Profile Picture
            </p>
          </div>
        </div>

        {/* Transport Details */}
        <div className=" shadow rounded p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#2152AC] flex items-center mb-4">
            <span className="mr-2">🚌</span> Transport Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Transport Route</label>
              <select
              className="border p-2 rounded w-full"
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
              >
                <option value="">Select Transport Route</option>
                {routes.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.routeName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Vehicle No</label>
              <select
                className="border p-2 rounded w-full"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
              >
                <option value="">Select Vehicle Number</option>
                {vehicleNumbers.map((veh) => (
                  <option key={veh.id} value={veh.id}>
                    {veh.number}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Hostel Details */}
        <div className=" shadow rounded p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#2152AC] flex items-center mb-4">
            <span className="mr-2">🏨</span> Hostel Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Hostel Name</label>
              <select
              className="border p-2 rounded w-full"
                value={selectedHostel}
                onChange={(e) => setSelectedHostel(e.target.value)}
              >
                <option value="">Select Hostel</option>
                {hostels.map((hostel) => (
                  <option key={hostel._id} value={hostel._id}>
                    {hostel.Hostel_Name}
                  </option>
                ))}
              </select>
            </div>
{/* {console.log("selected", selectedHostel)}
{console.log("hostelRooms", hostelRooms)} */}
            <div>
              <label className="block font-medium mb-1">Room Name</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Room</option>
                {hostelRooms.filter((room)=>room.hostelID === selectedHostel)?.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Previous School Details */}
        <div className=" shadow rounded p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#2152AC] flex items-center mb-4">
            <span className="mr-2">🏫</span> Previous School Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">School Name</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter your previous school name..."
                onChange={(event) => setPreviousSchoolName(event.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Qualification</label>
              <input
                type="text"
                className="border rounded w-full p-2"
                placeholder="Please enter your qualification!..."
                onChange={(event) =>
                  setPreviousQualification(event.target.value)
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Remarks</label>
              <textarea
                className="border rounded w-full p-2 resize-none"
                rows="3"
                placeholder="Write here!..."
                onChange={(event) => setRemarks(event.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        {/* Submit Button */}
        {progressStatus ? (
          <div className="flex justify-center items-center min-h-[80px]">
            <button
              type="button"
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg cursor-not-allowed"
              disabled
            >
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                />
              </svg>
              Processing…
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-[#143781] text-white px-6 py-2 rounded mt-4"
            >
              Save
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdmissionForm;
