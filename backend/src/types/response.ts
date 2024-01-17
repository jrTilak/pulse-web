/**
 * Represents the response format for success responses sent by the server to the client.
 */
export interface SuccessResponseType {
  status: number;
  message: string;
  data: {};
}

/**
 * Represents the response format for error responses sent by the server to the client.
 */
export interface ErrorResponseType {
  status: number;
  message: string;
  errors: any;
}

export type ResponseType = SuccessResponseType | ErrorResponseType;
