import { useState } from "react";

function Square({ value, win, onSquareClick }) {
  return (
    <button className={`square ${win?"win":""}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }


  const {winner, line = []} = calculateWinner(squares) ?? {};
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    if(squares.filter(item => !!item).length === squares.length) {
      status = "draw";
    } else  {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }


  return (
    <>
      <div className="status">{status}</div>
      {
        [0,1,2].map((row) => {
          return (
            <div className="board-row" key={row}>
              {[0,1,2].map((col) => {
                return (
                  <Square win={line.includes(row * 3 + col)} key={col} value={squares[row * 3 + col]} onSquareClick={() => handleClick(row * 3 + col)} />
                )
              })}
            </div>
          )
        })
      }
    </>
  );
}

function getSquaresDiff(squares1, squares2) {
  if(!squares1 || !squares2) {
    return -1
  }
  for(let i = 0; i < squares1.length; i++) {
    if(squares1[i] !== squares2[i]) {
      return i
    }
  }
  return -1;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [ascOrder, setAscOrder] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }



  const moves = history.map((squares, move) => {
    if(currentMove === move) {
      return <li key={move}>
        You are at move #{move}
      </li>
    }
    
    let description;
    if (move > 0) {
      const diff = getSquaresDiff(squares, history[move - 1]);
      const row = Math.floor(diff / 3);
      const col = diff % 3;
      description = `Go to move #${move}, (${row}, ${col})`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (!ascOrder) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={
          () => {
            setAscOrder(!ascOrder);
          }
        }>{ascOrder ? "升序": "降序"}</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
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
      return {winner: squares[a], line: lines[i]};
    }
  }
  return null;
}
