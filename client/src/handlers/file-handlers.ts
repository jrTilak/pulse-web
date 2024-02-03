import { IFile } from "@/types/file-types";
import { fetchUrl } from "./handler";

export default class FileHandler {
  public static uploadFile(
    content: string,
    name: string
  ): Promise<{ _id: string }> {
    return fetchUrl<{ _id: string }>("/file/upload", "POST", { content, name });
  }

  public static getFile(id: string): Promise<IFile> {
    return fetchUrl<IFile>(`/file/${id}`, "GET");
  }
}
