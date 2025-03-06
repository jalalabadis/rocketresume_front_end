import React, { useState, useEffect } from "react";
import {
  Save,
  ChevronRight,
  ChevronLeft,
  Download,
  Loader,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ResumePreview from "../components/ResumePreview";
import PersonalDetailsForm from "../components/resume/PersonalDetailsForm";
import ExperienceForm from "../components/resume/ExperienceForm";
import EducationForm from "../components/resume/EducationForm";
import SkillsForm from "../components/resume/SkillsForm";
import InterestsForm from "../components/resume/InterestsForm";
import AdditionalSectionsForm from "../components/resume/AdditionalSectionsForm";
import Login from "./Login";
import { generatePDF } from "../utils/pdfGenerator";
import { useResumeEnhancer } from "../hooks/useResumeEnhancer";
import { ResumeData } from "../types/resume";
import { useAuth } from "../context/AuthContext";
import BASE_URL from "../config/baseUrl";
import OpenAI from "openai";
import axios from "axios";

// Instantiate the OpenAI client.
const openai = new OpenAI({
  apiKey:
    import.meta.env.VITE_NEXT_PUBLIC_OPENAI_API_KEY ||
    "YOUR_OPENAI_API_KEY_HERE",
  dangerouslyAllowBrowser: true,
});

const LOCAL_STORAGE_KEY = "resumeDraftData";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isEnhancing } = useResumeEnhancer();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showPreviewResume, setPreviewResume] = useState<boolean>(false);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [resumeSaved, setResumeSaved] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); //
  const [loadingButtons, setLoadingButtons] = useState<{
      [key: string]: { pdf: boolean; word: boolean };
    }>({});
  // For subscription modal
  // const getFirstIncompleteStep = (formData: any): number => {
  //   // Step 1: Personal Details
  //   if (!formData.personalInfo.fullName || !formData.personalInfo.email)
  //     return 1;

  //   // Step 2: Work History
  //   if (formData.experience.length === 0) return 2;

  //   // Step 3: Education
  //   if (formData.education.length === 0) return 3;

  //   // Step 4: Skills
  //   if (formData.skills.length === 0) return 4;

  //   // Step 5: Interests
  //   if (formData.interests.length === 0) return 5;

  //   // Step 6: Additional Sections
  //   if (formData.additionalSections.length === 0) return 6;

  //   // Step 7: Review (all steps are complete)
  //   return 7;
  // };
  const getFirstIncompleteStep = (formData: any): number => {
    // Step 1: Personal Details
    if (!formData.personalInfo.fullName || !formData.personalInfo.email)
      return 1;

    // Step 2: Work History
    if (formData.experience.length === 0) return 2;

    // Step 3: Education
    if (formData.education.length === 0) return 3;

    // Step 4: Skills
    if (formData.skills.length === 0) return 4;

    // Step 5: Interests
    if (formData.interests.length === 0) return 5;

    // Step 6: Additional Sections (optional, so skip this check)
    // if (formData.additionalSections.length === 0) return 6; // Remove this line

    // Step 7: Review (all steps are complete)
    return 7;
  };
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Loaded formData:", parsedData); // Debugging
        setFormData(parsedData);

        // Determine the first incomplete step
        const firstIncompleteStep = getFirstIncompleteStep(parsedData);
        console.log("First incomplete step:", firstIncompleteStep); // Debugging

        // If all steps are complete, set the current step to 7
        if (firstIncompleteStep === 7) {
          console.log("All steps are complete. Setting currentStep to 7.");
          setCurrentStep(7);
        } else {
          console.log(
            "Incomplete step found. Setting currentStep to:",
            firstIncompleteStep
          );
          setCurrentStep(firstIncompleteStep);
        }
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
  }, []);
  // useEffect(() => {
  //   const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   if (savedData) {
  //     try {
  //       const parsedData = JSON.parse(savedData);
  //       console.log("Loaded formData:", parsedData); // Debugging
  //       setFormData(parsedData);

  //       // Determine the first incomplete step
  //       const firstIncompleteStep = getFirstIncompleteStep(parsedData);
  //       console.log("First incomplete step:", firstIncompleteStep); // Debugging

  //       // If all steps are complete, set the current step to 7
  //       if (firstIncompleteStep === 7) {
  //         console.log("All steps are complete. Setting currentStep to 7.");
  //         setCurrentStep(7);
  //       } else {
  //         console.log(
  //           "Incomplete step found. Setting currentStep to:",
  //           firstIncompleteStep
  //         );
  //         setCurrentStep(firstIncompleteStep);
  //       }
  //     } catch (error) {
  //       console.error("Error parsing saved data:", error);
  //     }
  //   }
  // }, []);
  // useEffect(() => {
  //   const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   if (savedData) {
  //     try {
  //       const parsedData = JSON.parse(savedData);
  //       console.log("Loaded formData:", parsedData); // Debugging
  //       setFormData(parsedData);

  //       // Determine the first incomplete step
  //       const firstIncompleteStep = getFirstIncompleteStep(parsedData);
  //       console.log("First incomplete step:", firstIncompleteStep); // Debugging

  //       // Set the current step
  //       setCurrentStep(firstIncompleteStep);
  //     } catch (error) {
  //       console.error("Error parsing saved data:", error);
  //     }
  //   }
  // }, []);


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

  const goToNextStep = async () => {
    await autoSaveDraft();
    // if (currentStep === 3 && !user) {
    //   setShowLoginModal(true);
    //   return;
    // }
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // ------------------ Enhanced Subscription Check ------------------
  const checkResumeLimit = async (): Promise<boolean> => {
    try {
      if (!user?.id) {
        setShowSubscriptionModal(true);
        return false;
      }

      const response = await fetch(
        `${BASE_URL}/addresume/check-resume-limit/${user.id}`
      );

      if (!response.ok) {
        setShowSubscriptionModal(true);
        return false;
      }

      const data = await response.json();

      if (typeof data.canGenerate !== "boolean") {
        setShowSubscriptionModal(true);
        return false;
      }

      return data.canGenerate;
    } catch (error) {
      console.error("Subscription check error:", error);
      setShowSubscriptionModal(true);
      return false;
    }
  };
  // Wrap an action so it only runs if subscription allows it.
  const performAction = async (action: () => Promise<void>) => {
    if (await checkResumeLimit()) {
      await action();
    }
  };

  // Create a Stripe checkout session for a given plan.
  const createCheckoutSession = async (priceId: string, planName: string) => {
    try {
      const url = `${BASE_URL}/stripe/create-checkout-session`;
      console.log("Creating checkout session at:", url, {
        priceId,
        planName,
        userId: user!.id,
      });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          planName,
          userId: user!.id,
        }),
      });
      const data = await res.json();
      console.log("Checkout session response:", data);
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error creating checkout session");
      }
    } catch (err) {
      console.error("Checkout session error:", err);
      alert("Error creating checkout session");
    }
  };

  // ----------------- Action Handlers -----------------

  // const handleDownload = async () => {
  //   try {
  //     // First check subscription status
  //     const canDownload = await checkResumeLimit();

  //     if (!canDownload) {
  //       setShowSubscriptionModal(true);
  //       return;
  //     }

  //     // Proceed with download if subscription is valid
  //     const completeResumeData: ResumeData = {
  //       id: draftId || crypto.randomUUID(),
  //       userId: user?.id || "",
  //       templateId: "template-1",
  //       ...formData,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     };

  //     const pdfBlob = await generatePDF(completeResumeData);
  //     const url = URL.createObjectURL(pdfBlob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `${formData.personalInfo.fullName.replace(
  //       /\s+/g,
  //       "_"
  //     )}_Resume.pdf`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);

  //     // Optionally show preview after download
  //   } catch (error) {
  //     console.error("Error downloading PDF:", error);
  //     alert("Failed to download resume. Please try again.");
  //   }
  // };

  const [formData, setFormData] = useState<
    Omit<ResumeData, "id" | "userId" | "templateId" | "createdAt" | "updatedAt">
  >(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData
      ? JSON.parse(savedData)
      : {
          personalInfo: {
            fullName: "",
            email: "",
            phone: "",
            location: "",
            portfolioUrl: "",
            aboutMe: "",
            additionalDetails: "",
          },
          education: [
            {
              school: "",
              degree: "",
              fieldOfStudy: "",
              graduationYear: "",
              description: "",
              gpa: "",
              honors: "",
            },
          ],
          experience: [
            {
              company: "",
              position: "",
              startDate: "",
              endDate: "",
              description: "",
              achievements: [""],
            },
          ],
          skills: [],
          interests: [],
          certifications: [],
          additionalSections: [],
        };
  });
  // State to store the draft resume ID
  const [draftId, setDraftId] = useState<string | null>(null);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
  }, []);
  // Save formData to local storage for anonymous users
  useEffect(() => {
    if (!user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, user]);

  // // When a user logs in, load any saved draft from local storage and the server
  // useEffect(() => {
  //   if (user) {
  //     const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
  //     if (localDraft) {
  //       try {
  //         const parsedDraft = JSON.parse(localDraft);
  //         setFormData(parsedDraft);
  //         localStorage.removeItem(LOCAL_STORAGE_KEY);
  //         // Assume that if there’s a local draft, steps 1-3 are complete.
  //         setCurrentStep(4);
  //       } catch (error) {
  //         console.error("Error parsing local draft:", error);
  //       }
  //     }
  //     fetch(`${BASE_URL}/addresume/getdraft?userId=${user.id}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.success && data.data) {
  //           setDraftId(data.data._id);
  //           setFormData({
  //             personalInfo: data.data.personalInfo,
  //             education: data.data.education,
  //             experience: data.data.experience,
  //             skills: data.data.skills || [],
  //             interests: data.data.interests || [],
  //             certifications: data.data.certifications || [],
  //             additionalSections: data.data.additionalSections || [],
  //           });
  //           setCurrentStep(4);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error loading draft resume from server:", error);
  //       });
  //   }
  // }, [user]);
  // When a user logs in, load any saved draft from local storage and the server
  useEffect(() => {
    if (user) {
      const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localDraft) {
        try {
          const parsedDraft = JSON.parse(localDraft);
          setFormData(parsedDraft);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          // Remove this line:
          // setCurrentStep(4);
        } catch (error) {
          console.error("Error parsing local draft:", error);
        }
      }
      fetch(`${BASE_URL}/addresume/getdraft?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setDraftId(data.data._id);
            const serverData = {
              personalInfo: data.data.personalInfo,
              education: data.data.education,
              experience: data.data.experience,
              skills: data.data.skills || [],
              interests: data.data.interests || [],
              certifications: data.data.certifications || [],
              additionalSections: data.data.additionalSections || [],
            };
            setFormData(serverData);

            // Add this line to calculate step from server data:
            setCurrentStep(getFirstIncompleteStep(serverData));
          }
        })
        .catch((error) => {
          console.error("Error loading draft resume from server:", error);
        });
    }
  }, [user]);
  // --- Form Change Handlers ---
  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value },
    }));
  };
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);
  const handleEducationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [name]: value };
      return { ...prev, education: newEducation };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: "",
          degree: "",
          fieldOfStudy: "",
          graduationYear: "",
          description: "",
          gpa: "",
          honors: "",
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      newExperience[index] = { ...newExperience[index], [name]: value };
      return { ...prev, experience: newExperience };
    });
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          achievements: [""],
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArr = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setFormData((prev) => ({ ...prev, skills: skillsArr }));
  };

  const handleSectionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newSections = [...prev.additionalSections];
      newSections[index] = { ...newSections[index], [name]: value };
      return { ...prev, additionalSections: newSections };
    });
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      additionalSections: [
        ...prev.additionalSections,
        { title: "", content: "" },
      ],
    }));
  };

  const removeSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalSections: prev.additionalSections.filter((_, i) => i !== index),
    }));
  };

  const handleAchievementChange = (
    expIndex: number,
    achIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      const newAchievements = [...newExperience[expIndex].achievements];
      newAchievements[achIndex] = value;
      newExperience[expIndex].achievements = newAchievements;
      return { ...prev, experience: newExperience };
    });
  };

  const addAchievement = (expIndex: number) => {
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      newExperience[expIndex].achievements = [
        ...newExperience[expIndex].achievements,
        "",
      ];
      return { ...prev, experience: newExperience };
    });
  };

  // Auto-save draft when navigating steps.
  const autoSaveDraft = async () => {
    const resumeDraftData: ResumeData = {
      id: draftId || crypto.randomUUID(),
      userId: user?.id || "",
      templateId: "template-1",
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!draftId) {
      try {
        const response = await fetch(`${BASE_URL}/addresume/draft`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resumeDraftData),
        });
        if (!response.ok) {
          throw new Error("Failed to create draft resume");
        }
        const result = await response.json();
        setDraftId(result._id);
        console.log("Draft created:", result);
      } catch (error) {
        console.error("Error creating draft:", error);
      }
    } else {
      try {
        const response = await fetch(`${BASE_URL}/addresume/${draftId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resumeDraftData),
        });
        if (!response.ok) {
          throw new Error("Failed to update draft resume");
        }
        const result = await response.json();
        console.log("Draft updated:", result);
      } catch (error) {
        console.error("Error updating draft:", error);
      }
    }
  };

  // --- Generate "About Me" Functionality ---
  const generateAboutMe = async (): Promise<string> => {
    const { fullName, location, email, portfolioUrl } = formData.personalInfo;
    const experiences = formData.experience
      .map((exp) => `${exp.position} at ${exp.company}`)
      .join(", ");
    const educations = formData.education
      .map((edu) => `${edu.degree} in ${edu.fieldOfStudy} from ${edu.school}`)
      .join(", ");
    const skills = formData.skills.join(", ");

    const prompt = `Based on the following information, write a concise, professional 2-3 sentence "About Me" summary for a resume.

  Name: ${fullName}
  Location: ${location}
  Email: ${email}
  Portfolio: ${portfolioUrl}
  Experience: ${experiences}
  Education: ${educations}
  Skills: ${skills}

  The summary should be engaging and suitable for display right below the candidate's name at the top of a resume.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      });
      const output = response.choices[0]?.message?.content?.trim();
      return output || "";
    } catch (error) {
      console.error("Error generating About Me:", error);
      return "";
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 animate-spin text-primary-600" />
          <p className="mt-2 text-gray-600">Saving your resume...</p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Export & Print Functions (Integrated in Dashboard)
  // -----------------------------
  // Generate HTML document from resume data (mimicking your PDF design).
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

  const handleExport = async () => {
    if (!user) {
      setPreviewResume(false);
      setSelectedResume(null);
      setShowLoginModal(true);
      return;
    }
    const completeResumeData: ResumeData = {
      id: draftId || "",
      userId: user?.id || "",
      templateId: "template-1",
      ...formData,
      certifications: formData.certifications,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const html = generateResumeHTML(completeResumeData);
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formData.personalInfo.fullName.replace(
      /\s+/g,
      "_"
    )}_Resume.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Update handlePrint to be an async function
  const handlePrint = async () => {
    const completeResumeData: ResumeData = {
      id: draftId || "",
      userId: user?.id || "",
      templateId: "template-1",
      ...formData,
      certifications: formData.certifications,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const html = generateResumeHTML(completeResumeData);
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  // Define steps for the resume builder.
  const steps = [
    {
      number: 1,
      title: "Personal Details",
      description: "Basic information about you",
    },
    {
      number: 2,
      title: "Work History",
      description: "Your professional experience",
    },
    { number: 3, title: "Education", description: "Your academic background" },
    { number: 4, title: "Skills", description: "Your expertise and abilities" },
    { number: 5, title: "Interests", description: "Your hobbies and passions" },
    {
      number: 6,
      title: "Additional Sections",
      description: "Extra information",
    },
    { number: 7, title: "Review", description: "Review and finalize" },
  ];

  

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  
  const handleDownload = async () => {
    try {
      // Check if the user has reached the resume limit
      const canDownload = await checkResumeLimit();

      if (!canDownload) {
        setShowSubscriptionModal(true); // Show subscription modal if limit is reached
        return;
      }

      // Proceed with download if subscription is valid
      const completeResumeData: ResumeData = {
        id: draftId || crypto.randomUUID(),
        userId: user?.id || "",
        templateId: "template-1",
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const pdfBlob = await generatePDF(completeResumeData);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${formData.personalInfo.fullName.replace(
        /\s+/g,
        "_"
      )}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download resume. Please try again.");
    }
  };
 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  
      try {
        if (!user) {
          setPreviewResume(true);
          setSelectedResume(formData);
        }
        if (!user) return;

        const resumeToSave: ResumeData = {
          id: draftId || "",
          userId: user.id,
          templateId: "template-1",
          personalInfo: { ...formData.personalInfo, aboutMe: 'aboutMeText' },
          education: formData.education,
          experience: formData.experience,
          skills: formData.skills,
          interests: formData.interests,
          certifications: formData.certifications,
          additionalSections: formData.additionalSections,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      
        const response = await fetch(`${BASE_URL}/addresume/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resumeToSave),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to save resume: ${response.statusText} - ${errorText}`
          );
        }
        setPreviewResume(true);
        setSelectedResume(formData);
        const responseData = await response.json();
        console.log("Save response data:", responseData);
      // Clear localStorage after successful save
      localStorage.removeItem(LOCAL_STORAGE_KEY);
        // setResumeSaved(true);
      } catch (error) {
        console.error("Error saving resume:", error);
      } finally {
        setLoading(false);
      }
    
  };
  


 
  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleSignUp = () => {
    setShowLoginModal(false);
    navigate("/signup");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsForm
            formData={formData.personalInfo}
            onChange={handlePersonalInfoChange}
          />
        );
      case 2:
        return (
          <ExperienceForm
            experiences={formData.experience}
            onChange={handleExperienceChange}
            onAdd={addExperience}
            onRemove={removeExperience}
            onAchievementChange={handleAchievementChange}
            onAddAchievement={addAchievement}
          />
        );
      case 3:
        return (
          <EducationForm
            education={formData.education}
            onChange={handleEducationChange}
            onAdd={addEducation}
            onRemove={removeEducation}
          />
        );
      case 4:
        return (
          <SkillsForm
            skills={formData.skills}
            onChange={handleSkillsChange}
            resumeContext={formData}
          />
        );
      case 5:
        return (
          <InterestsForm
            interests={formData.interests}
            onChange={(newInterests) =>
              setFormData((prev) => ({ ...prev, interests: newInterests }))
            }
            resumeContext={formData}
          />
        );
      case 6:
        return (
          <AdditionalSectionsForm
            certifications={formData.certifications}
            additionalSections={formData.additionalSections}
            onCertificationChange={(index, e) =>
              setFormData((prev) => {
                const newCerts: string[] = [...prev.certifications];
                newCerts[index] = (e.target as HTMLInputElement).value;
                return { ...prev, certifications: newCerts };
              })
            }
            onAddCertification={() =>
              setFormData((prev) => ({
                ...prev,
                certifications: [...prev.certifications, ""],
              }))
            }
            onRemoveCertification={(index) =>
              setFormData((prev) => ({
                ...prev,
                certifications: prev.certifications.filter(
                  (_, i) => i !== index
                ),
              }))
            }
            onSectionChange={handleSectionChange}
            onAddSection={addSection}
            onRemoveSection={removeSection}
          />
        );
      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Save Your Resume To Download ⬇
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Review all the information before finalizing your resume.
              </p>
              {/* Wrap the resume preview in a container with id "printable-cv" */}
              <div id="printable-cv">
                <ResumePreview
                  data={{
                    id: "",
                    userId: user?.id || "",
                    templateId: "template-1",
                    ...formData,
                    certifications: formData.certifications,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Compute complete resume data for export/print.
  const completeResumeData: ResumeData = {
    id: draftId || "",
    userId: user?.id || "",
    templateId: "template-1",
    ...formData,
    certifications: formData.certifications,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Login Required</h2>
            <p className="mb-4">
            Get your PDF for free, register to download!
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSignUp}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign Up
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && ( // Show loading indicator when loading is true
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 animate-spin text-primary-600" />
            <p className="mt-2 text-gray-600">Saving your resume...</p>
          </div>
        </div>
      )}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between mt-20 pt-15">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create Your Resume
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Complete all sections to create your professional resume
                </p>
              </div>
            </div>
            {/* <div className="mt-8">
              <div className="flex justify-between">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center w-36 ${
                      currentStep === step.number
                        ? "text-primary-600"
                        : currentStep > step.number
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        currentStep === step.number
                          ? "border-primary-600 bg-primary-50"
                          : currentStep > step.number
                          ? "border-green-600 bg-green-50"
                          : "border-gray-300"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">
                          {step.number}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs font-medium text-center">
                      {step.title}
                      <span className="block text-xs text-gray-400">
                        {step.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative mt-2">
                <div className="absolute left-0 top-4 w-full">
                  <div
                    className="h-1 bg-primary-600 transition-all duration-500"
                    style={{
                      width: `${
                        ((currentStep - 1) / (steps.length - 1)) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="absolute left-0 top-4 w-full bg-gray-200 h-1" />
              </div>
            </div> */}
            {/* Steps Section - Modified for Mobile Responsiveness */}
            <div className="mt-8">
              {/* Desktop Version */}
              <div className="hidden md:flex justify-between">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center w-36 ${
                      currentStep === step.number
                        ? "text-primary-600"
                        : currentStep > step.number
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        currentStep === step.number
                          ? "border-primary-600 bg-primary-50"
                          : currentStep > step.number
                          ? "border-green-600 bg-green-50"
                          : "border-gray-300"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">
                          {step.number}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs font-medium text-center">
                      {step.title}
                      <span className="block text-xs text-gray-400">
                        {step.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Version */}
              <div className="md:hidden space-y-4">
                <div className="flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        currentStep === steps[currentStep - 1].number
                          ? "border-primary-600 bg-primary-50"
                          : currentStep > steps[currentStep - 1].number
                          ? "border-green-600 bg-green-50"
                          : "border-gray-300"
                      }`}
                    >
                      {currentStep > steps[currentStep - 1].number ? (
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">
                          {currentStep}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium">
                        {steps[currentStep - 1].title}
                      </div>
                      <div className="text-xs text-gray-500">
                        Step {currentStep} of {steps.length}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full">
                  <div
                    className="absolute h-2 bg-primary-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ((currentStep - 1) / (steps.length - 1)) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
 <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-8 text-center bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 rounded-lg shadow-lg">
 <span className="text-white text-sm sm:text-lg md:text-xl font-semibold mb-2">
  Take a look at our best work and get inspired!
</span>

  <Link to="/#demo" className="bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-lg md:text-xl font-medium  px-4 py-2 rounded-full transition-all duration-300 hover:scale-105">
    Look Now 
  </Link>
</div></div>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Live Preview</h2>
          <div id="printable-cv">
            <ResumePreview
              data={{
                id: "",
                userId: user?.id || "",
                templateId: "template-1",
                ...formData,
                certifications: formData.certifications,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }}
            />
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {resumeSaved ? (
            <div className="space-y-4">
              <button
                onClick={() => performAction(handleDownload)}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => performAction(handleExport)}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Word
              </button>
              <button
                onClick={() => performAction(handlePrint)}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Print Resume
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Previous
                  </button>
                )}
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Next
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isEnhancing || loading} // Disable button when loading
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5 mr-2" />
                    )}
                    {loading ? "Saving..." : "Save & Preview Resume"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
      {showSubscriptionModal && (
        <SubscriptionModal
          onSelectPlan={(priceId, planName) => {
            createCheckoutSession(priceId, planName);
          }}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}













{showPreviewResume && selectedResume && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4  pt-24">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Resume Preview
                  </h2>
                  <button
                    onClick={() => setPreviewResume(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[70vh]">
                  <ResumePreview data={selectedResume} />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => handleExport(selectedResume, "pdf")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {loadingButtons[selectedResume.id]?.pdf
                        ? "Downloading..."
                        : "Download PDF"}
                    </button>
                
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
































    </div>
  );
};

export default Dashboard;

// ---------------------
// SubscriptionModal Component
// ---------------------
const SubscriptionModal: React.FC<{
  onSelectPlan: (priceId: string, planName: string) => void;
  onClose: () => void;
}> = ({ onSelectPlan, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          Subscribe Now
        </h2>
        <p className="mb-6 text-gray-700 text-center">
          You don't have an active subscription. Choose a plan below:
        </p>
        <div className="space-y-4">
          {/* Unlimited Plan Option */}
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Unlimited Resumes
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              $149 one-time fee for unlimited resume creation. Once a resume is
              completed, you can create another without additional fees.
            </p>
            <button
              onClick={() =>
                onSelectPlan("price_1Qw4xzGcVjZeEueAk0fAB9A6", "unlimited")
              }
              className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Subscribe for $149
            </button>
          </div>
          {/* Single Resume Plan Option */}
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Single Resume
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              $29 one-time fee to create one resume. After downloading, you
              won't be able to modify it on the platform.
            </p>
            <button
              onClick={() =>
                onSelectPlan("price_1Qw4xTGcVjZeEueAAUjyRrbc", "one-time")
              }
              className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Subscribe for $29
            </button>
          </div>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
