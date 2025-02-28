// import React, { useState } from "react";
// import { Loader } from "lucide-react";
// import OpenAI from "openai";
// import { ResumeData } from "../../types/resume";

// interface SkillsFormProps {
//   skills: string[];
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   // Optional resume context to tailor the prompt.
//   resumeContext?: Omit<
//     ResumeData,
//     "id" | "userId" | "templateId" | "createdAt" | "updatedAt"
//   >;
// }

// const SkillsForm: React.FC<SkillsFormProps> = ({
//   skills,
//   onChange,
//   resumeContext,
// }) => {
//   const [aiLoading, setAiLoading] = useState<boolean>(false);
//   const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
//   const [manualSkill, setManualSkill] = useState<string>("");
//   const [professionalSkillsInput, setProfessionalSkillsInput] =
//     useState<string>(skills.join(", "));

//   // Instantiate the OpenAI client using the Vite environment variable.
//   const openai = new OpenAI({
//     apiKey:
//       import.meta.env.VITE_NEXT_PUBLIC_OPENAI_API_KEY ||
//       "YOUR_OPENAI_API_KEY_HERE",
//     dangerouslyAllowBrowser: true,
//   });

//   const handleAISuggestion = async () => {
//     setAiLoading(true);
//     setAiSuggestions([]); // Clear previous suggestions before loading
//     try {
//       let prompt = "";
//       if (resumeContext) {
//         const { personalInfo, experience, education } = resumeContext;
//         const name = personalInfo.fullName;
//         const positions = experience.map((exp) => exp.position).join(", ");
//         const degrees = education.map((edu) => edu.degree).join(", ");
//         prompt = `Based on my resume details:
//   Name: ${name}
//   Positions: ${positions}
//   Degrees: ${degrees}
//   Please suggest 15 key professional skills that would best represent my expertise.
//   Return the result as a JSON array.`;
//       } else {
//         prompt = `Suggest 15 key professional skills that would be relevant for a resume.
//   Return the result as a JSON array.`;
//       }

//       const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: prompt }],
//         max_tokens: 200,
//         n: 1,
//       });

//       console.log("OpenAI skills response:", response);

//       const output = response.choices[0]?.message?.content?.trim();
//       let suggestions: string[] = [];
//       if (output) {
//         try {
//           suggestions = JSON.parse(output);
//           if (!Array.isArray(suggestions)) {
//             suggestions = [];
//           }
//         } catch (parseError) {
//           console.error("JSON parse error:", parseError);
//           suggestions = output
//             .split("\n")
//             .map((s) => s.trim())
//             .filter((s) => s.length > 0);
//         }
//       }

//       // Fallback to default skills if no suggestions are returned
//       if (suggestions.length === 0) {
//         suggestions = [
//           "JavaScript",
//           "React",
//           "Node.js",
//           "CSS",
//           "HTML",
//           "Python",
//           "Java",
//           "SQL",
//           "Git",
//           "Docker",
//           "AWS",
//           "TypeScript",
//           "REST APIs",
//           "GraphQL",
//           "Agile Methodology",
//         ];
//       }

//       // Limit to 15 suggestions
//       if (suggestions.length > 15) {
//         suggestions = suggestions.slice(0, 15);
//       }

//       setAiSuggestions(suggestions);
//     } catch (error: any) {
//       console.error("Error fetching AI skills suggestion:", error);
//       alert("Failed to fetch AI skills suggestion. Please try again.");
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const handleSelectSuggestion = (suggestion: string) => {
//     const currentSkills = skills.map((s) => s.trim()).filter((s) => s);
//     if (!currentSkills.includes(suggestion)) {
//       const newSkills = [...currentSkills, suggestion];
//       onChange({
//         target: { value: newSkills.join(", ") },
//       } as React.ChangeEvent<HTMLInputElement>);
//       setProfessionalSkillsInput(newSkills.join(", ")); // Update input field
//     }
//   };

//   const handleManualSkillAdd = () => {
//     if (manualSkill.trim() !== "") {
//       const currentSkills = skills.map((s) => s.trim()).filter((s) => s);
//       const newSkills = manualSkill
//         .split(",") // Split by commas
//         .map((s) => s.trim()) // Trim each skill
//         .filter((s) => s.length > 0); // Remove empty strings

//       newSkills.forEach((skill) => {
//         if (!currentSkills.includes(skill)) {
//           currentSkills.push(skill); // Add each skill individually
//         }
//       });

//       onChange({
//         target: { value: currentSkills.join(", ") },
//       } as React.ChangeEvent<HTMLInputElement>);
//       setManualSkill(""); // Clear the input field after adding.
//       setProfessionalSkillsInput(currentSkills.join(", ")); // Update professional skills input
//     }
//   };

//   const handleProfessionalSkillsInputChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     // Allow the user to type freely, including commas
//     setProfessionalSkillsInput(e.target.value);
//   };

//   const handleProfessionalSkillsInputBlur = () => {
//     // Split by commas, trim, and update the skills list when the input loses focus
//     const newSkills = professionalSkillsInput
//       .split(",")
//       .map((s) => s.trim())
//       .filter((s) => s.length > 0);

//     onChange({
//       target: { value: newSkills.join(", ") },
//     } as React.ChangeEvent<HTMLInputElement>);
//   };

//   const handleProfessionalSkillsInputKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     // Split by commas, trim, and update the skills list when the user presses Enter
//     if (e.key === "Enter") {
//       const newSkills = professionalSkillsInput
//         .split(",")
//         .map((s) => s.trim())
//         .filter((s) => s.length > 0);

//       onChange({
//         target: { value: newSkills.join(", ") },
//       } as React.ChangeEvent<HTMLInputElement>);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-xl font-semibold text-gray-900 mb-1">Skills</h2>
//         <p className="text-sm text-gray-500 mb-4">
//           Add your key skills and expertise. Separate them with commas.
//         </p>
//         <div className="space-y-4">
//           {/* Comma-separated skills input field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Professional Skills *
//             </label>
//             <input
//               type="text"
//               value={professionalSkillsInput}
//               onChange={handleProfessionalSkillsInputChange}
//               onBlur={handleProfessionalSkillsInputBlur}
//               onKeyDown={handleProfessionalSkillsInputKeyDown}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
//               placeholder="e.g., JavaScript, React, CSS"
//             />

//             <p className="mt-2 text-sm text-gray-500">
//               Add your key professional skills, separated by commas.
//             </p>
//           </div>

//           {/* Single manual skill input field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Add a Skill Manually
//             </label>
//             <div className="flex space-x-2 mt-1">
//               <input
//                 type="text"
//                 value={manualSkill}
//                 onChange={(e) => setManualSkill(e.target.value)}
//                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
//                 placeholder="Enter skills, e.g., Node.js, Python, SQL"
//               />
//               <button
//                 type="button"
//                 onClick={handleManualSkillAdd}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Add
//               </button>
//             </div>
//             <p className="mt-2 text-sm text-gray-500">
//               Enter skills separated by commas and click "Add" to append them to
//               your skills list.
//             </p>
//           </div>

//           {/* AI Suggestions */}
//           <button
//             type="button"
//             onClick={handleAISuggestion}
//             className="inline-flex items-center px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
//             disabled={aiLoading}
//           >
//             {aiLoading ? (
//               <Loader className="h-4 w-4 animate-spin" />
//             ) : (
//               "AI Suggest Skills"
//             )}
//           </button>

//           {aiSuggestions.length > 0 && (
//             <div className="mt-2 space-y-1">
//               {aiSuggestions.map((suggestion, idx) => (
//                 <button
//                   key={idx}
//                   type="button"
//                   onClick={() => handleSelectSuggestion(suggestion)}
//                   className="block w-full text-left px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
//                 >
//                   {suggestion}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SkillsForm;
import React, { useState } from "react";
import { Loader } from "lucide-react";
import OpenAI from "openai";
import { ResumeData } from "../../types/resume";

interface SkillsFormProps {
  skills: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resumeContext?: Omit<
    ResumeData,
    "id" | "userId" | "templateId" | "createdAt" | "updatedAt"
  >;
}

const SkillsForm: React.FC<SkillsFormProps> = ({
  skills,
  onChange,
  resumeContext,
}) => {
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [manualSkill, setManualSkill] = useState<string>("");
  const [professionalSkillsInput, setProfessionalSkillsInput] =
    useState<string>(skills.join(", "));
  const [error, setError] = useState<string>("");

  const openai = new OpenAI({
    apiKey:
      import.meta.env.VITE_NEXT_PUBLIC_OPENAI_API_KEY ||
      "YOUR_OPENAI_API_KEY_HERE",
    dangerouslyAllowBrowser: true,
  });

  const handleAISuggestion = async () => {
    // Validate if at least one skill is entered
    const currentSkills = professionalSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (currentSkills.length === 0) {
      setError(
        "Please enter at least one professional skill to get AI suggestions."
      );
      return;
    }

    setError("");
    setAiLoading(true);
    setAiSuggestions([]);

    try {
      let prompt = "";
      if (resumeContext) {
        const { personalInfo, experience, education } = resumeContext;
        const name = personalInfo.fullName || "the candidate";
        const positions = experience.map((exp) => exp.position).join(", ");
        const degrees = education.map((edu) => edu.degree).join(", ");
        prompt = `Based on the following resume details:
  - Name: ${name}
  - Positions: ${positions || "No positions provided"}
  - Degrees: ${degrees || "No degrees provided"}
  - Existing Skills: ${currentSkills.join(", ")}
  Please suggest 15 additional key professional skills that would complement the candidate's expertise. Return the result as a JSON array.`;
      } else {
        prompt = `The candidate has the following skills: ${currentSkills.join(
          ", "
        )}. Suggest 15 additional key professional skills that would complement these skills. Return the result as a JSON array.`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        n: 1,
      });

      console.log("OpenAI skills response:", response);

      const output = response.choices[0]?.message?.content?.trim();
      let suggestions: string[] = [];
      if (output) {
        try {
          suggestions = JSON.parse(output);
          if (!Array.isArray(suggestions)) {
            suggestions = [];
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          suggestions = output
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        }
      }

      if (suggestions.length === 0) {
        setAiSuggestions(["No suggestions available. Please try again."]);
      } else {
        if (suggestions.length > 15) {
          suggestions = suggestions.slice(0, 15);
        }
        setAiSuggestions(suggestions);
      }
    } catch (error: any) {
      console.error("Error fetching AI skills suggestion:", error);
      setAiSuggestions(["Failed to fetch suggestions. Please try again."]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    const currentSkills = skills.map((s) => s.trim()).filter((s) => s);
    if (!currentSkills.includes(suggestion)) {
      const newSkills = [...currentSkills, suggestion];
      onChange({
        target: { value: newSkills.join(", ") },
      } as React.ChangeEvent<HTMLInputElement>);
      setProfessionalSkillsInput(newSkills.join(", "));
    }
  };

  const handleManualSkillAdd = () => {
    if (manualSkill.trim() !== "") {
      const currentSkills = skills.map((s) => s.trim()).filter((s) => s);
      const newSkills = manualSkill
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      newSkills.forEach((skill) => {
        if (!currentSkills.includes(skill)) {
          currentSkills.push(skill);
        }
      });

      onChange({
        target: { value: currentSkills.join(", ") },
      } as React.ChangeEvent<HTMLInputElement>);
      setManualSkill("");
      setProfessionalSkillsInput(currentSkills.join(", "));
    }
  };

  const handleProfessionalSkillsInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfessionalSkillsInput(e.target.value);
    setError("");
  };

  const handleProfessionalSkillsInputBlur = () => {
    const newSkills = professionalSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onChange({
      target: { value: newSkills.join(", ") },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleProfessionalSkillsInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const newSkills = professionalSkillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      onChange({
        target: { value: newSkills.join(", ") },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Skills</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add your key skills and expertise. Separate them with commas.
        </p>
        <div className="space-y-4">
          {/* Comma-separated skills input field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Professional Skills *
            </label>
            <input
              type="text"
              value={professionalSkillsInput}
              onChange={handleProfessionalSkillsInputChange}
              onBlur={handleProfessionalSkillsInputBlur}
              onKeyDown={handleProfessionalSkillsInputKeyDown}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="e.g., JavaScript, React, CSS"
            />
            <p className="mt-2 text-sm text-gray-500">
              Add at least one key professional skill, separated by commas.
            </p>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          {/* Single manual skill input field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add a Skill Manually
            </label>
            <div className="flex space-x-2 mt-1">
              <input
                type="text"
                value={manualSkill}
                onChange={(e) => setManualSkill(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter skills, e.g., Node.js, Python, SQL"
              />
              <button
                type="button"
                onClick={handleManualSkillAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter skills separated by commas and click "Add" to append them to
              your skills list.
            </p>
          </div>

          {/* AI Suggestions */}
          <button
            type="button"
            onClick={handleAISuggestion}
            className="inline-flex items-center px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
            disabled={aiLoading}
          >
            {aiLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "AI Suggest Skills"
            )}
          </button>

          {aiSuggestions.length > 0 && (
            <div className="mt-2 space-y-1">
              {aiSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="block w-full text-left px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
