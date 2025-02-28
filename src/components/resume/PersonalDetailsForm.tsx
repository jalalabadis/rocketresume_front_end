import React from "react";
import { ResumeData } from "../../types/resume";

interface PersonalDetailsFormProps {
  formData: ResumeData["personalInfo"];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Personal Details
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Provide your contact information so employers can reach you.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              required
              value={formData.fullName}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              value={formData.phone}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="(555) 555-5555"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              value={formData.location}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="City, State"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="portfolioUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Portfolio URL <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="url"
              name="portfolioUrl"
              id="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="https://your-portfolio.com"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="additionalDetails"
              className="block text-sm font-medium text-gray-700"
            >
              Additional Information{" "}
              <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              name="additionalDetails"
              id="additionalDetails"
              rows={4}
              value={formData.additionalDetails}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Add any additional information you'd like to include..."
            />
          </div>
          {/* New About Resume Field */}
          <div className="sm:col-span-2">
            <label
              htmlFor="aboutMe"
              className="block text-sm font-medium text-gray-700"
            >
              About Resume <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              name="aboutMe"
              id="aboutMe"
              rows={3}
              value={formData.aboutMe || ""}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Enter a brief summary that highlights your experience, skills, and unique qualities. This summary will appear just below your name in your resume."
            />
            <p className="mt-2 text-xs text-gray-500">
              Please provide 2-3 sentences highlighting your professional
              background, key strengths, and career goals. If you choose not to
              include them, no worries—we will add them based on your resume
              summary at the end.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
