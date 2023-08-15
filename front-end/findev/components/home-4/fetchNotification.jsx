import { localUrl } from "/utils/path";

export const fetchNotification = async (token) => {
    const url = `${localUrl}/user-profiles/noti/unread`;
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const response = await fetch(url, { method: 'GET', headers });
      if (!response.ok) {
        // throw new Error('Failed to fetch profile data');
        console.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      // throw error;
    }
  };
