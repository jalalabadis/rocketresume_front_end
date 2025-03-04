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
    if (currentStep === 3 && !user) {
      setShowLoginModal(true);
      return;
    }
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

  // const goToNextStep = async () => {
  //   await autoSaveDraft();
  //   if (currentStep === 3 && !user) {
  //     setShowLoginModal(true);
  //     return;
  //   }
  //   if (currentStep < steps.length) {
  //     setCurrentStep((prev) => prev + 1);
  //   }
  // };

  // const goToPreviousStep = () => {
  //   if (currentStep > 1) {
  //     setCurrentStep((prev) => prev - 1);
  //   }
  // };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Clear localStorage on successful save
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!user) {
  //     setShowLoginModal(true);
  //     return;
  //   }

  //   const canGenerateResume = await checkResumeLimit();
  //   if (!canGenerateResume) {
  //     setShowSubscriptionModal(true);
  //     return;
  //   }

  //   let aboutMeText: string = formData.personalInfo.aboutMe?.trim() || "";
  //   if (!aboutMeText) {
  //     aboutMeText = await generateAboutMe();
  //     setFormData((prev) => ({
  //       ...prev,
  //       personalInfo: { ...prev.personalInfo, aboutMe: aboutMeText },
  //     }));
  //   }

  //   const resumeToSave: ResumeData = {
  //     id: draftId || crypto.randomUUID(),
  //     userId: user.id,
  //     templateId: "template-1",
  //     personalInfo: { ...formData.personalInfo, aboutMe: aboutMeText },
  //     education: formData.education,
  //     experience: formData.experience,
  //     skills: formData.skills,
  //     interests: formData.interests,
  //     certifications: formData.certifications,
  //     additionalSections: formData.additionalSections,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   };

  //   try {
  //     const response = await fetch(`${BASE_URL}/addresume/save`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(resumeToSave),
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(
  //         `Failed to save resume: ${response.statusText} - ${errorText}`
  //       );
  //     }

  //     const responseData = await response.json();
  //     console.log("Save response data:", responseData);
  //     setResumeSaved(true);

  //     // Clear localStorage after successful save
  //     localStorage.removeItem(LOCAL_STORAGE_KEY);
  //   } catch (error) {
  //     console.error("Error saving resume:", error);
  //   }
  // };
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
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   setLoading(true); // Start loading
  //   if (!user) {
  //     //setShowLoginModal(true);
  //     setPreviewResume(true);
  //     setSelectedResume(formData);
  //     setLoading(false); 
  //     return;
  //   }

  //   // const canGenerateResume = await checkResumeLimit();
  //   // if (!canGenerateResume) {
  //   //   setShowSubscriptionModal(true);
  //   //   return;
  //   // }

    

  //   //let aboutMeText: string = formData.personalInfo.aboutMe?.trim() || "";
  //   // if (!aboutMeText) {
  //   //   aboutMeText = await generateAboutMe();
  //   //   setFormData((prev) => ({
  //   //     ...prev,
  //   //     personalInfo: { ...prev.personalInfo, aboutMe: aboutMeText },
  //   //   }));
  //   // }

  //   const resumeToSave: ResumeData = {
  //     id: draftId || "",
  //     userId: user.id,
  //     templateId: "template-1",
  //     personalInfo: { ...formData.personalInfo, aboutMe: 'aboutMeText' },
  //     education: formData.education,
  //     experience: formData.experience,
  //     skills: formData.skills,
  //     interests: formData.interests,
  //     certifications: formData.certifications,
  //     additionalSections: formData.additionalSections,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   };

  //   try {
  //     const response = await fetch(`${BASE_URL}/addresume/save`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(resumeToSave),
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(
  //         `Failed to save resume: ${response.statusText} - ${errorText}`
  //       );
  //     }

  //     const responseData = await response.json();
  //     console.log("Save response data:", responseData);
  //     setResumeSaved(true);

  //     //setPreviewResume(true);
  //     //setSelectedResume(formData);

  //     // Clear localStorage after successful save
  //     //localStorage.removeItem(LOCAL_STORAGE_KEY);

  //     // Redirect to the "saved-resume" page after successful submissionaa
  //     //window.location.href = "/saved-resumes"; // Use window.location.href to redirect
  //   } catch (error) {
  //     console.error("Error saving resume:", error);
  //   } finally {
  //     setLoading(false); // Stop loading
  //   }
  // };


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
              Please log in or create an account to continue.
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

      <div className="flex flex-col items-start justify-start text-center bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-6 rounded-lg shadow-lg">
  <span className="text-white text-xl font-semibold mb-2">
    Take a look at our best work and get inspired!
  </span>
  <Link to="/#demo" className="text-white text-lg font-medium bg-white bg-opacity-20 px-4 py-2 rounded-full transition-all duration-300 hover:bg-opacity-40 hover:scale-105">
    - Look Now <div className="mr-1 mb-[-0.4rem] inline-flex h-5 w-5  bg-opacity-100 bg-[url('data:image/png;base64,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')] bg-contain bg-repeat-x bg-[size:100%]">
                    </div>
  </Link>
</div>



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
