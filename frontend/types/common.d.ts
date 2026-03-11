export interface HasId {
  id: string
}

export interface ApiResponse<T> {
  data: T,
  message: string;
  success: boolean;
}

export interface FileDto {
  id: string;
  fileName: string;
  fileType: FileType;
  path: string;
  size: number;
  bucket?: string | null;
  url?: string | null;
  urlExpiresAt?: Date | null;
  createdAt: Date;
}