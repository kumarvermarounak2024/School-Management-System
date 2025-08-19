import React, { useEffect, useState } from "react";
import ForgetPassword from "./ForgetPassword";
import logo from "../assets/images/Mansharplogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Loader";
const LoginForm = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("email");
  const [otpSent, setOtpSent] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const [resendOtpLoader, setResendOtpLoader] = useState(false);

  const handleSendOtp = async () => {
    try {
      setLoader(true);
      const res = await axios.post(`${apiUrl}/user/auth/send-login-otp`, {
        email,
      });
      console.log(res, "res");
      if (res?.status === 200) {
        setOtpSent(true);
        // navigate(`/otp-verify?email=${email}`);
        toast.success("Otp send successfully on your email");
      }
    } catch (error) {
      if (error?.response?.data?.error === "CREDENTIALS_DO_NOT_MATCH") {
        toast.error("CREDENTIALS_DO_NOT_MATCH");
      } else if (error?.response?.data?.error === "USER_NOT_FOUND") {
        toast.error("Your are not registered!");
      }
    } finally {
      setLoader(false);
    }
  };

  const handleReSendOtp = async () => {
    try {
      setResendOtpLoader(true);
      const res = await axios.post(`${apiUrl}/user/auth/send-login-otp`, {
        email,
      });
      console.log(res, "res");
      if (res?.status === 200) {
        // navigate(`/otp-verify?email=${email}`);
        toast.success("Otp send successfully on your email");
      }
    } catch (error) {
      if (error?.response?.data?.error === "CREDENTIALS_DO_NOT_MATCH") {
        toast.error("CREDENTIALS_DO_NOT_MATCH");
      } else if (error?.response?.data?.error === "USER_NOT_FOUND") {
        toast.error("Your are not registered!");
      }
    } finally {
      setResendOtpLoader(false);
    }
  };

  // /login user
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      console.log(email, password, "credencials");
      const res = await axios.post(`${apiUrl}/user/auth/login`, {
        email,
        password,
      });
      console.log(res, "res");
      if (res?.status === 200) {
        localStorage.setItem("token", res?.data?.token);
        toast.success("login successfully");
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (error) {
      if (error?.response?.data?.error === "CREDENTIALS_DO_NOT_MATCH") {
        toast.error("CREDENTIALS_DO_NOT_MATCH");
      } else if (error?.response?.data?.error === "USER_NOT_FOUND") {
        toast.error("Your are not registered!");
      } else if (error?.response?.data?.error === "Inactive_User") {
        toast.error("You are not active user!!!");
      } else if (error?.response?.data?.error === "ROLE_REQUIRED") {
        toast.error("Please contact to admin!. Your role is not assigned!");
      }
    } finally {
      setLoader(false);
    }
  };

  // // /login user with otp
  const handleLoginWithOtp = async (e) => {
    e.preventDefault();
    console.log(email, otp);
    try {
      setLoader(true);
      const res = await axios.post(`${apiUrl}/user/auth/login-with-otp`, {
        email,
        otp,
      });
      if (res?.status === 200) {
        localStorage.setItem("token", res?.data?.token);
        toast.success("Successfully login...!!!");
        navigate("/");
        setOtpSent(true);
      }
    } catch (error) {
      switch (error?.response?.data.error) {
        case "OTP_NOT_REQUESTED":
          toast.error("Please request an OTP first.");
          break;
        case "OTP_EXPIRED":
          toast.error("Your OTP has expired. Please request a new one.");
          break;
        case "OTP_INVALID":
          toast.error("Invalid OTP. Please try again.");
          break;
        case "USER_NOT_FOUND":
          toast.error("You are not registered!");
          break;
        case "Inactive_User":
          toast.error("You are not active user!!!");
          break;
        case "CREDENTIALS_DO_NOT_MATCH":
          toast.error("Credencial do not match!!!");
          break;
          case "ROLE_REQUIRED":
          toast.error("Please contact to admin!. Your role is not assigned!");
          break;
        default:
          toast.error("Something went wrong.");
      }
    } finally {
      setLoader(false);
    }
  };
  // On mount: decode token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <>
      <div className="flex h-screen bg-gradient-to-b from-[#143781] via-[#34599a] to-[#e3ecf9] items-center justify-center">
        <div className="w-full max-w-md bg-gray-100 rounded-xl sm:p-5 shadow-xl">
          <header>
            <img className="w-32 mx-auto mb-1" src={logo} alt="Logo" />
          </header>

          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 rounded-l font-semibold transition-all duration-300 ${
                activeTab === "email"
                  ? "bg-[#143781] text-white"
                  : "bg-gray-200 text-[#143781]"
              }`}
              onClick={() => {
                setActiveTab("email");
                setOtpSent(false);
                setShowForgetPassword(false);
              }}
            >
              Email
            </button>
            <button
              className={`px-4 py-2 rounded-r font-semibold transition-all duration-300 ${
                activeTab === "otp"
                  ? "bg-[#143781] text-white"
                  : "bg-gray-200 text-[#143781]"
              }`}
              onClick={() => {
                setActiveTab("otp");
                setOtpSent(false);
                setShowForgetPassword(false);
              }}
            >
              OTP
            </button>
          </div>

          {!showForgetPassword ? (
            <>
              {activeTab === "email" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label
                      className="block mb-2 text-[#143781]"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <input
                      className="w-full p-2 mb-2 text-[#143781] border-b-2 border-[#143781] outline-none focus:bg-gray-200 placeholder-[#143781]"
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block mb-2 text-[#143781]"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className="w-full p-2 mb-4 text-[#143781] border-b-2 border-[#143781] outline-none focus:bg-gray-200 placeholder-[#143781]"
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#143781] hover:bg-pink-700 text-white font-bold py-2 px-4 mb-4 rounded flex justify-center"
                  >
                    {loader ? <Loader loaderText="submiting" /> : " Submit"}
                  </button>
                  <button
                    type="button"
                    className="text-sm text-[#143781] hover:text-pink-700 underline"
                    onClick={() => setShowForgetPassword(true)}
                  >
                    Forget Password?
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLoginWithOtp} className="space-y-4">
                  {/* login with otp */}
                  <div>
                    <label
                      className="block mb-2 text-[#143781]"
                      htmlFor="mobile"
                    >
                      Email ID
                    </label>
                    <input
                      className="w-full p-2 mb-2 text-[#143781] border-b-2 border-[#143781] outline-none focus:bg-gray-200 placeholder-[#143781]"
                      type="email"
                      id="mobile"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your Email ID"
                      required
                    />
                  </div>

                  {!otpSent && (
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="bg-[#143781] hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                      >
                        {loader ? (
                          <Loader loaderText="Sending OTP" />
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                      <button
                        type="button"
                        className="text-sm text-[#143781] hover:text-pink-700 underline"
                        onClick={() => setShowForgetPassword(true)}
                      >
                        Forget Password?
                      </button>
                    </div>
                  )}

                  {otpSent && (
                    <>
                      <div>
                        <button
                          type="button"
                          onClick={handleReSendOtp}
                          className="block mb-2 text-[#5436ed] cursor-pointer p-2"
                        >
                          {resendOtpLoader ? (
                            <Loader loaderText="Sending OTP!" />
                          ) : (
                            "Resend OTP!"
                          )}
                        </button>
                      </div>
                      <div>
                        <label
                          className="block mb-2 text-[#143781]"
                          htmlFor="otp"
                        >
                          Enter OTP
                        </label>
                        <input
                          className="w-full p-2 mb-4 text-[#143781] border-b-2 border-[#143781] outline-none focus:bg-gray-200 placeholder-[#143781]"
                          type="text"
                          id="otp"
                          name="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter the OTP"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#143781] hover:bg-pink-700 text-white font-bold py-2 px-4 mb-2 rounded flex justify-center"
                      >
                        {loader ? <Loader loaderText="Submiting" /> : "Submit"}
                      </button>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="text-sm text-[#143781] hover:text-pink-700 underline"
                          onClick={() => setShowForgetPassword(true)}
                        >
                          Forget Password?
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </>
          ) : (
            <ForgetPassword goBack={() => setShowForgetPassword(false)} />
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginForm;
