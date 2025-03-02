import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  User,
  Layout,
  Check,
  Star,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { Save, ChevronRight, ChevronLeft, Download } from "lucide-react";
import axios from "axios";
import BASE_URL from "../config/baseUrl";

const LandingPage = () => {

  useEffect(()=>{
    const ms = Date.now();
    let pageTrafficID;
    axios.post(`${BASE_URL}/traffic/start`, 
      {url: window.location.href})
    .then(res=>{
      pageTrafficID = res.data.pageTrafficID;
      console.log(pageTrafficID)
    })
    .catch(err=>{
      console.log(err)
    })

     // ✅ **beforeunload ইভেন্ট দিয়ে নিশ্চিত করুন যে সর্বশেষ সময় আপডেট হচ্ছে**
     const updateVisitTime = () => {
      if (!pageTrafficID) return;
      const count = Math.floor((Date.now() - ms) / 1000);
    
      console.log("Updating Traffic:", count, pageTrafficID); 
    
      axios.post(`${BASE_URL}/traffic/end`, { pageTrafficID, count });
    };
    

    window.addEventListener("beforeunload", updateVisitTime);

     // Cleanup function: যখন ইউজার পেজ ছাড়বে
     return () => {
      window.removeEventListener("beforeunload", updateVisitTime);
      updateVisitTime(); // নিশ্চিত করুন যে Firebase-এ আপডেট যাচ্ছে
    };
  },[]);

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading animate-slide-down">
              Create Your Professional Resume
              <br />
              in Minutes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-slide-up">
              Stand out from the crowd with our AI-powered Rocket Resume
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
              <Link
                to="/dashboard"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition duration-300 shadow-lg hover:shadow-xl"
              >
                {/* <LayoutDashboard className="w-5 h-5 mr-2" /> */}
                Start From Scratch
              </Link>
              {/* <Link
                to="/templates"
                className="bg-primary-700/80 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition duration-300 border border-primary-500"
              >
                View Templates
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Why Choose Rocket Resume?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create stunning resumes that get you noticed with our powerful
              features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                50K+
              </div>
              <div className="text-gray-600">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                98%
              </div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                4.9/5
              </div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: <Layout className="h-8 w-8" />,
    title: "Professional Templates",
    description:
      "Choose from our collection of ATS-friendly templates designed by HR experts",
  },
  {
    icon: <Star className="h-8 w-8" />,
    title: "AI-Powered Suggestions",
    description: "Get smart content suggestions to make your resume stand out",
  },
  {
    icon: <Download className="h-8 w-8" />,
    title: "Easy Export",
    description:
      "Download your resume in multiple formats including PDF, Word, and TXT",
  },
];

const pricingPlans = [
  {
    name: "Basic",
    price: "0",
    period: "month",
    features: [
      "1 Resume Template",
      "Basic Export Options",
      "Limited Storage",
      "Email Support",
    ],
  },
  {
    name: "Pro",
    price: "15",
    period: "month",
    popular: true,
    features: [
      "All Templates",
      "AI Suggestions",
      "Unlimited Storage",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise",
    price: "29",
    period: "month",
    features: [
      "Custom Templates",
      "Team Management",
      "API Access",
      "24/7 Support",
    ],
  },
];

export default LandingPage;
