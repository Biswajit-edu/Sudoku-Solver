import React from 'react';
import './table.css';
import API_BASE from '../config';

const Table = ({ matrix, setMatrix, predictedMatrix, isDarkMode }) => {
  const handleInput = (row, col, e) => {
    const value = e.currentTarget.value;
    const singleDigit = /^[1-9]$/; // Regular expression to allow only one digit (1-9)
    
    if (value === '' || singleDigit.test(value)) {
      const updatedMatrix = matrix.map((rowArr, rowIndex) =>
        rowArr.map((cell, colIndex) => (rowIndex === row && colIndex === col ? (value ? parseInt(value, 10) : null) : cell))
    );
    setMatrix(updatedMatrix);
  }
};

  const resetBoard = () => {
    setMatrix(predictedMatrix.map(row => row.map(() => null))); // Reset to null values
  };
  
  const solve = async () => {
    try {
      const response = await fetch(`${API_BASE}/solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matrix }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData && errorData.Error === 'Invalid Sudoku') {
            alert('Invalid Sudoku! Please enter a correct one.');
            return;
        }
        throw new Error('Failed to solve the puzzle');
      }

      const solvedMatrix = await response.json();
      if (solvedMatrix && solvedMatrix.ans) {
        setMatrix(solvedMatrix.ans);
      } else if (solvedMatrix && solvedMatrix.Error) {
        alert('Invalid Sudoku! Please check the sudoku and try again.');
      } else {
        console.error('Invalid Input');
      }
    } catch (error) {
      console.error('Error solving puzzle:', error);
    }
  };
  
  return (
      <div className={`right_cont ${isDarkMode ? 'dark_comp' : 'light_comp'}`}>
        Extracted Sudoku Will show here
        <div className="sudoku-grid">
          {matrix.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text" // Changed to "text" to remove arrows
                value={value || ''}
                onChange={(e) => handleInput(rowIndex, colIndex, e)}
                className="grid-cell"
                maxLength={1} // Restricts to a single character
                />
              ))
            )}
        </div>
        <div className="control">
          <button className="Btn1" onClick={resetBoard}>
            Reset
          </button>
          <button className="Btn2" onClick={solve}>
            Solve
          </button>
        </div>
      </div>
  );
};

export default Table;

//   return (
//     <div>
//       <div className={`container ${isDarkMode?'light_comp':'dark_comp'}`}>
//         {/* <table id="sudoku-board">
//           <colgroup><col /><col /><col /></colgroup>
//           <colgroup><col /><col /><col /></colgroup>
//           <colgroup><col /><col /><col /></colgroup>
          
//           <tbody>
//             {matrix.map((row, rowIndex) => (
//               <tr className='Table_row' key={rowIndex}>
//                 {row.map((value, colIndex) => (
//                   <td
//                     key={colIndex}
//                     contentEditable
//                     onInput={(e) => handleInput(rowIndex, colIndex, e)}
//                     suppressContentEditableWarning={true}
//                   >
//                     {getCellContent(value, rowIndex, colIndex)}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table> */}
//         <div className="sudoku-grid">
//         {solution.map((row, rowIndex) =>
//           row.map((value, colIndex) => (
//             <input
//               key={`${rowIndex}-${colIndex}`}
//               type="number"
//               min="1"
//               max="9"
//               contentEditable
//               onInput={(e) => handleInput(rowIndex, colIndex, e)}
//               className="grid-cell"
//               value={value}
//             />
//           ))
//         )}
//       </div>
//         <div className='control'>
//           <button className='Btn1' onClick={resetBoard}>Reset</button>
//           <button className='Btn2' onClick={solve}>Solve</button>
//         </div>
//       </div>
//     </div>
//   );
// };