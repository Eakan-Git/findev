import { localUrl } from '/utils/path';

const putProfile = async (token, updatedFields) => {
  try {
    // Serialize the updatedFields object into x-www-form-urlencoded format
    const formData = new URLSearchParams();

    Object.entries(updatedFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(`${localUrl}/user-profiles`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(), // Pass the serialized form data as the request body
    });

    if (response.error === true) {
      console.error(response.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default putProfile;
