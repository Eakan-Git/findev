import Select from "react-select";
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
import { catOptions } from "./catOptions";
import { Input } from "@mui/icons-material";
const FormInfoBox = () => {
  // fetch user profile data with ID from state
  const { user } = useSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [defaultProfile, setDefaultProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modifiedFields, setModifiedFields] = useState({});
  const [privateOption, setPrivateOption] = useState(profile?.is_private || 1);
  const [isLoading, setIsLoading] = useState(false);
  const handlePrivateChange = (event) => {
    event.preventDefault();
    const selectedValue = event.target.value;
    console.log(selectedValue);
    setPrivateOption(selectedValue);
    setModifiedFields({ ...modifiedFields, is_private: selectedValue });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(modifiedFields);
    if (Object.keys(modifiedFields).length > 0) {
      // convert skills to array of objects with skill key and value of skill
      if (modifiedFields.skills) {
        modifiedFields.skills = modifiedFields.skills.map((skill) => ({
          skill,
        }));
      }
      console.log("Modified fields:", modifiedFields);
      setIsLoading(true);
      const msg = await putProfile(user, modifiedFields);
      // console.log(msg);
      if (msg?.error === false) {
        alert(msg.message);
        setProfile((prevProfile) => ({ ...prevProfile, ...modifiedFields }));
        setModifiedFields({});
        setDefaultProfile(profile);
      }
      else
      {
        // alert("Cập nhật thông tin thất bại");
        // console.log(msg);
        alert(msg.message);
      }
      setIsLoading(false);
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
      setPrivateOption(fetchedProfile.data.user_profile.is_private);
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

  
  if(!loading) {
  return (
    <form action="#" className="default-form">
        <div className="row">
        <div className="form-group col-lg-6 col-md-6">
          <label>Tên đăng nhập</label>
          <input type="text" name="username" 
          value={user.userAccount.username}
          disabled={true}
           />
        </div>
        <div className="form-group col-lg-6 col-md-6">
          <label>Cho phép nhà tuyển dụng tìm kiếm bạn</label>
          <select
            className="chosen-single form-select"
            name="is_private"
            value={privateOption}
            onChange={handlePrivateChange}
          >
            <option value="0">Cho phép</option>
            <option value="1">Không cho phép</option>
          </select>
        </div>
        </div>
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Họ và tên</label>
          <input type="text" name="full_name" placeholder={"Vui lòng cập nhật thông tin"} 
          value={modifiedFields.full_name !== undefined ? modifiedFields.full_name : (profile?.full_name || "")}
          onChange={handleInputChange}
           />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Tên công việc</label>
          <input type="text" name="good_at_position" placeholder={"Vui lòng cập nhật thông tin"} 
          value={modifiedFields.good_at_position !== undefined ? modifiedFields.good_at_position : (profile?.good_at_position || "")}
          onChange={handleInputChange}
           />
        </div>

        {/* <!-- Input --> */}
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            placeholder={"Vui lòng cập nhật thông tin"}
            value={modifiedFields.address !== undefined ? modifiedFields.address : (profile?.address || "")}
            onChange={handleInputChange}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Địa chỉ email</label>
          <input
            type="text"
            name="email"
            placeholder={"Vui lòng cập nhật thông tin"}
            value={modifiedFields.email !== undefined ? modifiedFields.email : (profile?.email || "")}
            onChange={handleInputChange}
            
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            placeholder={"Vui lòng cập nhật thông tin"}
            value={modifiedFields.phone !== undefined ? modifiedFields.phone : (profile?.phone || "")}
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

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
          <label>Số năm kinh nghiệm</label>
          <input type="number" name="year_of_experience" 
          placeholder={"Vui lòng cập nhật thông tin"}
          value={modifiedFields.year_of_experience !== undefined ? modifiedFields.year_of_experience : (profile?.year_of_experience || "")}
          onChange={handleInputChange}
          min={0}
           />
        </div>

        <div className="form-group col-lg-3 col-md-12">
          <label>Ngày sinh</label>
          <input
          className="chosen-single form-select"
          type="date"
          name="date_of_birth"
          value={modifiedFields.date_of_birth !== undefined ? modifiedFields.date_of_birth : (profile?.date_of_birth || "")}
          onChange={handleInputChange}
          >
          </input>
        </div>


        <div className="form-group col-lg-9 col-md-12">
          <label>Kỹ năng</label>
          <Select
            defaultValue={profile?.skills.map((skill) => ({ value: skill.skill, label: skill.skill })) ?? []}
            isMulti
            name="skills"
            options={catOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(selectedOptions) => {
              const skills = selectedOptions.map((option) => option.value);
              setModifiedFields({ ...modifiedFields, skills });
            }}
          />
        </div>

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
            style={{marginBottom: "10px"}}
            onClick={handleCancel}
          >
            Hủy
          </button>
          <span style={{ margin: '0 10px' }}></span>
          <button
            type="submit"
            className="theme-btn btn-style-one"
            onClick={handleSubmit}
            // style={{marginBottom: "10px"}}
          >
            {isLoading ? 
                      (<span className="fa fa-spinner fa-spin" style={{color: "white"}}></span>)
                      : (<>Cập nhật</>)}
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
