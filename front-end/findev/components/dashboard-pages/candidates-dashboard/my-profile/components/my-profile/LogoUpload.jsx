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
    const bodyPayload = {
      avatar: logImg,
    };
    const payload = {
      object: bodyPayload,
    }
    console.log(payload);
    // try {
    //   const response = await fetch(`${localUrl}/user-profiles/import/${user.userAccount.id}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Authorization': `Bearer ${user.token}`,
    //       'Content-Type': 'application/json', // Set the proper content type header for JSON
    //     },
    //     body: payload, 
    //   });
    //   console.log(response);
    //   if (response.error) {
    //     throw new Error("Error updating profile.");
    //   }
  
    //   const data = await response.json();
    //   return data;
    // } catch (error) {
    //   console.error(error);
    //   throw error;
    // }
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
          <label className="uploadButton-button ripple-effect" htmlFor="upload">
            {logImg ? logImg.name : "Tải ảnh đại diện"}
          </label>
          <span className="uploadButton-file-name"></span>
        </div>
        {error && <p className="error-message">{error}</p>} {/* Display error message if there is an error */}
      </div>
    </>
  );
};

export default LogoUpload;
