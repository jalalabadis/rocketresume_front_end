// import { ResumeData } from "../types/resume";

// const OPENAI_API_KEY =
//   "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";

// // Character limits for different sections
// const LIMITS = {
//   DESCRIPTION: 2000,
//   ABOUT_ME: 1000,
//   ACHIEVEMENT: 200,
//   CERTIFICATION: 300,
//   SKILL: 50,
//   INTEREST: 50,
//   EDUCATION: 1000,
// };

// export async function enhanceJobDescription(
//   description: string
// ): Promise<string> {
//   try {
//     const systemPrompt = `You are a technical resume writer. Transform job descriptions into concise, professional one paragraphs that:
// - Use complete sentences
// - Avoid bullet points or lists
// - Focus on technical depth over quantity
// - Maintain natural flow`;

//     const userPrompt = `Condense this job description into 1 focused paragraphs (NO BULLET POINTS):

//     Original Description:
//     "${description}"

//     Example Output:
//     "Led full-stack development of enterprise applications using React and Node.js, designing scalable microservices architecture. Implemented CI/CD pipelines and containerization strategies that improved deployment frequency. Collaborated with cross-functional teams to optimize database performance through query optimization and indexing strategies. Solved complex distributed system challenges using Redis caching and load balancing techniques."`;

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4-turbo",
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: userPrompt },
//         ],
//         temperature: 0.5, // Slightly higher for better flow
//         max_tokens: 600,
//         stop: ["\n\n"], // Prevent paragraph breaks
//       }),
//     });

//     const data = await response.json();
//     const enhancedText = data.choices[0].message.content.trim();

//     return cleanResponse(enhancedText, LIMITS.DESCRIPTION);
//   } catch (error) {
//     console.error("Error enhancing job description:", error);
//     return cleanResponse(description, LIMITS.DESCRIPTION);
//   }
// }

// // Enhanced cleaning function
// function cleanResponse(text: string, maxLength: number): string {
//   // Remove any residual bullet points or list markers
//   const cleaned = text
//     .replace(/^[-•*]\s+/gm, "") // Remove bullet points
//     .replace(/\d+\.\s/g, "") // Remove numbered lists
//     .replace(/\n/g, " ") // Convert newlines to spaces
//     .replace(/\s+/g, " ") // Collapse multiple spaces
//     .trim();

//   // Intelligent truncation at sentence boundary
//   if (cleaned.length <= maxLength) return cleaned;

//   const lastMeaningfulEnd = Math.max(
//     cleaned.lastIndexOf(". ", maxLength - 1),
//     cleaned.lastIndexOf("; ", maxLength - 1),
//     cleaned.lastIndexOf(", ", maxLength - 1)
//   );

//   return lastMeaningfulEnd > maxLength * 0.8
//     ? cleaned.substring(0, lastMeaningfulEnd + 1)
//     : cleaned.substring(0, maxLength - 3) + "...";
// }

// export async function enhanceAchievements(
//   achievements: string[]
// ): Promise<string[]> {
//   try {
//     const prompt = `
//       Transform these achievements into complete, impactful  one paragraph statements (max ${
//         LIMITS.ACHIEVEMENT
//       } chars each):
//       ${achievements.join("\n")}

//     `;

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a professional resume writer specializing in technical achievements. Create impactful statements that focus on value and expertise without relying on specific metrics.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         temperature: 0.5,
//         max_tokens: 150,
//       }),
//     });

//     const data = await response.json();
//     interface OpenAIResponse {
//       choices: {
//         message: {
//           content: string;
//         };
//       }[];
//     }

//     return (data as OpenAIResponse).choices[0].message.content
//       .split("\n")
//       .filter(Boolean)
//       .map((achievement: string) => {
//         const cleaned = achievement.replace(/^[-•]\s*/, "").trim();
//         return cleaned.length > LIMITS.ACHIEVEMENT
//           ? cleaned.substring(0, LIMITS.ACHIEVEMENT)
//           : cleaned;
//       });
//   } catch (error) {
//     console.error("Error enhancing achievements:", error);
//     return achievements;
//   }
// }

// export async function generateAboutMe(
//   resumeData: Partial<ResumeData>
// ): Promise<string> {
//   try {
//     const systemPrompt = `You create professional 3-4 sentence paragraph summaries following this structure:
// 1. Professional identity + expertise area
// 2. Key technical skills and methodologies
// 3. Notable achievements or leadership experience
// 4. Current professional focus or specialization

// Rules:
// - Single paragraph (no line breaks)
// - 3-4 complex sentences
// - Include specific technologies
// - Max ${LIMITS.ABOUT_ME} characters
// - Natural flowing narrative`;

//     const userPrompt = `Create professional paragraph summary from:
// Experience: ${
//       resumeData.experience
//         ?.map((e) => `${e.position} at ${e.company}`)
//         .join(", ") || "None"
//     }
// Education: ${
//       resumeData.education
//         ?.map((e) => `${e.degree} in ${e.fieldOfStudy}`)
//         .join(", ") || "None"
//     }
// Skills: ${resumeData.skills?.join(", ") || "None"}

// Example Response:
// "Experienced full-stack developer specializing in cloud-native application development, with expertise in React, Node.js, and AWS services. Successfully led the migration of legacy monolithic systems to microservices architecture, improving system scalability and deployment efficiency. Currently focused on implementing AI-powered features in enterprise applications while maintaining robust CI/CD pipelines and containerized workflows."`;

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4-turbo",
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: userPrompt },
//         ],
//         temperature: 0.4,
//         max_tokens: 250,
//       }),
//     });

//     const data = await response.json();
//     const rawText = data.choices[0].message.content.trim();

//     return formatParagraph(rawText, LIMITS.ABOUT_ME);
//   } catch (error) {
//     console.error("Error generating about me:", error);
//     return "";
//   }
// }

// // Paragraph formatting helper
// function formatParagraph(text: string, maxLength: number): string {
//   // Clean up text and maintain paragraph structure
//   const cleaned = text
//     .replace(/\n/g, " ") // Remove newlines
//     .replace(/\s+/g, " ") // Collapse whitespace
//     .replace(/^"+|"+$/g, "") // Remove surrounding quotes
//     .trim();

//   // Intelligent truncation at sentence boundary
//   if (cleaned.length <= maxLength) return cleaned;

//   // Find last sentence end within limit
//   const lastSentenceEnd = cleaned.lastIndexOf(".", maxLength - 1);
//   if (lastSentenceEnd > 0.7 * maxLength) {
//     return cleaned.substring(0, lastSentenceEnd + 1);
//   }

//   // Fallback to clean word boundary
//   const lastSpace = cleaned.lastIndexOf(" ", maxLength);
//   return cleaned.substring(0, lastSpace > 0 ? lastSpace : maxLength) + "...";
// }

// export async function enhanceEducation(description: string): Promise<string> {
//   try {
//     const prompt = `
//       Transform this education description into a professional statement OF ONE Paragraph (max ${LIMITS.EDUCATION} chars):
//       "${description}"

//       Guidelines:
//       1. Focus on relevant coursework
//       2. Highlight technical skills gained
//       3. Mention significant projects
//       4. Include academic achievements
//       5. Show practical applications

//       Example format:
//       "Specialized in software engineering with focus on distributed systems and cloud computing. Completed advanced coursework in algorithms, machine learning, and database design. Developed full-stack applications using modern frameworks and participated in collaborative team projects."
//     `;

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a professional resume writer specializing in educational backgrounds. Create detailed descriptions that highlight both academic knowledge and practical skills.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         temperature: 0.4,
//         max_tokens: 150,
//       }),
//     });

//     const data = await response.json();
//     const enhancedText = data.choices[0].message.content.trim();
//     return enhancedText.length > LIMITS.EDUCATION
//       ? enhancedText.substring(0, LIMITS.EDUCATION)
//       : enhancedText;
//   } catch (error) {
//     console.error("Error enhancing education description:", error);
//     return description;
//   }
// }

// export async function enhanceSkills(skills: string[]): Promise<string[]> {
//   if (!skills.length) return [];

//   try {
//     const prompt = `
//       Transform these skills into professional terms (max ${
//         LIMITS.SKILL
//       } chars each):
//       ${skills.join(", ")}

//       Guidelines:
//       1. Use industry-standard terminology
//       2. Group related skills
//       3. Focus on technical expertise
//       4. Include soft skills when relevant

//       Example format:
//       "Full-Stack Development, Cloud Architecture (AWS), React/Node.js Development, Agile Project Management"

//       Requirements:
//       1. Be specific and clear
//       2. Use recognized terms
//       3. Show expertise level
//       4. Keep professional tone
//       5. Return as comma-separated list
//     `;

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a professional resume writer specializing in technical skills. Create clear, industry-standard skill descriptions. Return skills as a comma-separated list.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         temperature: 0.5,
//         max_tokens: 100,
//       }),
//     });

//     const data = await response.json();
//     return data.choices[0].message.content
//       .split(/,|\n|-|•/)
//       .map((skill: string) => skill.trim())
//       .filter((skill: string) => skill.length > 0)
//       .map((skill: string) => {
//         const cleanedSkill = skill.replace(/^[-•]\s*/, "").trim();
//         return cleanedSkill.length > LIMITS.SKILL
//           ? cleanedSkill.substring(0, LIMITS.SKILL)
//           : cleanedSkill;
//       });
//   } catch (error) {
//     console.error("Error enhancing skills:", error);
//     return skills;
//   }
// }

// export async function enhanceInterests(interests: string[]): Promise<string[]> {
//   if (!interests.length) return [];

//   try {
//     const prompt = `
//       Transform these interests into professional terms :
//       ${interests.join(", ")}

//       Guidelines:
//       1. Focus on relevant interests
//       2. Show professional development
//       3. Include technical hobbies

//       Example format:
//       "Open Source Development, Tech Community Building, Technical Writing, AI/ML Research"

//       Requirements:
//       1. Keep professional tone
//       2. Show relevance to career
//       3. Be specific and clear
//       4. Demonstrate engagement
//       5. Return as comma-separated list
//     `;

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a professional resume writer helping present interests in a career-relevant way. Return interests as a comma-separated list.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         temperature: 0.5,
//         max_tokens: 100,
//       }),
//     });

//     const data = await response.json();
//     return data.choices[0].message.content
//       .split(/,|\n|-|•/)
//       .map((interest: string) => interest.trim())
//       .filter((interest: string) => interest.length > 0)
//       .map((interest: string) => {
//         const cleanedInterest = interest.replace(/^[-•]\s*/, "").trim();
//         return cleanedInterest.length > LIMITS.INTEREST
//           ? cleanedInterest.substring(0, LIMITS.INTEREST)
//           : cleanedInterest;
//       });
//   } catch (error) {
//     console.error("Error enhancing interests:", error);
//     return interests;
//   }
// }

// export async function enhanceCertification(certification: {
//   name: string;
//   issuer: string;
//   date: string;
//   description?: string;
// }): Promise<{
//   name: string;
//   issuer: string;
//   date: string;
//   description: string;
// }> {
//   try {
//     const prompt = `
//       Enhance this certification description:
//       Name: ${certification.name}
//       Issuer: ${certification.issuer}
//       Description: ${certification.description || ""}

//       Guidelines:
//       1. Focus on skills and knowledge gained
//       2. Highlight industry relevance
//       3. Mention specific technologies or methodologies
//       4. Show practical applications
//       5. Include scope and complexity level

//       Example format:
//       "Advanced certification demonstrating expertise in cloud architecture and deployment strategies. Covers comprehensive understanding of scalable systems, security best practices, and enterprise integration patterns. Includes hands-on experience with industry-standard tools and frameworks."

//       Requirements:
//       1. Keep professional tone
//       2. Be specific about technologies
//       3. Show value and relevance
//       4. Highlight key competencies
//       5. Maximum ${LIMITS.CERTIFICATION} characters
//     `;

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a professional resume writer specializing in technical certifications. Create detailed descriptions that highlight the value and relevance of each certification.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         temperature: 0.4,
//         max_tokens: 150,
//       }),
//     });

//     const data = await response.json();
//     const enhancedDescription = data.choices[0].message.content.trim();

//     return {
//       ...certification,
//       description:
//         enhancedDescription.length > LIMITS.CERTIFICATION
//           ? enhancedDescription.substring(0, LIMITS.CERTIFICATION)
//           : enhancedDescription,
//     };
//   } catch (error) {
//     console.error("Error enhancing certification:", error);
//     return {
//       ...certification,
//       description: certification.description || "",
//     };
//   }
// }

// export async function enhanceEducationDescription(education: {
//   school: string;
//   degree: string;
//   fieldOfStudy: string;
//   description?: string;
// }): Promise<string> {
//   try {
//     const prompt = `
//       Create an enhanced education description for:
//       School: ${education.school}
//       Degree: ${education.degree}
//       Field: ${education.fieldOfStudy}
//       Current Description: ${education.description || ""}

//       Guidelines:
//       1. Highlight key areas of study
//       2. Mention relevant coursework
//       3. Include technical skills gained
//       4. Reference projects or research
//       5. Show academic achievements

//       Example format:
//       "Specialized in advanced software engineering principles with focus on distributed systems and cloud computing. Completed rigorous coursework in algorithms, machine learning, and database design. Developed full-stack applications using modern frameworks and participated in research projects focusing on AI applications."

//       Requirements:
//       1. Be specific about technical focus
//       2. Highlight practical skills
//       3. Show academic excellence
//       4. Include relevant projects
//       5. Maximum ${LIMITS.EDUCATION} characters
//     `;

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a professional resume writer specializing in academic achievements. Create detailed descriptions that highlight both theoretical knowledge and practical skills gained during education.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         temperature: 0.4,
//         max_tokens: 200,
//       }),
//     });

//     const data = await response.json();
//     const enhancedDescription = data.choices[0].message.content.trim();

//     return enhancedDescription.length > LIMITS.EDUCATION
//       ? enhancedDescription.substring(0, LIMITS.EDUCATION)
//       : enhancedDescription;
//   } catch (error) {
//     console.error("Error enhancing education description:", error);
//     return education.description || "";
//   }
// }

// export async function enhanceFullResume(
//   formData: Partial<ResumeData>
// ): Promise<Partial<ResumeData>> {
//   try {
//     const [
//       enhancedExperiences,
//       enhancedEducation,
//       enhancedSkills,
//       enhancedInterests,
//       enhancedCertifications,
//       aboutMe,
//     ] = await Promise.all([
//       Promise.all(
//         (formData.experience || []).map(async (exp) => ({
//           ...exp,
//           description: await enhanceJobDescription(exp.description),
//           achievements: await enhanceAchievements(exp.achievements),
//         }))
//       ),

//       Promise.all(
//         (formData.education || []).map(async (edu) => ({
//           ...edu,
//           description: await enhanceEducationDescription(edu),
//         }))
//       ),

//       formData.skills ? enhanceSkills(formData.skills) : [],

//       formData.interests ? enhanceInterests(formData.interests) : [],

//       Promise.all(
//         (formData.certifications || []).map(
//           async (cert) => await enhanceCertification(cert)
//         )
//       ),

//       generateAboutMe(formData),
//     ]);

//     return {
//       ...formData,
//       experience: enhancedExperiences,
//       education: enhancedEducation,
//       skills: enhancedSkills,
//       interests: enhancedInterests,
//       certifications: enhancedCertifications,
//       personalInfo: {
//         fullName: formData.personalInfo?.fullName || "",
//         email: formData.personalInfo?.email || "",
//         phone: formData.personalInfo?.phone || "",
//         location: formData.personalInfo?.location || "",
//         portfolioUrl: formData.personalInfo?.portfolioUrl,
//         additionalDetails: formData.personalInfo?.additionalDetails,
//         aboutMe,
//       },
//     };
//   } catch (error) {
//     console.error("Error enhancing resume:", error);
//     throw error;
//   }
// }
import { ResumeData } from "../types/resume";

const OPENAI_API_KEY =
  "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";

// Character limits for different sections
const LIMITS = {
  DESCRIPTION: 1000,
  ABOUT_ME: 400,
  ACHIEVEMENT: 100,
  CERTIFICATION: 250,
  EDUCATION: 600,
} as const;

// Helper function to enforce character limits and clean text
function enforceLimit(text: string, limit: number): string {
  if (!text) return "";

  // Clean and normalize text
  let cleaned = text
    .replace(/\s+/g, " ")
    .replace(/[•●]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (cleaned.length <= limit) return cleaned;

  // Try to find a sentence end near the limit
  const lastPeriod = cleaned.lastIndexOf(".", limit);
  if (lastPeriod > limit * 0.75) {
    return cleaned.substring(0, lastPeriod + 1);
  }

  // Fall back to word boundary
  const lastSpace = cleaned.lastIndexOf(" ", limit - 3);
  return cleaned.substring(0, lastSpace) + "...";
}

export async function enhanceJobDescription(
  description: string
): Promise<string> {
  try {
    const prompt = `
      Transform this job description into a concise, impactful paragraph:
      "${description}"

      Requirements:
      1. Maximum ${LIMITS.DESCRIPTION} characters
      2. Use strong action verbs and quantifiable results
      3. Focus on achievements and impact
      4. Remove any bullet points or lists
      5. Maintain professional tone
      6. Avoid technical jargon unless essential
      7. Use active voice
      8. Focus on one main responsibility per sentence
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume writer specializing in concise, impactful job descriptions. Focus on achievements and impact while maintaining clarity and professionalism.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    return enforceLimit(data.choices[0].message.content, LIMITS.DESCRIPTION);
  } catch (error) {
    console.error("Error enhancing job description:", error);
    return enforceLimit(description, LIMITS.DESCRIPTION);
  }
}

export async function generateAboutMe(
  resumeData: Partial<ResumeData>
): Promise<string> {
  try {
    const prompt = `
      Create a professional summary Start with I am ,based on:
      Experience: ${resumeData.experience
        ?.map((e) => `${e.position} at ${e.company}`)
        .join(", ")}
      Skills: ${resumeData.skills?.join(", ")}
      Education: ${resumeData.education
        ?.map((e) => `${e.degree} in ${e.fieldOfStudy}`)
        .join(", ")}

      Requirements:
      1. Maximum ${LIMITS.ABOUT_ME} characters
      2. Focus on current expertise and career direction
      3. Avoid mentioning specific companies
      4. Use industry-standard terminology
      5. Maintain professional tone
      6. Create a cohesive narrative
      7. Highlight key achievements without details
      8. Focus on value proposition
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume writer specializing in executive summaries. Create concise, powerful summaries that highlight expertise and career focus without specific job details.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    return enforceLimit(data.choices[0].message.content, LIMITS.ABOUT_ME);
  } catch (error) {
    console.error("Error generating about me:", error);
    return "";
  }
}

export async function enhanceEducation(education: string): Promise<string> {
  try {
    const prompt = `
      Transform this education description into a professional statement:
      "${education}"

      Requirements:
      1. Maximum ${LIMITS.EDUCATION} characters
      2. Focus on relevant coursework and skills
      3. Highlight academic achievements
      4. Remove any bullet points
      5. Create one cohesive paragraph
      6. Use professional language
      7. Focus on career-relevant aspects
      8. Maintain active voice
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume writer specializing in academic achievements. Create concise, relevant education descriptions that highlight key learning outcomes and achievements.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    const data = await response.json();
    return enforceLimit(data.choices[0].message.content, LIMITS.EDUCATION);
  } catch (error) {
    console.error("Error enhancing education:", error);
    return enforceLimit(education, LIMITS.EDUCATION);
  }
}

export async function enhanceSkills(skills: string[]): Promise<string[]> {
  try {
    const prompt = `
      Refine and standardize the following professional skills for a resume:
      ${skills.join(", ")}

      **Guidelines:**
      1. Use industry-standard terminology.
      2. Remove redundant or outdated skills.
      3. Group related skills under broader categories.
      4. Prioritize relevant, high-demand skills based on industry standards.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume writer and career coach, specializing in optimizing professional skills for job applications. Ensure clarity, relevance, and proper categorization of skills.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No valid response from OpenAI.");
    }

    return data.choices[0].message.content
      .split("\n")
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length > 0);
  } catch (error) {
    console.error("Error enhancing skills:", error);
    return skills; // Return original skills in case of failure
  }
}

export async function enhanceInterests(interests: string[]): Promise<string[]> {
  try {
    const prompt = `
      Transform the following personal interests into professionally relevant and well-articulated activities:
      ${interests.join(", ")}

      **Guidelines:**
      1. Use professional and career-oriented language.
      2. Align interests with leadership, teamwork, or industry relevance.
      3. Remove overly personal or informal hobbies.
      4. Incorporate community involvement and skills development where applicable.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume writer specializing in enhancing personal interests to reflect professionalism, leadership, and career relevance.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No valid response from OpenAI.");
    }

    return data.choices[0].message.content
      .split("\n")
      .map((interest: string) => interest.trim())
      .filter((interest: string) => interest.length > 0);
  } catch (error) {
    console.error("Error enhancing interests:", error);
    return interests; // Return original interests in case of failure
  }
}

interface CertificationInput {
  name: string;
  issuer: string;
  date: string;
  description?: string;
}

interface CertificationOutput {
  name: string;
  issuer: string;
  date: string;
  description: string;
}

export async function enhanceCertification(
  certification: CertificationInput
): Promise<CertificationOutput> {
  try {
    const prompt = `
      Enhance this certification description:
      Name: ${certification.name}
      Issuer: ${certification.issuer}
      Description: ${certification.description || ""}

      Requirements:
      1. Maximum ${LIMITS.CERTIFICATION} characters for description
      2. Focus on the value and relevance of the certification
      3. Highlight specific skills or knowledge gained
      4. Use professional language
      5. Keep it concise and impactful
      6. Maintain active voice
      7. Remove any bullet points
      8. Include industry recognition if applicable
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume writer specializing in certification descriptions. Create concise, impactful descriptions that highlight the value and relevance of certifications.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    return {
      ...certification,
      description: enforceLimit(
        data.choices[0].message.content || certification.description || "",
        LIMITS.CERTIFICATION
      ),
    };
  } catch (error) {
    console.error("Error enhancing certification:", error);
    return {
      ...certification,
      description: certification.description || "",
    };
  }
}

export async function enhanceEducationDescription(education: {
  school: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  description?: string;
}): Promise<string> {
  try {
    const prompt = `
      Create an enhanced education description for:
      School: ${education.school}
      Degree: ${education.degree}
      Field: ${education.fieldOfStudy}
      Current Description: ${education.description || ""}

      Requirements:
      1. Maximum ${LIMITS.EDUCATION} characters
      2. Highlight key academic achievements
      3. Focus on relevant coursework
      4. Mention any honors or awards
      5. Include relevant projects or research
      6. Use professional language
      7. Keep it concise and impactful
      8. Maintain active voice
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume writer specializing in academic achievements. Create concise, relevant education descriptions that highlight key accomplishments and relevant coursework.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    const data = await response.json();
    return enforceLimit(data.choices[0].message.content, LIMITS.EDUCATION);
  } catch (error) {
    console.error("Error enhancing education description:", error);
    return education.description || "";
  }
}
