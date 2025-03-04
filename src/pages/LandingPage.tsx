import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
import RESUME1 from '../assets/RESUME1.webp';
import RESUME2 from '../assets/RESUME2.webp';
import RESUME3 from '../assets/RESUME3.webp';

const LandingPage = () => {
  const [zoomResume, setZoomResume]=useState(null);

  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#demo") {
      const element = document.getElementById("demo-resume");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);
///
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
            <span>🚀 Get More Interviews with the #1 AI Resume Creator!</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading animate-slide-down">
            Create a professional CV 
              <br />
              in 5 minutes - Free!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-slide-up">
            Optimized templates for ATS, download as PDF, quick and easy.
            </p>
            <div className="flex flex-col  justify-center items-center gap-4 animate-fade-in">
                     <Link
                      to="/dashboard"
                      className="w-full md:w-60 bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300 shadow-lg hover:shadow-xl"
                    >
                      Create Your Resume
                    </Link>

              {/* <Link
                to="/templates"
                className="bg-primary-700/80 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition duration-300 border border-primary-500"
              >
                View Templates
              </Link> */}

     <div className="text-xs sm:text-base md:text-lg">
                    <div className="mr-1 inline-flex h-3 w-20  bg-opacity-100 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNDkuNzQ4IiB2aWV3Qm94PSIwIC0xMCAxODcuNjczIDE3OS41MDMiIGhlaWdodD0iMjM5LjMzOCIgY2xhc3M9InN2ZWx0ZS03bmhscXYiIHN0eWxlPSJ3aWR0aDogMjBweDtoZWlnaHQ6IDIwcHg7Ij48cGF0aCBmaWxsPSIjRkJCRjI0IiBkPSJNMTg3LjE4MyA1Ny40N2E5Ljk1NSA5Ljk1NSAwIDAwLTguNTg3LTYuODZsLTU0LjE2Ny00LjkxOC0yMS40Mi01MC4xMzRhOS45NzggOS45NzggMCAwMC05LjE3Mi02LjA1MiA5Ljk3MiA5Ljk3MiAwIDAwLTkuMTcyIDYuMDYxbC0yMS40MiA1MC4xMjVMOS4wNyA1MC42MTFhOS45NzMgOS45NzMgMCAwMC04LjU3OCA2Ljg1OCA5Ljk2NCA5Ljk2NCAwIDAwMi45MTcgMTAuNTk2bDQwLjk0NCAzNS45MDgtMTIuMDczIDUzLjE4NGE5Ljk3IDkuOTcgMCAwMDMuODc4IDEwLjI5OEE5Ljk1MyA5Ljk1MyAwIDAwNDIgMTY5LjM1N2E5LjkzNyA5LjkzNyAwIDAwNS4xMTQtMS40MjRsNDYuNzI0LTI3LjkyNSA0Ni43MDcgMjcuOTI1YTkuOTM2IDkuOTM2IDAgMDAxMC45NjQtLjQ3OCA5Ljk3OSA5Ljk3OSAwIDAwMy44OC0xMC4yOThsLTEyLjA3NC01My4xODQgNDAuOTQ0LTM1LjlhOS45OCA5Ljk4IDAgMDAyLjkyNS0xMC42MDR6bTAgMCI+PC9wYXRoPjwvc3ZnPg==')] bg-contain bg-repeat-x bg-[size:20%_100%]"></div>
                     4.9/5 rating based on 
                    <a href="#" 
                      rel="nofollow" target="_blank" className="ml-2 text-blue-400 hover:underline">
                        10,000+ users
                    </a>
                    <div className="mt-2"/>
                    <div className="mr-1 mb-[-0.4rem] inline-flex h-5 w-4  bg-opacity-100 bg-[url('data:image/png;base64,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')] bg-contain bg-repeat-x bg-[size:100%]">
                    </div>
                     Secure & GDPR Compliant – Your data is safe with us!
                     <div className="mt-2"/>
                     <div className="mr-1 inline-flex h-5 w-5  bg-opacity-100 bg-[url('data:image/png;base64,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')] bg-contain bg-repeat-x bg-[size:calc(100%/1)_100%]">
                    </div>
                    Award-winning resume builder – Recognized for excellence!
                </div>

            </div>
          </div>
        </div>
      </div>

      {/* Resume Tamplete Section */}

       <div className=" py-16 bg-gray-50" id="demo-resume" style={{background:'#0082e6'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center ">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading text-white">
            The first step towards your next job starts here
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-white">
            Recruiters assess a CV in just a few seconds. Make a great first impression
            with a professional and impactful template.
            </p>
          </div>

          
          <div className=" flex flex-col items-center py-10">

      {/* CV Templates */}
     
     
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
      <div>
      <div className="flex items-center justify-start gap-2 text-white text-lg font-semibold mb-3">
          <svg className="w-7 h-7" fill="white" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M7.7587 2H16.2413C17.0463 1.99999 17.7106 1.99998 18.2518 2.04419C18.8139 2.09012 19.3306 2.18868 19.816 2.43598C20.5686 2.81947 21.1805 3.43139 21.564 4.18404C21.8113 4.66937 21.9099 5.18608 21.9558 5.74817C22 6.28936 22 6.95372 22 7.75868V16.2413C22 17.0463 22 17.7106 21.9558 18.2518C21.9099 18.8139 21.8113 19.3306 21.564 19.816C21.1805 20.5686 20.5686 21.1805 19.816 21.564C19.3306 21.8113 18.8139 21.9099 18.2518 21.9558C17.7106 22 17.0463 22 16.2413 22H7.75868C6.95372 22 6.28936 22 5.74817 21.9558C5.18608 21.9099 4.66937 21.8113 4.18404 21.564C3.43139 21.1805 2.81947 20.5686 2.43598 19.816C2.18868 19.3306 2.09012 18.8139 2.04419 18.2518C1.99998 17.7106 1.99999 17.0463 2 16.2413V7.7587C1.99999 6.95373 1.99998 6.28937 2.04419 5.74817C2.09012 5.18608 2.18868 4.66937 2.43597 4.18404C2.81947 3.43139 3.43139 2.81947 4.18404 2.43597C4.66937 2.18868 5.18608 2.09012 5.74817 2.04419C6.28937 1.99998 6.95373 1.99999 7.7587 2ZM4 10V16.2C4 17.0566 4.00078 17.6389 4.03755 18.089C4.07337 18.5274 4.1383 18.7516 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.24842 19.8617 5.47262 19.9266 5.91104 19.9624C6.36113 19.9992 6.94342 20 7.8 20H8L8 10H4ZM4 8V7.8C4 6.94342 4.00078 6.36113 4.03755 5.91104C4.07337 5.47262 4.1383 5.24842 4.21799 5.09202C4.40973 4.7157 4.7157 4.40973 5.09202 4.21799C5.24842 4.1383 5.47262 4.07337 5.91104 4.03755C6.36113 4.00078 6.94342 4 7.8 4H16.2C17.0566 4 17.6389 4.00078 18.089 4.03755C18.5274 4.07337 18.7516 4.1383 18.908 4.21799C19.2843 4.40973 19.5903 4.7157 19.782 5.09202C19.8617 5.24842 19.9266 5.47262 19.9624 5.91104C19.9992 6.36113 20 6.94342 20 7.8V8H4ZM10 10V20H16.2C17.0566 20 17.6389 19.9992 18.089 19.9624C18.5274 19.9266 18.7516 19.8617 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C19.8617 18.7516 19.9266 18.5274 19.9624 18.089C19.9992 17.6389 20 17.0566 20 16.2V10H10Z" fill="currentColor"></path>
          </svg>
          Split
        </div>
        <img
        onClick={()=>setZoomResume(RESUME1)}
          src={RESUME1}
          alt="Split CV"
          className="w-full cursor-zoom-in rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:brightness-90"
        />
        </div>
        <div>
      <div className="flex items-center justify-start gap-2 text-white text-lg font-semibold mb-3">
          <svg className="w-7 h-7" fill="white" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M7.7587 2H16.2413C17.0463 1.99999 17.7106 1.99998 18.2518 2.04419C18.8139 2.09012 19.3306 2.18868 19.816 2.43598C20.5686 2.81947 21.1805 3.43139 21.564 4.18404C21.8113 4.66937 21.9099 5.18608 21.9558 5.74817C22 6.28936 22 6.95372 22 7.75868V16.2413C22 17.0463 22 17.7106 21.9558 18.2518C21.9099 18.8139 21.8113 19.3306 21.564 19.816C21.1805 20.5686 20.5686 21.1805 19.816 21.564C19.3306 21.8113 18.8139 21.9099 18.2518 21.9558C17.7106 22 17.0463 22 16.2413 22H7.75868C6.95372 22 6.28936 22 5.74817 21.9558C5.18608 21.9099 4.66937 21.8113 4.18404 21.564C3.43139 21.1805 2.81947 20.5686 2.43598 19.816C2.18868 19.3306 2.09012 18.8139 2.04419 18.2518C1.99998 17.7106 1.99999 17.0463 2 16.2413V7.7587C1.99999 6.95373 1.99998 6.28937 2.04419 5.74817C2.09012 5.18608 2.18868 4.66937 2.43597 4.18404C2.81947 3.43139 3.43139 2.81947 4.18404 2.43597C4.66937 2.18868 5.18608 2.09012 5.74817 2.04419C6.28937 1.99998 6.95373 1.99999 7.7587 2ZM4 10V16.2C4 17.0566 4.00078 17.6389 4.03755 18.089C4.07337 18.5274 4.1383 18.7516 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.24842 19.8617 5.47262 19.9266 5.91104 19.9624C6.36113 19.9992 6.94342 20 7.8 20H16.2C17.0566 20 17.6389 19.9992 18.089 19.9624C18.5274 19.9266 18.7516 19.8617 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C19.8617 18.7516 19.9266 18.5274 19.9624 18.089C19.9992 17.6389 20 17.0566 20 16.2V10H4ZM20 8H4V7.8C4 6.94342 4.00078 6.36113 4.03755 5.91104C4.07337 5.47262 4.1383 5.24842 4.21799 5.09202C4.40973 4.7157 4.7157 4.40973 5.09202 4.21799C5.24842 4.1383 5.47262 4.07337 5.91104 4.03755C6.36113 4.00078 6.94342 4 7.8 4H16.2C17.0566 4 17.6389 4.00078 18.089 4.03755C18.5274 4.07337 18.7516 4.1383 18.908 4.21799C19.2843 4.40973 19.5903 4.7157 19.782 5.09202C19.8617 5.24842 19.9266 5.47262 19.9624 5.91104C19.9992 6.36113 20 6.94342 20 7.8V8Z" fill="currentColor"></path>
          </svg>
          Classic
        </div>
        <img
        onClick={()=>setZoomResume(RESUME2)}
          src={RESUME2}
          alt="Classic CV"
          className="w-full cursor-zoom-in rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:brightness-90"
        /></div>

      <div>
      <div className="flex items-center justify-start gap-2 text-white text-lg font-semibold mb-3">
          <svg className="w-7 h-7" fill="white" viewBox="0 0 24 24">
       <path fillRule="evenodd" clipRule="evenodd" d="M22 7.7587L22 16.2413C22 17.0463 22 17.7106 21.9558 18.2518C21.9099 18.8139 21.8113 19.3306 21.564 19.816C21.1805 20.5686 20.5686 21.1805 19.816 21.564C19.3306 21.8113 18.8139 21.9099 18.2518 21.9558C17.7106 22 17.0463 22 16.2413 22L7.75867 22C6.95371 22 6.28936 22 5.74817 21.9558C5.18608 21.9099 4.66937 21.8113 4.18404 21.564C3.43139 21.1805 2.81947 20.5686 2.43597 19.816C2.18868 19.3306 2.09012 18.8139 2.04419 18.2518C1.99998 17.7106 1.99999 17.0463 2 16.2413L2 7.75868C1.99999 6.95372 1.99998 6.28936 2.04419 5.74817C2.09012 5.18608 2.18868 4.66937 2.43597 4.18404C2.81947 3.43139 3.43139 2.81947 4.18404 2.43597C4.66937 2.18868 5.18608 2.09012 5.74817 2.04419C6.28937 1.99998 6.95373 1.99999 7.7587 2L16.2413 2C17.0463 1.99999 17.7106 1.99998 18.2518 2.04419C18.8139 2.09012 19.3306 2.18868 19.816 2.43597C20.5686 2.81947 21.1805 3.43139 21.564 4.18404C21.8113 4.66937 21.9099 5.18608 21.9558 5.74817C22 6.28937 22 6.95373 22 7.7587ZM4 13L4 16.2C4 17.0566 4.00078 17.6389 4.03755 18.089C4.07337 18.5274 4.1383 18.7516 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.24842 19.8617 5.47262 19.9266 5.91104 19.9624C6.36113 19.9992 6.94342 20 7.8 20L11 20L11 13L4 13ZM11.999 11L4 11L4 7.8C4 6.94342 4.00078 6.36113 4.03755 5.91104C4.07337 5.47262 4.1383 5.24842 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.24842 4.1383 5.47262 4.07337 5.91104 4.03755C6.36113 4.00078 6.94342 4 7.8 4L16.2 4C17.0566 4 17.6389 4.00078 18.089 4.03755C18.5274 4.07337 18.7516 4.1383 18.908 4.21799C19.2843 4.40973 19.5903 4.7157 19.782 5.09202C19.8617 5.24842 19.9266 5.47262 19.9624 5.91104C19.9992 6.36113 20 6.94342 20 7.8L20 11L12.001 11C12.0007 11 11.9993 11 11.999 11C11.9993 11 11.9987 11 11.999 11ZM13 13L13 20L16.2 20C17.0566 20 17.6389 19.9992 18.089 19.9624C18.5274 19.9266 18.7516 19.8617 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C19.8617 18.7516 19.9266 18.5274 19.9624 18.089C19.9992 17.6389 20 17.0566 20 16.2L20 13L13 13Z" fill="currentColor"></path>
          </svg>
          Hybrid
        </div>
        <img
        onClick={()=>setZoomResume(RESUME3)}
          src={RESUME3}
          alt="Hybrid CV"
          className="w-full cursor-zoom-in rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:brightness-90"
        /></div>
      </div>
    </div> 
        </div>
      </div>


      {zoomResume&&<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <span onClick={()=>setZoomResume(null)}  className="absolute top-10 right-10 w-12 h-12 pb-2 flex items-center justify-center text-white text-2xl font-semibold bg-black rounded-full cursor-pointer hover:text-gray-400">×</span>
        <img  src={zoomResume}
             className="h-[90%] w-auto shadow-lg border border-gray-300 rounded-lg cursor-zoom-out"/>
    </div>}

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
