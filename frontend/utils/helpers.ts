import { FileImage, FileText, FileVideo, File, FileChartPie } from "lucide-react-native";

export const getFileIcon = (fileName: string) => {
  const ext = fileName?.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'pdf':
      return FileText; // You can also use FileText or create a custom PDF icon
    case 'doc':
    case 'docx':
      return FileText; // Word icon alternative
    case 'ppt':
    case 'pptx':
      return FileChartPie;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return FileImage;
    case 'mp4':
    case 'mov':
    case 'avi':
      return FileVideo;
    default:
      return File;
  }
};


export const getMimeType = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'ppt':
      return 'application/vnd.ms-powerpoint';
    case 'pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
};

export const getUniqueFileName = (fileName: string, existingFiles: string[]) => {
  const ext = fileName.split('.').pop();
  const name = fileName.replace(`.${ext}`, '');

  let counter = 1;
  let newName = fileName;

  while (existingFiles.some((uri) => uri.includes(newName))) {
    newName = `${name} (${counter}).${ext}`;
    counter++;
  }

  return newName;
};