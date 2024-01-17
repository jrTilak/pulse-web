import { FileType } from "@/types/file.types";
import { ServiceResponseType } from "../types/handler-response.types";
import { fetchUrl } from "./handler";

export default class FileHandler {
  public static uploadFile(
    content: string,
    name: string
  ): Promise<ServiceResponseType<{ _id: string }>> {
    return fetchUrl<{ _id: string }>("/file/upload", "POST", { content, name });
  }

  public static getFile(id: string): Promise<ServiceResponseType<FileType>> {
    return fetchUrl<FileType>(`/file/${id}`, "GET");
  }
}
