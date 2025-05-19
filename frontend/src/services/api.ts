import { Constants } from "src/constants";
import { User } from "./../interfaces/user";
import { HttpError } from "./../utils/http-error";

export const apiService = {
  get: async (endpoint: string, user?: User | null) => {
    try {
      const response = await fetch(`${Constants.API}${endpoint}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!response.ok) throw new HttpError(response.status);
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  post: async (endpoint: string, data: any, user?: User | null) => {
    try {
      const response = await fetch(`${Constants.API}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new HttpError(response.status);
      const headers = response.headers;
      const body = await verifyResponseBody(response);

      return { body, headers };
    } catch (error) {
      throw error;
    }
  },

  put: async (endpoint: string, data: any, user?: User | null) => {
    try {
      const response = await fetch(`${Constants.API}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new HttpError(response.status);
    } catch (error) {
      console.error("PUT request failed:", error);
      throw error;
    }
  },

  delete: async (endpoint: string, user?: User | null) => {
    try {
      const response = await fetch(`${Constants.API}${endpoint}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user ? user.token : "null"}` },
      });
      if (!response.ok) throw new HttpError(response.status);
    } catch (error) {
      console.error("DELETE request failed:", error);
      throw error;
    }
  },

  fileUpload: async (endpoint: string, file: File[], data: any) => {
    try {
      const formData = new FormData();
      file.forEach((f) => {
        formData.append("file", f);
      });
      formData.append("data", JSON.stringify(data));
      const response = await fetch(`${Constants.API}${endpoint}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new HttpError(response.status);
      return await verifyResponseBody(response);
    } catch (error) {
      console.error("POST request failed:", error);
      throw error;
    }
  },
};

async function verifyResponseBody(response: Response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return null;
}
