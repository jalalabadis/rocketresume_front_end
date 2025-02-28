import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const SubscriptionFailed: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Subscription Unsuccessful
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your subscription was not successful or is inactive. Please subscribe to
        access this feature.
      </p>
    </div>
  );
};

export default SubscriptionFailed;
