import FormInfoBox from "./FormInfoBox";
import { useState } from "react";
import { UploadImg } from "./UploadImg";
import { useSelector } from "react-redux";
const Index = () => {
  const [avt, setAvt] = useState(null);
  const user = useSelector((state) => state.user);
  // save user to local storage
  localStorage.setItem("user", JSON.stringify(user));
  const handleAvtChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvt(URL.createObjectURL(file));
      UploadImg(file, user);
    } else {
      alert("Vui lòng chọn file ảnh");
    }
  };

  let avtImgContent = null;
  if (avt) {
    avtImgContent = (
      <img
        id="avt"
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid #ccc",
        }}
        src={avt}
        alt="avatar"
      />
    );
  }

  return (
    <div className="widget-content">
      <div
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => document.getElementById("uploadImg").click()}
      >
        {avtImgContent}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "30%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            width: "100%",
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
          }}
        >
          Thay Avatar
        </div>
      </div>
      <input
        className="uploadButton-input"
        type="file"
        name="attachments[]"
        accept="image/png, image/jpg, image/jpeg"
        id="uploadImg"
        hidden
        onChange={handleAvtChange}
      />
      <br />
      <FormInfoBox setAvt={setAvt} />
    </div>
  );
};

export default Index;
