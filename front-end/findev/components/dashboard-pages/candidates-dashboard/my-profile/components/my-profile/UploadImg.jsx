import { localUrl, checkImgUrl } from "/utils/path";

// Pass 'user' as a parameter to the function
export async function UploadImg (file, user) {
  const formData = new FormData();
  formData.append("avatar", file);
  const checkImgData = new FormData();
  checkImgData.append("image", file);
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
    const checkImg = await fetch(
      `${checkImgUrl}`,
      {
        method: "POST",
        body: checkImgData,
      }
    );
    let checkImgRes = await checkImg.json();
    // console.log("checkImg", checkImgRes);
    // console.log("response", response);
    if(response.ok){
      if(!checkImgRes?.message){
        alert("Bạn nên sử dụng hình ảnh có khuôn mặt rõ ràng để tăng khả năng tìm kiếm việc làm");
      }
      window.location.reload();
    }
    else{
      alert("Có lỗi xảy ra. Vui lòng thử lại");
    }
  } catch (err) {
    console.log(err);
  }
};
