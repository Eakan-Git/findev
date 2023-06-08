import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { FC, useState } from "react";

import uploadStyles from "./upload.module.scss";

interface IUploadProps {
  placeholder?: string;
  accept?: string;
  multiple?: boolean;
  handleChange?: (e: any) => void;
}

const Upload: FC<IUploadProps> = ({
  placeholder = "Upload file",
  accept = "image/*",
  multiple = false,
  handleChange = e => {
    console.log(e);
  },
}) => {
  const [fileName, setFileName] = useState<string>("");

  const handleUpload = (e: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const listFile = e.target.files;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setFileName(listFile[0].name as string);
    handleChange(listFile);
  };

  return (
    <div className={uploadStyles.wrapper}>
      <label htmlFor="upload">
        <ArrowUpwardIcon />
        <span>{fileName || placeholder}</span>
      </label>
      <input
        id="upload"
        type="file"
        className="upload__input"
        placeholder={placeholder}
        accept={accept}
        multiple={multiple}
        onChange={handleUpload}
      />
    </div>
  );
};

export default Upload;
