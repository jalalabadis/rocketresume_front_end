import { useState } from "react";
import { ResumeData } from "../types/resume";
import {
  enhanceJobDescription,
  generateAboutMe,
  enhanceSkills,
  enhanceInterests,
  enhanceCertification,
  enhanceEducationDescription,
} from "../utils/openai";

type ResumeFormData = Omit<
  ResumeData,
  "id" | "userId" | "templateId" | "createdAt" | "updatedAt"
>;

export const useResumeEnhancer = () => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const enhanceResume = async (
    formData: ResumeFormData
  ): Promise<ResumeFormData> => {
    setIsEnhancing(true);
    setError(null);
    setProgress(0);

    try {
      // Calculate total sections to enhance
      const totalSections = [
        formData.experience.length,
        formData.education.length,
        formData.certifications.length,
        formData.additionalSections.length,
        // Add 3 for skills, interests, and about me
        3,
      ].reduce((a, b) => a + b, 0);

      let completedSections = 0;

      // Enhance all sections in parallel for better performance
      const [
        enhancedExperiences,
        enhancedEducation,
        enhancedSkills,
        enhancedInterests,
        enhancedCertifications,
        aboutMe,
      ] = await Promise.all([
        // Enhance experiences
        Promise.all(
          formData.experience.map(async (exp) => {
            const enhanced = {
              ...exp,
              description: await enhanceJobDescription(exp.description),
            };
            completedSections++;
            setProgress((completedSections / totalSections) * 100);
            return enhanced;
          })
        ),

        // Enhance education
        Promise.all(
          formData.education.map(async (edu) => {
            const enhanced = {
              ...edu,
              description: await enhanceEducationDescription(edu),
            };
            completedSections++;
            setProgress((completedSections / totalSections) * 100);
            return enhanced;
          })
        ),

        // Enhance skills
        (async () => {
          const enhanced = await enhanceSkills(formData.skills);
          completedSections++;
          setProgress((completedSections / totalSections) * 100);
          return enhanced;
        })(),

        // Enhance interests
        (async () => {
          const enhanced = await enhanceInterests(formData.interests);
          completedSections++;
          setProgress((completedSections / totalSections) * 100);
          return enhanced;
        })(),

        // Enhance certifications
        Promise.all(
          formData.certifications.map(async (cert) => {
            const enhanced = await enhanceCertification(cert);
            completedSections++;
            setProgress((completedSections / totalSections) * 100);
            return enhanced;
          })
        ),

        // Generate about me section
        (async () => {
          const enhanced = await generateAboutMe(formData);
          completedSections++;
          setProgress((completedSections / totalSections) * 100);
          return enhanced;
        })(),
      ]);

      // Enhance additional sections if they exist
      const enhancedAdditionalSections = await Promise.all(
        formData.additionalSections.map(async (section) => {
          const enhancedContent = await enhanceJobDescription(section.content);
          completedSections++;
          setProgress((completedSections / totalSections) * 100);
          return {
            ...section,
            content: enhancedContent,
          };
        })
      );

      // Combine all enhanced sections
      const enhancedData: ResumeFormData = {
        ...formData,
        experience: enhancedExperiences,
        education: enhancedEducation,
        skills: enhancedSkills,
        interests: enhancedInterests,
        certifications: enhancedCertifications,
        additionalSections: enhancedAdditionalSections,
        personalInfo: {
          ...formData.personalInfo,
          aboutMe: aboutMe || "",
        },
      };

      setProgress(100);
      return enhancedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enhance resume");
      throw err;
    } finally {
      setIsEnhancing(false);
    }
  };

  return {
    enhanceResume,
    isEnhancing,
    error,
    progress,
  };
};
