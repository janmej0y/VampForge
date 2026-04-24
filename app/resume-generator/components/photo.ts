import { type ResumeData } from "./types";

const PHOTO_ENABLED_TEMPLATES = new Set<ResumeData["template"]>([
  "executive",
]);

type ResumePhotoLayout = {
  previewFrameClassName: string;
  previewImageClassName: string;
  documentWidth: number;
  documentHeight: number;
  documentRadius: string;
  pdfWidth: number;
  pdfHeight: number;
};

export function canDisplayResumePhoto(data: ResumeData) {
  return Boolean(
    data.includePhoto &&
      data.photo &&
      PHOTO_ENABLED_TEMPLATES.has(data.template)
  );
}

export function getResumePhotoLayout(
  template: ResumeData["template"]
): ResumePhotoLayout {
  if (template === "executive") {
    return {
      previewFrameClassName:
        "rounded-[1.9rem] border border-slate-200/80 bg-white/90 p-2.5 shadow-[0_18px_45px_rgba(15,23,42,0.12)]",
      previewImageClassName:
        "h-[9.75rem] w-[7.35rem] rounded-[1.3rem] object-cover",
      documentWidth: 124,
      documentHeight: 164,
      documentRadius: "22px",
      pdfWidth: 94,
      pdfHeight: 124,
    };
  }

  return {
    previewFrameClassName:
      "rounded-[1.75rem] border border-white/12 bg-white/10 p-2 shadow-[0_18px_45px_rgba(2,6,23,0.35)] backdrop-blur",
    previewImageClassName:
      "h-[8.9rem] w-[6.7rem] rounded-[1.15rem] object-cover",
    documentWidth: 112,
    documentHeight: 148,
    documentRadius: "20px",
    pdfWidth: 84,
    pdfHeight: 112,
  };
}
