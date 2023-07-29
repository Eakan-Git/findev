import { useEffect, useState } from "react";
import { localUrl } from "/utils/path";
import { useSelector } from "react-redux";

const LogoUpload = () => {
  const { user } = useSelector((state) => state.user);
  const [isUploaded, setIsUploaded] = useState(false);
  const [logImg, setLogoImg] = useState(null);
  const [error, setError] = useState(null); // Add error state
  // console.log(user);
  const logImgHandler = (e) => {
    setLogoImg(e.target.files[0]);
    setIsUploaded(true);
    setError(null); // Clear any previous error when a new image is selected
  };

  useEffect(() => {
    if (isUploaded) {
      uploadImg();
      setIsUploaded(false);
    }
  }, [isUploaded]);

  const uploadImg = async () => {
    if (!logImg) {
      setError("No image selected.");
      return;
    }
    try {
      putProfile();
      // setLogoImg(null);
    } catch (error) {
      console.log("An error occurred:", error);
      setError("An error occurred while uploading the image.");
    }
  };
  const putProfile = async () => {
    const formData = new FormData();
    formData.append("avatar", logImg);
    // formData.append("_method", "PUT");
    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
  }
    try {
        const response = await fetch(`${localUrl}/user-profiles/avatar/${user.userAccount.id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        });
  
        console.log(response);
        // alert("Tải lên thành công");
        // window.location.reload();
      } catch (err) {
        console.log(err);
        if (err.message === "Unauthenticated.") {
          alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
          router.push("/");
          dispatch(logoutUser());
        }
      }
  };
  return (
    <>
      <div className="uploading-outer">
        <button className="uploadButton">
          <input
            className="uploadButton-input"
            type="file"
            name="attachments[]"
            // accept="image/*"
            id="upload"
            onChange={logImgHandler}
            // onClick={() => {alert("Chức năng đang tạm khóa")}}
          />
          <label className="uploadButton-button ripple-effect" htmlFor="upload">
            {logImg ? logImg.name : "Tải ảnh đại diện"}
          </label>
          <span className="uploadButton-file-name"></span>
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </>
  );
};

export default LogoUpload;
