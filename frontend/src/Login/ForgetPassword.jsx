import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
const ForgetPassword = ({ goBack }) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const [otpSent, setOtpSent] = useState(false);
    const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
       setLoader(true);
      const res = await axios.post(`${apiUrl}/user/auth/forgot-password`, {
        email: formData?.email,
      });
      console.log(res, "res");
      if (res?.status === 200) {
        toast.success("Otp send successfully on your email");
        setOtpSent(true);
      }
    } catch (error) {
      if (error?.response?.data?.error === "CREDENTIALS_DO_NOT_MATCH") {
        toast.error("CREDENTIALS_DO_NOT_MATCH");
      } else if (error?.response?.data?.error === "USER_NOT_FOUND") {
        toast.error("Your are not registered!");
      }
    }finally {
      setLoader(false);
    }
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
     setLoader(true)
      const res = await axios.post(`${apiUrl}/user/auth/otp-verify`, {
        email: formData?.email,
        otp: formData?.otp,
        newPassword: formData?.newPassword,
        confirmPassword: formData?.confirmPassword,
      });
      console.log(res, "res resset pass");
      if (res?.status === 200) {
        toast.success("Successfully reset your password");
        goBack()
      }
    } catch (error) {
      console.log(error);
      switch (error?.response?.data.error) {
        case "EMAIL_REQUIRED":
          toast.error("Email is required.");
          break;
        case "OTP_REQUIRED":
          toast.error("Please enter the OTP.");
          break;
        case "PASSWORD_REQUIRED":
          toast.error("New Password and confirm password is required.");
          break;
        case "INVALID_OTP":
          toast.error("OTP does not match.");
          break;
        case "OTP_EXPIRED":
          toast.error("OTP has expired!!!.");
          break;
        case "USER_NOT_FOUND":
          toast.error("You are not registered!");
          break;
        case "PASSWORDS_DO_NOT_MATCH":
          toast.error("Passwords do not match!");
          break;
        default:
          toast.error("Something went wrong.");
      }
      if (error?.response?.data?.error === "CREDENTIALS_DO_NOT_MATCH") {
        toast.error("CREDENTIALS_DO_NOT_MATCH");
      }
    } finally{
      setLoader(false)
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#143781] mb-4">Forget Password</h2>
      <form
        className="space-y-4"
        onSubmit={otpSent ? handleResetPassword : handleSendOtp}
      >
        <div>
          <label className="block text-[#143781] font-semibold mb-1">
            Enter your Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-b-2 border-[#143781] px-3 py-2 rounded focus:outline-none text-[#143781] placeholder-[#143781]"
            placeholder="Enter your email"
            required
          />
        </div>

        {otpSent && (
          <>
            <div>
              <label className="block text-[#143781] font-semibold mb-1">
                OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full border-b-2 border-[#143781] px-3 py-2 rounded focus:outline-none text-[#143781] placeholder-[#143781]"
                placeholder="Enter your otp..."
                required
              />
            </div>
            <div>
              <label className="block text-[#143781] font-semibold mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border-b-2 border-[#143781] px-3 py-2 rounded focus:outline-none text-[#143781] placeholder-[#143781]"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="block text-[#143781] font-semibold mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border-b-2 border-[#143781] px-3 py-2 rounded focus:outline-none text-[#143781] placeholder-[#143781]"
                placeholder="Confirm new password"
                // required
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="bg-[#143781] hover:bg-[#0f2a61] text-white font-bold py-2 px-4 rounded w-1/2 flex justify-center"
          >
            {otpSent ?  <>{loader ? <><Loader loaderText="Saing!!!v"/></>: "Save"}</> : <>{loader ? <><Loader loaderText="Sending Otp!"/></>: "Send"}</>}
          </button>
          <button
            type="button"
            onClick={goBack}
            className="text-sm text-left text-[#143781] underline"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPassword;
