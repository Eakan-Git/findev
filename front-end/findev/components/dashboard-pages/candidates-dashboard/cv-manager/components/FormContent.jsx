import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { localUrl } from "/utils/path";
const FormContent = ({ isUploaded, setIsUploaded }) => {
  const { user } = useSelector((state) => state.user);
  const [cvTitle, setCvTitle] = useState("");
  const [cvNote, setCvNote] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleUploadCV = async (e) => {
    e.preventDefault();
    // console.log(cvTitle, cvNote, cvFile);
    if (!cvFile) {
      alert("Vui lòng chọn file CV");
      return;
    }
    if (cvTitle === "") {
      alert("Vui lòng nhập tên CV");
      return;
    }
    const formData = new FormData();
    formData.append("cv_name", cvTitle);
    formData.append("cv_path", cvFile);
    cvNote && formData.append("cv_note", cvNote);
    // log all form data
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    try {
      setLoading(true);
      const response = await fetch(`${localUrl}/cvs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      console.log(response);
      setCvFile(null); // Reset the selected file
      setCvTitle(""); // Clear the title input
      setCvNote(""); // Clear the note input
      // alert("Tải lên thành công");
      // window.location.reload();
      document.getElementById("CVfile").value = null;
      document.getElementById("cvTitle").value = "";
      document.getElementById("cvNote").value = "";
      setIsUploaded(!isUploaded);
    } catch (err) {
      console.log(err);
      if (err.message === "Unauthenticated.") {
        alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
        router.push("/");
        dispatch(logoutUser());
      }
    }
    setLoading(false);
  };

  return (
    <div className="form-inner">
      <h3>ĐĂNG TẢI CV</h3>

      {/* <!--Login Form--> */}
      <form>
        <div className="form-group">
          <label>Chọn file CV muốn tải lên</label>
          <span style={{ color: "red", fontSize: "14px" }}> *</span>
          <input
            id="CVfile"
            type="file"
            name="CVfile"
            required={true}
            onChange={(e) => setCvFile(e.target.files[0])}
            accept=".pdf"
          />
          <br />
          <i style={{ fontSize: "14px" }}>Chỉ chấp nhận file .pdf</i>
        </div>
        <div className="form-group">
          <label>Tên CV</label>
          <span style={{ color: "red", fontSize: "14px" }}> *</span>
          <input
            id="cvTitle"
            type="text"
            name="cvTitle"
            placeholder="Nhập tên CV"
            defaultValue={cvTitle}
            onChange={(e) => setCvTitle(e.target.value)}
            required={true}
          />
        </div>
        {/* name */}

        <div className="form-group">
          <label>Ghi chú</label>
          <input
            id="cvNote"
            type="text"
            name="cvNote"
            placeholder="Nhập ghi chú"
            defaultValue={cvNote}
            onChange={(e) => setCvNote(e.target.value)}
          />
        </div>
        {/* password */}

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="button"
            name="up-load"
            onClick={handleUploadCV}
            data-bs-dismiss={loading ? "" : "modal"}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </>
            ) : (
              "Tải lên"
            )}
          </button>
        </div>
      </form>
      {/* End form */}
    </div>
  );
};

export default FormContent;
