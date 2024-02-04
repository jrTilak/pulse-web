import axios, { Method } from "axios";

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
  data?: object
): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const response = await axios({
      url: `${import.meta.env.VITE_BACKEND_URL}${url}`,
      method,
      data,
      headers,
      withCredentials: true,
    });
    return new Promise<T>((resolve) => {
      resolve(response.data.data);
    });
  } catch (error) {
    return new Promise<T>((_, reject) => {
      const res = error as { response: { data: { message: string } } };
      reject(res?.response?.data?.message || "Something went wrong");
    });
  }
}
