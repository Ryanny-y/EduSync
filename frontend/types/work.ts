import { HasId, IFile, IUploadFile } from "./common";
import { SubmissionStatus } from "./submission";

export const workTypes = ['ASSIGNMENT', 'QUIZ', 'TASK', 'PROJECT'] as const;

export type WorkType = typeof workTypes[number];

export interface IStudentWork extends HasId {
  title: string;
  type: WorkType;
  description: string | null;
  dueDate: Date | null;
  classId: string;
  submissionStatus: SubmissionStatus;
};

export interface IWork extends HasId {
  title: string;
  description: string | null;
  type: WorkType;
  dueDate: string | null;
  classId: string;
  createdAt: Date;
  updatedAt: Date;

  materials: IWorkMaterial[];
}

export interface IWorkMaterial extends HasId {
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