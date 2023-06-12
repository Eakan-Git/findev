import Social from "../social/Social";

const CompanyInfo = ({company}) => {
  return (
    <ul className="company-info">
      <li>
        Người đăng tuyển: <span>{company?.full_name}</span>
      </li>
      <li>
        Số nhân viên: <span>{company?.company_profile.size}</span>
      </li>
      {/* <li>
        Email: <span>info@joio.com</span>
      </li> */}
      <li>
        Địa chỉ: <span>{company?.company_profile.address}</span>
      </li>
    </ul>
  );
};

export default CompanyInfo;
