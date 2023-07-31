import { localUrl } from "/utils/path";
import { logoutUser } from "/app/actions/userActions";
import { useDispatch } from "react-redux";

// Pass 'user' as a parameter to the function
export async function UploadImg (file, user) {
  // const user = JSON.parse(localStorage.getItem("user"));
  // const file = localStorage.getItem("avt");
  // console.log("user", user);
  const formData = new FormData();
  formData.append("avatar", file);
  // print each key-value pair
  for (var pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }
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
    console.log("response", response);
    // delete user from local storage
    // localStorage.removeItem("user");
    if(!response.ok){
      alert("Lỗi upload ảnh");
    }
    else window.location.reload();
  } catch (err) {
    console.log(err);
    if (err.message === "Unauthenticated.") {
      alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
      router.push("/");
      const dispatch = useDispatch();
      dispatch(logoutUser());
    }
  }
};
