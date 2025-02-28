import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const SubscriptionSuccess: React.FC = () => {
  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col justify-center items-center p-6">
      {/* Success Icon */}
      <div className="mb-6 p-6 bg-green-100 rounded-full animate-bounce">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>

      {/* Success Messageeeee */}
      <h1 className="text-4xl font-bold text-green-700 mb-4 text-center">
        Purchase Successful!
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
        Your payment has been processed successfully. Now, you will be
        redirected to the final step (Point 7) of your resume.
        <br />
        👉 Click the "Save Resume" button again to complete the process. Once
        saved, you will be able to view your purchased resume.
      </p>

      <Link
        to="/dashboard"
        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-lg hover:shadow-md relative z-20"
      >
        <span> GO TO POINT 7</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </Link>

      {/* Decorative background - now behind content */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
