// // resume.ts
// export interface ResumeTemplate {
//   id: string;
//   name: string;
//   preview: string;
// }

// // declare module "jspdf-autotable";

// export interface ResumeData {
//   _id?: string;
//   id: string;
//   userId: string;
//   templateId: string;
//   personalInfo: {
//     fullName: string;
//     email: string;
//     phone: string;
//     location: string;
//     portfolioUrl?: string;
//     aboutMe?: string;
//     additionalDetails?: string;
//   };
//   education: {
//     school: string;
//     degree: string;
//     fieldOfStudy: string;
//     graduationYear: string;
//     description?: string;
//     gpa?: string;
//     honors?: string;
//   }[];
//   experience: {
//     company: string;
//     position: string;
//     startDate: string;
//     endDate: string;
//     description: string;
//     achievements: string[];
//   }[];
//   skills: string[];
//   interests: string[];
//   certifications: string[]; // <== Changed from [] to string[]
//   additionalSections: {
//     title: string;
//     content: string;
//   }[];
//   createdAt: string;
//   updatedAt: string;
// }
export interface ResumeTemplate {
  id: string;
  name: string;
  preview: string;
}

export interface ResumeData {
  _id?: string;
  id: string;
  userId: string;
  templateId: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    portfolioUrl?: string;
    aboutMe?: string;
    additionalDetails?: string;
  };
  education: {
    school: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: string;
    description?: string;
    gpa?: string;
    honors?: string;
  }[];
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }[];
  skills: string[];
  interests: string[];
  certifications: string[];
  additionalSections: {
    title: string;
    content: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
