const FooterApps = () => {
  return (
    <div className="widget-content">
      <div className="download-btns">
        <div className="text">Click và tải ngay</div>
        <a href="#" className="app-btn">
          <div className="app-icon">
            <i className="fab fa-apple"></i>
          </div>
          <div className="inner">
            <div className="sub">Tải trên</div>
            <div className="name-app">Apple Store</div>
          </div>
        </a>
        <a href="#" className="app-btn">
          <div className="app-icon">
            <i className="fab fa-apple"></i>
          </div>
          <div className="inner">
            <div className="sub">Tải trên</div>
            <div className="name-app">Google Play</div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default FooterApps;
