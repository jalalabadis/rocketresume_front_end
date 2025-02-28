// EducationForm.tsx
import React, { useState } from "react";
import { Plus, Trash2, Loader } from "lucide-react";
import { ResumeData } from "../../types/resume";
import OpenAI from "openai";

interface EducationFormProps {
  education: ResumeData["education"];
  onChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  onChange,
  onAdd,
  onRemove,
}) => {
  // Local state for AI suggestions for the description field.
  const [loading, setLoading] = useState<{
    eduIndex: number;
    type: "description";
  } | null>(null);

  const [suggestions, setSuggestions] = useState<{
    eduIndex: number;
    type: "description";
    options: string[];
  } | null>(null);

  // Local state to track toggling optional fields  each education entry.
  const [showOptional, setShowOptional] = useState<Record<number, boolean>>({});

  // Instantiate OpenAI client using Vite environment variable.
  const openai = new OpenAI({
    apiKey:
      import.meta.env.VITE_NEXT_PUBLIC_OPENAI_API_KEY ||
      "YOUR_OPENAI_API_KEY_HERE",
    dangerouslyAllowBrowser: true,
  });

  // Handler to fetch AI suggestions for the education description.
  const handleAISuggestion = async (eduIndex: number) => {
    setLoading({ eduIndex, type: "description" });
    try {
      const currentDescription = education[eduIndex].description || "";
      const degree = education[eduIndex].degree || "your degree";
      const fieldOfStudy =
        education[eduIndex].fieldOfStudy || "your field of study";

      // Build a prompt that asks for a refined, friendly, and professional rewrite.
      const prompt = `Based on my education in ${fieldOfStudy} with a degree in ${degree}, rewrite the following description using 2-3 sentences in a clear, friendly, and professional tone . Start with "I learned" and enhance the existing description:\n\n"${currentDescription}"\n\nProvide 3 alternative suggestions.`;
      const maxTokens = 250;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
        n: 3, // Request 3 options
      });

      console.log("OpenAI response:", response);

      const options = response.choices
        .map((choice) => choice.message?.content?.trim())
        .filter((option): option is string => Boolean(option));

      setSuggestions({
        eduIndex,
        type: "description",
        options,
      });
    } catch (error: any) {
      console.error("Error fetching AI suggestion:", error);
      alert(
        "Failed to fetch AI suggestion. Please try again. " +
          (error.message || "")
      );
    } finally {
      setLoading(null);
    }
  };

  // Handler to select one of the AI suggestions.
  const selectSuggestion = (eduIndex: number, option: string) => {
    onChange(eduIndex, {
      target: { name: "description", value: option },
    } as React.ChangeEvent<HTMLTextAreaElement>);
    setSuggestions(null);
  };

  // Toggle optional fields for GPA and Honors.
  const toggleOptionalFields = (eduIndex: number) => {
    setShowOptional((prev) => ({
      ...prev,
      [eduIndex]: !prev[eduIndex],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Education</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add your educational background, starting with the most recent.
        </p>

        {education.map((edu, index) => (
          <div key={index} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Education {index + 1}
              </h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* School/University */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  School/University *
                </label>
                <input
                  type="text"
                  name="school"
                  required
                  value={edu.school}
                  onChange={(e) => onChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              {/* Degree */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Degree *
                </label>
                <input
                  type="text"
                  name="degree"
                  required
                  value={edu.degree}
                  onChange={(e) => onChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              {/* Field of Study */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Field of Study *
                </label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  required
                  value={edu.fieldOfStudy}
                  onChange={(e) => onChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              {/* Graduation Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Graduation Year *
                </label>
                <input
                  type="text"
                  name="graduationYear"
                  required
                  value={edu.graduationYear}
                  onChange={(e) => onChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="YYYY"
                />
              </div>
              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={edu.description}
                  onChange={(e) => onChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Additional details about your education, research, or academic projects."
                />
                <button
                  type="button"
                  onClick={() => handleAISuggestion(index)}
                  className="mt-2 px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                  disabled={
                    loading?.eduIndex === index &&
                    loading?.type === "description"
                  }
                >
                  {loading?.eduIndex === index &&
                  loading?.type === "description" ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    "AI Suggestion for Description"
                  )}
                </button>
                {suggestions &&
                  suggestions.type === "description" &&
                  suggestions.eduIndex === index && (
                    <div className="mt-2 space-y-1">
                      {suggestions.options.map((option, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => selectSuggestion(index, option)}
                          className="block w-full text-left px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {/* Optional Fields for GPA and Honors */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => toggleOptionalFields(index)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
              >
                <Plus className="h-5 w-5 mr-1" />
                {showOptional[index]
                  ? "Hide CGPA / Honors"
                  : "Add CGPA / Honors"}
              </button>
              {showOptional[index] && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      GPA (optional)
                    </label>
                    <input
                      type="text"
                      name="gpa"
                      value={(edu as any).gpa || ""}
                      onChange={(e) => onChange(index, e)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="e.g., 3.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Honors / Extracurriculars (optional)
                    </label>
                    <input
                      type="text"
                      name="honors"
                      value={(edu as any).honors || ""}
                      onChange={(e) => onChange(index, e)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="e.g., Dean's List, Student Council"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Another Education
        </button>
      </div>
    </div>
  );
};

export default EducationForm;
