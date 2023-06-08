import Box from "@mui/material/Box";
import { FC, CSSProperties } from "react";

import inputStyles from "./input.module.scss";

interface IInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string | number | undefined;
  handleChange?: (e: any) => void;
  handleBlur?: (e: any) => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}

const Input: FC<IInputProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  value,
  handleChange,
  handleBlur,
  error,
  touched,
  disabled = false,
  style,
}) => {
  return (
    <Box className={inputStyles.wrapper} style={style}>
      {label ? <label htmlFor={label}>{label}</label> : <></>}
      <input
        disabled={disabled}
        style={{
          cursor: disabled ? "not-allowed" : "auto",
        }}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {error && touched && <p className={inputStyles.error}>{error}</p>}
    </Box>
  );
};

export default Input;
