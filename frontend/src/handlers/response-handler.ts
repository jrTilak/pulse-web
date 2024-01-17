import { AxiosResponse } from "axios";

export default class ResponseHandler {
  public static HandleSuccessResponse(res: AxiosResponse<any>) {
    return {
      success: true as const,
      data: res.data.data,
    };
  }
  public static HandleErrorResponse(res: AxiosResponse<any>) {
    return {
      success: false as const,
      message: res?.data?.message || "Something went wrong",
    };
  }
}
