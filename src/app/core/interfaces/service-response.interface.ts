export interface ServiceResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
}
