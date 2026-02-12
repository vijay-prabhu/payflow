import { APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'healthy',
      service: 'payflow-api',
      region: process.env.AWS_REGION,
      timestamp: new Date().toISOString(),
    }),
  };
};
