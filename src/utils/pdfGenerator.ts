// import { ResumeData } from "../types/resume";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// // Modern color themes
// const themes = {
//   modern: {
//     primary: [41, 108, 242], // Modern blue
//     secondary: [237, 242, 247], // Light blue-gray
//     text: [45, 55, 72], // Dark blue-gray
//     subtext: [113, 128, 150], // Medium blue-gray
//     accent: [66, 153, 225], // Sky blue
//   },
//   minimal: {
//     primary: [45, 55, 72], // Dark gray
//     secondary: [247, 250, 252], // Light gray
//     text: [26, 32, 44], // Almost black
//     subtext: [113, 128, 150], // Medium gray
//     accent: [160, 174, 192], // Cool gray
//   },
//   elegant: {
//     primary: [76, 81, 191], // Royal blue
//     secondary: [237, 242, 247], // Light gray
//     text: [44, 82, 130], // Navy
//     subtext: [74, 85, 104], // Cool gray
//     accent: [49, 130, 206], // Bright blue
//   },
// };

// export const generatePDF = async (resumeData: ResumeData): Promise<Blob> => {
//   // Create PDF with A4 dimensions
//   const pdf = new jsPDF({
//     orientation: "portrait",
//     unit: "pt",
//     format: "a4",
//   });

//   // Select theme (can be customized based on user preference)
//   const theme = themes.modern;

//   // PDF styling constants
//   const styles = {
//     margin: {
//       top: 40,
//       bottom: 40,
//       left: 50,
//       right: 50,
//     },
//     lineHeight: {
//       tight: 1.2,
//       normal: 1.4,
//       loose: 1.6,
//     },
//     fontSize: {
//       name: 24,
//       section: 16,
//       subsection: 14,
//       normal: 11,
//       small: 10,
//     },
//     colors: theme,
//     spacing: {
//       section: 25,
//       item: 15,
//       paragraph: 10,
//     },
//   };

//   // Page dimensions
//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const contentWidth = pageWidth - styles.margin.left - styles.margin.right;
//   let yPos = styles.margin.top;

//   // Helper function to add a new page if needed
//   const checkNewPage = (height: number) => {
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     if (yPos + height > pageHeight - styles.margin.bottom) {
//       pdf.addPage();
//       yPos = styles.margin.top;
//       return true;
//     }
//     return false;
//   };

//   // Helper function for text wrapping
//   const addWrappedText = (
//     text: string,
//     options: {
//       fontSize?: number;
//       color?: number[];
//       bold?: boolean;
//       align?: "left" | "center" | "right";
//       maxWidth?: number;
//       lineHeight?: number;
//       indent?: number;
//     } = {}
//   ) => {
//     const {
//       fontSize = styles.fontSize.normal,
//       color = styles.colors.text,
//       bold = false,
//       align = "left",
//       maxWidth = contentWidth,
//       lineHeight = styles.lineHeight.normal,
//       indent = 0,
//     } = options;

//     pdf.setFontSize(fontSize);
//     pdf.setFont("helvetica", bold ? "bold" : "normal");
//     pdf.setTextColor(color[0], color[1], color[2]);

//     const lines = pdf.splitTextToSize(text, maxWidth - indent);
//     const textHeight = fontSize * lineHeight * lines.length;

//     checkNewPage(textHeight);

//     lines.forEach((line: string) => {
//       let xPos = styles.margin.left + indent;
//       if (align === "center") {
//         xPos = (pageWidth - pdf.getTextWidth(line)) / 2;
//       } else if (align === "right") {
//         xPos = pageWidth - styles.margin.right - pdf.getTextWidth(line);
//       }

//       pdf.text(line, xPos, yPos);
//       yPos += fontSize * lineHeight;
//     });

//     return textHeight;
//   };

//   // Add header with gradient background
//   const headerHeight = 130;
//   pdf.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
//   pdf.rect(0, 0, pageWidth, headerHeight, "F");

//   // Add name and contact info
//   yPos = 50;
//   addWrappedText(resumeData.personalInfo.fullName, {
//     fontSize: styles.fontSize.name,
//     color: [255, 255, 255],
//     bold: true,
//     align: "center",
//   });

//   yPos += 10;
//   const contactInfo = [
//     resumeData.personalInfo.email,
//     resumeData.personalInfo.phone,
//     resumeData.personalInfo.location,
//     resumeData.personalInfo.portfolioUrl,
//   ]
//     .filter(Boolean)
//     .join(" • ");

//   addWrappedText(contactInfo, {
//     fontSize: styles.fontSize.normal,
//     color: [255, 255, 255],
//     align: "center",
//   });

//   yPos = headerHeight + styles.spacing.section;

//   // Add sections
//   const addSection = (title: string, content: () => void) => {
//     // Add section title with modern styling
//     pdf.setFillColor(
//       theme.secondary[0],
//       theme.secondary[1],
//       theme.secondary[2]
//     );
//     pdf.roundedRect(
//       styles.margin.left - 10,
//       yPos - 15,
//       contentWidth + 20,
//       40,
//       3,
//       3,
//       "F"
//     );

//     addWrappedText(title.toUpperCase(), {
//       fontSize: styles.fontSize.section,
//       color: theme.primary,
//       bold: true,
//     });

//     yPos += 30;
//     content();
//     yPos += styles.spacing.section;
//   };

//   // About Me section
//   if (
//     resumeData.personalInfo.aboutMe &&
//     resumeData.personalInfo.aboutMe.trim()
//   ) {
//     addSection("About Me", () => {
//       addWrappedText(resumeData.personalInfo.aboutMe || "", {
//         lineHeight: styles.lineHeight.loose,
//       });
//     });
//   }

//   // Experience section
//   if (resumeData.experience.length > 0) {
//     addSection("Professional Experience", () => {
//       resumeData.experience.forEach((exp, index) => {
//         if (index > 0) yPos += styles.spacing.item;

//         // Company and position
//         addWrappedText(`${exp.position} at ${exp.company}`, {
//           fontSize: styles.fontSize.subsection,
//           bold: true,
//           color: theme.primary,
//         });

//         // Dates
//         addWrappedText(
//           `${new Date(exp.startDate).toLocaleDateString("en-US", {
//             month: "long",
//             year: "numeric",
//           })} - ${
//             exp.endDate
//               ? new Date(exp.endDate).toLocaleDateString("en-US", {
//                   month: "long",
//                   year: "numeric",
//                 })
//               : "Present"
//           }`,
//           {
//             fontSize: styles.fontSize.small,
//             color: theme.subtext,
//           }
//         );

//         // Description
//         yPos += styles.spacing.paragraph;
//         addWrappedText(exp.description, {
//           indent: 10,
//           lineHeight: styles.lineHeight.normal,
//         });

//         // Achievements
//         if (exp.achievements.length > 0 && exp.achievements[0] !== "") {
//           yPos += styles.spacing.paragraph;
//           exp.achievements.forEach((achievement) => {
//             addWrappedText(`• ${achievement}`, {
//               indent: 20,
//               lineHeight: styles.lineHeight.normal,
//             });
//           });
//         }
//       });
//     });
//   }

//   // Education section
//   if (resumeData.education.length > 0) {
//     addSection("Education", () => {
//       resumeData.education.forEach((edu, index) => {
//         if (index > 0) yPos += styles.spacing.item;

//         addWrappedText(`${edu.degree} in ${edu.fieldOfStudy}`, {
//           fontSize: styles.fontSize.subsection,
//           bold: true,
//           color: theme.primary,
//         });

//         addWrappedText(`${edu.school} - ${edu.graduationYear}`, {
//           color: theme.subtext,
//         });

//         if (edu.description) {
//           yPos += styles.spacing.paragraph;
//           addWrappedText(edu.description, {
//             indent: 10,
//             lineHeight: styles.lineHeight.normal,
//           });
//         }
//       });
//     });
//   }

//   // Skills section
//   if (resumeData.skills.length > 0) {
//     addSection("Skills", () => {
//       // Create skill badges
//       const skillsText = resumeData.skills.join(" • ");
//       addWrappedText(skillsText, {
//         lineHeight: styles.lineHeight.normal,
//       });
//     });
//   }

//   // Interests section
//   if (resumeData.interests.length > 0) {
//     addSection("Interests", () => {
//       const interestsText = resumeData.interests.join(" • ");
//       addWrappedText(interestsText, {
//         lineHeight: styles.lineHeight.normal,
//       });
//     });
//   }

//   // Additional sections
//   if (resumeData.additionalSections) {
//     resumeData.additionalSections.forEach((section) => {
//       if (section.title && section.content) {
//         addSection(section.title, () => {
//           addWrappedText(section.content, {
//             lineHeight: styles.lineHeight.normal,
//           });
//         });
//       }
//     });
//   }

//   return pdf.output("blob");
// };
import { ResumeData } from "../types/resume";
import jsPDF from "jspdf";

// Professional color scheme (Navy and Gold)
const colors = {
  primary: [28, 52, 97], // Navy blue
  secondary: [198, 150, 45], // Gold
  text: [51, 51, 51], // Dark gray
  subtext: [102, 102, 102], // Medium gray
  border: [220, 220, 220], // Light gray
};

const styles = {
  fonts: {
    name: 32, // Increased for better prominence
    section: 18,
    subsection: 14,
    normal: 11,
    small: 10,
  },
  spacing: {
    section: 35,
    item: 20,
    paragraph: 15,
  },
  margin: {
    top: 40,
    bottom: 50,
    left: 60,
    right: 60,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
  header: {
    height: 140, // Increased header height
    padding: 40, // Increased top padding for name
  },
};

export const generatePDF = async (resumeData: ResumeData): Promise<Blob> => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - styles.margin.left - styles.margin.right;
  let yPos = styles.margin.top;

  // Helper function to check and add new page
  const checkNewPage = (height: number, isSection = false) => {
    const remainingSpace = pageHeight - styles.margin.bottom - yPos;
    const requiredSpace = height + (isSection ? styles.spacing.section : 0);

    if (remainingSpace < requiredSpace) {
      pdf.addPage();
      yPos = styles.margin.top;
      return true;
    }
    return false;
  };

  // Enhanced text wrapping with better spacing
  const addWrappedText = (text: string, options: any = {}) => {
    const {
      fontSize = styles.fonts.normal,
      color = colors.text,
      bold = false,
      align = "left",
      maxWidth = contentWidth,
      lineHeight = styles.lineHeight.normal,
      indent = 0,
      addSpacing = true,
    } = options;

    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setTextColor(color[0], color[1], color[2]);

    const lines = pdf.splitTextToSize(text, maxWidth - indent);
    const textHeight = fontSize * lineHeight * lines.length;

    checkNewPage(textHeight);

    lines.forEach((line: string) => {
      let xPos = styles.margin.left + indent;
      if (align === "center") {
        xPos = (pageWidth - pdf.getTextWidth(line)) / 2;
      }
      pdf.text(line, xPos, yPos);
      yPos += fontSize * lineHeight;
    });

    if (addSpacing) {
      yPos += styles.spacing.paragraph;
    }
  };

  // Enhanced header with better styling
  const addHeader = () => {
    // Header background
    pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.rect(0, 0, pageWidth, styles.header.height, "F");

    // Adjust top padding
    yPos = styles.header.padding + 30; // Increase top padding
    //Name
    addWrappedText(resumeData.personalInfo.fullName, {
      fontSize: styles.fonts.name,
      color: [255, 255, 255],
      bold: true,
      align: "center",
      lineHeight: styles.lineHeight.tight,
      addSpacing: false,
    });

    // Reduce bottom padding
    yPos += styles.fonts.name - 35; // Adjust this value to reduce bottom padding

    const contactInfo = [
      resumeData.personalInfo.email,
      resumeData.personalInfo.phone,
      resumeData.personalInfo.location,
      resumeData.personalInfo.portfolioUrl,
    ].filter(Boolean);

    // Center contact info with proper spacing
    const contactText = contactInfo.join(" • ");
    addWrappedText(contactText, {
      fontSize: styles.fonts.normal,
      color: [255, 255, 255],
      align: "center",
      lineHeight: styles.lineHeight.normal,
      addSpacing: false,
    });

    yPos = styles.header.height + styles.spacing.section;
  };

  // Enhanced section headers
  const addSection = (title: string) => {
    checkNewPage(styles.fonts.section * 3, true);

    // Section title with accent color
    addWrappedText(title.toUpperCase(), {
      fontSize: styles.fonts.section,
      color: colors.secondary,
      bold: true,
      addSpacing: false,
    });

    // Underline
    const titleWidth = pdf.getTextWidth(title.toUpperCase());
    pdf.setDrawColor(
      colors.secondary[0],
      colors.secondary[1],
      colors.secondary[2]
    );
    pdf.setLineWidth(2);
    yPos -= 5;
    pdf.line(styles.margin.left, yPos, styles.margin.left + titleWidth, yPos);

    yPos += styles.spacing.paragraph * 1.5;
  };

  // Generate PDF content
  addHeader();

  // Professional Summary
  if (resumeData.personalInfo.aboutMe) {
    addSection("Professional Summary");
    addWrappedText(resumeData.personalInfo.aboutMe, {
      lineHeight: styles.lineHeight.loose,
    });
  }

  // Experience
  if (resumeData.experience.length > 0) {
    addSection("Professional Experience");
    resumeData.experience.forEach((exp, index) => {
      if (index > 0) yPos += styles.spacing.item;

      addWrappedText(exp.position, {
        fontSize: styles.fonts.subsection,
        bold: true,
        color: colors.primary,
        addSpacing: false,
      });

      addWrappedText(exp.company, {
        color: colors.secondary,
        bold: true,
        addSpacing: false,
      });

      const dateRange = `${new Date(exp.startDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })} - ${
        exp.endDate
          ? new Date(exp.endDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : "Present"
      }`;

      addWrappedText(dateRange, {
        fontSize: styles.fonts.small,
        color: colors.subtext,
        addSpacing: false,
      });

      yPos += styles.spacing.paragraph / 2;
      addWrappedText(exp.description, {
        lineHeight: styles.lineHeight.normal,
      });

      if (exp.achievements?.length > 0 && exp.achievements[0] !== "") {
        exp.achievements.forEach((achievement) => {
          addWrappedText(`• ${achievement}`, {
            indent: 15,
            lineHeight: styles.lineHeight.normal,
          });
        });
      }
    });
  }

  // Education
  if (resumeData.education.length > 0) {
    addSection("Education");
    resumeData.education.forEach((edu, index) => {
      if (index > 0) yPos += styles.spacing.item;

      addWrappedText(`${edu.degree} in ${edu.fieldOfStudy}`, {
        fontSize: styles.fonts.subsection,
        bold: true,
        color: colors.primary,
        addSpacing: false,
      });

      addWrappedText(`${edu.school} - ${edu.graduationYear}`, {
        color: colors.secondary,
        addSpacing: false,
      });

      if (edu.description) {
        yPos += styles.spacing.paragraph / 2;
        addWrappedText(edu.description, {
          lineHeight: styles.lineHeight.normal,
        });
      }
    });
  }

  // Skills
  if (resumeData.skills.length > 0) {
    addSection("Skills");
    const skillsText = resumeData.skills.join(" • ");
    addWrappedText(skillsText, {
      lineHeight: styles.lineHeight.normal,
    });
  }

  // Interests
  if (resumeData.interests.length > 0) {
    addSection("Interests");
    const interestsText = resumeData.interests.join(" • ");
    addWrappedText(interestsText, {
      lineHeight: styles.lineHeight.normal,
    });
  }

  // Additional sections
  if (resumeData.additionalSections?.length > 0) {
    resumeData.additionalSections.forEach((section) => {
      if (section.title && section.content) {
        addSection(section.title);
        addWrappedText(section.content, {
          lineHeight: styles.lineHeight.normal,
        });
      }
    });
  }

  return pdf.output("blob");
};
