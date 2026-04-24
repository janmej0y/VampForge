"use client";

import { downloadBlobFile } from "@/lib/export-utils";
import {
  createPortfolioCodeArchiveName,
  createPortfolioCodeBundle,
} from "./document";
import { type PortfolioData } from "./types";

export async function exportPortfolioCodeZip(data: PortfolioData) {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  createPortfolioCodeBundle(data).forEach((file) => {
    zip.file(file.path, file.content);
  });

  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  downloadBlobFile(createPortfolioCodeArchiveName(data), blob);
}
