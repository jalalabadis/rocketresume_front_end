// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Mail, Lock, User, ArrowRight, FileText, Check } from "lucide-react";
// import BASE_URL from "../config/baseUrl"; // Import the base URL
// import OtpPopup from "../components/OtpPopup"; // Import the OTP popup

// const Signup = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [name, setName] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showOtpPopup, setShowOtpPopup] = useState(false); // State for OTP popup visibility
//   const navigate = useNavigate();

//   // Static values to be sent with each user
//   const staticRole = "person";
//   const staticPhno = "12345678990";

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     setError("");
//     setShowOtpPopup(true); // Show OTP popup
//   };

//   const handleOtpVerify = async (otpCode: string) => {
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`${BASE_URL}/users/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//           role: staticRole, // Send static role "person"
//           name,
//           phno: staticPhno, // Send static phone number "12345678990"
//           otpCode, // Include the OTP in the request body
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         navigate("/Login"); // Redirect on successful registration
//       } else {
//         setError(data.message || "Registration failed");
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//       setShowOtpPopup(false); // Close OTP popup
//     }
//   };

//   const features = [
//     "Create unlimited resumes",
//     "Access to premium templates",
//     "AI-powered suggestions",
//     "Export to multiple formats",
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
//       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
//       <div className="relative flex min-h-screen">
//         {/* Left side - Form */}
//         <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
//           <div className="mx-auto w-full max-w-sm lg:w-96">
//             <h2 className="mt-6 text-3xl font-extrabold text-white font-heading">
//               Create your account
//             </h2>
//             <p className="mt-2 text-sm text-primary-100">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="font-medium text-white hover:text-primary-50"
//               >
//                 Sign in
//               </Link>
//             </p>

//             {error && (
//               <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//                 {error}
//               </div>
//             )}

//             <div className="mt-8">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label
//                     htmlFor="name"
//                     className="block text-sm font-medium text-white"
//                   >
//                     Full Name
//                   </label>
//                   <div className="mt-1 relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <User className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="name"
//                       name="name"
//                       type="text"
//                       required
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//                       placeholder="Enter your full name"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block text-sm font-medium text-white"
//                   >
//                     Email address
//                   </label>
//                   <div className="mt-1 relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Mail className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="email"
//                       name="email"
//                       type="email"
//                       required
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//                       placeholder="Enter your email"
//                     />
//                   </div>
//                 </div>

//                 {/* Removed Phone Number and Role input fields */}

//                 <div>
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-medium text-white"
//                   >
//                     Password
//                   </label>
//                   <div className="mt-1 relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Lock className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="password"
//                       name="password"
//                       type="password"
//                       required
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//                       placeholder="Create a password"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="confirmPassword"
//                     className="block text-sm font-medium text-white"
//                   >
//                     Confirm Password
//                   </label>
//                   <div className="mt-1 relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Lock className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       type="password"
//                       required
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//                       placeholder="Confirm your password"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
//                   >
//                     {loading ? "Registering..." : "Create account"}
//                     <span className="absolute right-3 flex items-center">
//                       <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
//                     </span>
//                   </button>
//                 </div>
//               </form>

//               <div className="mt-6">
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-white/10"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right side - Features */}
//         <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:relative">
//           <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10">
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
//               <h3 className="text-xl font-bold mb-6">
//                 Everything you need to succeed
//               </h3>
//               <ul className="space-y-4">
//                 {features.map((feature, index) => (
//                   <li key={index} className="flex items-center">
//                     <div className="flex-shrink-0">
//                       <Check className="h-5 w-5 text-primary-300" />
//                     </div>
//                     <p className="ml-3 text-sm">{feature}</p>
//                   </li>
//                 ))}
//               </ul>

//               <div className="mt-8 p-4 bg-white/5 rounded-xl">
//                 <blockquote>
//                   <p className="text-sm italic">
//                     "This platform helped me land my dream job! The AI
//                     suggestions and professional templates made all the
//                     difference."
//                   </p>
//                   <footer className="mt-2 text-sm font-medium">
//                     - Sarah Johnson, Software Engineer
//                   </footer>
//                 </blockquote>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* OTP Popup */}
//       {showOtpPopup && (
//         <OtpPopup
//           email={email}
//           onClose={() => setShowOtpPopup(false)}
//           onVerify={handleOtpVerify}
//         />
//       )}
//     </div>
//   );
// };

// export default Signup;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, ArrowRight, FileText, Check } from "lucide-react";
import BASE_URL from "../config/baseUrl"; // Import the base URL

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Static values to be sent with each userrrrr
  const staticRole = "person";
  const staticPhno = "12345678990";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: staticRole, // Send static role "person"
          name,
          phno: staticPhno, // Send static phone number "12345678990"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/Login"); // Redirect on successful registration
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Create unlimited resumes",
    "Access to premium templates",
    "AI-powered suggestions",
    "Export to multiple formats",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
      <div className="relative flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <h2 className="mt-6 text-3xl font-extrabold text-white font-heading">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-primary-100">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-white hover:text-primary-50"
              >
                Sign in
              </Link>
            </p>

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white"
                  >
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white"
                  >
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Create a password"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-white"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                  >
                    {loading ? "Registering..." : "Create account"}
                    <span className="absolute right-3 flex items-center">
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:relative">
          <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">
                Everything you need to succeed
              </h3>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-primary-300" />
                    </div>
                    <p className="ml-3 text-sm">{feature}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-white/5 rounded-xl">
                <blockquote>
                  <p className="text-sm italic">
                    "This platform helped me land my dream job! The AI
                    suggestions and professional templates made all the
                    difference."
                  </p>
                  <footer className="mt-2 text-sm font-medium">
                    - Sarah Johnson, Software Engineer
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
