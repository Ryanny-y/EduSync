export interface HasId {
  id: string
}

export interface ApiResponse<T> {
  data: T,
  message: string;
  success: boolean;
}