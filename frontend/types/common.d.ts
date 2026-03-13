export interface HasId {
  id: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface IFile {
  id: string;
  fileName: string;
  fileType: FileType;
  path: string;
  size: number;
  bucket?: string | null;
  url: string;
  urlExpiresAt?: Date | null;
  createdAt: Date;
}

export interface IUploadFile {
  uri: string;
  name: string;
  type: string;
}

export type FileType = "PDF" | "PPT" | "DOC" | "VIDEO" | "IMAGE";