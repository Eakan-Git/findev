const Education = ({ educations }) => {
  return (
    <div className="resume-outer">
      <div className="upper-title">
        <h4>Học vấn</h4>
        <button className="add-info-btn">
          <span className="icon flaticon-plus"></span> Thêm
        </button>
      </div>
      {/* <!-- Resume BLock --> */}
      {educations.length === 0 ? (
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
                    <button>
                      <span className="la la-pencil"></span>
                    </button>
                    <button>
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
