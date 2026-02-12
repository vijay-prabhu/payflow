import { success } from '../utils/response';

export const handler = async () => {
  return success({
    status: 'healthy',
    service: 'payflow-api',
    region: process.env.AWS_REGION,
    timestamp: new Date().toISOString(),
  });
};
