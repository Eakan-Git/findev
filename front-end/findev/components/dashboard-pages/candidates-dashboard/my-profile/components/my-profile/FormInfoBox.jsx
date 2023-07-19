import Select from "react-select";
import ContactInfoBox from "../ContactInfoBox";
import {fetchProfile} from "./fetchProfile"
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import putProfile from "./putProfile";
import { useRouter } from "next/router";
import { logoutUser } from "../../../../../../app/actions/userActions";
import { useDispatch } from "react-redux";
import Education from "./Education";
import Experiences from "./Experiences";
import Awards from "./Awards";
const FormInfoBox = () => {
  // fetch user profile data with ID from state
  const { user } = useSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [defaultProfile, setDefaultProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modifiedFields, setModifiedFields] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(modifiedFields);
    if (Object.keys(modifiedFields).length > 0) {
      // console.log("Modified fields:", modifiedFields);
      const msg = await putProfile(user.token, modifiedFields);
      // console.log(msg);
      if (msg?.error === false) {
        alert("Cập nhật thông tin thành công");
        setProfile((prevProfile) => ({ ...prevProfile, ...modifiedFields }));
        setModifiedFields({});
      }
      else
      {
        // alert("Cập nhật thông tin thất bại");
        // console.log(msg);
        alert(msg.message);
      }
    }
  };
  const handleCancel = (event) => {
    event.preventDefault();
    if (Object.keys(modifiedFields).length > 0) {
      setModifiedFields({});
      setProfile(defaultProfile);
    }
  };
const fetchUser = async () => {
    const fetchedProfile = await fetchProfile(user.userAccount.id, user.token);
    if (fetchedProfile.error === false) {
      setProfile(fetchedProfile.data.user_profile);
      setDefaultProfile(fetchedProfile.data.user_profile);
      // console.log("Profile:", fetchedProfile.data.user_profile);
      setLoading(!loading);
    } else if (fetchedProfile.message === "Unauthenticated.") {
      alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
      router.push("/");
      dispatch(logoutUser());
      return;
    } else {
      alert("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  // console.log(profile);
  const catOptions = [
    { value :  'Routers' ,  label :  'Routers' },
    { value :  'Phân tích dữ liệu' ,  label :  'Phân tích dữ liệu' },
    { value :  'Bootstrap' ,  label :  'Bootstrap' }, 
    { value :  'Sử dụng thành thạo word' ,  label :  'Sử dụng thành thạo word' }, 
    { value :  'UX' ,  label :  'UX' }, 
    { value :  'Accountants' ,  label :  'Accountants' }, 
    { value :  'J2EE' ,  label :  'J2EE' }, 
    { value :  'Android ADT' ,  label :  'Android ADT' }, 
    { value :  'SQL Server' ,  label :  'SQL Server' }, 
    { value :  'Emotional Intelligence (EQ)' ,  label :  'Emotional Intelligence (EQ)' }, 
    { value :  'Oracle PL/SQL' ,  label :  'Oracle PL/SQL' }, 
    { value :  'Tiếng Đức' ,  label :  'Tiếng Đức' }, 
    { value :  'Jenkins' ,  label :  'Jenkins' }, 
    { value :  'Quality Control' ,  label :  'Quality Control' }, 
    { value :  'Teamwork' ,  label :  'Teamwork' }, 
    { value :  'Phần mềm tekla' ,  label :  'Phần mềm tekla' }, 
    { value :  'Docker' ,  label :  'Docker' }, 
    { value :  'Tư duy sáng tạo' ,  label :  'Tư duy sáng tạo' }, 
    { value :  'Amis' ,  label :  'Amis' }, 
    { value :  'bán hàng' ,  label :  'bán hàng' }, 
    { value :  'Front-end' ,  label :  'Front-end' }, 
    { value :  'IT Helpdesk' ,  label :  'IT Helpdesk' }, 
    { value :  'Social Media' ,  label :  'Social Media' }, 
    { value :  'Có tinh thần trách nhiệm cao' ,  label :  'Có tinh thần trách nhiệm cao' }, 
    { value :  'Ecommerce' ,  label :  'Ecommerce' }, 
    { value :  'Cởi mở' ,  label :  'Cởi mở' }, 
    { value :  'MSSQL' ,  label :  'MSSQL' }, 
    { value :  'GameMaker' ,  label :  'GameMaker' }, 
    { value :  'Account Management' ,  label :  'Account Management' }, 
    { value :  'R&D' ,  label :  'R&D' }, 
    { value :  'WinForms' ,  label :  'WinForms' }, 
    { value :  'Adaptive Learning' ,  label :  'Adaptive Learning' },
    { value :  'Powerpoint' ,  label :  'Powerpoint' }, 
    { value :  'TOPIK 4' ,  label :  'TOPIK 4' }, 
    { value :  'PTS' ,  label :  'PTS' }, 
    { value :  'PMP' ,  label :  'PMP' }, 
    { value :  'Time - Management' ,  label :  'Time - Management' }, 
    { value :  'Sales online' ,  label :  'Sales online' }, 
    { value :  'TCP/IP' ,  label :  'TCP/IP' }, 
    { value :  '.Net Core' ,  label :  '.Net Core' }, 
    { value :  'Kỹ năng lãnh đạo' ,  label :  'Kỹ năng lãnh đạo' }, 
    { value :  'convincing skill' ,  label :  'convincing skill' }, 
    { value :  'kỹ năng đào tạo' ,  label :  'kỹ năng đào tạo' }, 
    { value :  'JLPT N3' ,  label :  'JLPT N3' }, 
    { value :  'Django' ,  label :  'Django' }, 
    { value :  'Financial office' ,  label :  'Financial office' }, 
    { value :  'Nhiệt tình' ,  label :  'Nhiệt tình' }, 
    { value :  'Framework Django' ,  label :  'Framework Django' }, 
    { value :  'Project Coordination' ,  label :  'Project Coordination' }, 
    { value :  'Socket.io' ,  label :  'Socket.io' }, 
    { value :  'MS Outlook' ,  label :  'MS Outlook' }, 
    { value :  'Chăm chỉ' ,  label :  'Chăm chỉ' }, 
    { value :  'User Research' ,  label :  'User Research' }, 
    { value :  'Spring Framework' ,  label :  'Spring Framework' }, 
    { value :  'Google APIs' ,  label :  'Google APIs' }, 
    { value :  'Data Presentation' ,  label :  'Data Presentation' }, 
    { value :  'Administration' ,  label :  'Administration' }, 
    { value :  'CSS3' ,  label :  'CSS3' }, 
    { value :  'Intermedidate English' ,  label :  'Intermedidate English' }, 
    { value :  'Tiếng Anh giao tiếp' ,  label :  'Tiếng Anh giao tiếp' }, 
    { value :  'Performance Marketing' ,  label :  'Performance Marketing' }, 
    { value :  'Agavi' ,  label :  'Agavi' }, 
    { value :  'CAD 2D' ,  label :  'CAD 2D' }, 
    { value :  '3D Visualization' ,  label :  '3D Visualization' }, 
    { value :  'quản lý tòa nhà' ,  label :  'quản lý tòa nhà' }, 
    { value :  'Business acumen & Market assessment' ,  label :  'Business acumen & Market assessment' },
    { value :  'VPN' ,  label :  'VPN' }, 
    { value :  'Negotiation' ,  label :  'Negotiation' }, 
    { value :  'Quản lý thời gian' ,  label :  'Quản lý thời gian' }, 
    { value :  'JLPT N2' ,  label :  'JLPT N2' }, 
    { value :  'Tiếng Anh cơ bản' ,  label :  'Tiếng Anh cơ bản' }, 
    { value :  'Canva' ,  label :  'Canva' }, 
    { value :  'Agile Testing' ,  label :  'Agile Testing' }, 
    { value :  'may mặc' ,  label :  'may mặc' }, 
    { value :  'Flash' ,  label :  'Flash' }, 
    { value :  'Wholesale Purchasing' ,  label :  'Wholesale Purchasing' }, 
    { value :  'TESOL' ,  label :  'TESOL' }, 
    { value :  'Microsoft Access' ,  label :  'Microsoft Access' }, 
    { value :  'Research & Analytic skills' ,  label :  'Research & Analytic skills' }, 
    { value :  'Linux' ,  label :  'Linux' }, 
    { value :  'Qt Framework' ,  label :  'Qt Framework' }, 
    { value :  'Selenium Testing' ,  label :  'Selenium Testing' }, 
    { value :  'Oracle SQL' ,  label :  'Oracle SQL' }, 
    { value :  'Marketing expertise' ,  label :  'Marketing expertise' }, 
    { value :  'Microsoft Office' ,  label :  'Microsoft Office' }, 
    { value :  'Tiếng Nhật N3' ,  label :  'Tiếng Nhật N3' }, 
    { value :  'Data Analysis' ,  label :  'Data Analysis' }, 
    { value :  'TOEIC 650' ,  label :  'TOEIC 650' }, 
    { value :  'Purchasing Negotiation' ,  label :  'Purchasing Negotiation' }, 
    { value :  'excel' ,  label :  'excel' }, 
    { value :  'Motion Graphic Design' ,  label :  'Motion Graphic Design' }, 
    { value :  'MVC' ,  label :  'MVC' }, 
    { value :  'Channel Marketing' ,  label :  'Channel Marketing' }, 
    { value :  'Microsoft Excel' ,  label :  'Microsoft Excel' }, 
    { value :  'Big Data' ,  label :  'Big Data' }, 
    { value :  'VR' ,  label :  'VR' }, 
    { value :  'Direct Sale' ,  label :  'Direct Sale' }, 
    { value :  'Excel cơ bản' ,  label :  'Excel cơ bản' }, 
    { value :  'VueJS' ,  label :  'VueJS' }, 
    { value :  'Angular 2' ,  label :  'Angular 2' }, 
    { value :  'Advertising' ,  label :  'Advertising' }, 
    { value :  'Programming' ,  label :  'Programming' }, 
    { value :  'kafka' ,  label :  'kafka' }, 
    { value :  'kỹ năng điều tra' ,  label :  'kỹ năng điều tra' }, 
    { value :  'LESS' ,  label :  'LESS' }, 
    { value :  'Redis' ,  label :  'Redis' }, 
    { value :  'Kỹ năng sư phạm' ,  label :  'Kỹ năng sư phạm' }, 
    { value :  'API Testing' ,  label :  'API Testing' }, 
    { value :  'team leader' ,  label :  'team leader' }, 
    { value :  'Final Cut Pro' ,  label :  'Final Cut Pro' }, 
    { value :  'Tư duy logic' ,  label :  'Tư duy logic' }, 
    { value :  'Thiết kế đồ họa' ,  label :  'Thiết kế đồ họa' },
    { value :  'ACLS' ,  label :  'ACLS' },
    { value :  'Ruby on Rails' ,  label :  'Ruby on Rails' },
    { value :  'hỗ trợ kinh doanh' ,  label :  'hỗ trợ kinh doanh' },
    { value :  'Video Production' ,  label :  'Video Production' },
    { value :  'digital marketing' ,  label :  'digital marketing' },
    { value :  'OPP' ,  label :  'OPP' },
    { value :  'VB.NET' ,  label :  'VB.NET' }, 
    { value :  'ASP' ,  label :  'ASP' }, 
    { value :  'German Translation' ,  label :  'German Translation' }, 
    { value :  'Microsoft Certified Technology' ,  label :  'Microsoft Certified Technology' }, 
    { value :  'HTML' ,  label :  'HTML' }, 
    { value :  'Sketchup' ,  label :  'Sketchup' }, 
    { value :  'Game Design' ,  label :  'Game Design' }, 
    { value :  'TOEFL' ,  label :  'TOEFL' }, 
    { value :  'Analytics' ,  label :  'Analytics' }, 
    { value :  'Consulting' ,  label :  'Consulting' }, 
    { value :  'Sharepoint' ,  label :  'Sharepoint' }, 
    { value :  'Nghiên cứu' ,  label :  'Nghiên cứu' }, 
    { value :  'Windows' ,  label :  'Windows' }, 
    { value :  'CAD/CAE' ,  label :  'CAD/CAE' }, 
    { value :  'React Native' ,  label :  'React Native' }, 
    { value :  'My SQL' ,  label :  'My SQL' }, 
    { value :  'Tiếng Anh đọc hiểu' ,  label :  'Tiếng Anh đọc hiểu' }, 
    { value :  'Telesales' ,  label :  'Telesales' }, 
    { value :  'RabbitMQ' ,  label :  'RabbitMQ' }, 
    { value :  'Đàm phán' ,  label :  'Đàm phán' }, 
    { value :  'Tiếng Thái' ,  label :  'Tiếng Thái' }, 
    { value :  'Digital Media' ,  label :  'Digital Media' }, 
    { value :  '3D Modeling' ,  label :  '3D Modeling' }, 
    { value :  'Adobe Audition' ,  label :  'Adobe Audition' }, 
    { value :  'Javascript Framework' ,  label :  'Javascript Framework' }, 
    { value :  'CodeIgniter' ,  label :  'CodeIgniter' }, 
    { value :  'Tiếng Nhật N3' ,  label :  'Tiếng Nhật N3' }, 
    { value :  'Business Analyst' ,  label :  'Business Analyst' }, 
    { value :  'Tiếng Nhật' ,  label :  'Tiếng Nhật' }, 
    { value :  'After Effect' ,  label :  'After Effect' }, 
    { value :  'Software Engineering' ,  label :  'Software Engineering' }, 
    { value :  'AI' ,  label :  'AI' }, 
    { value :  'Tư duy hệ thống' ,  label :  'Tư duy hệ thống' }, 
    { value :  'JavaScript Libraries' ,  label :  'JavaScript Libraries' }, 
    { value :  'Mobile Games' ,  label :  'Mobile Games' }, 
    { value :  'REST API' ,  label :  'REST API' }, 
    { value :  'HMTL5' ,  label :  'HMTL5' }, 
    { value :  'Swift' ,  label :  'Swift' }, 
    { value :  'Copywriting' ,  label :  'Copywriting' }, 
    { value :  'Drupal' ,  label :  'Drupal' }, 
    { value :  'Oracle Database' ,  label :  'Oracle Database' }, 
    { value :  '3D Artist' ,  label :  '3D Artist' }, 
    { value :  'Thuyết trình' ,  label :  'Thuyết trình' }, 
    { value :  'Spine' ,  label :  'Spine' }, 
    { value :  'ABAP' ,  label :  'ABAP' }, 
    { value :  'Excel Pivot' ,  label :  'Excel Pivot' }, 
    { value :  'Facebook Ads' ,  label :  'Facebook Ads' }, 
    { value :  'Ubuntu' ,  label :  'Ubuntu' }, 
    { value :  'Social Media Marketing' ,  label :  'Social Media Marketing' }, 
    { value :  'Corporate Communications' ,  label :  'Corporate Communications' }, 
    { value :  'Computer Vision' ,  label :  'Computer Vision' }, 
    { value :  'Shell script' ,  label :  'Shell script' },
    { value :  'phân tích số liệu' ,  label :  'phân tích số liệu' }, 
    { value :  'C++' ,  label :  'C++' }, 
    { value :  'Java GUI Framework' ,  label :  'Java GUI Framework' }, 
    { value :  'Designer' ,  label :  'Designer' }, 
    { value :  'Python' ,  label :  'Python' }, 
    { value :  'Kỹ năng quản lý' ,  label :  'Kỹ năng quản lý' }, 
    { value :  'Giao tiếp tốt' ,  label :  'Giao tiếp tốt' }, 
    { value :  'SEM' ,  label :  'SEM' }, 
    { value :  'Kỹ năng giảng dạy' ,  label :  'Kỹ năng giảng dạy' }, 
    { value :  'DNS' ,  label :  'DNS' }, 
    { value :  'Business Development' ,  label :  'Business Development' }, 
    { value :  'Relationship Management' ,  label :  'Relationship Management' }, 
    { value :  'GIS' ,  label :  'GIS' }, 
    { value :  'Sales Management' ,  label :  'Sales Management' }, 
    { value :  'Kỹ năng báo cáo' ,  label :  'Kỹ năng báo cáo' }, 
    { value :  'ActionScript' ,  label :  'ActionScript' }, 
    { value :  'facebook' ,  label :  'facebook' }, 
    { value :  'Vẽ 3D' ,  label :  'Vẽ 3D' }, 
    { value :  'Ruby' ,  label :  'Ruby' }, 
    { value :  'Game Balance' ,  label :  'Game Balance' }, 
    { value :  'Pytorch' ,  label :  'Pytorch' }, 
    { value :  'Microsoft Word' ,  label :  'Microsoft Word' }, 
    { value :  'Google Webmaster tool' ,  label :  'Google Webmaster tool' }, 
    { value :  'Kubernetes' ,  label :  'Kubernetes' }, 
    { value :  'Database' ,  label :  'Database' }, 
    { value :  'ASAP' ,  label :  'ASAP' }, 
    { value :  'ExpressJS' ,  label :  'ExpressJS' }, 
    { value :  'Sketch' ,  label :  'Sketch' }, 
    { value :  'App Game Kit' ,  label :  'App Game Kit' }, 
    { value :  'Zalo ads' ,  label :  'Zalo ads' }, 
    { value :  'NoSQL' ,  label :  'NoSQL' }, 
    { value :  'Kỹ năng đàm phán' ,  label :  'Kỹ năng đàm phán' }, 
    { value :  'Market Research' ,  label :  'Market Research' }, 
    { value :  'MCSE' ,  label :  'MCSE' }, 
    { value :  'bộ phận' ,  label :  'bộ phận' }, 
    { value :  'Accounts Payable' ,  label :  'Accounts Payable' }, 
    { value :  'System Admin' ,  label :  'System Admin' }, 
    { value :  'zalo' ,  label :  'zalo' }, 
    { value :  'Kĩ năng phân tích tổng hợp' ,  label :  'Kĩ năng phân tích tổng hợp' }, 
    { value :  'Purchasing Processes' ,  label :  'Purchasing Processes' }, 
    { value :  'Đọc hiểu' ,  label :  'Đọc hiểu' }, 
    { value :  'Automation Test' ,  label :  'Automation Test' }, 
    { value :  '3D Graphics' ,  label :  '3D Graphics' }, 
    { value :  'Tiếng Nhật N4' ,  label :  'Tiếng Nhật N4' }, 
    { value :  'Kỹ năng quản lý công việc' ,  label :  'Kỹ năng quản lý công việc' }, 
    { value :  'Javascript' ,  label :  'Javascript' }, 
    { value :  'Dart' ,  label :  'Dart' }, 
    { value :  'Premiere' ,  label :  'Premiere' }, 
    { value :  'Maya' ,  label :  'Maya' },
    { value :  'lập trình' ,  label :  'lập trình' },
    { value :  'Blockchain' ,  label :  'Blockchain' }, 
    { value :  'Tiếng Anh trung cấp' ,  label :  'Tiếng Anh trung cấp' }, 
    { value :  'UI/UX' ,  label :  'UI/UX' }, 
    { value :  'Unity 3D' ,  label :  'Unity 3D' }, 
    { value :  'Redux' ,  label :  'Redux' }, 
    { value :  'Làm việc nhóm' ,  label :  'Làm việc nhóm' }, 
    { value :  'RESTful API' ,  label :  'RESTful API' }, 
    { value :  'Sales' ,  label :  'Sales' },  
    { value :  'TypeScript' ,  label :  'TypeScript' }, 
    { value :  'webpack' ,  label :  'webpack' }, 
    { value :  'Kỹ năng phân tích kinh doanh' ,  label :  'Kỹ năng phân tích kinh doanh' }, 
    { value :  'Spring' ,  label :  'Spring' }, 
    { value :  'Banca knowledge' ,  label :  'Banca knowledge' }, 
    { value :  'Product Manager' ,  label :  'Product Manager' }, 
    { value :  'test plan' ,  label :  'test plan' }, 
    { value :  'tiếng đức B2' ,  label :  'tiếng đức B2' }, 
    { value :  'Academic English' ,  label :  'Academic English' }, 
    { value :  '3D Max' ,  label :  '3D Max' }, 
    { value :  'solidity' ,  label :  'solidity' }, 
    { value :  'ERP' ,  label :  'ERP' }, 
    { value :  'Tiếng Anh' ,  label :  'Tiếng Anh' }, 
    { value :  '.NET Framework' ,  label :  '.NET Framework' }, 
    { value :  'Business Process Analysis' ,  label :  'Business Process Analysis' }, 
    { value :  'Dịch thuật tiếng Trung' ,  label :  'Dịch thuật tiếng Trung' }, 
    { value :  'Customer Service' ,  label :  'Customer Service' }, 
    { value :  'MongoDB' ,  label :  'MongoDB' }, 
    { value :  'PHP' ,  label :  'PHP' }, 
    { value :  'Spring Boot' ,  label :  'Spring Boot' }, 
    { value :  'Manual Testing' ,  label :  'Manual Testing' }, 
    { value :  'API Development' ,  label :  'API Development' }, 
    { value :  'Quay dựng' ,  label :  'Quay dựng' }, 
    { value :  'AWS' ,  label :  'AWS' }, 
    { value :  'SQL' ,  label :  'SQL' }, 
    { value :  'Cad' ,  label :  'Cad' }, 
    { value :  'Tiếng Nhật N2' ,  label :  'Tiếng Nhật N2' }, 
    { value :  'Word' ,  label :  'Word' }, 
    { value :  'Tiếng Nhật N1' ,  label :  'Tiếng Nhật N1' }, 
    { value :  'Xây dựng mối quan hệ' ,  label :  'Xây dựng mối quan hệ' },
    { value :  'ASP.NET MVC' ,  label :  'ASP.NET MVC' },
    { value :  'Tiếng Anh giao tiếp' ,  label :  'Tiếng Anh giao tiếp' },
    { value :  'MS Offices' ,  label :  'MS Offices' },
    { value :  'Unity' ,  label :  'Unity' },
    { value :  'Chịu áp lực cao' ,  label :  'Chịu áp lực cao' }, 
    { value :  'Tensorflow' ,  label :  'Tensorflow' }, 
    { value :  'Có khả năng thích nghi nhanh' ,  label :  'Có khả năng thích nghi nhanh' }, 
    { value :  'Custom Facebook Pages' ,  label :  'Custom Facebook Pages' }, 
    { value :  'Content SEO' ,  label :  'Content SEO' }, 
    { value :  'Full Stack' ,  label :  'Full Stack' }, 
    { value :  'QC/QA' ,  label :  'QC/QA' }, 
    { value :  'Writing' ,  label :  'Writing' }, 
    { value :  'Kỹ năng Thuyết phục' ,  label :  'Kỹ năng Thuyết phục' }, 
    { value :  'Planning' ,  label :  'Planning' }, 
    { value :  ' Vuejs' ,  label :  ' Vuejs' }, 
    { value :  'German Teaching' ,  label :  'German Teaching' },
    { value :  'Oracle' ,  label :  'Oracle' }, 
    { value :  'HSK5' ,  label :  'HSK5' }, 
    { value :  'CPA' ,  label :  'CPA' }, 
    { value :  'Khả năng thuyết phục' ,  label :  'Khả năng thuyết phục' }, 
    { value :  'Tax Accounting' ,  label :  'Tax Accounting' }, 
    { value :  'Time Management' ,  label :  'Time Management' }, 
    { value :  'Elasticsearch' ,  label :  'Elasticsearch' }, 
    { value :  'PHP Applications' ,  label :  'PHP Applications' }, 
    { value :  'CentOS' ,  label :  'CentOS' }, 
    { value :  'Adobe Premiere' ,  label :  'Adobe Premiere' }, 
    { value :  'AIX platform' ,  label :  'AIX platform' }, 
    { value :  'Misa' ,  label :  'Misa' }, 
    { value :  'Warehouse operation' ,  label :  'Warehouse operation' }, 
    { value :  'MVP' ,  label :  'MVP' }, 
    { value :  'HSK4' ,  label :  'HSK4' }, 
    { value :  'Strategic planning' ,  label :  'Strategic planning' }, 
    { value :  'Architectural Illustration' ,  label :  'Architectural Illustration' },
    { value :  'Windows Server' ,  label :  'Windows Server' }, 
    { value :  'Tổ chức sự kiện' ,  label :  'Tổ chức sự kiện' }, 
    { value :  'Leadership' ,  label :  'Leadership' }, 
    { value :  'Struts' ,  label :  'Struts' }, 
    { value :  'Sáng tạo nội dung' ,  label :  'Sáng tạo nội dung' }, 
    { value :  'CI/CD' ,  label :  'CI/CD' }, 
    { value :  'Academic Development' ,  label :  'Academic Development' }, 
    { value :  'UML' ,  label :  'UML' }, 
    { value :  'SAP' ,  label :  'SAP' }, 
    { value :  'Video Editing' ,  label :  'Video Editing' }, 
    { value :  'g8' ,  label :  'g8' }, 
    { value :  'Dựng phim' ,  label :  'Dựng phim' }, 
    { value :  'YouTube' ,  label :  'YouTube' }, 
    { value :  'Tiếng Tây Ban Nha' ,  label :  'Tiếng Tây Ban Nha' }, 
    { value :  'Selenium' ,  label :  'Selenium' }, 
    { value :  'test scripts' ,  label :  'test scripts' }, 
    { value :  'People Management' ,  label :  'People Management' }, 
    { value :  'tiếp thị' ,  label :  'tiếp thị' }, 
    { value :  'InDesign' ,  label :  'InDesign' }, 
    { value :  '2D graphics' ,  label :  '2D graphics' }, 
    { value :  'Biên phiên dịch tiếng Anh' ,  label :  'Biên phiên dịch tiếng Anh' }, 
    { value :  'LAN' ,  label :  'LAN' }, 
    { value :  'Unix' ,  label :  'Unix' }, 
    { value :  'CakePHP' ,  label :  'CakePHP' }, 
    { value :  'Creative Writing' ,  label :  'Creative Writing' }, 
    { value :  'TOEIC' ,  label :  'TOEIC' }, { value :  'GMP' ,  label :  'GMP' }, 
    { value :  'QA' ,  label :  'QA' }, 
    { value :  'Angular 6' ,  label :  'Angular 6' }, 
    { value :  'Photoshop'  ,  label :  'Photoshop'  }, 
    { value :  'Negotiation Skill' ,  label :  'Negotiation Skill' }, 
    { value :  'MCSA' ,  label :  'MCSA' }, 
    { value :  'Trách nhiệm' ,  label :  'Trách nhiệm' }, 
    { value :  'PHP' ,  label :  'PHP' }, 
    { value :  'DaVinci' ,  label :  'DaVinci' }, 
    { value :  'Xử lý tình huống' ,  label :  'Xử lý tình huống' }, 
    { value :  'Tư duy tốt' ,  label :  'Tư duy tốt' }, 
    { value :  'CNC' ,  label :  'CNC' }, 
    { value :  'Quản lý con người' ,  label :  'Quản lý con người' },
    { value :  'kế toán kho' ,  label :  'kế toán kho' }, 
    { value :  'SCRUM' ,  label :  'SCRUM' }, 
    { value :  'CCNA' ,  label :  'CCNA' }, 
    { value :  'Kotlin' ,  label :  'Kotlin' }, 
    { value :  'Finance' ,  label :  'Finance' }, 
    { value :  'Flutter' ,  label :  'Flutter' }, 
    { value :  'etabs' ,  label :  'etabs' }, 
    { value :  'Github' ,  label :  'Github' }, 
    { value :  'Manager' ,  label :  'Manager' }, 
    { value :  'Laravel' ,  label :  'Laravel' }, 
    { value :  'Phối hợp tốt với các đồng nghiệp' ,  label :  'Phối hợp tốt với các đồng nghiệp' },
    { value :  'Project Management' ,  label :  'Project Management' }, 
    { value :  'design pattern' ,  label :  'design pattern' }, 
    { value :  'Core Java' ,  label :  'Core Java' }, 
    { value :  'Strategic Planning' ,  label :  'Strategic Planning' }, 
    { value :  'truyền đạt' ,  label :  'truyền đạt' }, 
    { value :  'Quản lý nhóm' ,  label :  'Quản lý nhóm' }, 
    { value :  'Perl' ,  label :  'Perl' }, 
    { value :  'MySQL' ,  label :  'MySQL' }, 
    { value :  'Phát triển thị trường' ,  label :  'Phát triển thị trường' }, 
    { value :  'Javascript' ,  label :  'Javascript' }, 
    { value :  'Golang' ,  label :  'Golang' }, 
    { value :  'Thân thiện' ,  label :  'Thân thiện' }, 
    { value :  'Android' ,  label :  'Android' }, 
    { value :  'IT Recruitment' ,  label :  'IT Recruitment' }, 
    { value :  'Corona' ,  label :  'Corona' }, 
    { value :  'Nginx' ,  label :  'Nginx' }, 
    { value :  'XHTML' ,  label :  'XHTML' }, 
    { value :  'XCode' ,  label :  'XCode' }, 
    { value :  'Tự tin' ,  label :  'Tự tin' }, 
    { value :  'Xây dựng đội nhóm' ,  label :  'Xây dựng đội nhóm' }, 
    { value :  'LPI' ,  label :  'LPI' }, 
    { value :  'NOSQL' ,  label :  'NOSQL' }, 
    { value :  'JLPT N1' ,  label :  'JLPT N1' }, 
    { value :  'Contract Law' ,  label :  'Contract Law' }, 
    { value :  'Asp .Net' ,  label :  'Asp .Net' }, 
    { value :  'Giao tiếp' ,  label :  'Giao tiếp' }, 
    { value :  'Final Cut' ,  label :  'Final Cut' }, 
    { value :  'Design Thinking' ,  label :  'Design Thinking' }, 
    { value :  'Agile' ,  label :  'Agile' }, 
    { value :  'HTML5' ,  label :  'HTML5' }, 
    { value :  'Websocket' ,  label :  'Websocket' }, 
    { value :  'Wordpress' ,  label :  'Wordpress' }, 
    { value :  'Adobe' ,  label :  'Adobe' }, 
    { value :  'Odoo' ,  label :  'Odoo' }, 
    { value :  'C&B' ,  label :  'C&B' }, 
    { value :  'Khả năng làm việc độc lập' ,  label :  'Khả năng làm việc độc lập' },
    { value :  'Angular JS' ,  label :  'Angular JS' }, 
    { value :  'MVC5' ,  label :  'MVC5' }, 
    { value :  'CSS' ,  label :  'CSS' }, 
    { value :  'Spring MVC' ,  label :  'Spring MVC' }, 
    { value :  'SASS' ,  label :  'SASS' }, 
    { value :  'Game' ,  label :  'Game' }, 
    { value :  'Adobe Premier' ,  label :  'Adobe Premier' }, 
    { value :  'Bridge Engineer' ,  label :  'Bridge Engineer' }, 
    { value :  'Tư vấn' ,  label :  'Tư vấn' }, 
    { value :  'Tin học văn phòng' ,  label :  'Tin học văn phòng' }, 
    { value :  'C++ nâng cao' ,  label :  'C++ nâng cao' }, 
    { value :  'TOEIC 600' ,  label :  'TOEIC 600' }, 
    { value :  'PR' ,  label :  'PR' }, 
    { value :  'Wacom Tablet' ,  label :  'Wacom Tablet' }, 
    { value :  'Interviews' ,  label :  'Interviews' }, 
    { value :  'Problem-solving' ,  label :  'Problem-solving' }, 
    { value :  'Cloud Computing' ,  label :  'Cloud Computing' }, 
    { value :  'Sales Leadership' ,  label :  'Sales Leadership' }, 
    { value :  'Nextjs' ,  label :  'Nextjs' }, 
    { value :  'Tiếp thị bán hàng' ,  label :  'Tiếp thị bán hàng' }, 
    { value :  'Jira' ,  label :  'Jira' }, 
    { value :  'TOEIC 850' ,  label :  'TOEIC 850' }, 
    { value :  'Android SDK' ,  label :  'Android SDK' }, 
    { value :  'Biên phiên dịch tiếng Hàn' ,  label :  'Biên phiên dịch tiếng Hàn' }, 
    { value :  'Microsoft Technologies' ,  label :  'Microsoft Technologies' }, 
    { value :  'Adobe After Effects' ,  label :  'Adobe After Effects' }, 
    { value :  'Creativity' ,  label :  'Creativity' }, 
    { value :  'OOP' ,  label :  'OOP' }, 
    { value :  'N3' ,  label :  'N3' }, 
    { value :  'SEO marketing' ,  label :  'SEO marketing' }, 
    { value :  'Communication' ,  label :  'Communication' }, 
    { value :  'Online Marketing' ,  label :  'Online Marketing' }, 
    { value :  'Data Domain' ,  label :  'Data Domain' }, 
    { value :  'Tổ chức công việc' ,  label :  'Tổ chức công việc' }, 
    { value :  'IOT' ,  label :  'IOT' }, 
    { value :  'Biên phiên dịch tiếng Trung' ,  label :  'Biên phiên dịch tiếng Trung' }, 
    { value :  'C#' ,  label :  'C#' }, 
    { value :  'Animation' ,  label :  'Animation' }, 
    { value :  'Excel' ,  label :  'Excel' }, 
    { value :  'PhalconPHP' ,  label :  'PhalconPHP' }, 
    { value :  'Adobe Dreamweaver' ,  label :  'Adobe Dreamweaver' }, 
    { value :  'UPS' ,  label :  'UPS' }, 
    { value :  'Project Manager' ,  label :  'Project Manager' }, 
    { value :  'PowerPoint' ,  label :  'PowerPoint' }, 
    { value :  'Java' ,  label :  'Java' }, 
    { value :  'Nonverbal Communication' ,  label :  'Nonverbal Communication' }, 
    { value :  'SVN' ,  label :  'SVN' }, 
    { value :  'Mocking' ,  label :  'Mocking' }, 
    { value :  'Biên phiên dịch Tiếng Nhật' ,  label :  'Biên phiên dịch Tiếng Nhật' }, 
    { value :  'Event Planning' ,  label :  'Event Planning' }, 
    { value :  'Google' ,  label :  'Google' }, 
    { value :  'ETAB' ,  label :  'ETAB' }, 
    { value :  'debug' ,  label :  'debug' },
    { value :  'IBM HTTP Server' ,  label :  'IBM HTTP Server' }, 
    { value :  'Magento 2' ,  label :  'Magento 2' }, 
    { value :  ' CSS' ,  label :  ' CSS' }, 
    { value :  'Photoshop' ,  label :  'Photoshop' }, 
    { value :  'kế toán tổng hợp' ,  label :  'kế toán tổng hợp' }, 
    { value :  'MS SQL' ,  label :  'MS SQL' }, 
    { value :  'NLP' ,  label :  'NLP' }, 
    { value :  'LinQ' ,  label :  'LinQ' }, 
    { value :  '.NET Compact Framework' ,  label :  '.NET Compact Framework' }, 
    { value :  'IELTS 7.5' ,  label :  'IELTS 7.5' }, 
    { value :  'Industrial Design' ,  label :  'Industrial Design' }, 
    { value :  'Figma' ,  label :  'Figma' }, 
    { value :  'Cross-cultural Communication Skills' ,  label :  'Cross-cultural Communication Skills' }, 
    { value :  'Coaching' ,  label :  'Coaching' }, 
    { value :  'Camtasia' ,  label :  'Camtasia' }, 
    { value :  'kỹ sư trưởng tòa nhà' ,  label :  'kỹ sư trưởng tòa nhà' }, 
    { value :  'Objective-C' ,  label :  'Objective-C' }, 
    { value :  'Adobe Photoshop' ,  label :  'Adobe Photoshop' }, 
    { value :  'Apache' ,  label :  'Apache' }, 
    { value :  'Back-End Web Development' ,  label :  'Back-End Web Development' }, 
    { value :  'PostgreSQL' ,  label :  'PostgreSQL' }, 
    { value :  'ASP.NET' ,  label :  'ASP.NET' }, 
    { value :  'DB2' ,  label :  'DB2' }, 
    { value :  'Giao tiếp' ,  label :  'Giao tiếp' }, 
  ]



  
  if(!loading) {
  return (
    <form action="#" className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Họ và tên</label>
          <input type="text" name="full_name" placeholder={profile?.full_name || "Vui lòng cập nhật thông tin"} 
          value={modifiedFields.full_name !== undefined ? modifiedFields.full_name : (profile?.full_name || "")}
          onChange={handleInputChange}
           />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Tên công việc</label>
          <input type="text" name="good_at_position" placeholder={profile?.good_at_position || "Vui lòng cập nhật thông tin"} 
          value={modifiedFields.good_at_position !== undefined ? modifiedFields.good_at_position : (profile?.good_at_position || "")}
          onChange={handleInputChange}
           />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            placeholder={modifiedFields.phone || profile?.phone || "Vui lòng cập nhật thông tin"}
            value={modifiedFields.phone !== undefined ? modifiedFields.phone : (profile?.phone || "")}
            onChange={handleInputChange}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Địa chỉ email</label>
          <input
            type="text"
            name="email"
            placeholder={modifiedFields.email || profile?.email || "Vui lòng cập nhật thông tin"}
            value={modifiedFields.email !== undefined ? modifiedFields.email : (profile?.email || "")}
            onChange={handleInputChange}
            
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            placeholder={modifiedFields.address || profile?.address || "Vui lòng cập nhật thông tin"}
            value={modifiedFields.address !== undefined ? modifiedFields.address : (profile?.address || "")}
            onChange={handleInputChange}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
        <label>Giới tính</label>
        <select
          className="chosen-single form-select"
          name="gender"
          value={modifiedFields.gender !== undefined ? modifiedFields.gender : (profile?.gender || "")}
          onChange={handleInputChange}
        >
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </div>



        {/* <div className="form-group col-lg-3 col-md-12">
          <label>Expected Salary($)</label>
          <select className="chosen-single form-select" >
            <option>120-350 K</option>
            <option>40-70 K</option>
            <option>50-80 K</option>
            <option>60-90 K</option>
            <option>70-100 K</option>
            <option>100-150 K</option>
          </select>
        </div> */}

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Số năm kinh nghiệm</label>
          <input type="number" name="year_of_experience" 
          placeholder={modifiedFields.year_of_experience || profile?.year_of_experience || "Vui lòng cập nhật thông tin"}
          value={modifiedFields.year_of_experience !== undefined ? modifiedFields.year_of_experience : (profile?.year_of_experience || "")}
          onChange={handleInputChange}
          min={0}
           />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Ngày sinh</label>
          <input className="chosen-single form-select"
          type="date"
          name="date_of_birth"
          value={modifiedFields.date_of_birth !== undefined ? modifiedFields.date_of_birth : (profile?.date_of_birth || "")}
          onChange={handleInputChange}
          >
          </input>
        </div>

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>Trình độ ngôn ngữ</label>
          <input type="text" name="name" placeholder="Toeic 750"  />
        </div> */}

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>Languages</label>
          <input
            type="text"
            name="name"
            placeholder="English, Turkish"
            
          />
        </div> */}

        {/* <!-- Search Select --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Kỹ năng</label>
          <Select
            defaultValue={[catOptions[1]]}
            isMulti
            name="colors"
            options={catOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            
          />
        </div>

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>Cho phép nhà tuyển dụng tìm kiếm bạn</label>
          <select className="chosen-single form-select" >
            <option>Cho phép</option>
            <option>Không cho phép</option>
          </select>
        </div> */}

        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
        <label>Giới thiệu</label>
        <textarea
          placeholder="Vui lòng cập nhật thông tin"
          value={modifiedFields.about_me !== undefined ? modifiedFields.about_me : (profile?.about_me || "")}
          name="about_me"
          onChange={handleInputChange}
        ></textarea>
      </div>

        <Education user={user}/>
        <Experiences user={user}/>
        <Awards user={user} />
        {/* <!-- Input --> */}
        
        {Object.keys(modifiedFields).length > 0 && (
        <div className="form-group col-lg-6 col-md-12">
          <button
            type="submit"
            className="theme-btn btn-style-cancel"
            onClick={handleCancel}
          >
            Hủy
          </button>
          <span style={{ margin: '0 10px' }}></span>
          <button
            type="submit"
            className="theme-btn btn-style-one"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      )}

      </div>
    </form>
  );
  }
  else {
    return (
      <div>Đang tải dữ liệu</div>
    )
  }
};

export default FormInfoBox;
