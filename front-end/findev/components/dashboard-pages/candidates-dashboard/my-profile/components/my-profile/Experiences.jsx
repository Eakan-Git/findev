import { Modal, Button } from 'react-bootstrap';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ExpsModalContent from "../ExpsModalContent";
import axios from 'axios'
import { localUrl } from "/utils/path.js";


const Experiences = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exps, setExps] = useState([]);
  const MAX_EXPS = 3;
  const getExps = async () => {
    try {
      const res = await axios.get(`${localUrl}/user-experiences/user/${user.userAccount.id}`, 
      {
        headers: 
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }})
      // if (!res.ok) {
      //   console.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại');
      // }
      setExps(res.data.data.user_experiences.data);
    } catch (error) {
      console.log(error);
      if(error.response.data.message === "Không tìm thấy")
      setExps([])
    }
  }


  useEffect(() => {
    getExps();
  }, []);

  const reloadData = () => {
    getExps();
  };

  const handleModalOpen = () => {
    if (exps.length >= MAX_EXPS) {
      alert("Bạn chỉ có thể cập nhật tối đa " + MAX_EXPS + " kinh nghiệm của bản thân!");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${localUrl}/user-experiences/${id}`, {
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
    <div className="resume-outer theme-blue">
      <div className="upper-title">
        <h4>Kinh nghiệm</h4>
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
              <h3 className="title">Kinh nghiệm</h3>
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
          <ExpsModalContent user={user} onClose={handleModalClose} reloadData={reloadData} />
        </Modal.Body>
      </Modal>
      </div>
      {/* <!-- Resume BLock --> */}
      {exps.length === 0 ? (
        <div className="resume-block">
          <div className="text">Bạn chưa cập nhật kinh nghiệm.</div>
        </div>
      ) : (
        exps.map((exp, index) => (
          <div className="resume-block" key={index + 1}>
            <div className="inner">
              <span className="name">{index + 1}</span>
              <div className="title-box">
                <div className="info-box">
                  <h3>{exp.title}</h3>
                  <span>{exp.position}</span>
                </div>
                <div className="edit-box">
                  <span className="year">{`${new Date(exp.start).getMonth() + 1}/${new Date(exp.start).getFullYear()} - ${new Date(exp.end).getMonth() + 1}/${new Date(exp.end).getFullYear()}`}</span>
                  <div className="edit-btns">
                    <button onClick={() => handleDelete(exp.id)}>
                      <span className="la la-trash"></span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="text">
                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a
                ipsum tellus. Interdum et malesuada fames ac ante
                <br /> ipsum primis in faucibus. */}
                {exp?.description || ""}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Experiences;
