import { IFile, IUploadFile } from "./common";

export const workTypes = ['ASSIGNMENT', 'QUIZ', 'TASK', 'PROJECT'] as const;

export type WorkType = typeof workTypes[number];

export interface IWork {
  id: string;
  title: string;
  description: string | null;
  type: WorkType;
  dueDate: string | null;
  classId: string;
  createdAt: Date;
  updatedAt: Date;

  materials: IWorkMaterial[];
}

export interface IWorkMaterial {
  id: string;
  file: IFile;
}

export interface ICreateWork {
  title: string;
  description?: string;
  type: WorkType;
  dueDate?: Date | null;
  materials?: IUploadFile[];
}