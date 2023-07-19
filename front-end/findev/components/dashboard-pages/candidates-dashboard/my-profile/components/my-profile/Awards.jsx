import { Modal, Button } from 'react-bootstrap';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AwardsModalContent from "../AwardsModalContent";
import axios from 'axios'
import { localUrl } from "/utils/path.js";
const Awards = ({user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [awards, setAwards] = useState([]);
  const MAX_AWARDS = 5;
  const getAwards = async () => {
    try {
      const res = await axios.get(`${localUrl}/user-achievements/user/${user.userAccount.id}`, 
      {
        headers: 
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }})
      // if (!res.ok) {
      //   console.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại');
      // }
      setAwards(res.data.data.user_achievements.data);
    } catch (error) {
      console.log(error);
      if(error.response.data.message === "Không tìm thấy")
      setAwards([])
    }
  }


  useEffect(() => {
    getAwards();
  }, []);

  const reloadData = () => {
    getAwards();
  };

  const handleModalOpen = () => {
    if (awards.length >= MAX_AWARDS) {
      alert("Bạn chỉ có thể cập nhật tối đa " + MAX_AWARDS + " giải thưởng!");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${localUrl}/user-achievements/${id}`, {
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
    <div className="resume-outer theme-yellow">
      <div className="upper-title">
        <h4>Thành tựu</h4>
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
              <h3 className="title">Giải thưởng</h3>
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
          <AwardsModalContent user={user} onClose={handleModalClose} reloadData={reloadData} />
        </Modal.Body>
      </Modal>
      </div>

      {awards.length <= 0 ? (
        <div className="text">Bạn chưa cập nhật thành tựu.</div>
      ) : (
        awards.map((award, index) => (
          <div className="resume-block" key={index}>
            <div className="inner">
              <span className="name">{index + 1}</span>
              <div className="title-box">
                <div className="info-box">
                  <h3>{award.description}</h3>
                  <span>{award.date}</span>
                </div>
                <div className="edit-box">
                  <span className="year">{award.year}</span>
                  <div className="edit-btns">
                    <button onClick={() => handleDelete(award.id)}>
                      <span className="la la-trash"></span>
                    </button>
                  </div>
                </div>
              </div>
              {/* <div className="text">{award.description}</div> */}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Awards;
