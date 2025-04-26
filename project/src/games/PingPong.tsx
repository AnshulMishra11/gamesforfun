import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import { RotateCcw, Home, Pause, Play } from 'lucide-react';

export const PingPong: React.FC = () => {
  const { setActiveGame } = useGameContext();
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // Game state
  const gameState = useRef({
    paddle1Y: 200,
    paddle2Y: 200,
    ballX: 400,
    ballY: 250,
    ballSpeedX: 5,
    ballSpeedY: 2,
  });
  
  const paddleHeight = 100;
  const paddleWidth = 10;
  const ballSize = 10;
  const winningScore = 11;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameStarted || isPaused) return;
    
    const moveAmount = 16;
    
    // Player 1 controls (W, S)
    if (e.key === 'w' || e.key === 'W') {
      gameState.current.paddle1Y = Math.max(0, gameState.current.paddle1Y - moveAmount);
    }
    if (e.key === 's' || e.key === 'S') {
      gameState.current.paddle1Y = Math.min(500 - paddleHeight, gameState.current.paddle1Y + moveAmount);
    }
    
    // Player 2 controls (Up, Down arrows)
    if (e.key === 'ArrowUp') {
      gameState.current.paddle2Y = Math.max(0, gameState.current.paddle2Y - moveAmount);
    }
    if (e.key === 'ArrowDown') {
      gameState.current.paddle2Y = Math.min(500 - paddleHeight, gameState.current.paddle2Y + moveAmount);
    }
  };
  
  const resetBall = () => {
    gameState.current.ballX = 400;
    gameState.current.ballY = 250;
    gameState.current.ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    gameState.current.ballSpeedY = 2 * (Math.random() > 0.5 ? 1 : -1);
  };
  
  const resetGame = () => {
    setScores({ player1: 0, player2: 0 });
    gameState.current = {
      paddle1Y: 200,
      paddle2Y: 200,
      ballX: 400,
      ballY: 250,
      ballSpeedX: 5,
      ballSpeedY: 2,
    };
    setWinner(null);
    setGameStarted(false);
    setIsPaused(false);
  };
  
  const startGame = () => {
    setGameStarted(true);
    setIsPaused(false);
    setWinner(null);
    
    if (scores.player1 >= winningScore || scores.player2 >= winningScore) {
      setScores({ player1: 0, player2: 0 });
    }
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  const returnToHome = () => {
    setActiveGame(null);
  };
  
  // Game logic
  const updateGame = () => {
    if (!gameStarted || isPaused) return;
    
    const { ballX, ballY, ballSpeedX, ballSpeedY, paddle1Y, paddle2Y } = gameState.current;
    
    // Move the ball
    gameState.current.ballX += ballSpeedX;
    gameState.current.ballY += ballSpeedY;
    
    // Ball collision with top and bottom walls
    if (ballY < 0 || ballY > 500 - ballSize) {
      gameState.current.ballSpeedY = -ballSpeedY;
    }
    
    // Ball collision with paddles
    if (
      ballX < paddleWidth + 20 && 
      ballX > 10 && 
      ballY > paddle1Y && 
      ballY < paddle1Y + paddleHeight
    ) {
      gameState.current.ballSpeedX = -ballSpeedX;
      
      // Add a bit of randomness to the return angle
      gameState.current.ballSpeedY += (Math.random() * 4 - 2);
    }
    
    if (
      ballX > 800 - paddleWidth - 20 && 
      ballX < 800 - 10 && 
      ballY > paddle2Y && 
      ballY < paddle2Y + paddleHeight
    ) {
      gameState.current.ballSpeedX = -ballSpeedX;
      
      // Add a bit of randomness to the return angle
      gameState.current.ballSpeedY += (Math.random() * 4 - 2);
    }
    
    // Keep vertical speed in check
    if (gameState.current.ballSpeedY > 10) gameState.current.ballSpeedY = 10;
    if (gameState.current.ballSpeedY < -10) gameState.current.ballSpeedY = -10;
    
    // Ball out of bounds
    if (ballX < 0) {
      // Player 2 scores
      setScores(prev => ({ ...prev, player2: prev.player2 + 1 }));
      resetBall();
    }
    
    if (ballX > 800) {
      // Player 1 scores
      setScores(prev => ({ ...prev, player1: prev.player1 + 1 }));
      resetBall();
    }
    
    // Check for winner
    if (scores.player1 >= winningScore) {
      setWinner('Player 1');
      setGameStarted(false);
    } else if (scores.player2 >= winningScore) {
      setWinner('Player 2');
      setGameStarted(false);
    }
    
    // Draw everything
    drawGame();
  };
  
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, 800, 500);
    
    // Draw center line
    ctx.strokeStyle = '#3730a3';
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 500);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(20, gameState.current.paddle1Y, paddleWidth, paddleHeight);
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(800 - 20 - paddleWidth, gameState.current.paddle2Y, paddleWidth, paddleHeight);
    
    // Draw ball
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(gameState.current.ballX, gameState.current.ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw scores
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4f46e580';
    ctx.fillText(scores.player1.toString(), 200, 100);
    ctx.fillStyle = '#7c3aed80';
    ctx.fillText(scores.player2.toString(), 600, 100);
  };
  
  const gameLoop = () => {
    updateGame();
    requestRef.current = requestAnimationFrame(gameLoop);
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    requestRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameStarted, isPaused, scores]);
  
  useEffect(() => {
    // Initial draw when component mounts
    drawGame();
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={returnToHome}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <Home size={16} /> Home
        </button>
        <h2 className="text-2xl font-bold text-center text-indigo-700">Ping Pong</h2>
        <div className="flex gap-2">
          <button 
            onClick={togglePause}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
            disabled={!gameStarted || !!winner}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button 
            onClick={resetGame}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>
      
      <div className="mb-4 flex justify-around items-center">
        <div className="text-center">
          <p className="font-bold text-indigo-700">Player 1</p>
          <p className="text-sm text-gray-600">(W/S keys)</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-indigo-700">Player 2</p>
          <p className="text-sm text-gray-600">(Arrow keys)</p>
        </div>
      </div>
      
      {winner && (
        <div className="text-center p-4 mb-4 bg-indigo-50 rounded-lg">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">{winner} Wins!</h3>
          <button
            onClick={startGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </button>
        </div>
      )}
      
      {!gameStarted && !winner && (
        <div className="text-center p-4 mb-4 bg-indigo-50 rounded-lg">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">Two Player Game</h3>
          <p className="mb-4">First to {winningScore} points wins!</p>
          <button
            onClick={startGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
      )}
      
      <div className="rounded-lg overflow-hidden border-2 border-indigo-300">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="bg-blue-50"
        ></canvas>
      </div>
      
      <div className="mt-4 text-center text-gray-600">
        <p><strong>Player 1:</strong> Use W and S keys to move</p>
        <p><strong>Player 2:</strong> Use Up and Down arrow keys to move</p>
        <p className="mt-2">First player to reach {winningScore} points wins!</p>
      </div>
    </div>
  );
};