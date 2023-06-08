import { FC, CSSProperties } from "react";

import buttonStyles from "./button.module.scss";

interface IButtonProps {
  text: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  color?: string;
  style?: CSSProperties;
}

const Button: FC<IButtonProps> = ({
  text,
  onClick,
  type = "button",
  color = "blue",
  style = {},
}) => {
  let classBtn;
  switch (color) {
    case "blue":
      classBtn = buttonStyles.btnBlue;
      break;

    case "white":
      classBtn = buttonStyles.btnWhite;
      break;

    default:
      classBtn = buttonStyles.btnBlue;
      break;
  }

  return (
    <button type={type} className={classBtn} onClick={onClick} style={style}>
      {text}
    </button>
  );
};

export default Button;
