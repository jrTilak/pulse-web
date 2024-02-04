import { AxiosResponse } from "axios";

export default class ResponseHandler {
  public static HandleSuccessResponse(res: AxiosResponse<unknown>) {
    return new Promise<unknown>((resolve) => {
      const data = res as { data: { data: unknown } };
      resolve(data.data.data);
    });
  }
  public static HandleErrorResponse(err: unknown) {
    return new Promise<string>((_, reject) => {
      const res = err as { response: { data: { message: string } } };
      reject(res?.response?.data?.message || "Something went wrong");
    });
  }
}
