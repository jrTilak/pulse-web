export interface SuccessResponseType<Data> {
  status: number;
  message: string;
  data: Data;
}

export interface ErrorResponseType {
  status: number;
  message: string;
  errors: any;
}

export type ResponseType<Data> = SuccessResponseType<Data> | ErrorResponseType;
