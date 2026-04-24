"use client";

import type { FileChild } from "docx";
import { createResumeDocument } from "./document";
import { categorizeSkills } from "./intelligence";
import { MIN_RESUME_SCALE, getResumeLayoutEstimate } from "./layout";
import {
  getHeaderContacts,
  getVisibleEducation,
  getVisibleExperience,
  getVisibleProjects,
  splitLines,
} from "./content";
import { type ResumeData } from "./types";

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function dataUrlToUint8Array(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function getImageFormatFromDataUrl(dataUrl: string) {
  if (dataUrl.startsWith("data:image/jpeg")) return "JPEG";
  if (dataUrl.startsWith("data:image/webp")) return "WEBP";
  return "PNG";
}

function getDocxImageTypeFromDataUrl(dataUrl: string) {
  if (dataUrl.startsWith("data:image/jpeg")) return "jpg" as const;
  return "png" as const;
}

export function printResumeDocument(data: ResumeData) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer");

  if (!printWindow) {
    return;
  }

  printWindow.document.write(createResumeDocument(data));
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
  };
}

export async function exportResumeDocx(data: ResumeData) {
  const docx = await import("docx");
  const {
    AlignmentType,
    BorderStyle,
    Document,
    ImageRun,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
    VerticalAlign,
    WidthType,
  } = docx;
  const categories = categorizeSkills(data.skills);
  const children: FileChild[] = [];
  const layout = getResumeLayoutEstimate(data);
  const scale = Math.max(MIN_RESUME_SCALE, Math.min(1, layout.scale * 0.97));
  const isModern = data.template === "modern";
  const isProfessional = data.template === "professional";
  const isMinimal = data.template === "minimal";
  const isExecutive = data.template === "executive";
  const titleSize = Math.round(34 * scale);
  const sectionSize = Math.round(18 * scale);
  const bodySize = Math.round(20 * scale);
  const metaSize = Math.round(17 * scale);
  const contactItems = getHeaderContacts(data);
  const contacts = contactItems.join(" | ");

  if (isExecutive) {
    const executivePhotoParagraph = data.photo
      ? new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              data: dataUrlToUint8Array(data.photo),
              type: getDocxImageTypeFromDataUrl(data.photo),
              transformation: {
                width: Math.round(88 * scale),
                height: Math.round(118 * scale),
              },
            }),
          ],
        })
      : new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "PHOTO",
              bold: true,
              size: Math.round(18 * scale),
            }),
          ],
          spacing: { before: Math.round(150 * scale), after: Math.round(150 * scale) },
        });

    children.push(
      new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 78, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.TOP,
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: data.personalInfo.fullName || "Your Name",
                        bold: true,
                        size: Math.round(34 * scale),
                      }),
                    ],
                    spacing: { after: Math.round(60 * scale) },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: (data.personalInfo.title || "Frontend Developer").toUpperCase(),
                        bold: true,
                        size: Math.round(15 * scale),
                      }),
                    ],
                    spacing: { after: Math.round(70 * scale) },
                  }),
                  ...[contactItems.slice(0, 3), contactItems.slice(3)].filter((group) => group.length > 0).map(
                    (group, index) =>
                      new Paragraph({
                        children: [new TextRun({ text: group.join(" | "), size: metaSize })],
                        spacing: { after: index === 0 ? Math.round(24 * scale) : 0 },
                      })
                  ),
                ],
              }),
              new TableCell({
                width: { size: 22, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.TOP,
                margins: {
                  top: 100,
                  right: 40,
                  bottom: 40,
                  left: 40,
                },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 6, color: "111827" },
                  bottom: { style: BorderStyle.SINGLE, size: 6, color: "111827" },
                  left: { style: BorderStyle.SINGLE, size: 6, color: "111827" },
                  right: { style: BorderStyle.SINGLE, size: 6, color: "111827" },
                },
                children: [executivePhotoParagraph],
              }),
            ],
          }),
        ],
      }),
      new Paragraph({
        border: {
          bottom: {
            color: "111827",
            size: 6,
            space: 1,
            style: BorderStyle.SINGLE,
          },
        },
        spacing: { after: Math.round(120 * scale) },
      })
    );
  } else {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.personalInfo.fullName || "Your Name",
            bold: true,
            size:
              isMinimal
                ? Math.round(30 * scale)
                : isModern
                  ? Math.round(35 * scale)
                  : isProfessional
                    ? Math.round(32 * scale)
                    : titleSize,
            allCaps: isMinimal,
          }),
        ],
        alignment: isMinimal || isProfessional ? AlignmentType.CENTER : AlignmentType.LEFT,
        border: isMinimal
          ? {
              top: {
                color: "D1D5DB",
                size: 4,
                space: 1,
                style: BorderStyle.SINGLE,
              },
            }
          : undefined,
        spacing: {
          after: Math.round((isModern ? 90 : isProfessional ? 80 : 100) * scale),
          before: isMinimal ? Math.round(70 * scale) : 0,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: data.personalInfo.title || "Frontend Developer",
            bold: !isMinimal,
            size:
              isMinimal
                ? Math.round(17 * scale)
                : isModern
                  ? Math.round(19 * scale)
                  : isProfessional
                    ? Math.round(18 * scale)
                    : bodySize,
            allCaps: isMinimal,
          }),
        ],
        alignment: isMinimal || isProfessional ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: Math.round((isModern ? 58 : isProfessional ? 50 : 70) * scale) },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: contacts,
            size: metaSize,
          }),
        ],
        alignment: isMinimal || isProfessional ? AlignmentType.CENTER : AlignmentType.LEFT,
        border: isMinimal
          ? {
              bottom: {
                color: "D1D5DB",
                size: 4,
                space: 1,
                style: BorderStyle.SINGLE,
              },
            }
          : isModern
            ? {
                bottom: {
                  color: "111827",
                  size: 6,
                  space: 1,
                  style: BorderStyle.SINGLE,
                },
              }
            : isProfessional
              ? {
                  bottom: {
                    color: "6B7280",
                    size: 4,
                    space: 1,
                    style: BorderStyle.SINGLE,
                  },
                }
              : undefined,
        spacing: { after: Math.round((isModern ? 150 : isProfessional ? 130 : 170) * scale) },
      })
    );
  }

  const addHeading = (label: string) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: label.toUpperCase(),
            bold: true,
            size: sectionSize,
          }),
        ],
        alignment: isMinimal ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: {
          before: Math.round((isMinimal ? 140 : isModern ? 150 : isProfessional ? 125 : isExecutive ? 118 : 160) * scale),
          after: Math.round((isMinimal ? 65 : isModern ? 68 : isProfessional ? 55 : isExecutive ? 50 : 80) * scale),
        },
        border: {
          ...(isExecutive
            ? {
                top: {
                  color: "111827",
                  size: 6,
                  space: 1,
                  style: BorderStyle.SINGLE,
                },
              }
            : {
                bottom: {
                  color: isMinimal ? "1F2937" : isModern ? "111827" : isProfessional ? "6B7280" : "D1D5DB",
                  size: isMinimal ? 6 : isModern ? 6 : 4,
                  space: 1,
                  style: BorderStyle.SINGLE,
                },
              }),
        },
      })
    );
  };

  const addBulletLines = (lines: string[]) => {
    lines.forEach((line) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: line, size: bodySize })],
          bullet: { level: 0 },
          spacing: isMinimal ? { after: 40 } : isModern ? { after: 55 } : isProfessional ? { after: 45 } : isExecutive ? { after: 48 } : undefined,
        })
      );
    });
  };

  addHeading("Professional Summary");
  addBulletLines(splitLines(data.summary));

  addHeading("Skills");
  categories.forEach((category) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${category.title}: `, bold: true, size: bodySize }),
          new TextRun({ text: category.skills.join(", "), size: bodySize }),
        ],
        indent: isModern || isMinimal || isProfessional ? { left: 360 } : undefined,
        spacing: isModern ? { after: 40 } : isProfessional ? { after: 28 } : isExecutive ? { after: 36 } : undefined,
      })
    );
  });

  addHeading("Work Experience");
  getVisibleExperience(data).forEach((item) => {
    if (isExecutive && item.companyName) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.companyName.toUpperCase(),
              bold: true,
              size: Math.round(15 * scale),
            }),
          ],
          spacing: { before: Math.round(76 * scale), after: Math.round(18 * scale) },
        })
      );
    }
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: item.role || "Role",
            bold: true,
            size: bodySize,
            allCaps: isMinimal,
          }),
        ],
        spacing: { before: Math.round((isModern ? 105 : isProfessional ? 88 : isExecutive ? (item.companyName ? 0 : 76) : 90) * scale), after: Math.round((isModern ? 42 : isProfessional ? 20 : isExecutive ? 18 : 35) * scale) },
        border: isModern
          ? {
              left: {
                color: "111827",
                size: 6,
                space: 8,
                style: BorderStyle.SINGLE,
              },
            }
          : isProfessional
            ? {
                bottom: {
                  color: "E5E7EB",
                  size: 4,
                  space: 1,
                  style: BorderStyle.SINGLE,
                },
              }
            : isExecutive
              ? {
                  bottom: {
                    color: "E5E7EB",
                    size: 4,
                    space: 1,
                    style: BorderStyle.SINGLE,
                  },
                }
          : undefined,
      })
    );
    if (item.companyName && !isExecutive) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.companyName,
              bold: isModern,
              size: isModern ? metaSize : isProfessional || isExecutive ? Math.round(18 * scale) : bodySize,
              allCaps: isModern,
            }),
          ],
          spacing: { after: Math.round((isModern ? 20 : isProfessional ? 10 : isExecutive ? 12 : 12) * scale) },
        })
      );
    }
    if (item.duration) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.duration,
              bold: isModern || isProfessional || isExecutive,
              size: metaSize,
              allCaps: isModern,
            }),
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: Math.round((isModern ? 15 : isProfessional ? 8 : isExecutive ? 10 : 10) * scale) },
        })
      );
    }
    addBulletLines(splitLines(item.description));
  });

  addHeading("Projects");
  getVisibleProjects(data).forEach((item) => {
    const linkText = [
      item.githubLink ? "GitHub" : "",
      item.liveLink ? "Live Link" : "",
    ]
      .filter(Boolean)
      .join(" | ");

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: item.projectName || "Project Name",
            bold: true,
            size: bodySize,
            allCaps: isMinimal,
          }),
        ],
        spacing: { before: Math.round((isModern ? 105 : isProfessional ? 88 : isExecutive ? 82 : 90) * scale), after: Math.round((isModern ? 42 : isProfessional ? 20 : isExecutive ? 18 : 35) * scale) },
        border: isModern
          ? {
              left: {
                color: "111827",
                size: 6,
                space: 8,
                style: BorderStyle.SINGLE,
              },
            }
          : isProfessional
            ? {
                bottom: {
                  color: "E5E7EB",
                  size: 4,
                  space: 1,
                  style: BorderStyle.SINGLE,
                },
              }
            : isExecutive
              ? {
                  bottom: {
                    color: "E5E7EB",
                    size: 4,
                    space: 1,
                    style: BorderStyle.SINGLE,
                  },
                }
          : undefined,
      })
    );
    if (linkText) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: linkText,
              bold: isModern || isProfessional || isExecutive,
              size: metaSize,
              allCaps: isModern,
            }),
          ],
          spacing: { after: Math.round((isModern ? 18 : isProfessional ? 10 : isExecutive ? 12 : 10) * scale) },
        })
      );
    }
    addBulletLines(splitLines(item.description));
  });

  addHeading("Education");
  getVisibleEducation(data).forEach((item) => {
    if (isExecutive && item.institutionName) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.institutionName.toUpperCase(),
              bold: true,
              size: Math.round(15 * scale),
            }),
          ],
          spacing: { before: Math.round(72 * scale), after: Math.round(18 * scale) },
        })
      );
    }
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: item.degree || "Degree",
            bold: true,
            size: bodySize,
            allCaps: isMinimal,
          }),
        ],
        spacing: { before: Math.round((isModern ? 100 : isProfessional ? 82 : isExecutive ? (item.institutionName ? 0 : 72) : 90) * scale), after: Math.round((isModern ? 36 : isProfessional ? 18 : isExecutive ? 18 : 30) * scale) },
        border: isModern
          ? {
              left: {
                color: "111827",
                size: 6,
                space: 8,
                style: BorderStyle.SINGLE,
              },
            }
          : isProfessional
            ? {
                bottom: {
                  color: "E5E7EB",
                  size: 4,
                  space: 1,
                  style: BorderStyle.SINGLE,
                },
              }
            : isExecutive
              ? {
                  bottom: {
                    color: "E5E7EB",
                    size: 4,
                    space: 1,
                    style: BorderStyle.SINGLE,
                  },
                }
          : undefined,
      })
    );
    if (item.institutionName && !isExecutive) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.institutionName,
              bold: isModern || isProfessional || isExecutive,
              size: isModern ? metaSize : isProfessional || isExecutive ? Math.round(18 * scale) : bodySize,
              allCaps: isModern,
            }),
          ],
          spacing: { after: Math.round((isModern ? 18 : isProfessional ? 10 : isExecutive ? 12 : 20) * scale) },
        })
      );
    }
    if (item.year) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.year,
              bold: isModern || isProfessional || isExecutive,
              size: metaSize,
              allCaps: isModern,
            }),
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: Math.round((isModern ? 12 : isProfessional ? 8 : isExecutive ? 10 : 10) * scale) },
        })
      );
    }
    addBulletLines(splitLines(item.description));
  });

  if (data.certifications.length > 0) {
    addHeading("Certifications");
    addBulletLines(data.certifications);
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 620,
              right: 560,
              bottom: 620,
              left: 560,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerBlobDownload(blob, `${data.personalInfo.fullName || "resume"}-resume.docx`);
}

export async function exportResumePdf(data: ResumeData) {
  const { default: jsPDF } = await import("jspdf");
  const layout = getResumeLayoutEstimate(data);
  const scale = Math.max(MIN_RESUME_SCALE, Math.min(1, layout.scale * 0.96));
  const isModern = data.template === "modern";
  const isProfessional = data.template === "professional";
  const isMinimal = data.template === "minimal";
  const isExecutive = data.template === "executive";
  const contactItems = getHeaderContacts(data);
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });
  const marginX = 42;
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 48;

  const ensureSpace = (height = 42 * scale) => {
    if (y + height > pageHeight - 44) {
      doc.addPage();
      y = 48;
    }
  };

  const addWrappedText = (
    text: string,
    options?: {
      fontSize?: number;
      indent?: number;
      color?: [number, number, number];
      maxWidth?: number;
      style?: "normal" | "bold";
      align?: "left" | "center" | "right";
    }
  ) => {
    const fontSize = (options?.fontSize ?? 11) * scale;
    const indent = options?.indent ?? 0;
    const color = options?.color ?? [75, 85, 99];
    const maxWidth = options?.maxWidth ?? pageWidth - marginX * 2 - indent;
    const align = options?.align ?? "left";
    doc.setFont("helvetica", options?.style ?? "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = doc.splitTextToSize(text, maxWidth);
    ensureSpace(lines.length * (fontSize + 3.5));
    if (align === "center") {
      doc.text(lines, pageWidth / 2, y, { align: "center" });
    } else if (align === "right") {
      doc.text(lines, pageWidth - marginX - indent, y, { align: "right" });
    } else {
      doc.text(lines, marginX + indent, y);
    }
    y += lines.length * (fontSize + 3.5) + 4 * scale;
  };

  const addSectionHeading = (label: string) => {
    ensureSpace(28 * scale);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(
      isMinimal ? 55 : 17,
      isMinimal ? 65 : 24,
      isMinimal ? 81 : 39
    );
    doc.setFontSize((isMinimal ? 10 : isModern ? 10.5 : isProfessional ? 10.5 : 11) * scale);
    if (isMinimal) {
      doc.text(label.toUpperCase(), pageWidth / 2, y, { align: "center" });
    } else {
      if (isModern) {
        doc.setFillColor(17, 24, 39);
        doc.rect(marginX, y - 6 * scale, 26 * scale, 2.5 * scale, "F");
        doc.text(label.toUpperCase(), marginX + 34 * scale, y);
      } else if (isExecutive) {
        doc.setLineWidth(1.2);
        doc.line(marginX, y - 7 * scale, pageWidth - marginX, y - 7 * scale);
        doc.setLineWidth(1);
        doc.text(label.toUpperCase(), marginX, y);
      } else if (isProfessional) {
        doc.text(label.toUpperCase(), marginX, y);
      } else {
        doc.text(label.toUpperCase(), marginX, y);
      }
    }
    y += 8 * scale;
    doc.setDrawColor(
      ...(isMinimal
        ? [31, 41, 55]
        : isModern
          ? [17, 24, 39]
          : isExecutive
            ? [17, 24, 39]
          : isProfessional
            ? [107, 114, 128]
            : [209, 213, 219]) as [number, number, number]
    );
    doc.line(
      isMinimal ? marginX + 40 : isModern ? marginX + 34 * scale : marginX,
      y,
      isMinimal ? pageWidth - marginX - 40 : pageWidth - marginX,
      y
    );
    y += 12 * scale;
  };

  if (isMinimal) {
    doc.setDrawColor(209, 213, 219);
    doc.line(marginX, y - 10, pageWidth - marginX, y - 10);
  } else if (isModern) {
    doc.setDrawColor(17, 24, 39);
    doc.setLineWidth(2);
    doc.line(marginX, y - 8, pageWidth - marginX, y - 8);
    doc.setLineWidth(1);
  } else if (isExecutive) {
    doc.setDrawColor(17, 24, 39);
    doc.setLineWidth(1.2);
    doc.line(marginX, y - 6, pageWidth - marginX, y - 6);
    doc.setLineWidth(1);
  } else if (isProfessional) {
    doc.setDrawColor(107, 114, 128);
    doc.line(marginX, y - 6, pageWidth - marginX, y - 6);
  }

  if (isExecutive) {
    const photoWidth = 86 * scale;
    const photoHeight = 116 * scale;
    const photoX = pageWidth - marginX - photoWidth;
    const photoY = y - 2 * scale;
    const textWidth = photoX - marginX - 20 * scale;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(24 * scale);
    doc.text(data.personalInfo.fullName || "Your Name", marginX, y);
    y += 20 * scale;

    addWrappedText((data.personalInfo.title || "Frontend Developer").toUpperCase(), {
      fontSize: 10.4,
      style: "bold",
      color: [51, 65, 85],
      maxWidth: textWidth,
    });

    [contactItems.slice(0, 3), contactItems.slice(3)]
      .filter((group) => group.length > 0)
      .forEach((group) => {
        addWrappedText(group.join(" | "), {
          fontSize: 9.6,
          color: [75, 85, 99],
          maxWidth: textWidth,
        });
      });

    doc.setDrawColor(17, 24, 39);
    doc.setLineWidth(1.2);
    doc.rect(photoX, photoY, photoWidth, photoHeight);
    if (data.photo) {
      doc.addImage(
        data.photo,
        getImageFormatFromDataUrl(data.photo),
        photoX + 4 * scale,
        photoY + 4 * scale,
        photoWidth - 8 * scale,
        photoHeight - 8 * scale
      );
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11 * scale);
      doc.text("PHOTO", photoX + photoWidth / 2, photoY + photoHeight / 2, {
        align: "center",
      });
    }
    y = Math.max(y, photoY + photoHeight) + 8 * scale;
  } else {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 24, 39);
    doc.setFontSize((isMinimal ? 19 : isModern ? 23 : isProfessional ? 22 : 22) * scale);
    if (isMinimal) {
      doc.text((data.personalInfo.fullName || "Your Name").toUpperCase(), pageWidth / 2, y, {
        align: "center",
      });
    } else if (isProfessional) {
      doc.text(data.personalInfo.fullName || "Your Name", pageWidth / 2, y, {
        align: "center",
      });
    } else {
      doc.text(data.personalInfo.fullName || "Your Name", marginX, y);
    }
    y += 20 * scale;

    addWrappedText(isMinimal ? (data.personalInfo.title || "Frontend Developer").toUpperCase() : data.personalInfo.title || "Frontend Developer", {
      fontSize: isMinimal ? 10.5 : isModern ? 11 : isProfessional ? 10.8 : 12,
      style: isMinimal ? "normal" : "bold",
      color: [55, 65, 81],
      maxWidth: isMinimal ? pageWidth - marginX * 2 : undefined,
      align: isMinimal || isProfessional ? "center" : "left",
    });

    addWrappedText(getHeaderContacts(data).join(" | "), {
      fontSize: isMinimal ? 9.5 : isModern ? 9.8 : isProfessional ? 9.6 : 10,
      color: [75, 85, 99],
      maxWidth: isMinimal ? pageWidth - marginX * 2 : undefined,
      align: isMinimal || isProfessional ? "center" : "left",
    });
  }

  if (isMinimal) {
    doc.setDrawColor(209, 213, 219);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 10 * scale;
  } else if (isModern) {
    doc.setDrawColor(17, 24, 39);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 10 * scale;
  } else if (isExecutive) {
    doc.setDrawColor(17, 24, 39);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 12 * scale;
  } else if (isProfessional) {
    doc.setDrawColor(107, 114, 128);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 9 * scale;
  }

  addSectionHeading("Professional Summary");
  splitLines(data.summary).forEach((line) => addWrappedText(`- ${line}`, { indent: 8 }));

  addSectionHeading("Skills");
  categorizeSkills(data.skills).forEach((category) => {
    addWrappedText(`${category.title}: ${category.skills.join(", ")}`, {
      indent: isModern || isMinimal || isProfessional ? 8 : 0,
    });
  });

  addSectionHeading("Work Experience");
  getVisibleExperience(data).forEach((item) => {
    ensureSpace(34 * scale);
    if (isModern) {
      doc.setDrawColor(17, 24, 39);
      doc.setLineWidth(1.5);
      doc.line(marginX, y - 2 * scale, marginX, y + 12 * scale);
      doc.setLineWidth(1);
    } else if (isExecutive) {
      doc.setDrawColor(229, 231, 235);
      doc.line(marginX, y - 6 * scale, pageWidth - marginX, y - 6 * scale);
    }
    if (isExecutive && item.companyName) {
      addWrappedText(item.companyName.toUpperCase(), {
        fontSize: 8.9,
        style: "bold",
        color: [71, 85, 105],
      });
    }
    addWrappedText(item.role || "Role", {
      fontSize: 11,
      style: "bold",
      color: [17, 24, 39],
      indent: isModern ? 10 : 0,
    });
    if (item.companyName && !isExecutive) {
      addWrappedText(item.companyName, {
        fontSize: isModern ? 9.6 : isProfessional ? 10 : 10,
        style: isModern ? "bold" : isExecutive ? "bold" : "normal",
        color: [71, 85, 105],
        indent: isModern ? 10 : 0,
      });
    }
    if (item.duration) {
      addWrappedText(item.duration, {
        fontSize: 9.5,
        style: isModern || isProfessional || isExecutive ? "bold" : "normal",
        color: [71, 85, 105],
        indent: isModern ? 10 : 0,
      });
    }
    splitLines(item.description).forEach((line) => {
      addWrappedText(`- ${line}`, { indent: isModern ? 16 : 8 });
    });
    y += (isModern ? 4 : isProfessional ? 3 : isExecutive ? 4 : 2) * scale;
  });

  addSectionHeading("Projects");
  getVisibleProjects(data).forEach((item) => {
    const links = [
      item.githubLink ? "GitHub" : "",
      item.liveLink ? "Live Link" : "",
    ]
      .filter(Boolean)
      .join(" | ");

    if (isModern) {
      doc.setDrawColor(17, 24, 39);
      doc.setLineWidth(1.5);
      doc.line(marginX, y - 2 * scale, marginX, y + 12 * scale);
      doc.setLineWidth(1);
    } else if (isExecutive) {
      doc.setDrawColor(229, 231, 235);
      doc.line(marginX, y - 6 * scale, pageWidth - marginX, y - 6 * scale);
    }
    addWrappedText(
      item.projectName || "Project Name",
      {
        fontSize: 11,
        style: "bold",
        color: [17, 24, 39],
        indent: isModern ? 10 : 0,
      }
    );
    if (links) {
      addWrappedText(links, {
        fontSize: isModern ? 9.4 : isProfessional ? 9.7 : 10,
        style: isModern ? "bold" : isExecutive ? "bold" : "normal",
        color: [71, 85, 105],
        indent: isModern ? 10 : 0,
      });
    }
    splitLines(item.description).forEach((line) => {
      addWrappedText(`- ${line}`, { indent: isModern ? 16 : 8 });
    });
    y += (isModern ? 4 : isProfessional ? 3 : isExecutive ? 4 : 2) * scale;
  });

  addSectionHeading("Education");
  getVisibleEducation(data).forEach((item) => {
    if (isModern) {
      doc.setDrawColor(17, 24, 39);
      doc.setLineWidth(1.5);
      doc.line(marginX, y - 2 * scale, marginX, y + 12 * scale);
      doc.setLineWidth(1);
    } else if (isExecutive) {
      doc.setDrawColor(229, 231, 235);
      doc.line(marginX, y - 6 * scale, pageWidth - marginX, y - 6 * scale);
    }
    if (isExecutive && item.institutionName) {
      addWrappedText(item.institutionName.toUpperCase(), {
        color: [75, 85, 99],
        fontSize: 8.9,
        style: "bold",
        indent: isModern ? 10 : 0,
      });
    }
    addWrappedText(item.degree || "Degree", {
      fontSize: 11,
      style: "bold",
      color: [17, 24, 39],
      indent: isModern ? 10 : 0,
    });
    if (item.institutionName && !isExecutive) {
      addWrappedText(item.institutionName, {
        color: [75, 85, 99],
        fontSize: isModern ? 9.6 : isProfessional ? 10 : 11,
        style: isModern ? "bold" : isExecutive ? "bold" : "normal",
        indent: isModern ? 10 : 0,
      });
    }
    if (item.year) {
      addWrappedText(item.year, {
        color: [75, 85, 99],
        fontSize: 9.5,
        style: isModern || isProfessional || isExecutive ? "bold" : "normal",
        indent: isModern ? 10 : 0,
      });
    }
    splitLines(item.description).forEach((line) => {
      addWrappedText(`- ${line}`, { indent: isModern ? 16 : 8 });
    });
    y += (isModern ? 4 : isProfessional ? 3 : isExecutive ? 4 : 2) * scale;
  });

  if (data.certifications.length > 0) {
    addSectionHeading("Certifications");
    data.certifications.forEach((item) => addWrappedText(`- ${item}`, { indent: 8 }));
  }

  doc.save(`${data.personalInfo.fullName || "resume"}-resume.pdf`);
}
