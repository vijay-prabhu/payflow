import { APIGatewayProxyResult } from 'aws-lambda';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Idempotency-Key,Authorization',
};

export function success(body: unknown): APIGatewayProxyResult {
  return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

export function created(body: unknown): APIGatewayProxyResult {
  return { statusCode: 201, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

export function badRequest(message: string, errors?: unknown): APIGatewayProxyResult {
  return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: message, details: errors }) };
}

export function notFound(message: string): APIGatewayProxyResult {
  return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: message }) };
}

export function conflict(message: string): APIGatewayProxyResult {
  return { statusCode: 409, headers: CORS_HEADERS, body: JSON.stringify({ error: message }) };
}

export function serverError(message: string): APIGatewayProxyResult {
  return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: message }) };
}
