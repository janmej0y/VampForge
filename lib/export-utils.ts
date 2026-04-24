export function downloadTextFile(filename: string, contents: string) {
  if (typeof window === "undefined") {
    return;
  }

  const blob = new Blob([contents], {
    type: "text/html;charset=utf-8",
  });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export function downloadBlobFile(filename: string, blob: Blob) {
  if (typeof window === "undefined") {
    return;
  }

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export function openGeneratedDocument(contents: string) {
  if (typeof window === "undefined") {
    return;
  }

  const blob = new Blob([contents], {
    type: "text/html;charset=utf-8",
  });
  const objectUrl = URL.createObjectURL(blob);

  window.open(objectUrl, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
