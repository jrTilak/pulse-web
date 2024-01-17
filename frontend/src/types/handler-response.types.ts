interface ErrorServiceResponseType {
  success: false;
  message: string;
}

interface SuccessServiceResponseType<Data> {
  success: true;
  data: Data;
}

export type ServiceResponseType<Data> =
  | ErrorServiceResponseType
  | SuccessServiceResponseType<Data>;
