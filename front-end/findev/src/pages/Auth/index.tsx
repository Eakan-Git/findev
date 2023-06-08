import { Box, Paper } from "@mui/material";
import { FC, useState } from "react";

import Button from "@/elements/Button";

import authStyles from "./auth.module.scss";

const Auth: FC = () => {
  const [type, setType] = useState<"login" | "signUp" | "loginAdmin" | "signUpAdmin">("login");

  const handleChangeType = (type: "login" | "signUp" | "loginAdmin" | "signUpAdmin") => {
    setType(type);
  };
  return (
    <Box className={authStyles.wrapper}>
      <Paper
        sx={{
          borderRadius: "10px",
        }}
      >
        <Box className={authStyles.paper}>
          <Box className={authStyles.type}>
            <Button
              text="Login"
              onClick={() => handleChangeType("login")}
              color={type === "login" ? "blue" : "white"}
              style={{
                borderRadius: " 10px 0 0 0",
                width: "50%",
              }}
            />

            <Button
              text="Login Company"
              onClick={() => handleChangeType("loginAdmin")}
              color={type === "loginAdmin" ? "blue" : "white"}
              style={{
                borderRadius: "0 0 0 0",
                width: "50%",
              }}
            />

            <Button
              text="Sign Up Company"
              onClick={() => handleChangeType("signUpAdmin")}
              color={type === "signUpAdmin" ? "blue" : "white"}
              style={{
                borderRadius: " 0 10px 0 0",
                width: "50%",
              }}
            />
          </Box>
          {/*
          {type === "login" ? (
            <FormLogin />
          ) : type === "loginAdmin" ? (
            <FormLogin formType="admin" />
          ) : type === "signUpAdmin" ? (
            <FormSignUp formType="admin" />
          ) : (
            <FormSignUp />
          )} */}
        </Box>
      </Paper>
    </Box>
  );
};

export default Auth;
