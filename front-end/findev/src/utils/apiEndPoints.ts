/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const apiEndpoints = {
  API_AUTH_USER: `${BASE_API_URL}/auth-user`,
  API_USER_ACCOUNTS: `${BASE_API_URL}/user-accounts`,
  API_USER_PROFILES: `${BASE_API_URL}/user-profiles`,
};

export default apiEndpoints;
