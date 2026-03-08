import { ClassDto } from "./class.types";

export const mapClassToDto = (cls: any): ClassDto => ({
  id: cls.id,
  name: cls.name,
  subject: cls.subject,
  section: cls.section,
  time: cls.time,
  room: cls.room,
  gmeetLink: cls.gmeetLink,
  code: cls.code,
  teacher: cls.teacher
    ? `${cls.teacher.lastName}, ${cls.teacher.firstName}`
    : '',
  bgColor: cls.bgColor,
  studentCount: cls._count?.students ?? 0,
  createdAt: cls.createdAt,
  updatedAt: cls.updatedAt,
});