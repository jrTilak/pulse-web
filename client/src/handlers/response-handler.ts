import { AxiosResponse } from "axios";

export default class ResponseHandler {
  public static HandleSuccessResponse(res: AxiosResponse<any>) {
    return new Promise<any>((resolve) => {
      resolve(res.data.data);
    });
  }
  public static HandleErrorResponse(err: any) {
    return new Promise<string>((_, reject) => {
      reject(err?.response?.data?.message || "Something went wrong");
    });
  }
}
