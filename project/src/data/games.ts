import { Game } from '../types';
import { FlappyBird } from '../games/FlappyBird';
import { WhackAMole } from '../games/WhackAMole';
import { TicTacToe } from '../games/TicTacToe';
import { MemoryMatch } from '../games/MemoryMatch';
import { PingPong } from '../games/PingPong';
import { DrawingGame } from '../games/DrawingGame';

export const games: Game[] = [
  
  {
    id: 'whack-a-mole',
    title: 'Finding Me',
    description: 'Whack the moles as they pop up to score points!',
    category: 'singlePlayer',
    difficulty: 'Easy',
    thumbnail: 'https://images.pexels.com/photos/6578889/pexels-photo-6578889.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    component: WhackAMole
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Find matching pairs of cards to win!',
    category: 'singlePlayer',
    difficulty: 'Easy',
    thumbnail: 'https://images.pexels.com/photos/163696/toy-car-toy-box-mini-163696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    component: MemoryMatch
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description: 'Classic X and O game. Get three in a row to win!',
    category: 'twoPlayer',
    difficulty: 'Easy',
    thumbnail: 'https://images.pexels.com/photos/7303187/pexels-photo-7303187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    component: TicTacToe
  },
  {
    id: 'ping-pong',
    title: 'Ping Pong',
    description: 'Play ping pong against a friend! First to 11 wins.',
    category: 'twoPlayer',
    difficulty: 'Medium',
    thumbnail: 'https://images.pexels.com/photos/976873/pexels-photo-976873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    component: PingPong
  },
  {
    id: 'drawing-game',
    title: 'Drawing Challenge',
    description: 'Draw and guess with friends online!',
    category: 'multiplayer',
    difficulty: 'Medium',
    thumbnail: 'https://images.pexels.com/photos/4792729/pexels-photo-4792729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    component: DrawingGame
  }
];