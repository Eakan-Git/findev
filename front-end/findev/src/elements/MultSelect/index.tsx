import { Box } from "@mui/material";
import { nanoid } from "nanoid";
import { FC, ReactElement, useEffect, useRef, useState } from "react";

import useClickOutside from "@/hooks/useClickOutside";
import useDontTriggerParentWhenClickChild from "@/hooks/useDontTriggerParentWhenClickChild";

import selectStyles from "./multiSelect.module.scss";

interface IMultiSelectProps {
  label: string;
  name: string;
  options: { value: string; text: string }[];
  value?: string[];
  handleChange?: (e: any) => void;
  handleBlur?: (e: any) => void;
  error?: string | string[];
  touched?: boolean;
}

const MultiSelect: FC<IMultiSelectProps> = ({
  name,
  label,
  value = [],
  error,
  touched,
  options,
  handleChange = e => {
    console.log(e);
  },
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<ReactElement>(null);
  const selectRef = useRef(null);
  const closeRefs = useRef<HTMLButtonElement[] | null[]>([]);

  const handleDeleteSelected = (val: string) => {
    const newValue = value?.filter((v: string) => v !== val);
    console.log(newValue);
    handleChange(newValue);
  };

  const handleChoseOption = (val: string) => {
    const newValue = [...value, val];
    console.log(newValue);
    handleChange(newValue);
  };

  const optionRemaining = options.filter(option => !value?.includes(option.value));

  useClickOutside(menuRef, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    closeRefs.current = closeRefs.current.slice(0, value.length);
  }, [value]);

  useDontTriggerParentWhenClickChild(selectRef, closeRefs, () => {
    setIsOpen(true);
  });

  return (
    <Box className={selectStyles.wrapper}>
      {label ? <label htmlFor={name}>{label}</label> : <></>}
      <Box ref={selectRef} className={selectStyles.select} aria-hidden="true">
        {value?.length ? (
          <Box className={selectStyles.selected}>
            {value.map((val: string, index: number) => {
              return (
                <Box key={nanoid()} className={selectStyles.value}>
                  <span className={selectStyles.text}>{val}</span>
                  <button
                    ref={el => {
                      if (closeRefs.current) closeRefs.current[index] = el;
                    }}
                    className={selectStyles.close}
                    onClick={() => {
                      handleDeleteSelected(val);
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

      {isOpen && (
        <Box className={selectStyles.options} ref={menuRef}>
          {optionRemaining.map(option => {
            return (
              <Box
                key={nanoid()}
                className={selectStyles.option}
                onClick={() => {
                  handleChoseOption(option.value);

                  if (value.length === options.length - 1) {
                    setIsOpen(false);
                  }
                }}
              >
                <input type="checkbox" id={option.value} name={option.value} value={option.value} />
                <label htmlFor={option.value}>{option.text}</label>
              </Box>
            );
          })}
        </Box>
      )}

      {error && touched && <p className={selectStyles.error}>{error}</p>}
    </Box>
  );
};

export default MultiSelect;
