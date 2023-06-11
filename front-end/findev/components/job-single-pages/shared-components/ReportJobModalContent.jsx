import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { localUrl } from '../../../utils/path';

const ReportJobModalContent = ({ id, onClose }) => {
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(
        `${localUrl}/job-reports/`,
        {
          reason: message,
          job_id: id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token,
          },
        }
      );

      setMessage('');
      setIsSubmitSuccess(true);
    } catch (error) {
      console.error('Failed to submit report:', error);
    }
  };

  const resetModal = () => {
    setMessage('');
    setIsSubmitSuccess(false);
  };

  const handleModalClose = () => {
    onClose();
    resetModal();
  };

  return (
    <form className="default-form job-apply-form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <textarea
            className="darma"
            name="message"
            placeholder="Lý do báo cáo"
            value={message}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <button className="theme-btn btn-style-one w-100" type="submit" name="submit-form">
            Gửi báo cáo
          </button>
        </div>
      </div>
      {isSubmitSuccess && (
        <p className="success-message">Báo cáo đã được gửi thành công !</p>
      )}
      <style jsx>{`
        .success-message {
          font-size: 18px;
          color: red;
          text-align: center;
          margin-top: 10px;
          font-family: Arial, sans-serif;
        }
      `}</style>
    </form>
  );
};

export default ReportJobModalContent;
