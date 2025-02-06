export function jsonResponse(statusCode: number, body?: object | string, token?: string) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      ...(token && {
        "Access-Control-Expose-Headers": "x-auth-token",
        "x-auth-token": token,
      }),
    },
    ...(body !== undefined && {
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  };
}
