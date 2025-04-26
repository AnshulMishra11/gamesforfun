import React from 'react';
import { ChevronRight } from 'lucide-react';
import { GameCard } from './GameCard';
import { games } from '../data/games';

interface GameCategoryProps {
  id: string;
  title: string;
  description: string;
  category: 'singlePlayer' | 'twoPlayer' | 'multiplayer';
}

export const GameCategory: React.FC<GameCategoryProps> = ({ id, title, description, category }) => {
  const categoryGames = games.filter(game => game.category === category);
  
  return (
    <section id={id} className="mb-12">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-700">{title}</h2>
        <ChevronRight className="text-indigo-500 ml-2" />
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoryGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
};