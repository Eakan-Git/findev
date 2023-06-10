import { use } from "react";
import FormInfoBox from "./FormInfoBox";
import LogoUpload from "./LogoUpload";

const index = () => {
  // fetch user profile data with ID from context
  // const { user } = useContext(UserContext);
  // const [profile, setProfile] = useState(null);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const res = await axios.get(`localhost:8000/api/${user._id}`);
  //       setProfile(res.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchProfile();
  // }, []);
  return (
    <div className="widget-content">
      <LogoUpload />
      {/* End logo and cover photo components */}

      <FormInfoBox />
      {/* compnay info box */}
    </div>
  );
};

export default index;
