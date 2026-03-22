import { FileType } from "@prisma/client";

export const mapMimeTypeToFileType = (mimeType: string): FileType => {
  if (mimeType.includes("pdf")) return FileType.PDF;
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return FileType.PPT;
  if (mimeType.includes("word") || mimeType.includes("document"))
    return FileType.DOC;
  if (mimeType.includes("video")) return FileType.VIDEO;
  if (mimeType.includes("image")) return FileType.IMAGE;
  return FileType.PDF;
};
