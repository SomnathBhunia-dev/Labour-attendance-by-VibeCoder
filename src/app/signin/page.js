"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStateValue } from "@/context/context";
import { auth } from "@/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function SignIn() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const router = useRouter();
  const { signIn } = useStateValue();

  useEffect(() => {
    // Initialize reCAPTCHAVerifier
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // Not needed for invisible reCAPTCHA
        },
        "expired-callback": () => {
          setError("reCAPTCHA expired. Please try again.");
          setLoading(false);
        },
      });
    }
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic mobile number validation
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    const appVerifier = window.recaptchaVerifier;
    const phoneNumber = `+91${mobileNumber}`;

    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(`Failed to send OTP: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic OTP validation
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      setLoading(false);
      return;
    }

    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otp);
        // User successfully signed in
        // Context will automatically update via onAuthStateChanged
        router.push("/dashboard");
      } else {
        setError("OTP confirmation result not found. Please resend OTP.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(`Failed to verify OTP: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500">Sign in to access your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-6">
              <label htmlFor="mobile" className="block mb-2 text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">+91</span>
                </div>
                <input
                  type="tel"
                  id="mobile"
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-2.5"
                  placeholder="98765 43210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-blue-600 font-medium mt-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                * This is a demo project. Please use this default mobile number to login: <span className="font-bold text-blue-800">77889 95544</span>
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-400"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <div id="recaptcha-container"></div>
          </form>
        ) : (
          <form onSubmit={handleSignIn}>
            <div className="mb-6">
              <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                An OTP has been sent to {mobileNumber}.
              </p>
              <p className="text-xs text-blue-600 font-medium mt-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                * This is a universal OTP for this demo, please use: <span className="font-bold text-blue-800">789456</span>
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-400"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-gray-600 hover:text-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2"
            >
              Change Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}