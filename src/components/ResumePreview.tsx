// // ResumePreview.tsx
// import React from "react";
// import { ResumeData } from "../types/resume";

// interface ResumePreviewProps {
//   data: ResumeData;
// }

// const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
//   return (
//     <div className="bg-white p-8 shadow-xl max-w-4xl mx-auto font-serif">
//       {/* Header */}
//       <div className="mb-8 border-b-2 border-primary-200 pb-6">
//         <h1 className="text-4xl font-bold mb-3 text-gray-900 font-heading">
//           {data.personalInfo.fullName}
//         </h1>
//         <div className="text-base flex flex-wrap gap-3 text-gray-600">
//           <span className="font-medium">{data.personalInfo.email}</span>
//           <span className="text-gray-400">•</span>
//           <span className="font-medium">{data.personalInfo.phone}</span>
//           <span className="text-gray-400">•</span>
//           <span className="font-medium">{data.personalInfo.location}</span>
//           {data.personalInfo.portfolioUrl && (
//             <>
//               <span className="text-gray-400">•</span>
//               <a
//                 href={data.personalInfo.portfolioUrl}
//                 className="text-primary-600 hover:text-primary-700 font-medium"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Portfolio
//               </a>
//             </>
//           )}
//         </div>
//       </div>

//       {/* About Me */}
//       {data.personalInfo.aboutMe && (
//         <div className="mb-8">
//           <p className="text-gray-800 leading-relaxed text-lg">
//             {data.personalInfo.aboutMe}
//           </p>
//         </div>
//       )}

//       {/* Work Experience */}
//       <div className="mb-8">
//         <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
//           Work Experience
//         </h2>
//         {data.experience.map((exp, index) => (
//           <div key={index} className="mb-6">
//             <div className="flex justify-between items-baseline mb-2">
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900">
//                   {exp.company}
//                 </h3>
//                 <p className="text-lg text-primary-600 font-medium">
//                   {exp.position}
//                 </p>
//               </div>
//               <p className="text-sm text-gray-600 font-medium">
//                 {new Date(exp.startDate).toLocaleDateString("en-US", {
//                   month: "short",
//                   year: "numeric",
//                 })}{" "}
//                 -{" "}
//                 {exp.endDate
//                   ? new Date(exp.endDate).toLocaleDateString("en-US", {
//                       month: "short",
//                       year: "numeric",
//                     })
//                   : "Present"}
//               </p>
//             </div>
//             <p className="text-gray-700 mb-3 leading-relaxed">
//               {exp.description}
//             </p>
//             {exp.achievements &&
//               exp.achievements.length > 0 &&
//               exp.achievements[0] !== "" && (
//                 <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
//                   {exp.achievements.map((achievement, i) => (
//                     <li key={i} className="leading-relaxed">
//                       {achievement}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//           </div>
//         ))}
//       </div>

//       {/* Education */}
//       <div className="mb-8">
//         <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
//           Education
//         </h2>
//         {data.education.map((edu, index) => (
//           <div key={index} className="mb-6">
//             <div className="flex justify-between items-baseline mb-2">
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900">
//                   {edu.school}
//                 </h3>
//                 <p className="text-lg text-primary-600 font-medium">
//                   {edu.degree} in {edu.fieldOfStudy}
//                 </p>
//               </div>
//               <p className="text-sm text-gray-600 font-medium">
//                 {edu.graduationYear}
//               </p>
//             </div>
//             {edu.description && (
//               <p className="text-gray-700 leading-relaxed">{edu.description}</p>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Certifications */}
//       {data.certifications && data.certifications.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
//             Certifications
//           </h2>
//           <ol className="list-decimal list-inside text-gray-700 space-y-2">
//             {data.certifications.map((cert, index) => (
//               <li key={index}>{cert}</li>
//             ))}
//           </ol>
//         </div>
//       )}

//       {/* Skills */}
//       {data.skills.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
//             Skills
//           </h2>
//           <div className="flex flex-wrap gap-2">
//             {data.skills.map((skill, index) => (
//               <span
//                 key={index}
//                 className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full font-medium text-sm"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Interests */}
//       {data.interests.length > 0 && (
//         <div className="mb-8">
//           <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
//             Interests
//           </h2>
//           <div className="flex flex-wrap gap-2">
//             {data.interests.map((interest, index) => (
//               <span
//                 key={index}
//                 className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium text-sm"
//               >
//                 {interest}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Additional Sections */}
//       {data.additionalSections &&
//         data.additionalSections.length > 0 &&
//         data.additionalSections.map(
//           (section, index) =>
//             section.title &&
//             section.content && (
//               <div key={index} className="mb-8">
//                 <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
//                   {section.title}
//                 </h2>
//                 <div className="text-gray-700 whitespace-pre-line leading-relaxed">
//                   {section.content}
//                 </div>
//               </div>
//             )
//         )}

//       {/* Additional Information */}
//       {data.personalInfo.additionalDetails && (
//         <div className="mb-8">
//           <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
//             Additional Information
//           </h2>
//           <div className="text-gray-700 whitespace-pre-line leading-relaxed">
//             {data.personalInfo.additionalDetails}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumePreview;
import React from "react";
import { ResumeData } from "../types/resume";

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  return (
    <div className="bg-white p-8 shadow-xl max-w-4xl mx-auto font-serif">
      {/* Header */}
      <div className="mb-8 border-b-2 border-primary-200 pb-6">
        <h1 className="text-4xl font-bold mb-3 text-gray-900 font-heading">
          {data.personalInfo.fullName}
        </h1>
        <div className="text-base flex flex-wrap gap-3 text-gray-600">
          <span className="font-medium">{data.personalInfo.email}</span>
          <span className="text-gray-400">•</span>
          <span className="font-medium">{data.personalInfo.phone}</span>
          <span className="text-gray-400">•</span>
          <span className="font-medium">{data.personalInfo.location}</span>
          {data.personalInfo.portfolioUrl && (
            <>
              <span className="text-gray-400">•</span>
              <a
                href={data.personalInfo.portfolioUrl}
                className="text-primary-600 hover:text-primary-700 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      {/* About Me */}
      {data.personalInfo.aboutMe && (
        <div className="mb-8">
          <p className="text-gray-800 leading-relaxed text-lg">
            {data.personalInfo.aboutMe}
          </p>
        </div>
      )}

      {/* Work Experience */}
      <div className="mb-8">
        <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
          Work Experience
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {exp.company}
                </h3>
                <p className="text-lg text-primary-600 font-medium">
                  {exp.position}
                </p>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {new Date(exp.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}{" "}
                -{" "}
                {exp.endDate
                  ? new Date(exp.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "Present"}
              </p>
            </div>
            <p className="text-gray-700 mb-3 leading-relaxed">
              {exp.description}
            </p>
            {exp.achievements &&
              exp.achievements.length > 0 &&
              exp.achievements[0] !== "" && (
                <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="leading-relaxed">
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-8">
        <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
          Education
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {edu.school}
                </h3>
                <p className="text-lg text-primary-600 font-medium">
                  {edu.degree} in {edu.fieldOfStudy}
                </p>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {edu.graduationYear}
              </p>
            </div>
            {edu.description && (
              <p className="text-gray-700 leading-relaxed">{edu.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
            Certifications
          </h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            {data.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full font-medium text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {data.interests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
            Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Sections */}
      {data.additionalSections &&
        data.additionalSections.length > 0 &&
        data.additionalSections.map((section, index) =>
          section.title && section.content ? (
            <div key={index} className="mb-8">
              <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
                {section.title}
              </h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {section.content}
              </div>
            </div>
          ) : null
        )}

      {/* Additional Information */}
      {data.personalInfo.additionalDetails && (
        <div className="mb-8">
          <h2 className="text-xl font-bold uppercase text-gray-900 mb-4 border-b-2 border-primary-200 pb-2 font-heading">
            Additional Information
          </h2>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {data.personalInfo.additionalDetails}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
