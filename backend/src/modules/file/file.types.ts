import { FileType } from "@prisma/client";

export interface FileDto {
  id: string;
  fileName: string;
  fileType: FileType;
  path: string;
  size: number;
  bucket: string;
  url: string;
  urlExpiresAt: string;
  createdAt: string;
}
