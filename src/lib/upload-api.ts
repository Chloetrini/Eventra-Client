import { axiosClient } from "@/lib/api";

export async function uploadEventCoverImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosClient.post("/uploads/event-cover", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const body = response.data.body as { url: string; publicId: string };
  return body.url;
}