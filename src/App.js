import React from 'react';
import { useState } from 'react';

function Square({ value, onSquareClick, isWinning }) {
  // use isWinning prop directly
  return (
    <button
      className={`square${isWinning ? '-winning' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}



function Board({isXNext, squares , onPlay}) {
  
  function handleClick(i) {
    if(calculateWinner(squares) || squares[i]  ) return;
    const nextSquares = squares.slice();
    if (isXNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }
  // get winner and winning line (if any)
  const result = calculateWinnerLine(squares);
  const winner = result.winner;
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every((cell) => cell !== null)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (isXNext ? 'X' : 'O');
  }
  const board = [0,1,2].map((i) => (
    <div className='board-row' key={i}>
      {[0,1,2].map((j) => {
        const idx = 3*i + j;
        return (
          <Square
            key={idx}
            value={squares[idx]}
            onSquareClick={() => handleClick(idx)}
            isWinning={result.line && result.line.includes(idx)}
          />
        );
      })}
    </div>
  ));
    
  return (
    <>
      <div className='status'>{status}</div>
      <div>{board}</div>
      
  </>
);
}



function Game() {
  
  const [switches, setSwitches] = useState(true);
  // history entries are [squaresArray, changedIndex|null]
  const [history,setHistory] = useState([[Array(9).fill(null), null]]);
  
  const [currentMove, setCurrentMove] = useState(0);
  
  
  const xIsNext = currentMove % 2 === 0;
  // get the squares array from the current history entry
  const currentSquares = history[currentMove][0];
  function handlePlay(nextSquares, change) {
    const nextHistory = [...history.slice(0, currentMove + 1), [nextSquares, change]];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSwitches(){
    setSwitches(!switches);
  }
  
  
  const moves = switches
    ? history.map(([squares, change], move) => {
        const description = move > 0 ? 'Go to move #' + move : 'Go to game start';
        const changedPosStr = change != null ? ` (${change % 3 + 1}, ${Math.floor(change / 3) + 1})` : '';
        return (
          <li key={move}>
            {move === currentMove ? (
              <span>{`You are at move #${move}${changedPosStr}`}</span>
            ) : (
              <button onClick={() => jumpTo(move)}>{description}</button>
            )}
          </li>
        );
      })
    : history
        .slice()
        .reverse()
        .map(([squares, change], move) => {
          const actualMove = history.length - 1 - move;
          const changedPosStr = change != null ? ` (${change % 3 + 1}, ${Math.floor(change / 3) + 1})` : '';
          const description = actualMove > 0 ? 'Go to move #' + actualMove : 'Go to game start';
          return (
            <li key={actualMove}>
              {actualMove === currentMove ? (
                <span>{`You are at move #${actualMove}${changedPosStr}`}</span>
              ) : (
                <button onClick={() => jumpTo(actualMove)}>{description}</button>
              )}
            </li>
          );
        });
  return (
    <div className="game">
      <div className="game-board">
        <Board isXNext={xIsNext} squares={currentSquares} onPlay ={handlePlay} />
      </div>
      <div className="game-info">
        <ToggleButton switches={switches} handleSwitches={handleSwitches}/>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

const App = () => {
  return (
    
    <div>
      <Game/>
    </div>
  );
};

export default App;

function ToggleButton({switches, handleSwitches}) { 
  return (
    <button onClick={handleSwitches}>{switches ? 'Ascending order' : 'Descending order'}</button>
  );
}

// returns both winner and winning line indices
function calculateWinnerLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function calculateWinner(squares) {
   const lines = [
     [0, 1, 2],
     [3, 4, 5],
     [6, 7, 8],
     [0, 3, 6],
     [1, 4, 7],
     [2, 5, 8],
     [0, 4, 8],
     [2, 4, 6]
   ];
   for (let i = 0; i < lines.length; i++) {
     const [a, b, c] = lines[i];
     
     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
       return squares[a];
     }
   }
   return null;
}
