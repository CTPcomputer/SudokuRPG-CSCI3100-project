import React, { useState, useEffect,useRef } from 'react';
import { LICENSE_KEY } from './License/license.js';



const CustomDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsOpen((prev) => !prev);
      event.preventDefault();
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'relative',
        width: '120px',
        fontFamily: 'Silkscreen',
        fontSize: '16px',
      }}
    >
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          padding: '10px',
          height: '40px',
          background: '#8bac0f',
          color: '#0f380f',
          border: '2px solid #444',
          borderRadius: '0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textTransform: 'capitalize',
          transition: 'background-color 0.3s',
          outline: 'none',
        }}
        onMouseEnter={(e) => (e.target.style.background = '#9bbc0f')}
        onMouseLeave={(e) => (e.target.style.background = '#8bac0f')}
      >
        <span>{value}</span>
        <span style={{ marginLeft: '5px' }}>▼</span>
      </div>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '48px', // Below the dropdown button
            left: '0',
            width: '100%',
            background: '#8bac0f',
            border: '2px solid #444',
            borderRadius: '0',
            zIndex: 10,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // Subtle shadow for depth
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              style={{
                padding: '10px',
                color: '#0f380f',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.background = '#9bbc0f')}
              onMouseLeave={(e) => (e.target.style.background = '#8bac0f')}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const SudokuGame = ({ onComplete,stage }) => {
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [initialBoard, setInitialBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [solution, setSolution] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing');
  const [message, setMessage] = useState('');
  const [invalidCells, setInvalidCells] = useState([]);
  const timeLeftList = [1800, 1200,900,600];
  const initialTime = timeLeftList[stage - 1] || 1800;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [difficulty, setDifficulty] = useState('easy'); // Default difficulty

  useEffect(() => {
    fetchPuzzle();
  }, [difficulty]);
  

  useEffect(() => {
    if (gameStatus === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleBattleLoss();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStatus]);

  const fetchPuzzle = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/sudoku/${difficulty}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-License-Key': LICENSE_KEY,
          },
        }
      );
      const result = await response.json();
      if (result.status === 'success') {
        setBoard(JSON.parse(JSON.stringify(result.data.puzzle)));
        setInitialBoard(JSON.parse(JSON.stringify(result.data.puzzle)));
        setSolution(JSON.parse(JSON.stringify(result.data.solution)));
        setGameStatus('playing');
        setMessage('');
        setInvalidCells([]);
        setSelectedCell(null);
        setTimeLeft(initialTime);
      } else {
        setMessage('Failed to load puzzle. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching puzzle:', error);
      setMessage('Error connecting to server. Please try again later.');
    }
  };

  const resetGame = () => {
    fetchPuzzle();
    setTimeLeft(initialTime);
  };

  const handleCellClick = (row, col) => {
    if (gameStatus === 'playing' && initialBoard[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (number) => {
    if (gameStatus !== 'playing' || !selectedCell) return;

    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    const newBoard = [...board];
    newBoard[row][col] = number;
    setBoard(newBoard);
    setInvalidCells([]);
    setMessage('');
  };

  const findInvalidCells = () => {
    const invalid = new Set();

    // Check rows
    for (let i = 0; i < 9; i++) {
      const row = new Set();
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== 0 && row.has(board[i][j])) {
          invalid.add(`${i},${j}`);
        }
        row.add(board[i][j]);
      }
    }

    // Check columns
    for (let j = 0; j < 9; j++) {
      const col = new Set();
      for (let i = 0; i < 9; i++) {
        if (board[i][j] !== 0 && col.has(board[i][j])) {
          invalid.add(`${i},${j}`);
        }
        col.add(board[i][j]);
      }
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const box = new Set();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const row = boxRow * 3 + i;
            const col = boxCol * 3 + j;
            if (board[row][col] !== 0 && box.has(board[row][col])) {
              invalid.add(`${row},${col}`);
            }
            box.add(board[row][col]);
          }
        }
      }
    }

    return Array.from(invalid);
  };


  const handleBattleWin = () => {
    setMessage('Congratulations! You defeated the boss!');
    setGameStatus('solved');

    const timeTaken = initialTime - timeLeft; // Calculate time taken for this stage
    if (onComplete) {
      setTimeout(() => onComplete(true, timeTaken), 1500); // Pass timeTaken back
    }
  };

  const handleBattleLoss = () => {
    setMessage('Time\'s up! The boss defeated you!');
    setGameStatus('failed');
    if (onComplete) {
      setTimeout(() => onComplete(false, 0), 1500); // 0 time on loss
    }
  };

  const checkSolution = () => {
    const isComplete = board.every(row => row.every(cell => cell !== 0));
    if (!isComplete) {
      setMessage('Please fill in all cells before checking!');
      return;
    }

    const invalid = findInvalidCells();
    setInvalidCells(invalid);

    if (invalid.length > 0) {
      setMessage('There are some conflicts in your solution. Try again!');
      return;
    }

    handleBattleWin();
  };

  const showSolution = () => {
    if (gameStatus !== 'playing') return;
    setBoard(JSON.parse(JSON.stringify(solution)));
    setGameStatus('solved');
    setMessage('Here is the solution!');
    localStorage.setItem('cheat', 'true');
    handleBattleWin();
  };

  const clearCell = () => {
    if (selectedCell && gameStatus === 'playing' && initialBoard[selectedCell.row][selectedCell.col] === 0) {
      const newBoard = [...board];
      newBoard[selectedCell.row][selectedCell.col] = 0;
      setBoard(newBoard);
      setInvalidCells([]);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  // Rest of your JSX remains largely the same, just adding difficulty selection
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#0f380f',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
    {/*Test lose button for debugging
    <button
      onClick={handleBattleLoss}>
        <p>test lose</p>
      </button>
    */}
      <div style={{ 
        color: 'white', 
        fontSize: '24px', 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Silkscreen',
        gap: '20px'
      }}>
        <div style={{
          padding: '10px 20px',
          fontSize: '16px',
          fontFamily: 'Silkscreen',
          background: '#8bac0f',
          color: '#0f380f',
          border: '2px solid #444',
          borderRadius: '0',
          textAlign: 'center',
          lineHeight: '40px',
          transition: 'background-color 0.3s'
        }}>
          Time Left: {formatTime(timeLeft)}
        </div>
        <CustomDropdown
          value={difficulty}
          onChange={setDifficulty}
          options={difficultyOptions}
        />
      </div>

      {/* Rest of your grid and button JSX remains the same */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(9, 40px)',
        gap: '1px',
        background: '#444',
        border: '2px solid #444',
        width: 'fit-content',
        margin: '0 auto'
      }}>
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '40px',
                height: '40px',
                background: invalidCells.includes(`${rowIndex},${colIndex}`)
                  ? '#ffebee'
                  : selectedCell?.row === rowIndex && selectedCell?.col === colIndex 
                    ? '#306230'
                    : initialBoard[rowIndex][colIndex] !== 0 
                      ? '#8bac0f'
                      : '#9bbc0f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: initialBoard[rowIndex][colIndex] === 0 ? 'pointer' : 'not-allowed',
                fontSize: '20px',
                fontWeight: 'bold',
                fontFamily: 'Silkscreen',
                color: invalidCells.includes(`${rowIndex},${colIndex}`)
                  ? '#f44336'
                  : initialBoard[rowIndex][colIndex] !== 0 
                    ? '#444' 
                    : '#000',
                borderRight: (colIndex + 1) % 3 === 0 ? '2px solid #444' : 'none',
                borderBottom: (rowIndex + 1) % 3 === 0 ? '2px solid #444' : 'none'
              }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell !== 0 ? cell : ''}
            </div>
          ))
        ))}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {message && (
          <div style={{ 
            color: message.includes('Congratulations') ? 'green' : message.includes('conflicts') ? 'red' : 'white',
            marginBottom: '10px',
            fontWeight: 'bold',
            fontFamily: 'Silkscreen',
          }}>
            {message}
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 40px)',
        gap: '5px',
        width: 'fit-content',
        margin: '20px auto'
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <button
            key={number}
            onClick={() => handleNumberInput(number)}
            style={{
              width: '40px',
              height: '40px',
              fontSize: '20px',
              fontFamily: 'Silkscreen',
              border: '2px solid #444',
              background: '#8bac0f',
              color: '#0f380f',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              outline: 'none',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '40px'
            }}
            disabled={gameStatus !== 'playing'}
          >
            {number}
          </button>
        ))}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        <button onClick={resetGame} style={{ padding: '10px 20px', fontSize: '16px', fontFamily: 'Silkscreen', background: '#8bac0f', color: '#0f380f', border: '2px solid #444', borderRadius: '0', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', transition: 'background-color 0.3s', outline: 'none', lineHeight: '40px' }}>
          New Game
        </button>
        <button onClick={checkSolution} style={{ padding: '10px 20px', fontSize: '16px', fontFamily: 'Silkscreen', background: '#8bac0f', color: '#0f380f', border: '2px solid #444', borderRadius: '0', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', transition: 'background-color 0.3s', outline: 'none', lineHeight: '40px' }} disabled={gameStatus !== 'playing'}>
          Check Solution
        </button>
        <button onClick={showSolution} style={{ padding: '10px 20px', fontSize: '16px', fontFamily: 'Silkscreen', background: '#8bac0f', color: '#0f380f', border: '2px solid #444', borderRadius: '0', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', transition: 'background-color 0.3s', outline: 'none', lineHeight: '40px' }}>
          Show Solution
        </button>
        <button onClick={clearCell} style={{ padding: '10px 20px', fontSize: '16px', fontFamily: 'Silkscreen', background: '#8bac0f', color: '#0f380f', border: '2px solid #444', borderRadius: '0', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', transition: 'background-color 0.3s', outline: 'none', lineHeight: '40px' }} disabled={gameStatus !== 'playing'}>
          Clear Cell
        </button>
      </div>
    </div>
  );
};

export default SudokuGame;