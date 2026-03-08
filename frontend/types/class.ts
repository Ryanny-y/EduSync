import { HasId } from './common';

export interface IClass extends HasId {
  name: string;
  subject: string;
  section: string;
  time: string;
  room: string;
  gmeetLink?: string | null;
  code: string;
  bgColor: string;

  teacher: string;
  studentCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface CreateClassType {
  name: string;
  subject: string;
  section: string;
  time: string;
  room: string;
  gmeetLink?: string;
}
