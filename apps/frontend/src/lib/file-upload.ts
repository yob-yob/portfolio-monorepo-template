import { backend } from "./api.ts";

interface FileUploadData {
  File: File;
  name: string;
  size: number;
  type: string;
  versioned: boolean | undefined;
}

type onUploadRequestError = (message: string) => void;
type onUploadError = (message: string) => void;
type onUploadSuccess = (path: string) => Promise<boolean>;
type onUploadFilesSkipped = (fileName: string) => Promise<boolean>;

export const uploadFiles = async (
  contextType: "organization" | "user",
  contextId: string,
  location: string,
  files: FileUploadData[],
  onUploadRequestError: onUploadRequestError,
  onUploadError: onUploadError,
  onUploadSuccess: onUploadSuccess,
  onUploadFilesSkipped: onUploadFilesSkipped = () => Promise.resolve(false)
) => {
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
    return;
  }

  for (const { url, path, fileName } of uploadLogoData.fileUploadUrls) {
    const file = files.find((file) => file.name === fileName);

    if (!file) {
      onUploadError("File not found");
      return;
    }

    const fileUploadResponse = await fetch(url, {
      method: "PUT",
      body: file.File,
    });

    if (fileUploadResponse.ok) {
      await onUploadSuccess(path);
    } else {
      onUploadError(JSON.stringify(await fileUploadResponse.json()));
    }
  }

  for (const { fileName } of uploadLogoData.skippedFiles) {
    onUploadFilesSkipped(fileName);
  }

  return;
};
