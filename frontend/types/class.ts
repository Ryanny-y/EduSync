import { HasId } from "./common"

export interface IClass extends HasId {
  name: string
  subject: string
  section: string
  time: string
  room: string
  gmeetLink?: string | null
  code: string

  teacherId: string

  createdAt: string
  updatedAt: string
}