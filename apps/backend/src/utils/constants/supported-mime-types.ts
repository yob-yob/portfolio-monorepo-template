export const supportedMimeTypes = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/ico": "ico",
  "application/pdf": "pdf",
} as const;

export type SupportedMimeType = keyof typeof supportedMimeTypes;
export type SupportedExtension = (typeof supportedMimeTypes)[SupportedMimeType];

export function isSupportedMimeType(mime: string): mime is SupportedMimeType {
  return mime in supportedMimeTypes;
}

export function getMimeTypeExtension(
  mime: SupportedMimeType
): SupportedExtension {
  return supportedMimeTypes[mime];
}
