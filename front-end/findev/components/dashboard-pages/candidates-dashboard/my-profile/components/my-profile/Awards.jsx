const Awards = ({ awards }) => {
  console.log(awards);
  return (
    <div className="resume-outer theme-yellow">
      <div className="upper-title">
        <h4>Giải thưởng</h4>
        <button className="add-info-btn">
          <span className="icon flaticon-plus"></span> Thêm
        </button>
      </div>

      {awards.length <= 0 ? (
        <div className="text">Bạn chưa cập nhật giải thưởng.</div>
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
                    <button>
                      <span className="la la-pencil"></span>
                    </button>
                    <button>
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
