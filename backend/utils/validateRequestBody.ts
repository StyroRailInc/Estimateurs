export function validateRequestBody(body: string) {
  try {
    return JSON.parse(body);
  } catch (error) {
    return undefined;
  }
}
