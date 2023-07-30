import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logoutUser } from "/app/actions/userActions";
const SidebarFooter = () => {
  const user = useSelector((state) => state.user.user);
  const socialContent = [
    { id: 1, icon: "fa-facebook-f", link: "https://www.facebook.com/" },
    { id: 2, icon: "fa-twitter", link: "https://www.twitter.com/" },
    { id: 3, icon: "fa-instagram", link: "https://www.instagram.com/" },
    { id: 4, icon: "fa-linkedin-in", link: "https://www.linkedin.com/" },
  ];
  let content = null;
  const dispatch = useDispatch();
  const handleLogout = () => {
    if(confirm("Bạn có chắc chắn muốn đăng xuất?")){
      dispatch(logoutUser());
    }
  }
  if(user){
    content = <>
    <a
      className="theme-btn btn-style-one mm-listitem__text"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasMenu"
      onClick={handleLogout}
      >
        Đăng xuất
      </a>
    </>
  }
  else{
    content = <>
      <a href="#" 
      className="theme-btn btn-style-one mm-listitem__text"
      data-bs-toggle="modal"
      data-bs-target="#loginPopupModal"
      >
        Đăng nhập
      </a>
    </>
  }
  return (
    <div className="mm-add-listing mm-listitem pro-footer">
      {content}
      {/* job post btn */}

      <div className="mm-listitem__text">
        <div className="contact-info">
          <span className="phone-num">
            <span>Liên hệ với chúng tôi</span>
            <a href="tel:1234567890">123 456 7890</a>
          </span>
          <span className="address">
            227 Nguyễn Văn Cừ <br />
            phường 4, quận 5, TP.HCM
          </span>
          <a href="mailto:support@findev.com" className="email">
            support@findev.com
          </a>
        </div>
        {/* End .contact-info */}

        {/* <div className="social-links">
          {socialContent.map((item) => (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              key={item.id}
            >
              <i className={`fab ${item.icon}`}></i>
            </a>
          ))}
        </div> */}
        {/* End social-links */}
      </div>
      {/* End .mm-listitem__text */}
    </div>
  );
};

export default SidebarFooter;
