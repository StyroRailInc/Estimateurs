export interface AWSEvent {
  body: string;
  headers: Record<string, string>;
  queryStringParameters: QueryStringParameters;
  isBase64Encoded?: boolean;
}

export interface HandlerResponse {
  statusCode: number;
  headers: Record<string, string>;
  body?: string;
  isBase64Encoded?: boolean;
}

interface QueryStringParameters {
  email: string;
  name: string;
  replace: string;
}
