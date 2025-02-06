export interface AWSEvent {
  body: string;
  headers: Record<string, string>;
  queryStringParameters: { email: string; name: string; replace: string };
}

export interface HandlerResponse {
  statusCode: number;
  headers: Record<string, string>;
  body?: string;
}
