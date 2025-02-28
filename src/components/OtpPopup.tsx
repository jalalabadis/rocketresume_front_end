import React, { useState } from "react";
import { Mail, Check, X } from "lucide-react";
import BASE_URL from "../config/baseUrl";
// Define the props interface
interface OtpPopupProps {
  email: string;
  onClose: () => void;
  onVerify: (otpCode: string) => void; // Accept otpCode as a parameter
}

const OtpPopup = ({ email, onClose, onVerify }: OtpPopupProps) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Function to send OTP
  const handleSendOtp = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/users/sendOTP/${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP sent successfully!");
        setIsOtpSent(true);
      } else {
        setMessage(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      onVerify(otp); // Pass the OTP to the parent component
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">OTP Verification</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!isOtpSent ? (
          <div>
            <p className="text-gray-600 mb-4">
              We will send an OTP to your email <strong>{email}</strong>.
            </p>
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Enter the OTP sent to your email <strong>{email}</strong>.
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              {isLoading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </div>
        )}

        {message && (
          <div
            className={`mt-4 p-2 rounded-lg text-center ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpPopup;
