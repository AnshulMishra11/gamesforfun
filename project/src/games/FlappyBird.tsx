import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import { RotateCcw, Home, Pause, Play } from 'lucide-react';

export const FlappyBird: React.FC = () => {
  const { setActiveGame } = useGameContext();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [birdPosition, setBirdPosition] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<{x: number, topHeight: number}[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  
  const gameRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  
  const gravity = 0.6;
  const jumpForce = -10;
  const pipeWidth = 80;
  const pipeGap = 150;
  const pipeSpeed = 3;
  const pipeSpawnRate = 1500;
  
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;
    
    const gameLoop = () => {
      setBirdPosition((prevPos) => {
        const newPos = prevPos + birdVelocity;
        if (newPos < 0 || newPos > 500) { // Check floor and ceiling
          handleGameOver();
          return prevPos;
        }
        return newPos;
      });
      
      setBirdVelocity((prevVel) => prevVel + gravity);
      
      setPipes((prevPipes) => {
        // Move pipes
        const movedPipes = prevPipes.map(pipe => ({
          ...pipe,
          x: pipe.x - pipeSpeed
        }));
        
        // Remove pipes that are off screen
        const visiblePipes = movedPipes.filter(pipe => pipe.x > -pipeWidth);
        
        // Check for collision
        visiblePipes.forEach(pipe => {
          if (
            pipe.x < 100 + 40 && 
            pipe.x + pipeWidth > 100 &&
            (birdPosition < pipe.topHeight || birdPosition > pipe.topHeight + pipeGap)
          ) {
            handleGameOver();
          }
        });
        
        // Check if bird passed a pipe
        const passedPipe = prevPipes.find(pipe => pipe.x > 100 - pipeSpeed && pipe.x - pipeSpeed <= 100);
        if (passedPipe) {
          setScore(s => s + 1);
        }
        
        return visiblePipes;
      });
      
      frameRef.current = requestAnimationFrame(gameLoop);
    };
    
    frameRef.current = requestAnimationFrame(gameLoop);
    
    const spawnPipesInterval = setInterval(() => {
      setPipes(prevPipes => [
        ...prevPipes,
        {
          x: 800,
          topHeight: Math.floor(Math.random() * 300) + 50
        }
      ]);
    }, pipeSpawnRate);
    
    return () => {
      cancelAnimationFrame(frameRef.current);
      clearInterval(spawnPipesInterval);
    };
  }, [gameStarted, birdVelocity, gameOver, isPaused]);
  
  const handleGameOver = () => {
    setGameOver(true);
    setHighScore(prevHigh => Math.max(prevHigh, score));
  };
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setBirdPosition(250);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setIsPaused(false);
  };
  
  const handleJump = () => {
    if (!gameStarted) {
      startGame();
      return;
    }
    
    if (gameOver) {
      startGame();
      return;
    }
    
    if (isPaused) return;
    
    setBirdVelocity(jumpForce);
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  const returnToHome = () => {
    setActiveGame(null);
  };
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleJump();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, gameOver, isPaused]);
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={returnToHome}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <Home size={16} /> Home
        </button>
        <h2 className="text-2xl font-bold text-center text-indigo-700">Flappy Bird</h2>
        <div className="flex gap-2">
          <button 
            onClick={togglePause}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
            disabled={!gameStarted || gameOver}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button 
            onClick={startGame}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold">Score: {score}</div>
        <div className="text-lg">High Score: {highScore}</div>
      </div>
      
      <div 
        ref={gameRef}
        className="relative w-full h-[500px] border-2 border-indigo-300 bg-gradient-to-b from-blue-300 to-blue-100 overflow-hidden rounded-lg cursor-pointer"
        onClick={handleJump}
      >
        {/* Bird */}
        <div 
          className="absolute left-[100px] w-10 h-10 bg-yellow-400 rounded-full"
          style={{ top: `${birdPosition}px` }}
        >
          <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"></div>
          <div className="absolute top-2 left-2 w-1 h-1 bg-black rounded-full"></div>
          <div className="absolute top-6 left-6 w-4 h-2 bg-orange-600 rounded"></div>
        </div>
        
        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <React.Fragment key={index}>
            {/* Top pipe */}
            <div 
              className="absolute bg-green-500 border-r-4 border-b-4 border-green-700"
              style={{ 
                left: `${pipe.x}px`, 
                top: 0, 
                width: `${pipeWidth}px`, 
                height: `${pipe.topHeight}px` 
              }}
            ></div>
            {/* Bottom pipe */}
            <div 
              className="absolute bg-green-500 border-r-4 border-t-4 border-green-700"
              style={{ 
                left: `${pipe.x}px`, 
                top: `${pipe.topHeight + pipeGap}px`, 
                width: `${pipeWidth}px`, 
                height: `${500 - pipe.topHeight - pipeGap}px` 
              }}
            ></div>
          </React.Fragment>
        ))}
        
        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col">
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-red-500 mb-4">Game Over!</h3>
              <p className="text-lg mb-2">Score: {score}</p>
              <p className="text-lg mb-4">High Score: {highScore}</p>
              <button 
                onClick={startGame}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
        
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-indigo-600 mb-4">Flappy Bird</h3>
              <p className="mb-4">Press space bar or click to jump</p>
              <button 
                onClick={startGame}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Start Game
              </button>
            </div>
          </div>
        )}
        
        {isPaused && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-indigo-600 mb-4">Game Paused</h3>
              <button 
                onClick={togglePause}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Resume Game
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center text-gray-500">
        <p>Press space bar or click to make the bird jump</p>
      </div>
    </div>
  );
};