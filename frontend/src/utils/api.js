/**
 * Central API configuration.
 *  - Dev:        http://localhost:5000/api/v1  (backend runs locally)
 *  - Production: https://velocitas-api.vercel.app/api/v1
 *  - Override:   set REACT_APP_API_URL in .env
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const API_BASE = API_BASE_URL
  ? `${API_BASE_URL}/api/v1`
  : process.env.NODE_ENV === 'production'
    ? 'https://velocitas-api.vercel.app/api/v1'
    : 'http://localhost:5000/api/v1';

export default API_BASE;
