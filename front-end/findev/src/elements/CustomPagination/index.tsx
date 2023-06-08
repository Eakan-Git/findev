import { Pagination } from "@mui/material";
import Box from "@mui/material/Box/Box";
import { FC } from "react";

import paginationStyles from "./customPagination.module.scss";

interface ICustomPaginationProps {
  totalPage: number;
  handleChangePage: (page: number) => void;
  currentPage?: number;
}

const CustomPagination: FC<ICustomPaginationProps> = ({
  totalPage,
  handleChangePage,
  currentPage,
}) => {
  return (
    <Box className={paginationStyles.wrapper}>
      <Pagination
        count={totalPage}
        onChange={(e, page) => handleChangePage(page)}
        color="primary"
        page={currentPage}
      />
    </Box>
  );
};

export default CustomPagination;
