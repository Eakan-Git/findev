/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box, Grid } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";

import Button from "../Button";

import calendarStyles from "./calendarScheduler.module.scss";

const CalendarScheduler: FC = () => {
  const [selectedCells, setSelectedCells] = useState<TCell[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activatedCells, setActivatedCells] = useState<TCell[]>([]);
  const [originalActivatedCells, setOriginalActivatedCells] = useState<TCell[]>([]);

  const dragTargetRef = useRef(null);

  useEffect(() => {
    setOriginalActivatedCells(activatedCells);
  }, [activatedCells]);

  const handleCellMouseDown = (event: MouseEvent, rowIndex: number, columnIndex: number) => {
    event.preventDefault();
    setIsDragging(true);
    // @ts-ignore
    if (dragTargetRef?.current) dragTargetRef.current = event.target;
    toggleCellSelection(rowIndex, columnIndex);
  };

  const handleCellMouseEnter = (event: MouseEvent, rowIndex: number, columnIndex: number) => {
    if (isDragging) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (dragTargetRef?.current) dragTargetRef.current = event.target;
      toggleCellSelection(rowIndex, columnIndex);
    }
  };

  const handleCellMouseUp = () => {
    setIsDragging(false);
    dragTargetRef.current = null;
  };

  const toggleCellSelection = (rowIndex: number, columnIndex: number) => {
    const cell: TCell = { rowIndex, columnIndex };
    const isSelected = isCellSelected(cell);
    let updatedCells = [...selectedCells];

    if (isSelected) {
      updatedCells = updatedCells.filter(selectedCell => !areCellsEqual(selectedCell, cell));
    } else {
      updatedCells.push(cell);
    }

    setSelectedCells(updatedCells);
  };

  const isCellSelected = (cell: TCell) => {
    return selectedCells.some(selectedCell => areCellsEqual(selectedCell, cell));
  };

  const areCellsEqual = (cell1: TCell, cell2: TCell) => {
    return cell1.rowIndex === cell2.rowIndex && cell1.columnIndex === cell2.columnIndex;
  };

  const isCellActivated = (rowIndex: number, columnIndex: number) => {
    return activatedCells.some(cell => areCellsEqual(cell, { rowIndex, columnIndex }));
  };

  const getCellClassName = (rowIndex: number, columnIndex: number) => {
    const cellClasses: string[] = [calendarStyles.cell];
    if (isCellActivated(rowIndex, columnIndex)) {
      cellClasses.push(calendarStyles.activatedCell);
    }
    if (isCellSelected({ rowIndex, columnIndex })) {
      cellClasses.push(calendarStyles.selectedCell);
    }
    if (isDragging && dragTargetRef.current === `${rowIndex}-${columnIndex}`) {
      cellClasses.push(calendarStyles.draggingCell);
    }
    return cellClasses.join(" ");
  };

  const handleCancel = () => {
    console.log(originalActivatedCells);
    setActivatedCells(originalActivatedCells);
  };

  const handleSave = () => {
    console.log(selectedCells);

    setOriginalActivatedCells(activatedCells);
  };

  const isChanged = JSON.stringify(originalActivatedCells) !== JSON.stringify(activatedCells);

  useEffect(() => {
    console.log(selectedCells);
  }, [selectedCells]);

  return (
    <Box className={calendarStyles.container}>
      <table className={calendarStyles.table}>
        <thead>
          <tr>
            <th className={calendarStyles.columnHeader}></th>
            <th className={calendarStyles.columnHeader}>Thứ Hai</th>
            <th className={calendarStyles.columnHeader}>Thứ Ba</th>
            <th className={calendarStyles.columnHeader}>Thứ Tư</th>
            <th className={calendarStyles.columnHeader}>Thứ Năm</th>
            <th className={calendarStyles.columnHeader}>Thứ Sáu</th>
            <th className={calendarStyles.columnHeader}>Thứ Bảy</th>
            <th className={calendarStyles.columnHeader}>Chủ Nhật</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(Array(24).keys()).map(hour => (
            <tr key={hour}>
              <td className={calendarStyles.rowHeader}>{`${hour}h - ${hour + 1}h`}</td>
              {Array.from(Array(7).keys()).map(day => {
                const columnIndex = day + 1;
                const rowIndex = hour;

                return (
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                  <td
                    key={columnIndex}
                    className={getCellClassName(rowIndex, columnIndex)}
                    // @ts-ignore
                    onMouseDown={event => handleCellMouseDown(event, rowIndex, columnIndex)}
                    // @ts-ignore
                    onMouseEnter={event => handleCellMouseEnter(event, rowIndex, columnIndex)}
                    onMouseUp={handleCellMouseUp}
                  ></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {isChanged || selectedCells.length > 0 ? (
        <Grid
          container
          spacing={2}
          justifyContent={"flex-end"}
          sx={{
            mt: "1rem",
          }}
        >
          <Grid item xs={"auto"}>
            <Button text="Hủy" color="white" onClick={handleCancel} />
          </Grid>
          <Grid item xs={"auto"}>
            <Button text="Cập nhật" onClick={handleSave} />
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default CalendarScheduler;
