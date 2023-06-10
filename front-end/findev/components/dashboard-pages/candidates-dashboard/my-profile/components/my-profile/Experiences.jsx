const Experiences = ({ exps }) => {
  return (
    <div className="resume-outer theme-blue">
      <div className="upper-title">
        <h4>Kinh nghiệm</h4>
        <button className="add-info-btn">
          <span className="icon flaticon-plus"></span> Thêm
        </button>
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
                    <button>
                      <span className="la la-pencil"></span>
                    </button>
                    <button>
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
