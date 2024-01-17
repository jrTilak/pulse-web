import axios, { Method } from "axios";
import { ServiceResponseType } from "@/types/handler-response.types";
import ResponseHandler from "./response-handler";

/**
 * Fetches data from the specified URL using the specified HTTP method.
 *
 * @param url - The URL to fetch data from.
 * @param method - The HTTP method to use for the request ie GET, POST, PUT, DELETE.
 * @param data - The data to send with the request (optional).
 * @param headers - The headers to include in the request (optional).
 * @returns A promise that resolves to the response data.
 */
export async function fetchUrl<T>(
  url: string,
  method: Method,
  data?: any,
  headers: any = {
    "Content-Type": "application/json",
  }
): Promise<ServiceResponseType<T>> {
  try {
    const response = await axios({
      url: `${import.meta.env.VITE_BACKEND_URL}${url}`,
      method,
      data,
      headers,
      withCredentials: true,
    });
    return ResponseHandler.HandleSuccessResponse(response);
  } catch (error: any) {
    return ResponseHandler.HandleErrorResponse(error);
  }
}
