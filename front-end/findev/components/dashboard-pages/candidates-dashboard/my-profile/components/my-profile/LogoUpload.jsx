import { useEffect, useState } from "react";
import { localUrl } from '/utils/path';
import { useSelector } from "react-redux";

const LogoUpload = () => {
  const { user } = useSelector((state) => state.user);
  const [isUploaded, setIsUploaded] = useState(false);
  const [logImg, setLogoImg] = useState(null); // Change initial state to null

  const logImgHandler = (e) => {
    setLogoImg(e.target.files[0]);
    setIsUploaded(true);
  };

  useEffect(() => {
    if (isUploaded) {
      uploadImg();
        setIsUploaded(false);
    }
  }, [isUploaded]);

  const uploadImg = async () => {
    if (!logImg) {
      console.error('No image selected.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', logImg);
    console.log(formData);
    try {
    //   const res = await fetch(`${localUrl}/user-profiles`, {
        const res = await fetch(`${localUrl}/user-profiles/${user.userAccount.id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });
      const data = await res.json();

      if (res.error) {
        console.error(data.message);
        return;
      }
      alert(data.message);
      console.log(data);
      return data;
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  return (
    <>
      <div className="uploading-outer">
        <div className="uploadButton">
          <input
            className="uploadButton-input"
            type="file"
            name="attachments[]"
            accept="image/*"
            id="upload"
            onChange={logImgHandler}
          />
          <label
            className="uploadButton-button ripple-effect"
            htmlFor="upload"
          >
            {logImg ? logImg.name : "Tải ảnh đại diện"}
          </label>
          <span className="uploadButton-file-name"></span>
        </div>
        <div className="text">
          File ảnh phải có định dạng .jpg, .png, .jpeg và kích thước tối đa 2MB, độ phân giải tối thiểu 300x300px
        </div>
      </div>
    </>
  );
};

export default LogoUpload;
