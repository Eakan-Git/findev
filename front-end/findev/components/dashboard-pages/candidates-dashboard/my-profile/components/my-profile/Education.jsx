import { Modal, Button } from 'react-bootstrap';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EduModalContent from "../EduModalContent";
import axios from 'axios'
import { localUrl } from "/utils/path.js";

const Education = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [educations, setEducations] = useState([]);
  const MAX_EDU = 3;
  const getEDUS = async () => {
    try {
      const res = await axios.get(`${localUrl}/user-educations/user/${user.userAccount.id}`, 
      {
        headers: 
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }})
      // if (!res.ok) {
      //   console.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại');
      // }
      setEducations(res.data.data.user_educations.data);
    } catch (error) {
      if(error.response.data.message === "Không tìm thấy")
        setEducations([])
    }
  }


  useEffect(() => {
    getEDUS();
  }, []);


  const reloadData = () => {
    getEDUS();
  };

  const handleModalOpen = () => {
      if (educations.length >= MAX_EDU) {
        alert("Bạn chỉ có thể cập nhật tối đa " + MAX_EDU + " thông tin học vấn của bản thân!");
      } else {
        setIsModalOpen(true);
      }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${localUrl}/user-educations/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      reloadData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="resume-outer">
      <div className="upper-title">
        <h4>Học vấn</h4>
        <button className="add-info-btn" onClick={handleModalOpen}>
          <span className="icon flaticon-plus"></span> Thêm
        </button>
        <Modal
          show={isModalOpen}
          onHide={handleModalClose}
          dialogClassName="modal-dialog modal-dialog-centered modal-dialog-scrollable"
        >
        <Modal.Header closeButton={false}>
          <div className="apply-modal-content modal-content">
            <div className="text-center">
              <h3 className="title">Học vấn</h3>
                <button
                  type="button"
                  className="closed-modal"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick= {handleModalClose}
                ></button>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <EduModalContent user={user} onClose={handleModalClose} reloadData={reloadData} />
        </Modal.Body>
      </Modal>
      </div>
      {/* <!-- Resume BLock --> */}
      {educations.length <= 0 ? (
        <div className="text">Bạn chưa cập nhật học vấn.</div>
      ) : (
        educations.map((education, index) => (
          <div className="resume-block" key={index}>
            <div className="inner">
              <span className="name">{index + 1}</span>
              <div className="title-box">
                <div className="info-box">
                  <h3>{education.university}</h3>
                  <span>{education.major}</span>
                </div>
                <div className="edit-box">
                  <span className="year">{`${new Date(education.start).getFullYear()} - ${new Date(education.end).getFullYear()}`}</span>
                  <div className="edit-btns">
                    <button onClick={() => handleDelete(education.id)}>
                      <span className="la la-trash"></span>
                    </button>
                  </div>
                </div>
              </div>
              {/* <div className="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a
                ipsum tellus. Interdum et malesuada fames ac ante
                <br /> ipsum primis in faucibus.
              </div> */}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Education;
