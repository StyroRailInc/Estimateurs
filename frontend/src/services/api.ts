import { Constants } from "src/constants";

export class HttpError extends Error {
  constructor(public readonly status: number, message?: string) {
    super(message);
  }
}

export const apiService = {
  get: async (endpoint: string) => {
    try {
      const response = await fetch(`${Constants.API}${endpoint}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("GET request failed:", error);
      throw error;
    }
  },

  post: async (endpoint: string, data: any, user?: { email: string; token: string } | null) => {
    try {
      const response = await fetch(`${Constants.API}/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new HttpError(response.status);
      return await verifyResponseBody(response);
    } catch (error) {
      console.error("POST request failed:", error);
      throw error;
    }
  },

  put: async (endpoint: string, data: any) => {
    try {
      const response = await fetch(`${Constants.API}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("PUT request failed:", error);
      throw error;
    }
  },

  delete: async (endpoint: string) => {
    try {
      const response = await fetch(`${Constants.API}${endpoint}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("DELETE request failed:", error);
      throw error;
    }
  },
};

async function verifyResponseBody(response: Response): Promise<string | null> {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return null;
}
