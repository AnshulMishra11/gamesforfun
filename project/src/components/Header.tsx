import React from 'react';
import { TowerControl as GameController } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GameController size={32} className="text-yellow-300" />
          <h1 className="text-2xl md:text-3xl font-bold">KidsPlay Zone</h1>
        </div>
        <nav>
          <ul className="flex gap-4">
            <li className="hidden md:block">
              <a href="#single-player" className="hover:text-yellow-300 transition-colors">
                Single Player
              </a>
            </li>
            <li className="hidden md:block">
              <a href="#two-player" className="hover:text-yellow-300 transition-colors">
                Two Player
              </a>
            </li>
            <li className="hidden md:block">
              <a href="#multiplayer" className="hover:text-yellow-300 transition-colors">
                Multiplayer
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};