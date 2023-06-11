import { Box } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import UserControllers from "@/controllers/UserControllers";
import Paper from "@/elements/Paper";
import Upload from "@/elements/Upload";

import DetailProfile from "./components/DetailProfile";

const Profile: FC = () => {
  const [profile, setProfile] = useState<TProfile>({} as TProfile);

  useEffect(() => {
    setProfile({
      id: 1,
      full_name: "Nguyen Van A",
      avatar: "",
      about_me:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus nesciunt libero amet?",
      good_at_pos: "Devops",
      year_of_exp: "5",
      date_of_birth: "1/1/1990",
      gender: "Nam",
      address: "123 Nguyen Van Linh Street",
      email: "nva@gmal.com",
      phone: "0905123123",
    });
  }, []);

  const handleUploadCv = (files: FileList) => {
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    console.log(file);
    Promise.resolve(UserControllers.uploadCv(formData))
      .then((res: TResponse) => {
        if (!res.error) {
          toast.success("Upload CV thành công");
        } else {
          toast.error("Upload CV thất bại");
        }
      })
      .catch(err => {
        console.log(err);
        toast.error("Upload CV thất bại");
      });
  };
  return (
    <Paper>
      <h2>Thông tin cá nhân</h2>

      <Box
        sx={{
          mt: "10px",
        }}
      >
        <Upload
          placeholder="Lưu CV và cập nhật thông tin cá nhân"
          accept="image/*"
          handleChange={handleUploadCv}
        />

        <DetailProfile profile={profile} />
      </Box>
    </Paper>
  );
};

export default Profile;
