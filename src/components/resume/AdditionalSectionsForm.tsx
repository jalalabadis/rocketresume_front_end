// AdditionalSectionsForm.tsx
import React, { useState } from "react";
import { Plus, Trash2, Loader } from "lucide-react";
import OpenAI from "openai";

interface AdditionalSectionsFormProps {
  certifications: string[];
  additionalSections: {
    title: string;
    content: string;
  }[];
  onCertificationChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onAddCertification: () => void;
  onRemoveCertification: (index: number) => void;
  onSectionChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onAddSection: () => void;
  onRemoveSection: (index: number) => void;
}

const AdditionalSectionsForm: React.FC<AdditionalSectionsFormProps> = ({
  certifications,
  additionalSections,
  onCertificationChange,
  onAddCertification,
  onRemoveCertification,
  onSectionChange,
  onAddSection,
  onRemoveSection,
}) => {
  // Local state for AI suggestions for certification names.
  const [certLoading, setCertLoading] = useState<number | null>(null);
  const [certSuggestions, setCertSuggestions] = useState<{
    index: number;
    options: string[];
  } | null>(null);

  // Instantiate the OpenAI client.
  const openai = new OpenAI({
    apiKey:
      import.meta.env.VITE_NEXT_PUBLIC_OPENAI_API_KEY ||
      "YOUR_OPENAI_API_KEY_HERE",
    dangerouslyAllowBrowser: true,
  });

  // Handler to fetch AI suggestions for certification names.
  const handleCertAISuggestion = async (index: number) => {
    setCertLoading(index);
    try {
      // Get current certification text, if any.
      const currentCert = certifications[index]?.trim();
      // Build a prompt that instructs the AI to return a JSON array with at least 5 suggestions.
      const prompt = currentCert
        ? `Based on my resume for a front-end developer and the current certification "${currentCert}", return a JSON array (with no extra text) of at least 5 refined or complementary professional certification names. For example: ["Certified Front-End Developer", "Front-End Development Professional", "HTML5/CSS3 Expert Certification", "JavaScript Specialist Certification", "UX/UI Design Certification"].`
        : `Based on my resume for a front-end developer, return a JSON array (with no extra text) of at least 5 professional certification names that would add value. For example: ["Certified Front-End Developer", "Front-End Development Professional", "HTML5/CSS3 Expert Certification", "JavaScript Specialist Certification", "UX/UI Design Certification"].`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        n: 1,
      });
      console.log("OpenAI certification response:", response);
      const output = response.choices[0]?.message?.content?.trim();
      let options: string[] = [];
      if (output) {
        try {
          // Attempt to parse the output as JSON.
          options = JSON.parse(output);
          if (!Array.isArray(options)) {
            options = [];
          }
        } catch (parseError) {
          // Fallback: split by newlines.
          options = output
            .split("\n")
            .map((o) => o.trim())
            .filter((o) => o.length > 0);
        }
      }
      // If fewer than 5 suggestions are returned, you might choose to re-prompt or use what you got.
      setCertSuggestions({ index, options });
    } catch (error: any) {
      console.error("Error fetching certification AI suggestion:", error);
      alert(
        "Failed to fetch certification AI suggestion. Please try again. " +
          (error.message || "")
      );
    } finally {
      setCertLoading(null);
    }
  };

  // When a user selects an AI suggestion, append it to the current certification field.
  const selectCertSuggestion = (index: number, option: string) => {
    const currentValue = certifications[index].trim();
    // Append the suggestion separated by a comma if the field already has text.
    const newValue = currentValue ? `${currentValue}, ${option}` : option;
    onCertificationChange(index, {
      target: { value: newValue },
    } as React.ChangeEvent<HTMLInputElement>);
    // Do not clear suggestions so the user can select additional options.
  };

  return (
    <div className="space-y-8">
      {/* Certifications Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Certifications
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Add your professional certifications (only the certification name is
          needed).
        </p>
        {certifications.map((cert, index) => (
          <div key={index} className="mb-6 p-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Certification {index + 1}
              </h3>
              <button
                type="button"
                onClick={() => onRemoveCertification(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col space-y-1">
              <input
                type="text"
                name="certification"
                value={cert}
                onChange={(e) => onCertificationChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter certification name"
              />
              <button
                type="button"
                onClick={() => handleCertAISuggestion(index)}
                className="mt-2 px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                disabled={certLoading === index}
              >
                {certLoading === index ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "AI Suggestion"
                )}
              </button>
              {certSuggestions &&
                certSuggestions.index === index &&
                certSuggestions.options.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {certSuggestions.options.map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectCertSuggestion(index, option)}
                        className="block w-full text-left px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddCertification}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Certification
        </button>
      </div>

      {/* Additional Sections */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Additional Sections
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Add any other sections you'd like to include in your resume.
        </p>
        {additionalSections.map((section, index) => (
          <div key={index} className="mb-6 p-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Custom Section {index + 1}
              </h3>
              <button
                type="button"
                onClick={() => onRemoveSection(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Section Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={section.title}
                  onChange={(e) => onSectionChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="e.g., Publications, Awards, Languages"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  name="content"
                  rows={4}
                  value={section.content}
                  onChange={(e) => onSectionChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Add the content for this section..."
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddSection}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Custom Section
        </button>
      </div>
    </div>
  );
};

export default AdditionalSectionsForm;
