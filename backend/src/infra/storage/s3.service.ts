import dotenv from 'dotenv';
dotenv.config();

import { 
  S3Client, 
  PutObjectCommand, 
  DeleteObjectCommand,
  GetObjectCommand 
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CustomError } from "../../common/utils/Errors";
import prismaClient from '../../config/client';
import { File } from '@prisma/client';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const EXPIRES_IN = 3600;

export interface UploadResult {
  fileId: string;
  url: string;
  bucket: string;
  key: string;
}

export const uploadFile = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folderPath: string = "lessons"
): Promise<UploadResult> => {
  try {
    const key = `${folderPath}/${Date.now()}-${fileName}`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      // Optional: Add metadata for tracking
      Metadata: {
        "original-name": fileName,
        "uploaded-at": new Date().toISOString(),
      },
    }));

    // Generate presigned URL for immediate access
    const accessUrl = await generatePresignedUrl(key);

    return {
      fileId: key,
      url: accessUrl,
      bucket: BUCKET_NAME,
      key,
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new CustomError(500, "Failed to upload file to S3");
  }
};

export const generatePresignedUrl = async (
  key: string, 
  expiresIn: number = EXPIRES_IN
): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Presigned URL error:", error);
    throw new CustomError(500, "Failed to generate file access URL");
  }
};

export const deleteFile = async (key: string): Promise<void> => {
  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
  } catch (error) {
    console.error("S3 delete error:", error);
  }
};

export const refreshPresignedUrlIfExpired = async (file: File) => {
  if (!file.urlExpiresAt || new Date() > file.urlExpiresAt) {
    const newUrl = await generatePresignedUrl(file.path);
    await prismaClient.file.update({
      where: { id: file.id },
      data: { url: newUrl, urlExpiresAt: new Date(Date.now() + 3600 * 1000) },
    });
    file.url = newUrl;
  }
  return file;
};