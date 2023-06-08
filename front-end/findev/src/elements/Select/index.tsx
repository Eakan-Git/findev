import { Box } from "@mui/material";
import { nanoid } from "nanoid";
import { FC } from "react";

import selectStyles from "./select.module.scss";

interface ISelectProps {
  label?: string;
  name?: string;
  options: { value: string; text: string }[];
  value?: string;
  handleChange?: (e: unknown) => void;
  handleBlur?: (e: unknown) => void;
  error?: string;
  touched?: boolean;
}

const Select: FC<ISelectProps> = ({
  name,
  label,
  options,
  value,
  handleChange,
  handleBlur,
  error,
  touched,
}) => {
  return (
    <Box className={selectStyles.wrapper}>
      {label ? <label htmlFor={name}>{label}</label> : <></>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={label}
      >
        <option value="" label={label} hidden disabled />
        {options.map(option => {
          return (
            <option key={nanoid()} value={option.value}>
              {option.text}
            </option>
          );
        })}
      </select>
      {error && touched && <p className={selectStyles.error}>{error}</p>}
    </Box>
  );
};

export default Select;
