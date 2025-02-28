import React, { useState } from "react";
import { Plus, Trash2, Loader } from "lucide-react";
import { ResumeData } from "../../types/resume";
import OpenAI from "openai";

interface ExperienceFormProps {
  experiences: ResumeData["experience"];
  onChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onAchievementChange: (
    expIndex: number,
    achIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onAddAchievement: (expIndex: number) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experiences,
  onChange,
  onAdd,
  onRemove,
  onAchievementChange,
  onAddAchievement,
}) => {
  const [loading, setLoading] = useState<{
    expIndex: number;
    achIndex?: number;
    type: "achievement" | "description";
  } | null>(null);

  const [suggestions, setSuggestions] = useState<{
    expIndex: number;
    achIndex?: number;
    type: "achievement" | "description";
    options: string[];
  } | null>(null);

  const openai = new OpenAI({
    apiKey:
      import.meta.env.VITE_NEXT_PUBLIC_OPENAI_API_KEY ||
      "YOUR_OPENAI_API_KEY_HERE",
    dangerouslyAllowBrowser: true,
  });

  // Helper function to count words in a string
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleAISuggestion = async (
    expIndex: number,
    achIndex?: number,
    type: "achievement" | "description" = "achievement"
  ) => {
    setLoading({ expIndex, achIndex, type });
    try {
      let prompt = "";
      let maxTokens = 150;

      const position = experiences[expIndex].position || "your role";
      const company = experiences[expIndex].company || "the company";
      const startDate = experiences[expIndex].startDate || "start date";
      const endDate = experiences[expIndex].endDate || "end date";

      if (type === "achievement") {
        const currentAchievement =
          experiences[expIndex].achievements[achIndex ?? 0] || "team lead";
        prompt = `Based on my experience as a ${position} at ${company}, where I worked on real projects, suggest one sentence alternative achievement statements for: "${currentAchievement}". Avoid generic corporate jargon.`;
        maxTokens = 50;
      } else {
        const currentDescription = experiences[expIndex].description || "";
        const isCurrent =
          !experiences[expIndex].endDate ||
          new Date(experiences[expIndex].endDate) > new Date();

        const start = new Date(startDate);
        const end = isCurrent ? new Date() : new Date(endDate);
        const durationInMonths =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        const durationText =
          durationInMonths >= 12
            ? `${Math.floor(durationInMonths / 12)} year${
                Math.floor(durationInMonths / 12) > 1 ? "s" : ""
              }`
            : `${durationInMonths} month${durationInMonths > 1 ? "s" : ""}`;

        if (isCurrent) {
          prompt = `Rewrite the following description in a clear, friendly tone over 2–3 sentences, emphasizing that you are currently working as a ${position} at ${company} since ${startDate} (a period of ${durationText}). Detail your ongoing contributions:\n\n"${currentDescription}"`;
        } else {
          prompt = `Rewrite the following description in a professional tone over 2–3 sentences, highlighting your contributions as a ${position} at ${company} from ${startDate} to ${endDate} (a period of ${durationText}). For example: "As a ${position} at ${company}, I contributed to creating user-friendly web interfaces that enhance customer interactions."\n\nCurrent description: "${currentDescription}"`;
        }
        maxTokens = 250;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
        n: 3,
      });

      const options = response.choices
        .map((choice) => choice.message?.content?.trim())
        .filter((option): option is string => Boolean(option));

      setSuggestions({
        expIndex,
        achIndex,
        type,
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

  const selectSuggestion = (
    expIndex: number,
    option: string,
    type: "achievement" | "description",
    achIndex?: number
  ) => {
    if (type === "achievement" && achIndex !== undefined) {
      onAchievementChange(expIndex, achIndex, {
        target: { value: option },
      } as React.ChangeEvent<HTMLInputElement>);
    } else if (type === "description") {
      onChange(expIndex, {
        target: { name: "description", value: option },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }
    setSuggestions(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Work Experience
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Add your relevant work experience, starting with the most recent.
        </p>

        {experiences.map((exp, index) => (
          <div key={index} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Position {index + 1}
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
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={exp.company}
                  onChange={(e) => onChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              {/* Position Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position Title *
                </label>
                <input
                  type="text"
                  name="position"
                  required
                  value={exp.position}
                  onChange={(e) => onChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={exp.startDate}
                  onChange={(e) => onChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={exp.endDate}
                  onChange={(e) => onChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                  rows={4}
                  value={exp.description}
                  onChange={(e) => onChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Describe your responsibilities and achievements and write minimum 15 words ..."
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAISuggestion(index, undefined, "description")
                  }
                  className="mt-2 px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                  disabled={
                    (loading?.expIndex === index &&
                      loading?.type === "description") ||
                    countWords(exp.description) < 15 // Disable if less than 25 words
                  }
                >
                  {loading?.expIndex === index &&
                  loading?.type === "description" ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    "Correct Your Description with AI"
                  )}
                </button>
                {suggestions &&
                  suggestions.type === "description" &&
                  suggestions.expIndex === index && (
                    <div className="mt-2 space-y-1">
                      {suggestions.options.map((option, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            selectSuggestion(index, option, "description")
                          }
                          className="block w-full text-left px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {/* Achievements Section */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Responsibilities / Achievements
              </label>
              {exp.achievements.map((ach, achIndex) => (
                <div key={achIndex} className="flex flex-col mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name={`achievement-${achIndex}`}
                      value={ach}
                      onChange={(e) => onAchievementChange(index, achIndex, e)}
                      className="flex-grow mt-1 block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Enter responsibility/achievement"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleAISuggestion(index, achIndex, "achievement")
                      }
                      className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      disabled={
                        loading?.expIndex === index &&
                        loading?.achIndex === achIndex
                      }
                    >
                      {loading?.expIndex === index &&
                      loading?.achIndex === achIndex ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        "AI Suggestion"
                      )}
                    </button>
                  </div>
                  {suggestions &&
                    suggestions.type === "achievement" &&
                    suggestions.expIndex === index &&
                    suggestions.achIndex === achIndex && (
                      <div className="space-y-1">
                        {suggestions.options.map((option, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              selectSuggestion(
                                index,
                                option,
                                "achievement",
                                achIndex
                              )
                            }
                            className="block w-full text-left px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => onAddAchievement(index)}
                className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Achievement
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Another Position
        </button>
      </div>
    </div>
  );
};

export default ExperienceForm;
