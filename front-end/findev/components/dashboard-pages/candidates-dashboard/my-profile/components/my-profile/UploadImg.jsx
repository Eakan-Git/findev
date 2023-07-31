import { localUrl } from "/utils/path";

// Pass 'user' as a parameter to the function
export async function UploadImg (file, user) {
  const formData = new FormData();
  formData.append("avatar", file);
  try {
    const response = await fetch(
      `${localUrl}/user-profiles/avatar/${user.user.userAccount.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.user.token}`,
        },
        body: formData,
      }
    );
    // console.log("response", response);
    if(!response.ok){
      alert("Lỗi upload ảnh");
    }
    else window.location.reload();
  } catch (err) {
    console.log(err);
  }
};
