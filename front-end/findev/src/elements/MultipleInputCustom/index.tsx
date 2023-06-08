/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box, Grid } from "@mui/material";
import { useFormik } from "formik";
import { nanoid } from "nanoid";
import { FC, useRef } from "react";

import Button from "../Button";
import Input from "../Input/Input";

import selectStyles from "./multipleInputCustom.module.scss";

interface IMultipleInputCustomProps {
  label: string;
  name: string;
  values?: [];
  handleChange?: (values: any) => void;
  placeholder?: string;
}

const MultipleInputCustom: FC<IMultipleInputCustomProps> = ({
  name,
  label,
  values = [],
  handleChange = () => {},
  placeholder = "Enter",
}) => {
  const closeRefs = useRef<HTMLButtonElement[] | null[]>([]);
  const formik = useFormik({
    initialValues: {
      text: "",
    },
    onSubmit: val => {
      if (!val.text) return;
      if (values?.find(item => item[`${name}`] === val.text)) return;
      const newValue = [
        ...values,
        {
          id: nanoid(),
          [`${name}`]: val.text,
        },
      ];
      handleChange(newValue);
    },
  });
  const handleDeleteSelected = (id: string | number) => {
    // @ts-ignore
    const newValues = values?.filter(item => id !== item?.id);
    handleChange(newValues);
  };

  return (
    <Box className={selectStyles.wrapper}>
      {label ? <label htmlFor={name}>{label}</label> : <></>}
      <Box className={selectStyles.select} aria-hidden="true">
        {values?.length ? (
          <Box className={selectStyles.selected}>
            {values.map((val: any, index: number) => {
              return (
                <Box key={nanoid()} className={selectStyles.value}>
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  <span className={selectStyles.text}>{val[`${name}`]}</span>
                  <button
                    ref={el => {
                      if (closeRefs.current) closeRefs.current[index] = el;
                    }}
                    className={selectStyles.close}
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      handleDeleteSelected(val.id as string | number);
                    }}
                  >
                    x
                  </button>
                </Box>
              );
            })}
          </Box>
        ) : (
          <p className={selectStyles.placeholder}>{label}</p>
        )}
      </Box>
      <Grid container spacing={2} sx={{ mt: "0.5rem" }} alignItems={"center"}>
        <Grid item xs={9.5}>
          <Input
            label={""}
            name={"text"}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            touched={formik.touched.text}
            error={formik.errors.text}
            value={formik.values.text}
            placeholder={placeholder}
            style={{
              marginBottom: "0",
            }}
          />
        </Grid>
        <Grid item xs={2.5}>
          <Button
            text="Add"
            onClick={() => {
              formik.handleSubmit();
            }}
            style={{
              width: "100%",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MultipleInputCustom;
