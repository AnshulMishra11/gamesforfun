import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameContextType {
  activeGame: ReactNode | null;
  setActiveGame: (game: ReactNode | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeGame, setActiveGame] = useState<ReactNode | null>(null);

  return (
    <GameContext.Provider value={{ activeGame, setActiveGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  return context;
};