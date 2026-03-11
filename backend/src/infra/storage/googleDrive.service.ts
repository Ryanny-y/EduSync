import { google } from "googleapis";
import { Readable } from "stream";
import { CustomError } from "../../common/utils/Errors";

const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY,
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export interface UploadResult {
  fileId: string;
  webViewLink: string;
  webContentLink: string;
}

export const uploadFileToDrive = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<UploadResult> => {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType,
      body: Readable.from(fileBuffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id, webViewLink, webContentLink",
    });

    const fileId = response.data.id!;
    
    // Make file publicly readable (optional - remove if you want private)
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Get updated links after permission change
    const fileInfo = await drive.files.get({
      fileId,
      fields: "webViewLink, webContentLink",
    });

    return {
      fileId,
      webViewLink: fileInfo.data.webViewLink!,
      webContentLink: fileInfo.data.webContentLink!,
    };
  } catch (error) {
    console.log(error);
    
    throw new CustomError(500, "Failed to upload file to Google Drive");
  }
};

export const deleteFileFromDrive = async (fileId: string): Promise<void> => {
  try {
    await drive.files.delete({ fileId });
  } catch (error) {
    // File might already be deleted, don't throw
    console.error("Failed to delete file from Drive:", error);
  }
};