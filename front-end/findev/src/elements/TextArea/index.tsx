import Box from "@mui/material/Box";
import { FC } from "react";

import inputStyles from "./textArea.module.scss";

interface ITextAreaProps {
  label: string;
  name: string;
  placeholder?: string;
  value?: string;
  handleChange?: (e: any) => void;
  handleBlur?: (e: any) => void;
  error?: string;
  touched?: boolean;
  rows?: number;
}

const TextArea: FC<ITextAreaProps> = ({
  name,
  label,
  placeholder,
  value,
  handleChange,
  handleBlur,
  error,
  touched,
  rows = 5,
}) => {
  return (
    <Box className={inputStyles.wrapper}>
      <label htmlFor={label}>{label}</label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={rows}
      />
      {error && touched && <p className={inputStyles.error}>{error}</p>}
    </Box>
  );
};

export default TextArea;
