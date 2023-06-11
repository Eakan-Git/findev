import { Box, Grid } from "@mui/material";
import { useFormik } from "formik";
import { FC } from "react";
import { toast } from "react-hot-toast";

import UserControllers from "@/controllers/UserControllers";
import Button from "@/elements/Button";
import Input from "@/elements/Input/Input";
import TextArea from "@/elements/TextArea";

interface IDetailProfileProps {
  profile: TProfile;
}
const DetailProfile: FC<IDetailProfileProps> = () => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: "",
      full_name: "",
      avatar: "",
      about_me: "",
      good_at_pos: "",
      year_of_exp: "",
      date_of_birth: "",
      gender: "",
      address: "",
      email: "",
      phone: "",
    },
    onSubmit: values => {
      console.log(values);
      Promise.resolve(UserControllers.updateProfile(values))
        .then((res: TResponse) => {
          if (!res.error) {
            toast.success("Cập nhật thông tin thành công");
          } else {
            toast.error("Cập nhật thông tin thất bại");
          }
        })
        .catch(err => {
          console.log(err);
          toast.error("Cập nhật thông tin thất bại");
        });
    },
  });
  return (
    <Box sx={{ mt: "2rem" }}>
      <Grid container columnSpacing={4} alignItems={"center"}>
        <Grid item xs={2}>
          <img
            src={formik.values.avatar || "https://picsum.photos/200"}
            alt="avatar"
            onError={e => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              e.target.src = "https://picsum.photos/200";
            }}
            style={{
              width: "100%",
              borderRadius: "50%",
            }}
          />
        </Grid>
        <Grid item xs>
          <Input
            label="Họ và tên"
            name="full_name"
            placeholder="Nhập"
            value={formik.values.full_name}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            error={formik.errors.full_name}
            touched={formik.touched.full_name}
          />
          <Grid container columnSpacing={2}>
            <Grid item xs={6}>
              <Input
                label="Giới tính"
                name="gender"
                placeholder="Nhập"
                value={formik.values.gender}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                error={formik.errors.gender}
                touched={formik.touched.gender}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Ngày sinh"
                name="date_of_birth"
                placeholder="Nhập"
                type="datetime-local"
                value={formik.values.date_of_birth}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                error={formik.errors.date_of_birth}
                touched={formik.touched.date_of_birth}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container columnSpacing={2}>
        <Grid item xs={6}>
          <Input
            label="Số điện thoại"
            name="phone"
            placeholder="Nhập"
            value={formik.values.phone}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            error={formik.errors.phone}
            touched={formik.touched.phone}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Email"
            name="email"
            placeholder="Nhập"
            value={formik.values.email}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
          />
        </Grid>
      </Grid>

      <Input
        label="Địa chỉ"
        name="address"
        placeholder="Nhập"
        value={formik.values.address}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        error={formik.errors.address}
        touched={formik.touched.address}
      />

      <TextArea
        label="Giới thiệu"
        name="about_me"
        placeholder="Nhập"
        value={formik.values.about_me}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        error={formik.errors.about_me}
        touched={formik.touched.about_me}
      />

      <Grid container columnSpacing={2}>
        <Grid item xs={6}>
          <Input
            label="Số năm kinh nghiệm"
            name="good_at_pos"
            placeholder="Nhập"
            value={formik.values.good_at_pos}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            error={formik.errors.good_at_pos}
            touched={formik.touched.good_at_pos}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Số năm kinh nghiệm"
            name="year_of_exp"
            placeholder="Nhập"
            value={formik.values.year_of_exp}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            error={formik.errors.year_of_exp}
            touched={formik.touched.year_of_exp}
          />
        </Grid>
      </Grid>

      <Button text={"Lưu"} onClick={formik.handleSubmit} />
    </Box>
  );
};

export default DetailProfile;
