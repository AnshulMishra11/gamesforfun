import { ReactNode } from 'react';

export interface Game {
  id: string;
  title: string;
  description: string;
  category: 'singlePlayer' | 'twoPlayer' | 'multiplayer';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  thumbnail: string;
  component: React.ComponentType<any>;
}