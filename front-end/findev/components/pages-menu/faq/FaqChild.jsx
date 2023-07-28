const FaqChild = () => {
  return (
    <>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item accordion block active-block">
          <h2 className="accordion-header">
            <button
              className="acc-btn accordion-button "
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
            >
              Vì sao tôi tạo tài khoản nhưng không nhận được công việc gợi ý?
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body ">
              <div className="content">
                <p>
                  Khi bạn tạo tài khoản, chúng tôi chỉ yêu cầu bạn cung cấp họ và tên.
                </p>
                <p>
                  Nếu bạn muốn nhận được công việc gợi ý, hãy cập nhật đầy đủ thông tin hồ sơ của bạn, như: Công việc mong muốn, kinh nghiệm làm việc, kỹ năng, ...
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion-item accordion block active-block">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button acc-btn collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Tôi đã cập nhật thông tin đầy đủ, tại sao tôi vẫn chưa xem được công việc gợi ý?
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="content">
                <p>
                  Hệ thống cần có thời gian để đánh giá thông tin hồ sơ của bạn và gợi ý công việc phù hợp.
                  <br/>Quá trình này có thể mất vài phút, tùy thuộc vào đặc trưng thông tin hồ sơ của bạn. Hãy kiên nhẫn chờ đợi nhé!
                  </p>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion-item accordion block active-block">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button acc-btn collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Tôi không thể nhập thông tin nhanh bằng CV của tôi?
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="content">
                <p>
                  Hệ thống của chúng tôi cung cấp tính năng nhập thông tin hồ sơ nhanh bằng CV.
                </p>
                <p>
                Tuy nhiên, để hệ thống có thể nhận diện được thông tin của bạn, CV của bạn phải đúng kiểu mà hệ thống có thể đọc được.
                <br/>Hiện tại, hệ thống chỉ có khả năng đọc được CV được xuất ra từ chính hệ thống của chúng tôi.
                Đây là hạn chế của hệ thống, chúng tôi sẽ cố gắng cải thiện hệ thống để có thể đọc được nhiều kiểu CV hơn.
                </p>
                <p>
                  Bạn có thể tải thử một CV mẫu của chúng tôi <a href="https://drive.google.com/file/d/1BVc0BjcwOOKFxdfQSpRwQ0SjTQ-07Jfd" target="_blank" rel="noreferrer">tại đây </a> để trải nghiệm tính năng này.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqChild;
