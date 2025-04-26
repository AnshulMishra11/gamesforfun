import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { RotateCcw, Home } from 'lucide-react';

export const TicTacToe: React.FC = () => {
  const { setActiveGame } = useGameContext();
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const checkWinner = (squares: Array<string | null>) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;

    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setScores({ ...scores, [newWinner]: scores[newWinner as keyof typeof scores] + 1 });
      setGameOver(true);
    } else if (!newBoard.includes(null)) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setGameOver(false);
  };

  const renderSquare = (i: number) => {
    return (
      <button
        className={`w-20 h-20 text-4xl font-bold flex items-center justify-center border-2 border-indigo-300 bg-white hover:bg-indigo-50 transition-colors
          ${board[i] === 'X' ? 'text-pink-500' : 'text-blue-500'}`}
        onClick={() => handleClick(i)}
      >
        {board[i]}
      </button>
    );
  };

  const returnToHome = () => {
    setActiveGame(null);
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={returnToHome}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <Home size={16} /> Home
        </button>
        <h2 className="text-2xl font-bold text-center text-indigo-700">Tic-Tac-Toe</h2>
        <button 
          onClick={resetGame}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="flex justify-center gap-8 mb-6">
        <div className={`text-center p-2 rounded ${xIsNext && !winner ? 'bg-pink-100 ring-2 ring-pink-300' : ''}`}>
          <div className="text-xl font-bold text-pink-500">Player X</div>
          <div className="text-2xl">{scores.X}</div>
        </div>
        <div className={`text-center p-2 rounded ${!xIsNext && !winner ? 'bg-blue-100 ring-2 ring-blue-300' : ''}`}>
          <div className="text-xl font-bold text-blue-500">Player O</div>
          <div className="text-2xl">{scores.O}</div>
        </div>
      </div>

      {gameOver && (
        <div className="mb-6 p-3 text-center rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100">
          {winner ? (
            <p className="text-xl font-bold text-indigo-700">
              Player {winner} wins!
            </p>
          ) : (
            <p className="text-xl font-bold text-indigo-700">
              It's a draw!
            </p>
          )}
        </div>
      )}

      {!gameOver && (
        <div className="mb-6 p-3 text-center">
          <p className="text-lg text-indigo-600">
            {xIsNext ? "Player X's turn" : "Player O's turn"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-6">
        {Array(9).fill(null).map((_, i) => (
          <div key={i}>{renderSquare(i)}</div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-600 text-sm">Get three in a row to win!</p>
      </div>
    </div>
  );
};