import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Game } from '../types';
import { Play } from 'lucide-react';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { setActiveGame } = useGameContext();
  
  const handlePlayGame = () => {
    const GameComponent = game.component;
    setActiveGame(<GameComponent />);
  };
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div 
        className="h-40 bg-gradient-to-br from-indigo-400 to-purple-500 relative"
        style={{
          backgroundImage: `url(${game.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePlayGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full flex items-center"
          >
            <Play size={16} className="mr-1" /> Play Now
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-indigo-600 mb-1">{game.title}</h3>
        <p className="text-sm text-gray-600">{game.description}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
            {game.difficulty}
          </span>
          <button
            onClick={handlePlayGame}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Play Game &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};