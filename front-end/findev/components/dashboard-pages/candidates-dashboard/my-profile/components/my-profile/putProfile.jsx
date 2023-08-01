import { localUrl } from '/utils/path';

// const putProfile = async (token, updatedFields) => {
//   try {
//     // Serialize the updatedFields object into x-www-form-urlencoded format
//     const formData = new URLSearchParams();

//     Object.entries(updatedFields).forEach(([key, value]) => {
//       formData.append(key, value);
//     });

//     const response = await fetch(`${localUrl}/user-profiles`, {
//       method: 'PUT',
//       headers: {
//         'Accept': 'application/json',
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: formData.toString(), // Pass the serialized form data as the request body
//     });

//     if (response.error === true) {
//       console.error(response.message);
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
const putProfile = async (user, updatedFields) => {
  const payload = { user_profile: updatedFields };
  // console.log(JSON.stringify(payload, null, 2));
  let bodyPayload = { object: payload};
  // console.log(JSON.stringify(bodyPayload, null, 2));
  try {
    const response = await fetch(`${localUrl}/user-profiles/import/${user.userAccount.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json', // Set the proper content type header for JSON
      },
      body: JSON.stringify(bodyPayload, null, 2), 
    });

    if (response.error) {
      throw new Error("Error updating profile.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default putProfile;
