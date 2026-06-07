import { backend } from "./api.ts";

interface FileUploadData {
  File: File;
  name: string;
  size: number;
  type: string;
  versioned: boolean | undefined;
}

interface uploadedFiles {
  fileName: string;
  path: string;
}

interface skippedFiles {
  fileName: string;
  reason: string;
}

type onUploadRequestError = (message: string) => void;
type onUploadError = (message: string) => void;
type onUploadSuccess = (path: string) => Promise<boolean>;
type onUploadFilesSkipped = (
  fileName: string,
  reason: string
) => Promise<boolean>;

export const uploadFiles = async (
  contextType: "organization" | "user",
  contextId: string,
  location: string,
  files: FileUploadData[],
  onUploadRequestError: onUploadRequestError,
  onUploadError: onUploadError,
  onUploadSuccess: onUploadSuccess = () => Promise.resolve(true),
  onUploadFilesSkipped: onUploadFilesSkipped = () => Promise.resolve(true)
): Promise<{
  uploadedFiles?: Set<uploadedFiles>;
  skippedFiles?: Set<skippedFiles>;
  error?: string;
}> => {
  // Get Upload URL to upload the Logo file directly to s3...
  const { data: uploadLogoData, error: uploadLogoError } =
    await backend.storage.upload.post({
      contextType,
      contextId,
      location,
      files: files
        .filter((file) => file.size > 0)
        .map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          versioned: file.versioned ?? false,
        })),
    });

  if (uploadLogoError) {
    onUploadRequestError(uploadLogoError.value.message ?? "Unknown Error");
    return { error: uploadLogoError.value.message ?? "Unknown Error" };
  }

  const uploadedFiles = new Set<uploadedFiles>();
  const skippedFiles = new Set<skippedFiles>();

  for (const { url, path, fileName } of uploadLogoData.fileUploadUrls) {
    const file = files.find((file) => file.name === fileName);

    if (!file) {
      onUploadError("File not found");
      continue;
    }

    const fileUploadResponse = await fetch(url, {
      method: "PUT",
      body: file.File,
    });

    if (fileUploadResponse.ok) {
      await onUploadSuccess(path);
      uploadedFiles.add({
        path,
        fileName,
      });
    } else {
      onUploadError(JSON.stringify(await fileUploadResponse.json()));
    }
  }

  for (const { fileName, reason } of uploadLogoData.skippedFiles) {
    await onUploadFilesSkipped(fileName, reason);
    skippedFiles.add({
      fileName,
      reason,
    });
  }

  return {
    uploadedFiles,
    skippedFiles,
  };
};
