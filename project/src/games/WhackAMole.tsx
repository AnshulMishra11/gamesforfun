import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import { RotateCcw, Home, Timer } from 'lucide-react';

export const WhackAMole: React.FC = () => {
  const { setActiveGame } = useGameContext();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const holes = Array(9).fill(null);
  
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameStarted(true);
    setGameOver(false);
    setActiveMole(null);
  };
  
  const whackMole = (index: number) => {
    if (index === activeMole && gameStarted && !gameOver) {
      setScore(prevScore => prevScore + 1);
      setActiveMole(null);
      if (moleTimerRef.current) {
        clearTimeout(moleTimerRef.current);
      }
      showMole();
    }
  };
  
  const showMole = () => {
    const randomDelay = Math.floor(Math.random() * 1000) + 500;
    moleTimerRef.current = setTimeout(() => {
      if (gameStarted && !gameOver) {
        const randomHole = Math.floor(Math.random() * holes.length);
        setActiveMole(randomHole);
        
        // Hide mole after a while if not whacked
        moleTimerRef.current = setTimeout(() => {
          setActiveMole(null);
          showMole();
        }, 1200);
      }
    }, randomDelay);
  };
  
  const endGame = () => {
    setGameStarted(false);
    setGameOver(true);
    setHighScore(prevHigh => Math.max(prevHigh, score));
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (moleTimerRef.current) {
      clearTimeout(moleTimerRef.current);
      moleTimerRef.current = null;
    }
  };
  
  const returnToHome = () => {
    setActiveGame(null);
  };
  
  useEffect(() => {
    if (gameStarted && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      showMole();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (moleTimerRef.current) {
        clearTimeout(moleTimerRef.current);
      }
    };
  }, [gameStarted, gameOver]);
  
  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={returnToHome}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <Home size={16} /> Home
        </button>
        <h2 className="text-2xl font-bold text-center text-indigo-700">Whack-a-Mole</h2>
        <button 
          onClick={startGame}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-bold">Score: {score}</div>
        <div className="flex items-center gap-1 text-xl">
          <Timer size={20} className="text-red-500" />
          <span className={timeLeft <= 10 ? "text-red-500" : ""}>
            {timeLeft}s
          </span>
        </div>
        <div className="text-gray-600">High: {highScore}</div>
      </div>
      
      {!gameStarted && !gameOver && (
        <div className="text-center p-4 mb-6 bg-indigo-50 rounded-lg">
          <p className="mb-4">Whack the moles as they appear to score points!</p>
          <button
            onClick={startGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
      )}
      
      {gameOver && (
        <div className="text-center p-4 mb-6 bg-indigo-50 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Game Over!</h3>
          <p className="mb-4">Your score: {score}</p>
          <button
            onClick={startGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-4 bg-green-600 p-4 rounded-lg">
        {holes.map((_, index) => (
          <div 
            key={index}
            className="relative h-24 bg-green-800 rounded-full overflow-hidden"
            onClick={() => whackMole(index)}
          >
            <div 
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-brown-500 rounded-full transition-transform duration-100 ${
                activeMole === index ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{ backgroundColor: '#8B4513' }}
            >
              {activeMole === index && (
                <>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gray-700 rounded-full">
                    <div className="absolute top-2 left-3 w-2 h-2 bg-white rounded-full"></div>
                    <div className="absolute top-2 right-3 w-2 h-2 bg-white rounded-full"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-pink-300 rounded-full"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-gray-600 text-sm">
        <p>Click on the moles as they appear to score points!</p>
      </div>
    </div>
  );
};