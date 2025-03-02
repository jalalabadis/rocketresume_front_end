import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { ResumeData } from "../types/resume";
import BASE_URL from "../config/baseUrl";
import ResumePreview from "../components/ResumePreview";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { generatePDF } from "../utils/pdfGenerator";
import axios from "axios";


const SavedResumes: React.FC = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [downloadsRemaining, setDownloadsRemaining] = useState<number>(2);
  const [downloadStatus, setDownloadStatus] = useState<{
    [key: string]: { pdf: boolean; word: boolean };
  }>({});
  const [loadingButtons, setLoadingButtons] = useState<{
    [key: string]: { pdf: boolean; word: boolean };
  }>({});
  // Fetch the user's saved resumes
  // useEffect(() => {
  //   const fetchResumes = async () => {
  //     try {
  //       if (!user?.id) {
  //         setError("User not authenticated");
  //         return;
  //       }
  //       const response = await fetch(
  //         `https://resume-servers.vercel.app/resume/addresume/getallresumes/${user.id}`
  //       );
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setResumes(Array.isArray(data) ? data : []);
  //     } catch (err) {
  //       setError(
  //         err instanceof Error ? err.message : "Failed to fetch resumes"
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchResumes();
  // }, [user]);
  useEffect(() => {
    const abortController = new AbortController();

    const fetchResumes = async () => {
      try {
        if (!user?.id) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${BASE_URL}/addresume/getallresumes/${user.id}`,
          { signal: abortController.signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResumes(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch resumes"
          );
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchResumes();

    return () => {
      abortController.abort();
    };
  }, [user]); // Add BASE_URL if it's not constant
  // Check the user's subscription status before allowing download/export
  // const checkSubscription = async (): Promise<boolean> => {
  //   try {
  //     if (!user?.id) return false;
  //     const url = `${BASE_URL}/addresume/check-resume-limit/${user.id}`;
  //     console.log("Checking subscription at:", url);
  //     const response = await fetch(url);
  //     console.log("Response status:", response.status);

  //     // Get the JSON response from the backend
  //     const data = await response.json();
  //     console.log("Subscription response data:", data);

  //     if (!response.ok) {
  //       console.error("Backend returned non-OK status.");
  //       setShowSubscriptionModal(true);
  //       return false;
  //     }

  //     // Check if the backend returned a flag (canGenerate) for subscription
  //     if (!data.canGenerate) {
  //       console.warn("Subscription check failed, canGenerate is false.");
  //       setShowSubscriptionModal(true);
  //       return false;
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error("Subscription check failed with error:", error);
  //     setShowSubscriptionModal(true);
  //     return false;
  //   }
  // };
  // const checkSubscription = async (): Promise<boolean> => {
  //   try {
  //     if (!user?.id) return false;
  //     const url = `${BASE_URL}/addresume/check-resume-limit/${user.id}`;
  //     console.log("Checking subscription at:", url);
  //     const response = await fetch(url);
  //     console.log("Response status:", response.status);

  //     const data = await response.json();
  //     console.log("Subscription response data:", data);

  //     if (!response.ok) {
  //       console.error("Backend returned non-OK status.");
  //       setShowSubscriptionModal(true);
  //       return false;
  //     }

  //     if (!data.canGenerate) {
  //       console.warn("Subscription check failed, canGenerate is false.");
  //       setShowSubscriptionModal(true);
  //       return false;
  //     }

  //     // Update the remaining downloads in state
  //     if (data.downloadsRemaining !== undefined) {
  //       setDownloadsRemaining(data.downloadsRemaining);
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error("Subscription check failed with error:", error);
  //     setShowSubscriptionModal(true);
  //     return false;
  //   }
  // };

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

  const generateResumeHTML = (resumeData: ResumeData): string => {
    const { fullName, email, phone, location, portfolioUrl, aboutMe } =
      resumeData.personalInfo;
    const header = `
         <div class="header">
           <h1>${fullName}</h1>
           <p>${[email, phone, location, portfolioUrl]
             .filter(Boolean)
             .join(" • ")}</p>
         </div>
       `;
    const summary = aboutMe
      ? `
           <div class="section">
             <div class="section-title">PROFESSIONAL SUMMARY</div>
             <div class="section-content">${aboutMe}</div>
           </div>
         `
      : "";
    const experience = resumeData.experience
      .map((exp) => {
        const startDate = new Date(exp.startDate).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        const endDate = exp.endDate
          ? new Date(exp.endDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : "Present";
        const achievements =
          exp.achievements &&
          exp.achievements.length > 0 &&
          exp.achievements[0] !== ""
            ? `<ul>${exp.achievements
                .map((ach) => `<li>${ach}</li>`)
                .join("")}</ul>`
            : "";
        return `
             <div class="subsection">
               <div class="subsection-title">${exp.position}</div>
               <div class="subsection-company">${exp.company}</div>
               <div class="subsection-dates">${startDate} - ${endDate}</div>
               <div class="section-content">${exp.description}</div>
               ${achievements}
             </div>
           `;
      })
      .join("");
    const experienceSection = experience
      ? `
           <div class="section">
             <div class="section-title">EXPERIENCE</div>
             ${experience}
           </div>
         `
      : "";
    const education = resumeData.education
      .map((edu) => {
        return `
             <div class="subsection">
               <div class="subsection-title">${edu.degree} in ${
          edu.fieldOfStudy
        }</div>
               <div class="subsection-company">${edu.school} - ${
          edu.graduationYear
        }</div>
               ${
                 edu.description
                   ? `<div class="section-content">${edu.description}</div>`
                   : ""
               }
             </div>
           `;
      })
      .join("");
    const educationSection = education
      ? `
           <div class="section">
             <div class="section-title">EDUCATION</div>
             ${education}
           </div>
         `
      : "";
    const skills =
      resumeData.skills && resumeData.skills.length > 0
        ? resumeData.skills.join(" • ")
        : "";
    const skillsSection = skills
      ? `
           <div class="section">
             <div class="section-title">SKILLS</div>
             <div class="section-content">${skills}</div>
           </div>
         `
      : "";
    const interests =
      resumeData.interests && resumeData.interests.length > 0
        ? resumeData.interests.join(" • ")
        : "";
    const interestsSection = interests
      ? `
           <div class="section">
             <div class="section-title">INTERESTS</div>
             <div class="section-content">${interests}</div>
           </div>
         `
      : "";
    const certifications =
      resumeData.certifications && resumeData.certifications.length > 0
        ? resumeData.certifications.join(" • ")
        : "";
    const certificationsSection = certifications
      ? `
           <div class="section">
             <div class="section-title">CERTIFICATIONS</div>
             <div class="section-content">${certifications}</div>
           </div>
         `
      : "";
    const additionalSections =
      resumeData.additionalSections && resumeData.additionalSections.length > 0
        ? resumeData.additionalSections
            .map((sec) => {
              if (sec.title && sec.content) {
                return `
                     <div class="section">
                       <div class="section-title">${sec.title.toUpperCase()}</div>
                       <div class="section-content">${sec.content}</div>
                     </div>
                   `;
              }
              return "";
            })
            .join("")
        : "";
    const fullHTML = `
         <html>
           <head>
             <meta charset="utf-8">
             <title>Resume</title>
             <style>
               body {
                 font-family: Helvetica, Arial, sans-serif;
                 color: #333333;
                 margin: 20px;
                 padding: 0;
               }
               .header {
                 text-align: center;
                 background-color: #1C3461;
                 padding: 20px;
                 color: #ffffff;
                 margin-bottom: 20px;
               }
               .header h1 {
                 font-size: 32px;
                 margin: 0;
               }
               .header p {
                 font-size: 11px;
                 margin: 5px 0 0;
               }
               .section {
                 margin-bottom: 20px;
               }
               .section-title {
                 font-size: 18px;
                 font-weight: bold;
                 color: #C6962D;
                 margin-bottom: 5px;
                 border-bottom: 2px solid #C6962D;
                 padding-bottom: 5px;
               }
               .section-content {
                 font-size: 11px;
                 line-height: 1.5;
               }
               .subsection {
                 margin-bottom: 15px;
               }
               .subsection-title {
                 font-size: 14px;
                 font-weight: bold;
                 color: #1C3461;
               }
               .subsection-company {
                 font-size: 11px;
                 font-weight: bold;
                 color: #C6962D;
               }
               .subsection-dates {
                 font-size: 10px;
                 color: #666666;
               }
               ul {
                 padding-left: 20px;
                 margin: 5px 0;
                 list-style-type: disc;
               }
               li {
                 font-size: 11px;
                 line-height: 1.5;
               }
             </style>
           </head>
           <body>
             ${header}
             ${summary}
             ${experienceSection}
             ${educationSection}
             ${skillsSection}
             ${interestsSection}
             ${certificationsSection}
             ${additionalSections}
           </body>
         </html>
       `;
    return fullHTML;
  };

  const handleExport = async (resume: ResumeData, format: "pdf" | "html") => {
    // Remove the checkSubscription logic
    setLoadingButtons((prev) => ({
      ...prev,
      [resume.id]: {
        ...prev[resume.id],
        [format]: true,
      },
    }));

    try {
      let blob: Blob;
      let extension: string;

      switch (format) {
        case "pdf":
          blob = await generatePDF(resume);
          extension = "pdf";
          break;
        case "html":
          const html = generateResumeHTML(resume);
          blob = new Blob(["\ufeff", html], { type: "application/msword" });
          extension = "doc";
          break;
        default:
          throw new Error("Invalid export format");
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.personalInfo.fullName.replace(
        /\s+/g,
        "_"
      )}_Resume.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadStatus((prev) => ({
        ...prev,
        [resume.id]: {
          ...prev[resume.id],
          [format]: true,
        },
      }));

      setDownloadsRemaining((prev) => prev - 1);
    } catch (error) {
      console.error(`${format.toUpperCase()} export failed:`, error);
      alert(`Failed to generate ${format.toUpperCase()}. Please try again.`);
    } finally {
      setLoadingButtons((prev) => ({
        ...prev,
        [resume.id]: {
          ...prev[resume.id],
          [format]: false,
        },
      }));
    }
  };

  const exportToHTML = (htmlContent: string) => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.html";
    link.click();
  };

  // Handle PDF download with subscription check
  const handleDownload = async (resume: ResumeData) => {
    try {
      const pdfBlob = await generatePDF(resume);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.personalInfo.fullName.replace(
        /\s+/g,
        "_"
      )}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };
  // Handle subscription purchase process
  const createCheckoutSession = async (priceId: string, planName: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId,
            planName,
            userId: user?.id,
          }),
        }
      );
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Missing checkout URL");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout process. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 text-center">
          Loading resumes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 text-red-500 text-center">
          Error: {error}
        </div>
      </div>
    );
  }

  // return (
  //   <div className="min-h-screen bg-gray-50 relative">
  //     <Navbar />
  //     <div className="max-w-7xl mx-auto py-8 px-4">
  //       <div className="flex justify-between items-center mb-8 mt-20">
  //         <h1 className="text-3xl font-bold text-gray-900">Saved Resumes</h1>
  //         <Link
  //           to="/dashboard"
  //           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
  //         >
  //           Back to Dashboard
  //         </Link>
  //       </div>

  //       {resumes.length === 0 ? (
  //         <div className="text-center text-gray-500 py-12">
  //           <p className="text-lg">No resumes found.</p>
  //           <p className="mt-2">Create your first resume in the dashboard!</p>
  //         </div>
  //       ) : (
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-24">
  //           {resumes.map((resume) => (
  //             <div
  //               key={resume._id}
  //               className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
  //             >
  //               <div className="p-6">
  //                 <h2 className="text-xl font-semibold mb-2">
  //                   {resume.personalInfo.fullName || "Untitled Resume"}
  //                 </h2>
  //                 <p className="text-sm text-gray-500 mb-4">
  //                   Created:{" "}
  //                   {new Date(resume.createdAt).toLocaleDateString("en-US", {
  //                     year: "numeric",
  //                     month: "long",
  //                     day: "numeric",
  //                   })}
  //                 </p>
  //                 <div className="space-y-3">
  //                   <button
  //                     onClick={() => {
  //                       setSelectedResume(resume);
  //                       setShowPreviewModal(true);
  //                     }}
  //                     className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
  //                   >
  //                     Preview Resume
  //                   </button>
  //                   <button
  //                     onClick={() => handleExport(resume, "pdf")}
  //                     disabled={
  //                       downloadStatus[resume.id]?.pdf ||
  //                       downloadsRemaining === 0 ||
  //                       loadingButtons[resume.id]?.pdf
  //                     }
  //                     className={`w-full px-4 py-2 ${
  //                       downloadStatus[resume.id]?.pdf ||
  //                       downloadsRemaining === 0
  //                         ? "bg-gray-400"
  //                         : "bg-blue-600"
  //                     } text-white rounded-md transition-colors flex items-center justify-center`}
  //                   >
  //                     {loadingButtons[resume.id]?.pdf ? (
  //                       "Downloading..."
  //                     ) : (
  //                       <>
  //                         <Download className="w-5 h-5 mr-2" />
  //                         Download PDF
  //                       </>
  //                     )}
  //                   </button>

  //                   <button
  //                     onClick={() => handleExport(resume, "html")}
  //                     disabled={
  //                       downloadStatus[resume.id]?.word ||
  //                       downloadsRemaining === 0 ||
  //                       loadingButtons[resume.id]?.word
  //                     }
  //                     className={`w-full px-4 py-2 ${
  //                       downloadStatus[resume.id]?.word ||
  //                       downloadsRemaining === 0
  //                         ? "bg-gray-400"
  //                         : "bg-purple-600"
  //                     } text-white rounded-md transition-colors flex items-center justify-center`}
  //                   >
  //                     {loadingButtons[resume.id]?.word ? (
  //                       "Downloading..."
  //                     ) : (
  //                       <>
  //                         <Download className="w-5 h-5 mr-2" />
  //                         Download Word (Editable)
  //                       </>
  //                     )}
  //                   </button>
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       )}

  //       {/* Subscription Modal */}
  //       {showSubscriptionModal && (
  //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
  //           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
  //             <h2 className="text-2xl font-bold text-gray-900 mb-4">
  //               Upgrade Your Plan
  //             </h2>
  //             <p className="text-gray-600 mb-6">
  //               To download resumes, please choose a subscription plan:
  //             </p>
  //             <div className="space-y-4">
  //               <div className="border border-gray-200 rounded-lg p-4">
  //                 <h3 className="text-lg font-semibold mb-2">
  //                   Unlimited Plan ($149)
  //                 </h3>
  //                 <p className="text-sm text-gray-500 mb-4">
  //                   Create unlimited resumes with full editing capabilities
  //                 </p>
  //                 <button
  //                   onClick={() =>
  //                     createCheckoutSession(
  //                       "price_1Qs3JLGcVjZeEueAgz79KCf0",
  //                       "unlimited"
  //                     )
  //                   }
  //                   className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
  //                 >
  //                   Choose Unlimited
  //                 </button>
  //               </div>
  //               <div className="border border-gray-200 rounded-lg p-4">
  //                 <h3 className="text-lg font-semibold mb-2">
  //                   Single Resume ($29)
  //                 </h3>
  //                 <p className="text-sm text-gray-500 mb-4">
  //                   Create and download one resume (no future edits)
  //                 </p>
  //                 <button
  //                   onClick={() =>
  //                     createCheckoutSession(
  //                       "price_1Qs8oVGcVjZeEueACD6NoJNN",
  //                       "one-time"
  //                     )
  //                   }
  //                   className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
  //                 >
  //                   Choose Single
  //                 </button>
  //               </div>
  //             </div>
  //             <button
  //               onClick={() => setShowSubscriptionModal(false)}
  //               className="mt-6 text-sm text-gray-500 hover:text-gray-700"
  //             >
  //               Maybe later
  //             </button>
  //           </div>
  //         </div>
  //       )}

  //       {/* Resume Preview Modal */}
  //       {showPreviewModal && selectedResume && (
  //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4  pt-24">
  //           <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
  //             <div className="p-6">
  //               <div className="flex justify-between items-center mb-6">
  //                 <h2 className="text-2xl font-bold text-gray-900">
  //                   Resume Preview
  //                 </h2>
  //                 <button
  //                   onClick={() => setShowPreviewModal(false)}
  //                   className="text-gray-500 hover:text-gray-700"
  //                 >
  //                   ✕
  //                 </button>
  //               </div>
  //               <div className="overflow-y-auto max-h-[70vh]">
  //                 <ResumePreview data={selectedResume} />
  //               </div>
  //               <div className="mt-6 flex justify-end space-x-3">
  //                 <button
  //                   onClick={() => setShowPreviewModal(false)}
  //                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
  //                 >
  //                   Close
  //                 </button>
  //                 <div className="mt-6 flex justify-end space-x-3">
  //                   <button
  //                     onClick={() => handleExport(selectedResume, "pdf")}
  //                     disabled={
  //                       downloadStatus[selectedResume.id]?.pdf ||
  //                       downloadsRemaining === 0 ||
  //                       loadingButtons[selectedResume.id]?.pdf
  //                     }
  //                   >
  //                     {loadingButtons[selectedResume.id]?.pdf
  //                       ? "Downloading..."
  //                       : "PDF"}
  //                   </button>
  //                   <button
  //                     onClick={() => handleExport(selectedResume, "html")}
  //                     disabled={
  //                       downloadStatus[selectedResume.id]?.word ||
  //                       downloadsRemaining === 0 ||
  //                       loadingButtons[selectedResume.id]?.word
  //                     }
  //                   >
  //                     {loadingButtons[selectedResume.id]?.word
  //                       ? "Downloading..."
  //                       : "Word"}
  //                   </button>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8 mt-20">
          <h1 className="text-3xl font-bold text-gray-900">Saved Resumes</h1>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg">No resumes found.</p>
            <p className="mt-2">Create your first resume in the dashboard!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-24">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {resume.personalInfo.fullName || "Untitled Resume"}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Created:{" "}
                    {new Date(resume.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setSelectedResume(resume);
                        setShowPreviewModal(true);
                      }}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Preview Resume
                    </button>
                    <button
                      onClick={() => handleExport(resume, "pdf")}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md transition-colors flex items-center justify-center hover:bg-blue-700"
                    >
                      {loadingButtons[resume.id]?.pdf ? (
                        "Downloading..."
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Download PDF
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleExport(resume, "html")}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-md transition-colors flex items-center justify-center hover:bg-purple-700"
                    >
                      {loadingButtons[resume.id]?.word ? (
                        "Downloading..."
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Download Word (Editable)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subscription Modal */}
        {showSubscriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Upgrade Your Plan
              </h2>
              <p className="text-gray-600 mb-6">
                To download resumes, please choose a subscription plan:
              </p>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Unlimited Plan ($149)
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Create unlimited resumes with full editing capabilities
                  </p>
                  <button
                    onClick={() =>
                      createCheckoutSession(
                        "price_1Qw4xzGcVjZeEueAk0fAB9A6",
                        "unlimited"
                      )
                    }
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Choose Unlimited
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Single Resume ($29)
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Create and download one resume (no future edits)
                  </p>
                  <button
                    onClick={() =>
                      createCheckoutSession(
                        "price_1Qw4xTGcVjZeEueAAUjyRrbc",
                        "one-time"
                      )
                    }
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Choose Single
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="mt-6 text-sm text-gray-500 hover:text-gray-700"
              >
                Maybe later
              </button>
            </div>
          </div>
        )}

        {/* Resume Preview Modal */}
        {showPreviewModal && selectedResume && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4  pt-24">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Resume Preview
                  </h2>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[70vh]">
                  <ResumePreview data={selectedResume} />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => handleExport(selectedResume, "pdf")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {loadingButtons[selectedResume.id]?.pdf
                        ? "Downloading..."
                        : "PDF"}
                    </button>
                    <button
                      onClick={() => handleExport(selectedResume, "html")}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      {loadingButtons[selectedResume.id]?.word
                        ? "Downloading..."
                        : "Word"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedResumes;
