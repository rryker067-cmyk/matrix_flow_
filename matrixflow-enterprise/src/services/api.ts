import { getApiUrl } from '../lib/env';

export const apiBaseUrl = getApiUrl();

export const apiRoutes = {
  health: getApiUrl('/health'),
  auth: {
    login: getApiUrl('/api/v1/auth/login'),
  },
  companies: getApiUrl('/api/v1/companies'),
  branches: getApiUrl('/api/v1/branches'),
  products: getApiUrl('/api/v1/products'),
  sales: getApiUrl('/api/v1/sales'),
  inventory: getApiUrl('/api/v1/inventory'),
  vectors: getApiUrl('/api/v1/vectors'),
  matrices: getApiUrl('/api/v1/matrices'),
  operations: getApiUrl('/api/v1/operations'),
  reports: getApiUrl('/api/v1/reports'),
};
