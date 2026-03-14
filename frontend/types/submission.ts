import { IFile } from './common';

export const SubmissionStatusTypes = ['PENDING', 'SUBMITTED', 'GRADED', 'LATE', 'MISSING'] as const;

export type SubmissionStatus = (typeof SubmissionStatusTypes)[number];

export interface ISubmission {
  id: string;
  studentId: string;
  studentName: string;
  workId: string;
  workTitle: string;

  status: SubmissionStatus;

  turnedInAt: Date | null;
  gradedAt: Date | null;

  grade: number | null;
  feedback: string | null;

  files: {
    id: string; // wrapper ID from backend
    file: IFile; // the actual file
  }[];

  isLate: boolean;

  createdAt: Date;
}

export interface SubmissionStats {
  total: number;
  pending: number;
  submitted: number;
  graded: number;
  late: number;
  missing: number;
}

export interface ISubmissionList {
  submissions: ISubmission[];
  stats: SubmissionStats;
}
