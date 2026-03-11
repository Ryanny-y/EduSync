import { IFile, IUploadFile } from "./common";

export interface ILesson {
  id: string;
  title: string;
  classId: string;
  createdAt: Date;

  materials: ILessonMaterial[];
}

export interface ILessonMaterial {
  id: string;
  file: IFile;
}

export interface ICreateLesson {
  title: string;
  materials?: IUploadFile[];
}