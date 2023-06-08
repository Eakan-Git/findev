import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FC, useEffect } from "react";

import Button from "@/elements/Button";

interface IModalInfosEventCalendarProps {
  isOpen: boolean;
  handleOpenModal: (open: boolean) => void;
  data: object;
}
const ModalInfosEventCalendar: FC<IModalInfosEventCalendarProps> = ({
  isOpen,
  handleOpenModal,
  data,
}) => {
  const handleClose = () => {
    handleOpenModal(false);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
      <DialogContent>
        Let Google help apps determine location. This means sending anonymous location data to
        Google, even when no apps are running.
      </DialogContent>
      <DialogActions>
        <Button
          color="white"
          text="Hủy"
          onClick={() => {
            handleClose();
          }}
        />
        <Button
          text="Xác nhận"
          onClick={() => {
            handleClose();
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ModalInfosEventCalendar;
