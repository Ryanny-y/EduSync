import { FileImage, FileText, FileVideo, File, FileChartPie } from "lucide-react-native";

export const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();

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