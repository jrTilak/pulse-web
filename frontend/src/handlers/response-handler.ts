import { AxiosResponse } from "axios";

export default class ResponseHandler {
  public static HandleSuccessResponse(res: AxiosResponse<any>) {
    return {
      success: true as const,
      data: res.data.data,
    };
  }
  public static HandleErrorResponse(err: any) {
    return {
      success: false as const,
      message: err?.response?.data?.message || "Something went wrong",
    };
  }
}
