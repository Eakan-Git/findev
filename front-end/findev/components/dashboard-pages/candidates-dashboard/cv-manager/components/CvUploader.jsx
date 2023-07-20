import React, { useState } from "react";
import { localUrl } from "/utils/path";

// Validation checking
function checkFileType(file) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  return allowedTypes.includes(file.type);
}

const CvUploader = ({ user, file, onFileUpload }) => {
  const [cvTitle, setCvTitle] = useState("");
  const [cvNote, setCvNote] = useState("");
  const [selectedFile, setSelectedFile] = useState(file);

  const deleteHandler = () => {
    setSelectedFile(null);
  };

  const saveCvHandler = async () => {
    // console.log(selectedFile);
    if (!selectedFile) return; // Do nothing if no file is selected

    const formData = new FormData();
    formData.append("cv_name", cvTitle);
    formData.append("cv_note", cvNote);
    formData.append("user_id", user.userAccount.id);
    formData.append("cv_path", selectedFile);

    try {
      const response = await fetch(`${localUrl}/cvs/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      console.log(response);
      setSelectedFile(null); // Reset the selected file
      setCvTitle(""); // Clear the title input
      setCvNote(""); // Clear the note input
    } catch (err) {
      console.log(err);
      if (err.message === "Unauthenticated.") {
        alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
        router.push("/");
        // dispatch(logoutUser());
      }
    }
  };

  return (
    <>
      {/* Start Upload result */}
      <div className="uploading-resume">
          <div className="cv-review-box">
            <span className="title">{selectedFile?.name}</span>
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
      </div>
      {/* End upload-resume */}
    </>
  );
};

export default CvUploader;
