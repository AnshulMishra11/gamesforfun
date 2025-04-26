import React from 'react';
import { GameCategory } from './GameCategory';
import { useGameContext } from '../context/GameContext';

export const GameHub = () => {
  const { activeGame } = useGameContext();

  return (
    <div className="space-y-8">
      {!activeGame ? (
        <>
          <section className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-2">Welcome to KidsPlay Zone!</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pick a game from our awesome collection and start having fun! Challenge yourself or play with friends.
            </p>
          </section>
          
          <GameCategory 
            id="single-player"
            title="Single Player Games" 
            description="Challenge yourself with these fun games!"
            category="singlePlayer"
          />
          
          <GameCategory 
            id="two-player"
            title="Two Player Games" 
            description="Play with a friend on the same device!"
            category="twoPlayer"
          />
          
          <GameCategory 
            id="multiplayer"
            title="Multiplayer Games" 
            description="Play with friends online!"
            category="multiplayer"
          />
        </>
      ) : (
        <div className="game-container">
          {activeGame}
        </div>
      )}
    </div>
  );
};