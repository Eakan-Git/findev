// fetchProfile.js
import { localUrl } from '../../../../../../utils/path';

export const fetchProfile = async (id, token) => {
    const url = `${localUrl}/user-profiles/${id}`;
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const response = await fetch(url, { method: 'GET', headers });
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
