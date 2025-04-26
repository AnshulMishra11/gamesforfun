import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { RotateCcw, Home, Timer, Award } from 'lucide-react';

type Card = {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
};

export const MemoryMatch: React.FC = () => {
  const { setActiveGame } = useGameContext();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  const cardValues = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];
  
  const returnToHome = () => {
    setActiveGame(null);
  };

  const getDifficultyPairs = () => {
    switch (difficulty) {
      case 'easy': return 6;
      case 'medium': return 8;
      case 'hard': return 12;
      default: return 6;
    }
  };
  
  const initializeGame = () => {
    const numPairs = getDifficultyPairs();
    const selectedValues = cardValues.slice(0, numPairs);
    
    const newCards: Card[] = [...selectedValues, ...selectedValues].map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false
    }));
    
    // Shuffle the cards
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }
    
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeElapsed(0);
    setGameCompleted(false);
  };
  
  const startGame = () => {
    initializeGame();
    setGameStarted(true);
  };
  
  const changeDifficulty = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    setGameStarted(false);
  };
  
  const handleCardClick = (id: number) => {
    if (!gameStarted || gameCompleted) return;
    
    // Don't allow clicking already flipped or matched cards
    if (cards[id].flipped || cards[id].matched) return;
    
    // Don't allow more than 2 cards to be flipped at once
    if (flippedCards.length >= 2) return;
    
    // Flip the card
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    
    // Add card to flipped cards
    setFlippedCards([...flippedCards, id]);
  };
  
  useEffect(() => {
    // Check for matches when 2 cards are flipped
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCardId, secondCardId] = flippedCards;
      
      if (cards[firstCardId].value === cards[secondCardId].value) {
        // Match found
        const newCards = [...cards];
        newCards[firstCardId].matched = true;
        newCards[secondCardId].matched = true;
        setCards(newCards);
        setMatchedPairs(prev => prev + 1);
        
        // Clear flipped cards
        setFlippedCards([]);
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          const newCards = [...cards];
          newCards[firstCardId].flipped = false;
          newCards[secondCardId].flipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);
  
  useEffect(() => {
    // Check if all pairs are matched
    if (matchedPairs === getDifficultyPairs() && matchedPairs > 0) {
      setGameCompleted(true);
      setGameStarted(false);
      
      // Update best time
      if (bestTime === null || timeElapsed < bestTime) {
        setBestTime(timeElapsed);
      }
    }
  }, [matchedPairs, bestTime, timeElapsed]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameStarted && !gameCompleted) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [gameStarted, gameCompleted]);
  
  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={returnToHome}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <Home size={16} /> Home
        </button>
        <h2 className="text-2xl font-bold text-center text-indigo-700">Memory Match</h2>
        <button 
          onClick={() => initializeGame()}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
          disabled={!gameStarted}
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-1">
          <span className="font-medium">Moves:</span> {moves}
        </div>
        <div className="flex items-center gap-1">
          <Timer size={16} className="text-indigo-600" />
          <span>{formatTime(timeElapsed)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">Pairs:</span> {matchedPairs}/{getDifficultyPairs()}
        </div>
      </div>
      
      {bestTime !== null && (
        <div className="flex items-center justify-center gap-2 mb-4 text-indigo-700">
          <Award size={16} className="text-yellow-500" />
          <span className="font-medium">Best time: {formatTime(bestTime)}</span>
        </div>
      )}
      
      {!gameStarted && !gameCompleted && (
        <div className="text-center p-4 mb-6 bg-indigo-50 rounded-lg">
          <h3 className="font-bold mb-3">Select Difficulty</h3>
          <div className="flex justify-center gap-3 mb-4">
            <button 
              className={`px-4 py-2 rounded ${difficulty === 'easy' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => changeDifficulty('easy')}
            >
              Easy
            </button>
            <button 
              className={`px-4 py-2 rounded ${difficulty === 'medium' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => changeDifficulty('medium')}
            >
              Medium
            </button>
            <button 
              className={`px-4 py-2 rounded ${difficulty === 'hard' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => changeDifficulty('hard')}
            >
              Hard
            </button>
          </div>
          <button
            onClick={startGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
      )}
      
      {gameCompleted && (
        <div className="text-center p-4 mb-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-xl font-bold text-green-700 mb-2">Congratulations!</h3>
          <p className="mb-1">You completed the game in {moves} moves.</p>
          <p className="mb-4">Time: {formatTime(timeElapsed)}</p>
          <button
            onClick={startGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </button>
        </div>
      )}
      
      <div className={`grid ${difficulty === 'easy' ? 'grid-cols-3 md:grid-cols-4' : difficulty === 'medium' ? 'grid-cols-4' : 'grid-cols-4 md:grid-cols-6'} gap-3 mb-6`}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`h-20 rounded-lg shadow-md cursor-pointer transition-all duration-300 transform ${
              card.flipped || card.matched ? 'rotate-y-180' : ''
            } ${card.matched ? 'bg-green-100' : card.flipped ? 'bg-indigo-100' : 'bg-indigo-600'}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="h-full flex items-center justify-center">
              {(card.flipped || card.matched) ? (
                <span className="text-4xl">{card.value}</span>
              ) : (
                <span className="text-white text-2xl">?</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-gray-600 text-sm">
        <p>Find all the matching pairs to win!</p>
      </div>
    </div>
  );
};