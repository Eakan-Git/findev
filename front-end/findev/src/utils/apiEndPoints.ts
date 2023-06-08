/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const apiEndpoints = {
  API_AUTH_EMPLOYER: `${BASE_API_URL}/auth-employer`,
  API_AUTH_COMPANY: `${BASE_API_URL}/auth-company`,

  API_EMPLOYER_ACCOUNTS: `${BASE_API_URL}/employer-accounts`,

  API_JOBS: `${BASE_API_URL}/jobs`,
  API_JOB_TYPES: `${BASE_API_URL}/job-types`,
  API_JOB_LOCATIONS: `${BASE_API_URL}/job-locations`,
  API_JOB_SKILLS: `${BASE_API_URL}/job-skills`,

  API_APPLICATIONS: `${BASE_API_URL}/applications`,

  API_COMPANY_UPLOAD_AVATAR: `${BASE_API_URL}/company/upload-avatar`,
  API_COMPANY_UPLOAD_COVER: `${BASE_API_URL}/company/upload-cover`,
  API_COMPANY_EDIT: `${BASE_API_URL}/company/edit`,
  API_COMPANY_ACCOUNTS: `${BASE_API_URL}/company-accounts`,
  API_COMPANY_PROFILES: `${BASE_API_URL}/company-profiles`,

  API_EMPLOYER_PROFILES: `${BASE_API_URL}/employer-profiles`,
};

export default apiEndpoints;
