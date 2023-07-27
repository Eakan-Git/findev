import React, { useState, useRef, useEffect } from 'react';
import styles from './Timetable.module.css';
import { localUrl } from '/utils/path';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchProfile } from './fetchProfile';
import { useDispatch } from 'react-redux';
import { logoutUser } from '/app/actions/userActions';

const Timetable = () => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activatedCells, setActivatedCells] = useState([]);
  const { user } = useSelector((state) => state.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = async () => {
    const fetchedProfile = await fetchProfile(user.userAccount.id, user.token);
    if (fetchedProfile.error === false) {
      setProfile(fetchedProfile.data.user_profile);
      // console.log(fetchedProfile.data.user_profile.time_table);
      setLoading(!loading);
    } else if (fetchedProfile.message === 'Unauthenticated.') {
      alert('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại');
      router.push('/');
      dispatch(logoutUser());
    } else {
      console.log('Đã có lỗi xảy ra, vui lòng thử lại sau');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (profile && profile.time_table) {
      const parsedActivatedCells = profile.time_table.coordinate.split(';').map((coordinate) => {
        const [columnIndex, rowIndex] = coordinate.split(',');
        return { rowIndex: parseInt(rowIndex), columnIndex: parseInt(columnIndex) };
      });      
      setActivatedCells(parsedActivatedCells);
      setSelectedCells(parsedActivatedCells); // Set saved cells as selected cells
    }
    setIsBlankTimetable(!profile || !profile.time_table || profile.time_table.length === 0);
  }, [profile]);

  const [originalActivatedCells, setOriginalActivatedCells] = useState([]);
  const [isBlankTimetable, setIsBlankTimetable] = useState(false);

  const dragTargetRef = useRef(null);

  useEffect(() => {
    setOriginalActivatedCells(activatedCells);
  }, [activatedCells]);

  const handleCellMouseDown = (event, rowIndex, columnIndex) => {
    event.preventDefault();
    setIsDragging(true);
    dragTargetRef.current = event.target;
    toggleCellSelection(rowIndex, columnIndex);
  };

  const handleCellMouseEnter = (event, rowIndex, columnIndex) => {
    if (isDragging) {
      dragTargetRef.current = event.target;
      toggleCellSelection(rowIndex, columnIndex);
    }
  };

  const handleCellMouseUp = () => {
    setIsDragging(false);
    dragTargetRef.current = null;
  };

  const toggleCellSelection = (rowIndex, columnIndex) => {
    const cell = { rowIndex, columnIndex };
    const isSelected = isCellSelected(cell);
    let updatedCells = [...selectedCells];

    if (isSelected) {
      updatedCells = updatedCells.filter((selectedCell) => !areCellsEqual(selectedCell, cell));
    } else {
      updatedCells.push(cell);
    }

    setSelectedCells(updatedCells);
  };

  const isCellSelected = (cell) => {
    return selectedCells.some((selectedCell) => areCellsEqual(selectedCell, cell));
  };

  const areCellsEqual = (cell1, cell2) => {
    return cell1.rowIndex === cell2.rowIndex && cell1.columnIndex === cell2.columnIndex;
  };

  const isCellActivated = (rowIndex, columnIndex) => {
    return activatedCells.some((cell) => areCellsEqual(cell, { rowIndex, columnIndex }));
  };

  const getCellClassName = (rowIndex, columnIndex) => {
    const cellClasses = [styles.cell];
    // if (isCellActivated(rowIndex, columnIndex)) {
    //   cellClasses.push(styles.activatedCell);
    // }
    if (isCellSelected({ rowIndex, columnIndex })) {
      cellClasses.push(styles.selectedCell);
    }
    if (isDragging && dragTargetRef.current === `${rowIndex}-${columnIndex}`) {
      cellClasses.push(styles.draggingCell);
    }
    return cellClasses.join(' ');
  };

  const handleCancel = () => {
    setSelectedCells(originalActivatedCells); // Revert to original activated cells
  };

  const handleSave = async () => {
    // alert('Đã lưu thay đổi');
    //check if selectedCells is empty
    let coordinate = selectedCells.map((cell) => `${cell.columnIndex},${cell.rowIndex}`).join(';');
    if (coordinate.includes("NaN,NaN;")) {
      coordinate = coordinate.replace("NaN,NaN;", "");
    }
    if (coordinate.includes("NaN,NaN")) {
      coordinate = coordinate.replace("NaN,NaN", "");
    }
    // console.log("coordinate", coordinate);
    try {
      setIsLoading(true);
      const response = await fetch(`${localUrl}/time-tables/${user.userAccount.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json', // Add Content-Type header
        },
        body: JSON.stringify({ coordinate }), // Pass the coordinate as an object in the request body
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Handle successful response
      } else {
        // Handle error response
        console.log('Error:', response.status);
      }
    } catch (error) {
      // Handle network error
      console.log('Error:', error);
    }
    setIsLoading(false);
    setActivatedCells(selectedCells); // Update activated cells
    setIsDragging(false);
  };
  
  

  const handleClear = () => {
    setSelectedCells([]); // Clear selected cells
  };

  const isChanged = JSON.stringify(originalActivatedCells) !== JSON.stringify(selectedCells);

  let buttons = (
    <div className="form-group col-lg-6 col-md-12" style={{ marginTop: '10px' }}>
      <button type="submit" className="theme-btn btn-style-cancel" onClick={handleCancel}>
        Hủy
      </button>
      <span style={{ margin: '0 10px' }}></span>
      <button type="submit" className="theme-btn btn-style-one" onClick={handleSave}>
        {isLoading ? 
                      (<span className="fa fa-spinner fa-spin" style={{color: "white"}}></span>)
                      : (<>Cập nhật</>)}
      </button>
      <span style={{ margin: '0 10px' }}></span>
      <button type="submit" className="theme-btn btn-style-clear" onClick={handleClear}>
        Xóa tất cả
      </button>
    </div>
  );


  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.columnHeader}></th>
            <th className={styles.columnHeader}>Thứ Hai</th>
            <th className={styles.columnHeader}>Thứ Ba</th>
            <th className={styles.columnHeader}>Thứ Tư</th>
            <th className={styles.columnHeader}>Thứ Năm</th>
            <th className={styles.columnHeader}>Thứ Sáu</th>
            <th className={styles.columnHeader}>Thứ Bảy</th>
            <th className={styles.columnHeader}>Chủ Nhật</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(Array(24).keys()).map((hour) => (
            <tr key={hour}>
              <td className={styles.rowHeader}>{`${hour}h - ${hour + 1}h`}</td>
              {Array.from(Array(7).keys()).map((day) => {
                const columnIndex = day + 1;
                const rowIndex = hour;

                return (
                  <td
                    key={columnIndex}
                    className={getCellClassName(rowIndex, columnIndex)}
                    onMouseDown={(event) => handleCellMouseDown(event, rowIndex, columnIndex)}
                    onMouseEnter={(event) => handleCellMouseEnter(event, rowIndex, columnIndex)}
                    onMouseUp={handleCellMouseUp}
                  ></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {buttons}
    </div>
  );
};

export default Timetable;
