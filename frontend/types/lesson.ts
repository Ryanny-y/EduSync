import { FileDto } from "./common";

export interface LessonDto {
  id: string;
  title: string;
  classId: string;
  createdAt: Date;

  materials: LessonMaterialDto[];
}

export interface LessonMaterialDto {
  id: string;
  file: FileDto;
}