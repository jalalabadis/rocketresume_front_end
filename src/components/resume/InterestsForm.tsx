// InterestsForm.tsx
import React, { useState } from "react";
import { Loader } from "lucide-react";
import OpenAI from "openai";
import { ResumeData } from "../../types/resume";

// Change the onChange prop so that it receives a new interests array.
interface InterestsFormProps {
  interests: string[];
  onChange: (newInterests: string[]) => void;
  // Optional resume context to tailor the suggestions.
  resumeContext?: Omit<
    ResumeData,
    "id" | "userId" | "templateId" | "createdAt" | "updatedAt"
  >;
}

const InterestsForm: React.FC<InterestsFormProps> = ({
  interests,
  onChange,
  resumeContext,
}) => {
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState<string>("");

  // Instantiate the OpenAI client.
  const openai = new OpenAI({
    apiKey:
      import.meta.env.VITE_NEXT_PUBLIC_OPENAI_API_KEY ||
      "YOUR_OPENAI_API_KEY_HERE",
    dangerouslyAllowBrowser: true,
  });

  const handleAISuggestion = async () => {
    setAiLoading(true);
    try {
      let prompt = "";
      if (resumeContext) {
        // Build a dynamic prompt using the resume context.
        const { personalInfo, skills, experience, education } = resumeContext;
        const name = personalInfo.fullName;
        const skillsText = skills.join(", ");
        const positions = experience.map((exp) => exp.position).join(", ");
        const degrees = education.map((edu) => edu.degree).join(", ");
        prompt = `Based on my resume details:
Name: ${name}
Skills: ${skillsText}
Positions: ${positions}
Degrees: ${degrees}
Please suggest 15 professional interests or hobbies that would complement my profile.
Return the result as a JSON array.`;
      } else {
        prompt = `Suggest 15 professional interests or hobbies that would complement a resume.
Return the result as a JSON array.`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        n: 1,
      });
      console.log("OpenAI interests response:", response);

      const output = response.choices[0]?.message?.content?.trim();
      let suggestions: string[] = [];
      if (output) {
        try {
          suggestions = JSON.parse(output);
          if (!Array.isArray(suggestions)) {
            suggestions = [];
          }
        } catch (parseError) {
          suggestions = output
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        }
      }
      if (suggestions.length > 15) {
        suggestions = suggestions.slice(0, 15);
      }
      setAiSuggestions(suggestions);
    } catch (error: any) {
      console.error("Error fetching AI interests suggestion:", error);
      alert("Failed to fetch AI interests suggestion. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // Append a manually typed interest.
  const handleAddNewInterest = () => {
    if (newInterest.trim() !== "") {
      const updated = [...interests, newInterest.trim()];
      onChange(updated);
      setNewInterest("");
    }
  };

  // When a suggestion is clicked, append it to the interests array if not already present.
  const handleSelectSuggestion = (suggestion: string) => {
    if (!interests.includes(suggestion)) {
      const updated = [...interests, suggestion];
      onChange(updated);
    }
    // Do not clear aiSuggestions so user can add many.
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Interests</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add your hobbies and interests to create a more personal connection.
        </p>

        {/* Display current interests as chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {interests.map((interest, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Input to add a new interest manually */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Type a new interest..."
          />
          <button
            type="button"
            onClick={handleAddNewInterest}
            className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {/* AI Suggest Interests Button */}
        <button
          type="button"
          onClick={handleAISuggestion}
          className="inline-flex items-center px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
          disabled={aiLoading}
        >
          {aiLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            "AI Suggest Interests"
          )}
        </button>

        {/* Render AI suggestions as buttons */}
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

        <p className="mt-2 text-sm text-gray-500">
          Type your interests manually or click the AI Suggest Interests button
          to get ideas.
        </p>
      </div>
    </div>
  );
};

export default InterestsForm;
