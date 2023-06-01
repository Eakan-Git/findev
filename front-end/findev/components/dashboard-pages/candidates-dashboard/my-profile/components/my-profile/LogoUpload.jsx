import { useState } from "react";

const LogoUpload = () => {
    const [logImg, setLogoImg] = useState("");
    const logImgHander = (e) => {
        setLogoImg(e.target.files[0]);
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
                        required
                        onChange={logImgHander}
                    />
                    <label
                        className="uploadButton-button ripple-effect"
                        htmlFor="upload"
                    >
                        {logImg !== "" ? logImg.name : "Tải ảnh đại diện"}
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
