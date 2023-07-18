import { useState } from "react";
import axios from "axios"
import { localUrl } from "/utils/path";

// validation checking
function checkFileType(file) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  return allowedTypes.includes(file.type);
}

const CvUploader = ({ user, onFileUpload }) => {
  const [getCvFile, setCvFile] = useState(null);
  const [cvTitle, setCvTitle] = useState("");
  const [cvNote, setCvNote] = useState("");
  const [getError, setError] = useState("");

  const cvManagerHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return; // If no file is selected, do nothing

    if (checkFileType(file)) {
      setCvFile(file);
      setError("");
      // Call the file upload handler function passed from the parent component
      onFileUpload(file);
    } else {
      setError("Only accept (.doc, .docx, .pdf) file");
    }
  };

  const deleteHandler = () => {
    setCvFile(null);
  };

  const saveCvHandler = async () => {
    const formData = new FormData();
    formData.append("cv_name", cvTitle);
    formData.append("cv_note", cvNote);
    formData.append("user_id", user.userAccount.id);
    formData.append("cv_path", getCvFile);
    try
    {
      const response = await fetch(`${localUrl}/cvs/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data', 
        },
        body: formData // Pass the serialized form data as the request body
      });
        console.log(response)
        setCvFile(null); // Reset the selected file
        setCvTitle(""); // Clear the title input
        setCvNote(""); // Clear the note input
    }
    catch (err)
    {
        console.log(err)
        if (err.message === "Unauthenticated.") {
          alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
          router.push("/");
          dispatch(logoutUser());
      }
    }
  };

  return (
    <>
      {/* Start Upload resule */}
      <div className="uploading-resume">
        {!getCvFile ? (
          // Show the drop file section if no file is selected or after saving
          <div className="uploadButton">
            <input
              className="uploadButton-input"
              type="file"
              name="attachments[]"
              accept=".doc,.docx,.xml,application/msword,application/pdf, image/*"
              id="upload"
              onChange={cvManagerHandler}
            />
            <label className="cv-uploadButton" htmlFor="upload">
              <span className="title">Bỏ tệp CV của bạn vào đây</span>
              <span className="text">
              Kích thước tệp tải lên là (Tối đa 5Mb) và loại tệp cho phép là (.doc, .docx, .pdf).
              </span>
              <span className="theme-btn btn-style-one">Đăng tải</span>
              {getError !== "" ? <p className="ui-danger mb-0">{getError}</p> : undefined}
            </label>
          </div>
        ) : (
          // Show the selected file section if a file is uploaded
          <div className="cv-review-box">
            <span className="title">{getCvFile.name}</span>
            <div className="edit-btns">
              <button onClick={deleteHandler}>
                <span className="la la-trash"></span>
              </button>
            </div>

            {/* Title and Note input */}
            <div className="cv-input-section">
              <input
                type="text"
                placeholder="Tên CV"
                value={cvTitle}
                onChange={(e) => setCvTitle(e.target.value)}
              />
              <textarea
                placeholder="Ghi chú"
                value={cvNote}
                onChange={(e) => setCvNote(e.target.value)}
              />
              <button className="theme-btn btn-style-one" onClick={saveCvHandler}>
                Lưu CV
              </button>
            </div>
          </div>
        )}
      </div>
      {/* End upload-resume */}
    </>
  );
};

export default CvUploader;
